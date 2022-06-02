import { postMessenger, postGoogle, cache, getSimsimi } from '../controllers/chatbotController';

// Set the cache if the user asked to get started.
function Simsimi(sender_psid, text) {
    if (sender_psid != '306816786589318') console.log('Simsimi: ', sender_psid);
    let response = getSimsimi(text);
    postMessenger(sender_psid, response);
}

export default {
    Simsimi
}