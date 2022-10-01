import {postMessenger} from "../controllers/chatbotController";
import {Database} from "../controllers/handleFirestore";

// Set the cache if the user asked to get started.
function LDT(sender_psid) {
    if (sender_psid != "306816786589318") console.log("LDT: ", sender_psid);
    let response = {"text": "LDT toàn trường, cập nhật cho ngày " + Database.ref("LDT").child("DateTime").get() + ":"};
    postMessenger(sender_psid, response);
    response = {"attachment": {
        "type": "image",
        "payload": {
            "attachment_id": Database.ref("LDT").child("MessID").get(),
        },
    }};
    postMessenger(sender_psid, response);
}

export default {
    LDT,
};
