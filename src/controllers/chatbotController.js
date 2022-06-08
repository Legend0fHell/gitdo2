require("dotenv").config();
import request from "request";
import {handleMessage} from "./handleMessage";
import {handleQuickReply} from "./handleQuickReply";
import {handlePostback} from "./handlePostback";
import {Database, ServerValue} from "./handleFirestore";
import {Debug} from "../functions/debug";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export const cache = {};

const getHomePage = (req, res) => {
    Debug();
    return res.send("Hello");
};

const getWebhook = (req, res) => {
    console.log(VERIFY_TOKEN);
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
};

const postWebhook = (req, res) => {
    const body = req.body;
    if (body.object === "page") {
        body.entry.forEach(function(entry) {
            const webhook_event = entry.messaging[0];
            const sender_psid = webhook_event.sender.id;
            if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            } else if (webhook_event.message) {
                try {
                    if (webhook_event.message.quick_reply.payload) {
                        handleQuickReply(sender_psid, webhook_event.message.quick_reply.payload);
                    }
                } catch (error) {
                    handleMessage(sender_psid, webhook_event.message);
                }
            } else if (webhook_event.optin) {
                console.log(webhook_event.optin);
            }
        });
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
};

export const postGoogle = (request_body) => {
    return new Promise((resolve) => {
        request({
            uri: "https://script.google.com/macros/s/AKfycbz_r3_Fg9yrCojeAAzXxy762IEh-R8Z-OBLkrwOL74_isB1FPDnkF1epNq4vO1TFJYaeA/exec",
            method: "POST",
            followAllRedirects: true,
            body: JSON.stringify(request_body),
        }, (err, res, body) => {
            if (!err) {
                Database.ref("Telemetry/ExternalAPICall").child("GoogleAPI").set(ServerValue.increment(1));
                resolve(JSON.parse(body));
            } else {
                console.error("Unable to POST: " + request_body + "\nError: " + err);
                resolve("error");
            }
        });
    });
};

// Sends response messages via the Send API
export const postMessenger = (sender_psid, response) => {
    // Construct the message body
    return new Promise((resolve) => {
        const request_body = {
            "recipient": {
                "id": sender_psid,
            },
            "message": response,
        };
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": {"access_token": PAGE_ACCESS_TOKEN},
            "method": "POST",
            "json": request_body,
        }, (err, res, body) => {
            if (err || (body.error != undefined && body.error != null)) {
                console.log("Unable to send message:\n" + err + res);
                resolve("error");
            } else {
                Database.ref("Telemetry/ExternalAPICall").child("MessAPI").set(ServerValue.increment(1));
                resolve("ok");
            }
        });
    });
};

export const getSimsimi = (ask, sv = 2) => {
    return new Promise((resolve) => {
        const text = encodeURIComponent(ask);
        let uri = `https://api-sv2.simsimi.net/v2/?text=${text}&lc=vn&cf=false`;
        if (sv == 0) uri = `https://simsimi.info/api/?text=${text}&lc=vn`;
        else if (sv == 1) uri = `https://api.simsimi.net/v2/?text=${text}&lc=vn&cf=false`;
        request({
            uri: uri,
            method: "GET",
            followAllRedirects: true,
        }, (err, res, body) => {
            if (!err) {
                Database.ref("Telemetry/Simsimi").child(sv).set(ServerValue.increment(1));
                Database.ref("Telemetry/ExternalAPICall").child("SimsimiAPI").set(ServerValue.increment(1));
                resolve(JSON.parse(body));
            } else {
                console.error("Unable to GET: " + body + "\nError: " + err);
                resolve("error");
            }
        });
    });
};

module.exports = {
    getHomePage,
    getWebhook,
    postWebhook,
};
