require("dotenv").config();
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
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else {
        res.sendStatus(404);
    }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
    // Don't analyze message from the bot itself.
    if(sender_psid == '306816786589318') return;

    // Debugging line
    console.log('Received message: ', sender_psid, 'Content: ', received_message.text);

    // Normalize case by uppercase, trim whitespace, de-Vietnamese.
    var strNormalized = received_message.text.replace( / +/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();

    // Check if the line is saying about TKB:
    if(cache[sender_psid] === 'TKB' || strNormalized.includes("TKB") || strNormalized.includes("THOIKHOABIEU") || strNormalized.includes("MONGI") || strNormalized.includes("HOCGI")) {
        
        if(/\d/.test(strNormalized)) {
            // If the line contains number, auto pass it to the GSheet to try it:
            TKBOutput(sender_psid, strNormalized);
        }
        else {
            // If the line doesn't contain number, if it was from phase1, incorrect input, else ask:
            if(cache[sender_psid] === 'TKB') {
                cache[sender_psid] = null;
                let response;
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
    switch (payload) {
        case 'postback_card_626f695446be37888700002d':
            payload = 'TKB';
            break;
        case 'postback_card_626f69a746be37888700002f':
            payload = 'LDT';
            break;
        default:
            break;
    }
    if(sender_psid != '306816786589318') console.log('Received postback: ', sender_psid, 'Type: ', payload);
    if (payload === 'TKB') {
      TKBPhase1(sender_psid);
    } 
    else if (payload === 'LDT') {
      response = { "text": "Chưa có lịch dạy thay bạn eii" };
      callSendAPI(sender_psid, response);
    }
}

// Set the cache if the user request TKB.
function TKBPhase1(sender_psid) {
    console.log('TKB phase 1, procedding to ask: ', sender_psid);
    cache[sender_psid] = "TKB";
}

function TKBOutput(sender_psid, answer) {
    let classAsking = answer;
    if(sender_psid != '306816786589318') console.log('TKB phase 2: ', sender_psid, 'Content: ', answer);
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
            if(res2.Status === 'SUCCESS') {
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
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {
    getHomePage: getHomePage,
    getWebhook: getWebhook,
    postWebhook: postWebhook,
}