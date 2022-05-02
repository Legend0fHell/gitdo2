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
                if(cache[sender_psid] === 'TKB') TKBOutput(sender_psid, webhook_event.message);
                else handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
            else {
                if(sender_psid != '306816786589318') console.log('Received unknown event: ', sender_psid, "Content: ", webhook_event);
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
    if(sender_psid != '306816786589318') console.log('Received message: ', sender_psid, 'Content: ', received_message.text);
    // let response;
    // // Check if the message contains text
    // if (received_message.text) {
    //     // Create the payload for a basic text message
    //     response = {
    //         "text": `GitDo sẽ quay trở lại phục vụ các bạn trong khoảng thời gian sớm nhất nhe! Hiện tại các bạn có thể trải nghiệm trước tính năng xem Thời khóa biểu và Lịch dạy thay. Nhấn vào Menu để tìm hiểu thêm nhé!`
    //     }
    // }

    // // Sends the response message
    // callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
    // Get the payload for the postback
    let payload = received_postback.payload;
    // Set the response based on the postback payload
    // console.log(payload);
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
      console.log('TKB phase 1, procedding to ask: ', sender_psid);
      cache[sender_psid] = payload;
    } else if (payload === 'LDT') {
      response = { "text": "Chưa có lịch dạy thay bạn eii" };
      callSendAPI(sender_psid, response);
    }
}

function TKBOutput(sender_psid, answer) {
    let classAsking = answer.text.toUpperCase();
    if(sender_psid != '306816786589318') console.log('TKB phase 2: ', sender_psid, 'Content: ', answer.text);
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
                response = { "text": "TKB của lớp " + classAsking + " là gì tớ có biết đâu ._." };
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