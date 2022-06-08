import {postMessenger} from "../controllers/chatbotController";
import {Firestore} from "../controllers/handleFirestore";

// Set the cache if the user asked to get started.
function RNOptIn(sender_psid, received_optin) {
    console.log("Received RN Optin: ", sender_psid, "Token: ", received_optin.notification_messages_token, "Exp: ", received_optin.token_expiry_timestamp);
    if (received_optin.notification_messages_status == "STOP_NOTIFICATIONS") {
        Firestore.collection("RecurNoti").doc(sender_psid).set({
            "RNToken": received_optin.notification_messages_token,
            "RNExp": received_optin.token_expiry_timestamp,
            "Enable": 0,
        });
        postMessenger(sender_psid, {
            "text": "Hủy thông báo GitDo thành công.",
        });
        return;
    }
    Firestore.collection("RecurNoti").doc(sender_psid).set({
        "RNToken": received_optin.notification_messages_token,
        "RNExp": received_optin.token_expiry_timestamp,
        "Enable": 1,
    });
    const expDate = new Date(received_optin.token_expiry_timestamp);
    postMessenger(sender_psid, {
        "text": `Đã đăng ký nhận thông báo thành công! GitDo sẽ gửi thông báo cho bạn cho đến ${expDate.toLocaleDateString("vi-VN")}.\n===\n(Trường hợp bạn không muốn nhận thông báo nữa, bạn có thể chọn \"Dừng thông báo\" trong \"Quản lý\", hoặc không gia hạn khi được hỏi).`,
    });
}

async function NotiOptIn(sender_psid) {
    if (sender_psid != "306816786589318") console.log("Notification Opt-in: ", sender_psid);
    const res = await postMessenger(sender_psid, {
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
    if (res == "error") {
        const data = await Firestore.collection("RecurNoti").doc(sender_psid).get();
        if (!data.exists) {
            postMessenger(sender_psid, {
                "text": "Bạn chưa đăng ký từ trước đó!!",
            });
        } else {
            if (doc.data().Enable == 1) {
                postMessenger(sender_psid, {
                    "text": `Bạn đã đăng ký nhận thông báo từ trước đó!! GitDo hiện gửi thông báo cho bạn cho đến ${new Date(doc.data().RNExp).toLocaleDateString("vi-VN")}.\n===\n(Trường hợp bạn không muốn nhận thông báo nữa, bạn có thể chọn \"Dừng thông báo\" trong \"Quản lý\", hoặc không gia hạn khi được hỏi).`,
                });
            } else {
                postMessenger(sender_psid, {
                    "text": "Bạn đã hủy nhận thông báo từ trước đó!! GitDo hiện không gửi tin nhắn thông báo cho bạn.\n===\n(Trường hợp bạn muốn nhận thông báo, bạn có thể chọn \"Tiếp tục thông báo\" trong \"Quản lý\").",
                });
            }
        }
    }
}

export default {
    NotiOptIn, RNOptIn,
};
