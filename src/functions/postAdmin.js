import {postMessenger, postGoogle} from "../controllers/chatbotController.js";

// Set the cache if the user asked to get started.
async function AdminCre(sender_psid) {
    if (sender_psid != "306816786589318") console.log("Admin: ", sender_psid);
    const res = await postGoogle({
        "mode": 7,
    });
    const elements = [];
    res.forEach((info) => {
        elements.push({
            "title": info[0],
            "image_url": info[2],
            "subtitle": info[1],
            "buttons": [
                {
                    "type": "web_url",
                    "url": info[3],
                    "title": "Messenger",
                },
            ],
            "default_action": {
                "type": "web_url",
                "url": info[3],
                "webview_height_ratio": "FULL",
            },
        });
    });
    postMessenger(sender_psid, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements,
            },
        },
    });
}

export {
    AdminCre,
};
