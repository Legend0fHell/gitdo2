import {createRequire} from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import {seenIndicator} from "./controllers/chatbotController.js";
import {handleMessage} from "./controllers/handleMessage.js";
import {handleQuickReply} from "./controllers/handleQuickReply.js";
import {handlePostback} from "./controllers/handlePostback.js";
import {handleOptin} from "./controllers/handleOptin.js";
import {Debug} from "./functions/debug.js";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const app = express().use(bodyParser.json());

app.listen(process.env.PORT || 8080, () => {
    console.log("GitDo2 - Glitch Compliant, running at: " + (process.env.PORT || 8080));
});

app.get("/webhook", (req, res) => {
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
    Debug();
});

app.post("/webhook", (req, res) => {
    const body = req.body;
    if (body.object === "page") {
        body.entry.forEach(function(entry) {
            const webhook_event = entry.messaging[0];
            const sender_psid = webhook_event.sender.id;
            if (webhook_event.postback) {
                seenIndicator(sender_psid);
                handlePostback(sender_psid, webhook_event.postback);
            } else if (webhook_event.message) {
                seenIndicator(sender_psid);
                try {
                    if (webhook_event.message.quick_reply.payload) {
                        handleQuickReply(sender_psid, webhook_event.message.quick_reply.payload);
                    }
                } catch (error) {
                    handleMessage(sender_psid, webhook_event.message);
                }
            } else if (webhook_event.optin) {
                seenIndicator(sender_psid);
                handleOptin(sender_psid, webhook_event.optin);
            }
        });
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

