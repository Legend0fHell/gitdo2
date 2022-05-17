import { postMessenger, postGoogle, cache } from '../controllers/chatbotController';

// Set the cache if the user asked to get started.
function LDT(sender_psid) {
    if (sender_psid != '306816786589318') console.log('LDT: ', sender_psid);
    let response = { "text": "Hiện tại chưa có lịch dạy thay mới nhaa!!" };
    postMessenger(sender_psid, response);
}

export default {
    LDT
}