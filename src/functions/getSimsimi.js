import { postMessenger, postGoogle, cache, getSimsimi } from '../controllers/chatbotController';

const emojiResponse = ["😀","😁","😂","🤣","😄","😅","😆","😉","😊","😋","😍","😘","🥰","😚","☺","🤗","🤩","😛","😜","😝","=)))", ":))", "=]]]]", ":>", ":]]]"];
const notUnderstand = [
    "Sim kh\u00f4ng bi\u1ebft b\u1ea1n \u0111ang n\u00f3i g\u00ec. Xin h\u00e3y ch\u1ec9 d\u1ea1y cho t\u1edb",
    "T\u00f4i kh\u00f4ng bi\u1ebft b\u1ea1n \u0111ang n\u00f3i g\u00ec. H\u00e3y d\u1ea1y t\u00f4i",
]
// Answer using Simsimi when users chatting.
async function Simsimi(sender_psid, text) {
    if (sender_psid != '306816786589318') console.log('Simsimi: ', sender_psid);

    // Detect spam or emoji by counting the number of letter.
    let textDetect = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    if(!/^[A-Z]+$/.test(textDetect)) { // If not found any letter:
        console.log('Spam detected: ', sender_psid, " Detect: ", textDetect);
        // Random the response in the emoji array.
        let response = {"text": emojiResponse[Math.floor(Math.random()*emojiResponse.length)]};
        postMessenger(sender_psid, response);
        return;
    }

    // Server randomizing for balancing output.
    let ans;
    if(text.length <= 8) {
        console.log('Simsimi SV1 / INFO: ', sender_psid);
        ans = await getSimsimi(text, Math.floor(Math.random()*2)+1);
    }
    else {
        console.log('Simsimi SV2: ', sender_psid);
        ans = await getSimsimi(text);
    }

    // Checking the response if it is valid.
    if(notUnderstand.some(v => ans.success.includes(v))) { // If Simsimi does not understand:
        console.log('Simsimi not understand: ', sender_psid);
        // Random the response in the emoji array.
        let response = {"text": emojiResponse[Math.floor(Math.random()*emojiResponse.length)]};
        postMessenger(sender_psid, response);
        return;
    }

    // Send response
    console.log('Simsimi response: ', sender_psid, " Text: ", ans.success);
    let response = { "text": ans.success };
    postMessenger(sender_psid, response);
}

export default {
    Simsimi
}