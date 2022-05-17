import { postMessenger, postGoogle } from '../controllers/chatbotController';

// Set the cache if the user request Club.
async function CLBPhase1(sender_psid, showMode = "Pg1") {
    console.log('CLB phase 1, procedding to ask: ', sender_psid);
    let response;
    let res2 = await postGoogle({
        "mode": 3,
        "showMode": showMode
    });
    let arraySend = [];
    for (let i = 0; i < res2.length; ++i) {
        let tmp = {
            "content_type": "text",
            "title": res2[i][2],
            "payload": "CLBP2_" + res2[i][1]
        }
        arraySend.push(tmp);
    }
    response = {
        "text": "Cậu muốn hỏi về CLB nào trong trường nhỉ? :v",
        "quick_replies": arraySend
    }
    postMessenger(sender_psid, response);
}

async function CLBPhase2(sender_psid, answer) {
    if (sender_psid != '306816786589318') console.log('CLB phase 2: ', sender_psid, 'Content: ', answer);
    let response;
    let res2 = await postGoogle({
        "mode": 4,
        "id": answer
    });
    let button = [];
    for (let j = 3; j <= 5; ++j) {
        let titl;
        if (j == 3) titl = "Facebook";
        if (j == 4) titl = "Instagram";
        if (j == 5) titl = "Khác";
        if (res2[0][j] != '')
            button.push({
                "type": "web_url",
                "url": res2[0][j],
                "title": titl
            });
    }
    response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": res2[0][0], "image_url": res2[0][2], "subtitle": res2[0][1], "buttons": button,
                    "default_action": {
                        "type": "web_url",
                        "url": res2[0][3],
                        "webview_height_ratio": "FULL"
                    }
                }]
            }
        }
    }
    postMessenger(sender_psid, response);
}

export default {
    CLBPhase1, CLBPhase2
}