import {postMessenger} from "../controllers/chatbotController";
import {Database} from "../controllers/handleFirestore";

// Set the cache if the user asked to get started.
async function LDT(sender_psid) {
    if (sender_psid != "306816786589318") console.log("LDT: ", sender_psid);
    const refer = Database.ref("LDT");
    await refer.once("value", (snap) => {
        let response = {"text": "LDT toàn trường, cập nhật cho ngày " + snap.val().DateTime + ":"};
        postMessenger(sender_psid, response);
        response = {"attachment": {
            "type": "image",
            "payload": {
                "attachment_id": snap.val().MessID,
            },
        }};
        postMessenger(sender_psid, response);
    });
}

export default {
    LDT,
};
