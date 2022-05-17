require("dotenv").config();
import request from "request";
import getTimetable from "../functions/getTimetable";
import getInfoClub from "../functions/getInfoClub";
import postGetStarted from "../functions/postGetStarted";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

let cache = {};
let getHomePage = (req, res) => {
    return res.send("Hello")
};

const CLBPostbackID = 'postback_card_626f69d246be3760af000038';
const TKBPostbackID = 'postback_card_626f695446be37888700002d';
const GetStartedPostbackID = 'GetStartedPostback';

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

function postGoogle(request_body) {
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
                console.error("Unable to POST: " + request_body + "Error: " + err);
                resolve("error");
            }
        });
    });

}

function handleQuickReply(sender_psid, received_payload) {
    console.log('Received QuickReply payload: ', sender_psid, 'Content: ', received_payload);
    if (received_payload.includes('CLBP2')) {
        if (received_payload.substring(6) == '5') getInfoClub.CLBPhase1(sender_psid, "MH");
        else if (received_payload.substring(6) == '10') getInfoClub.CLBPhase1(sender_psid, "Pg2");
        else if (received_payload.substring(6) == '19') getInfoClub.CLBPhase1(sender_psid, "Pg1");
        else getInfoClub.CLBPhase2(sender_psid, received_payload.substring(6));
    }
    else if (received_payload.includes(CLBPostbackID)) {
        getInfoClub.CLBPhase1(sender_psid, "Pg1");
    }
    else if (received_payload.includes(TKBPostbackID)) {
        getTimetable.TKBPhase1(sender_psid);
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
    let strNormalized = "";
    try {
        strNormalized = received_message.text.replace(/ +/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    } catch (error) {
        return;
    }

    // Check if the line is saying about TKB:
    if (cache[sender_psid] === 'TKB' || strNormalized.includes("TKB") || strNormalized.includes("THOIKHOABIEU") || strNormalized.includes("MONGI") || strNormalized.includes("HOCGI")) {
        if (/\d/.test(strNormalized) || strNormalized.includes("DIU")) {
            // If the line contains number, auto pass it to the GSheet to try it:
            getTimetable.TKBPhase2(sender_psid, strNormalized);
        }
        else {
            // If the line doesn't contain number, if it was from phase1, incorrect input, else ask:
            if (cache[sender_psid] === 'TKB') {
                cache[sender_psid] = null;
                response = { "text": "TKB của lớp bạn vừa nhập là gì tớ có biết đâu ._." };
                postMessenger(sender_psid, response);
            }
            else {
                getTimetable.TKBPhase1(sender_psid);
            }
        }
    }
}

function handlePostback(sender_psid, received_postback) {
    let payload = received_postback.payload;
    if (sender_psid != '306816786589318') console.log('Received postback: ', sender_psid, 'Type: ', payload);
    if (payload.includes(TKBPostbackID)) {
        getTimetable.TKBPhase1(sender_psid);
    }
    else if (payload.includes(CLBPostbackID)) {
        getInfoClub.CLBPhase1(sender_psid, "Pg1");
    }
    else if (payload.includes(GetStartedPostbackID) || payload.includes("WELCOME_MESSAGE")) {
        postGetStarted.HelloWorld(sender_psid);
    }
}

// Sends response messages via the Send API
function postMessenger(sender_psid, response) {
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
        try {
            console.log(body.error);
        }
        catch {

        }
        if (err) {
            console.log("Unable to send message:" + err);
        }
    });
}

module.exports = {
    getHomePage,
    getWebhook,
    postWebhook,
    postGoogle,
    postMessenger,
}