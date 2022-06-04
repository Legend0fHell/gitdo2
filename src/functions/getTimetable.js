import {postMessenger, postGoogle, cache} from "../controllers/chatbotController";

// Set the cache if the user request TKB.
function TKBPhase1(sender_psid) {
    console.log("TKB phase 1, procedding to ask: ", sender_psid);
    postMessenger(sender_psid, {"text": "Bạn hãy nhập tên lớp cần tra cứu (Ví dụ: 11SD):"});
    cache[sender_psid] = "TKB";
}

async function TKBPhase2(sender_psid, answer) {
    const classAsking = answer;
    if (sender_psid != "306816786589318") console.log("TKB phase 2: ", sender_psid, "Content: ", answer);
    let response;
    cache[sender_psid] = null;
    const res2 = await postGoogle({
        "mode": 2,
        "id": classAsking,
    });
    if (res2.Status === "SUCCESS") {
        response = {"text": "TKB lớp " + res2.Class + ", có hiệu lực từ " + res2.Update + ": \n" + res2.Text};
        postMessenger(sender_psid, response);
        response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "attachment_id": res2.AttID,
                },
            },
        };
        postMessenger(sender_psid, response);
    } else {
        TKBNotFound(sender_psid);
    }
}

function TKBNotFound(sender_psid) {
    cache[sender_psid] = null;
    const response = {"text": "TKB của lớp bạn vừa nhập là gì tớ có biết đâu ._."};
    postMessenger(sender_psid, response);
}

export default {
    TKBPhase1, TKBPhase2, TKBNotFound,
};
