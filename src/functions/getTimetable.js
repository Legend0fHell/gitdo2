const controller = require('../controllers/chatbotController')

// Set the cache if the user request TKB.
function TKBPhase1(sender_psid) {
    console.log('TKB phase 1, procedding to ask: ', sender_psid);
    let response;
    response = { "text": "Bạn hãy nhập tên lớp cần tra cứu (Ví dụ: 12SD):" };
    controller.postMessenger(sender_psid, response);
    cache[sender_psid] = "TKB";
}

async function TKBPhase2(sender_psid, answer) {
    let classAsking = answer;
    if (sender_psid != '306816786589318') console.log('TKB phase 2: ', sender_psid, 'Content: ', answer);
    let response;
    cache[sender_psid] = null;
    let res2 = await controller.postGoogle({
        "mode": 2,
        "id": classAsking
    });
    if (res2.Status === 'SUCCESS') {
        response = { "text": "TKB lớp " + res2.Class + ", có hiệu lực từ " + res2.Update + ": \n" + res2.Text };
        controller.postMessenger(sender_psid, response);
        response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "attachment_id": res2.AttID,
                }
            }
        }
        controller.postMessenger(sender_psid, response);
    }
    else {
        response = { "text": "TKB của lớp bạn vừa nhập là gì tớ có biết đâu ._." };
        controller.postMessenger(sender_psid, response);
    }
}

module.exports = {
    TKBPhase1, TKBPhase2
}