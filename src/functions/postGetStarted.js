import {postMessenger} from "../controllers/chatbotController.js";
import * as PostbackID from "../controllers/indexPostbackId.js";
// Set the cache if the user asked to get started.
function HelloWorld(sender_psid) {
    if (sender_psid != "306816786589318") console.log("Hello world: ", sender_psid);
    const response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Xin chào, mình là GitDo đây :<",
                        "image_url": "https://thumbs2.imgbox.com/4a/b5/0ZdluDVZ_t.png",
                        "subtitle": "Hãy xem menu để biết mình có thể làm gì nè! Muốn hỏi gì hãy nói, buồn chuyện gì hãy kể nhé <3",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.facebook.com/cybtechno/",
                            "webview_height_ratio": "FULL",
                        },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Thời khóa biểu",
                                "payload": PostbackID.TKB,
                            },
                            {
                                "type": "postback",
                                "title": "Tất tần tật về CYB",
                                "payload": PostbackID.About,
                            },
                            {
                                "type": "postback",
                                "title": "Hướng dẫn dùng GitDo",
                                "payload": PostbackID.Help,
                            },
                        ],
                    },
                ],
            },
        },
    };
    postMessenger(sender_psid, response);
    postMessenger(sender_psid, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Nếu bạn là học sinh CYB, hãy nhấn nút dưới để nhận được những thông báo về TKB, sự kiện, áo đoàn, vv từ GitDo nhaa!",
                "buttons": [{
                    "type": "postback",
                    "title": "Nhấn vào đây nè <3",
                    "payload": "NotiOptInPostback",
                }],
            },
        },
    });
}

export {
    HelloWorld,
};
