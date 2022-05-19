import { postMessenger, postGoogle, cache } from '../controllers/chatbotController';

// Set the cache if the user asked to get started.
async function HTHT(sender_psid) {
    if (sender_psid != '306816786589318') console.log('HTHT: ', sender_psid);
    let response = { "text": "Hãy để GitDo hỗ trợ các cậu học tập thật tốt nhaaa!" };
    await postMessenger(sender_psid, response);
    response = { "text": "Cậu cần tớ giúp gì thế nhỉ? :v" };   
}

export default {
    HTHT
}