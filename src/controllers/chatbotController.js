import {createRequire} from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
import request from "request";
import {Database, ServerValue} from "./handleFirestore.js";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

export const cache = {};

export const seenIndicator = (sender_psid) => {
    if (sender_psid == "306816786589318") return;
    const request_body = {
        "recipient": {
            "id": sender_psid,
        },
        "sender_action": "mark_seen",
    };
    request({
        "uri": "https://graph.facebook.com/v13.0/306816786589318/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body,
    }, (err, res, body) => {
    });
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
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    console.error("Unable to resolve JSON: " + request_body + "\nError: " + error + body);
                    resolve("error");
                }
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
        let uri = `https://tuanxuong.com/api/simsimi/index.php?text=${text}`;
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
                try {
                    if (sv == 1) resolve(JSON.parse(body));
                    else if (sv == 0) {
                        const tmp = JSON.parse(body);
                        tmp.success = tmp.message;
                        resolve(tmp);
                    } else if (sv == 2) {
                        const tmp = JSON.parse(body);
                        tmp.success = tmp.response;
                        resolve(tmp);
                    }
                } catch (error) {
                    console.error("Unable to resolve JSON: " + body + "\nError: " + error);
                    resolve("error");
                }
            } else {
                console.error("Unable to GET: " + body + "\nError: " + err);
                resolve("error");
            }
        });
    });
};
