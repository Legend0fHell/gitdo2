require("dotenv").config();
import { send } from "express/lib/response";
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

let cache = {};
let getHomePage = (req, res) => {
    return res.send("Hello")
};

let getWebhook = (req, res) => {
    console.log(VERIFY_TOKEN);
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
        else {
            res.sendStatus(403);
        }
    }
};

let postWebhook = (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
            else if (webhook_event.message) {
                let fl = 0;
                try {
                    if(webhook_event.message.quick_reply.payload) {
                        handleQuickReply(sender_psid, webhook_event.message.quick_reply.payload);
                        fl = 1;
                    }
                } catch (error) {

                }
                if(!fl) handleMessage(sender_psid, webhook_event.message);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else {
        res.sendStatus(404);
    }
};

function handleQuickReply(sender_psid, received_payload) {
    console.log('Received QuickReply payload: ', sender_psid, 'Content: ', received_payload);
    if (received_payload.includes('CLBP2')) {
        console.log('CLB', received_payload.substring(6));
        if(received_payload.substring(6) == '5') {
            CLBPhase1(sender_psid, "MH");
        }
        else if(received_payload.substring(6) == '10') {
            CLBPhase1(sender_psid, "Pg2");
        }
        else if(received_payload.substring(6) == '19') {
            CLBPhase1(sender_psid, "Pg1");
        }
        else CLBPhase2(sender_psid, received_payload.substring(6));
    } 
    else if(received_payload.includes('postback_card_626f69d246be3760af000038')) {
        CLBPhase1(sender_psid, "Pg1");
    }
    else if(received_payload.includes('postback_card_626f695446be37888700002d')) {
        TKBPhase1(sender_psid);
    }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Don't analyze message from the bot itself.
    if (sender_psid == '306816786589318') return;

    // Debugging line
    console.log('Received message: ', sender_psid, 'Content: ', received_message.text);

    // Normalize case by uppercase, trim whitespace, de-Vietnamese.
    var strNormalized = "";
    try {
        strNormalized = received_message.text.replace(/ +/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    } catch (error) {
        return;
    }

    // Check if the line is saying about TKB:
    if (cache[sender_psid] === 'TKB' || strNormalized.includes("TKB") || strNormalized.includes("THOIKHOABIEU") || strNormalized.includes("MONGI") || strNormalized.includes("HOCGI")) {
        if (/\d/.test(strNormalized)) {
            // If the line contains number, auto pass it to the GSheet to try it:
            TKBOutput(sender_psid, strNormalized);
        }
        else {
            // If the line doesn't contain number, if it was from phase1, incorrect input, else ask:
            if (cache[sender_psid] === 'TKB') {
                cache[sender_psid] = null;
                response = { "text": "TKB của lớp bạn vừa nhập là gì tớ có biết đâu ._." };
                callSendAPI(sender_psid, response);
            }
            else {
                TKBPhase1(sender_psid);
            }
        }
    }
}

function handlePostback(sender_psid, received_postback) {
    let response;
    let payload = received_postback.payload;
    if (payload.includes('postback_card_626f695446be37888700002d')) {
        payload = 'TKB';
    }
    if (sender_psid != '306816786589318') console.log('Received postback: ', sender_psid, 'Type: ', payload);
    if (payload === 'TKB') {
        TKBPhase1(sender_psid);
    }
}

// Set the cache if the user request TKB.
function TKBPhase1(sender_psid) {
    console.log('TKB phase 1, procedding to ask: ', sender_psid);
    response = { "text": "Bạn hãy nhập tên lớp cần tra cứu (Ví dụ: 12SD):" };
    callSendAPI(sender_psid, response);
    cache[sender_psid] = "TKB";
}

// Set the cache if the user request CLB.
function CLBPhase1(sender_psid, showMode = "Pg1") {
    console.log('CLB phase 1, procedding to ask: ', sender_psid);
    // cache[sender_psid] = "CLB";
    let response;
    let request_body = {
        "mode": 3,
        "showMode": showMode
    }
    request({
        uri: "https://script.google.com/macros/s/AKfycbz_r3_Fg9yrCojeAAzXxy762IEh-R8Z-OBLkrwOL74_isB1FPDnkF1epNq4vO1TFJYaeA/exec",
        method: "POST",
        followAllRedirects: true,
        body: JSON.stringify(request_body)
    }, (err, res, body) => {
        if (!err) {
            let res2 = JSON.parse(body);
            let arraySend = [];
            for (var i = 0; i < res2.length; ++i) {
                let tmp = {
                    "content_type": "text",
                    "title": res2[i][2],
                    "payload": "CLBP2_" + res2[i][1]
                }
                arraySend.push(tmp);
            }
            response = {
                "text": "Cậu muốn hỏi về CLB nào trong trường nhỉ? :v",
                "quick_replies": arraySend
            }
            callSendAPI(sender_psid, response);
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function CLBPhase2(sender_psid, answer) {
    if (sender_psid != '306816786589318') console.log('CLB phase 2: ', sender_psid, 'Content: ', answer);
    let response;
    let request_body = {
        "mode": 4,
        "id": answer
    }
    request({
        uri: "https://script.google.com/macros/s/AKfycbz_r3_Fg9yrCojeAAzXxy762IEh-R8Z-OBLkrwOL74_isB1FPDnkF1epNq4vO1TFJYaeA/exec",
        method: "POST",
        followAllRedirects: true,
        body: JSON.stringify(request_body)
    }, (err, res, body) => {
        if (!err) {
            let res2 = JSON.parse(body);
            let button = [];
            if(res2[0][3] != '') {
                button.push(
                    {
                        "type": "web_url",
                        "url": res2[0][3],
                        "title": "Facebook"
                    }
                );
            }
            if(res2[0][4] != '') {
                button.push(
                    {
                        "type": "web_url",
                        "url": res2[0][4],
                        "title": "Instagram"
                    }
                );
            }
            if(res2[0][5] != '') {
                button.push(
                    {
                        "type": "web_url",
                        "url": res2[0][5],
                        "title": "Khác"
                    }
                );
            }
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": res2[0][0],
                                "image_url": res2[0][2],
                                "subtitle": res2[0][1],
                                "buttons": button
                            }
                        ]
                    }
                }
            }
            callSendAPI(sender_psid, response);
        } else {
            console.error("Unable to send message:" + err);
        }
    });

}

function TKBOutput(sender_psid, answer) {
    let classAsking = answer;
    if (sender_psid != '306816786589318') console.log('TKB phase 2: ', sender_psid, 'Content: ', answer);
    let response;
    cache[sender_psid] = null;
    let request_body = {
        "mode": 2,
        "id": classAsking
    }
    request({
        uri: "https://script.google.com/macros/s/AKfycbz_r3_Fg9yrCojeAAzXxy762IEh-R8Z-OBLkrwOL74_isB1FPDnkF1epNq4vO1TFJYaeA/exec",
        method: "POST",
        followAllRedirects: true,
        body: JSON.stringify(request_body)
    }, (err, res, body) => {
        if (!err) {
            var res2 = JSON.parse(body);
            if (res2.Status === 'SUCCESS') {
                response = { "text": "TKB lớp " + res2.Class + ", có hiệu lực từ " + res2.Update + ": \n" + res2.Text };
                callSendAPI(sender_psid, response);
                response = {
                    "attachment": {
                        "type": "image",
                        "payload": {
                            "attachment_id": res2.AttID,
                        }
                    }
                }
                callSendAPI(sender_psid, response);
            }
            else {
                response = { "text": "TKB của lớp bạn vừa nhập là gì tớ có biết đâu ._." };
                callSendAPI(sender_psid, response);
            }
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (err) {
            console.log("Unable to send message:" + err);
        }
    });
}

module.exports = {
    getHomePage: getHomePage,
    getWebhook: getWebhook,
    postWebhook: postWebhook,
}