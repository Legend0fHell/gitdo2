import {postMessenger} from "../controllers/chatbotController";

// Set the cache if the user asked to get started.
function LDT(sender_psid) {
    if (sender_psid != "306816786589318") console.log("LDT: ", sender_psid);
    const response = {"attachment": {
        "type": "image",
        "payload": {
            "attachment_id": "1491259617991509",
        },
    }};
    postMessenger(sender_psid, response);
}

export default {
    LDT,
};
