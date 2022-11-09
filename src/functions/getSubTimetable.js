import {postMessenger} from "../controllers/chatbotController.js";
import {Database} from "../controllers/handleFirestore.js";

// Set the cache if the user asked to get started.
async function TKBChieu(sender_psid) {
    if (sender_psid != "306816786589318") console.log("TKB Chiều: ", sender_psid);
    const refer = Database.ref("TKBChieu");
    await refer.once("value", (snap) => {
        let response = {"text": "TKB buổi chiều toàn trường, cập nhật cho ngày " + snap.val().DateTime + ":"};
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

export {
    TKBChieu,
};
