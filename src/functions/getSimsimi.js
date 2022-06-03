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
    let letter = /^[A-Z]+$/;
    let textDetect = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    if(!textDetect.match(letter)) { // If not found any letter:
        // Random the response in the emoji array.
        let response = {"text": emojiResponse[Math.floor(Math.random()*emojiResponse.length)]};
        postMessenger(sender_psid, response);
        return;
    }

    // Server randomizing for balancing output.
    let ans;
    if(text.length <= 8) {
        ans = await getSimsimi(text, Math.floor(Math.random()*2)+1);
    }
    else {
        ans = await getSimsimi(text);
    }

    // Checking the response if it is valid.
    if(notUnderstand.some(v => ans.success.includes(v))) { // If Simsimi does not understand:
        // Random the response in the emoji array.
        let response = {"text": emojiResponse[Math.floor(Math.random()*emojiResponse.length)]};
        postMessenger(sender_psid, response);
        return;
    }

    // Send response
    let response = { "text": ans.success };
    postMessenger(sender_psid, response);
}

export default {
    Simsimi
}