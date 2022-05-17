require("dotenv").config();
import request from "request";
import { handleMessage } from "./handleMessage";
import { handleQuickReply } from "./handleQuickReply";
import { handlePostback } from "./handlePostback";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export let cache = {};

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
                try {
                    if (webhook_event.message.quick_reply.payload)
                        handleQuickReply(sender_psid, webhook_event.message.quick_reply.payload);
                } catch (error) {
                    handleMessage(sender_psid, webhook_event.message);
                }
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else {
        res.sendStatus(404);
    }
};

export let postGoogle = (request_body) => {
    return new Promise(resolve => {
        request({
            uri: "https://script.google.com/macros/s/AKfycbz_r3_Fg9yrCojeAAzXxy762IEh-R8Z-OBLkrwOL74_isB1FPDnkF1epNq4vO1TFJYaeA/exec",
            method: "POST",
            followAllRedirects: true,
            body: JSON.stringify(request_body)
        }, (err, res, body) => {
            if (!err) {
                resolve(JSON.parse(body));
            } else {
                console.error("Unable to POST: " + request_body + "\nError: " + err);
                resolve("error");
            }
        });
    });

}

// Sends response messages via the Send API
export let postMessenger = (sender_psid, response) => {
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
        if (err || body.error != undefined) {
            console.log("Unable to send message:\n" + err);
        }
    });
}

module.exports = {
    getHomePage,
    getWebhook,
    postWebhook,
}