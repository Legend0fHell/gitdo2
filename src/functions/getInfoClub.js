import {postMessenger, postGoogle} from "../controllers/chatbotController.js";

// Set the cache if the user request Club.
async function CLBPhase1(sender_psid, showMode = "Pg1") {
    console.log("CLB phase 1, procedding to ask: ", sender_psid);
    const res2 = await postGoogle({
        "mode": 3,
        "showMode": showMode,
    });
    const arraySend = [];
    for (let i = 0; i < res2.length; ++i) {
        const tmp = {
            "content_type": "text",
            "title": res2[i][2],
            "payload": "CLBP2_" + res2[i][1],
        };
        arraySend.push(tmp);
    }
    postMessenger(sender_psid, {
        "text": "Cậu muốn hỏi về CLB nào nhỉ? :v",
        "quick_replies": arraySend,
    });
}

async function CLBPhase2(sender_psid, answer) {
    if (sender_psid != "306816786589318") console.log("CLB phase 2: ", sender_psid, "Content: ", answer);
    const res2 = await postGoogle({
        "mode": 4,
        "id": answer,
    });
    const button = [];
    for (let j = 3; j <= 5; ++j) {
        let titl;
        if (j == 3) titl = "Facebook";
        if (j == 4) titl = "Instagram";
        if (j == 5) titl = "Khác";
        if (res2[0][j] != "") {
            button.push({
                "type": "web_url",
                "url": res2[0][j],
                "title": titl,
            });
        }
    }
    postMessenger(sender_psid, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": res2[0][0], "image_url": res2[0][2], "subtitle": res2[0][1], "buttons": button,
                    "default_action": {
                        "type": "web_url",
                        "url": res2[0][3],
                        "webview_height_ratio": "FULL",
                    },
                }],
            },
        },
    });
}

export default {
    CLBPhase1, CLBPhase2,
};
