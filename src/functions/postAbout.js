import { postMessenger } from "../controllers/chatbotController";
import * as PostbackID from "../controllers/indexPostbackId";

// Set the cache if the user asked to get started.
async function about(sender_psid) {
    if (sender_psid != '306816786589318') console.log('About: ', sender_psid);
    let response;
    response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "CYB là nhà <3",
                    "image_url": "https://thumbs2.imgbox.com/22/fe/SHYFp2AO_t.jpg",
                    "subtitle": "Địa chỉ:  Đường Nguyễn Tất Thành, tổ 44, phường Yên Thịnh, TP Yên Bái, Yên Bái",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Gọi!",
                            "payload": "+842163852131"
                        }
                    ],
                    "default_action": {
                        "type": "web_url",
                        "url": "http://chuyenyenbai.edu.vn/",
                        "webview_height_ratio": "FULL"
                    }
                }]
            }
        }
    }
    await postMessenger(sender_psid, response);
    let arraySend = [];
    let titleList = ["Thời khóa biểu", "Câu lạc bộ", "Lịch dạy thay"];
    let payloadList = [PostbackID.TKB, PostbackID.CLB, PostbackID.LDT];
    for (let i = 0; i < titleList.length; ++i) {
        arraySend.push({
            "content_type": "text",
            "title": titleList[i],
            "payload": payloadList[i]
        });
    }
    response = {
        "text": "Cậu muốn xem thông tin gì?",
        "quick_replies": arraySend
    }
    postMessenger(sender_psid, response);
}

export default {
    about
}