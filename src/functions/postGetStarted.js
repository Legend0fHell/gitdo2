import {postMessenger} from "../controllers/chatbotController";

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
                                "payload": "postback_card_626f695446be37888700002d",
                            },
                            {
                                "type": "postback",
                                "title": "Lịch dạy thay",
                                "payload": "postback_card_626f69a746be37888700002f",
                            },
                            {
                                "type": "postback",
                                "title": "Xem thêm!",
                                "payload": "postback_card_626f6a4b46be372c1d000031",
                            },
                        ],
                    },
                ],
            },
        },
    };
    postMessenger(sender_psid, response);
}

export default {
    HelloWorld,
};
