import {postMessenger} from "../controllers/chatbotController";

// Set the cache if the user asked to get started.
async function NotiOptIn(sender_psid) {
    if (sender_psid != "306816786589318") console.log("Notification Opt-in: ", sender_psid);
    postMessenger(sender_psid, {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "notification_messages",
                "image_url": "https://thumbs2.imgbox.com/84/db/GDg0hvoj_t.png",
                "title": "Nhận thông báo TKB, Sự kiện, Áo đoàn...",
                "payload": "RecurNotiOptIn",
                "notification_messages_frequency": "DAILY",
                "notification_messages_timezone": "Asia/Ho_Chi_Minh",
            },
        },
    });
}

export default {
    NotiOptIn,
};
