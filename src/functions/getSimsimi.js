import { postMessenger, postGoogle, cache, getSimsimi } from '../controllers/chatbotController';
import { Firestore, FieldValue, Database, ServerValue} from '../controllers/handleFirestore';
import { bad_words } from './vn_offensive_words';
const emojiResponse = ["😀","😁","😂","🤣","😄","😅","😆","😉","😊","😋","😍","😘","🥰","😚","☺","🤗","🤩","😛","😜","😝","=)))", ":))", "=]]]]", ":>", ":]]]"];
const notUnderstand = [
    "Sim kh\u00f4ng bi\u1ebft b\u1ea1n \u0111ang n\u00f3i g\u00ec. Xin h\u00e3y ch\u1ec9 d\u1ea1y cho t\u1edb",
    "T\u00f4i kh\u00f4ng bi\u1ebft b\u1ea1n \u0111ang n\u00f3i g\u00ec. H\u00e3y d\u1ea1y t\u00f4i",
]

// Filter bad words
function valid (content) {
    const star = "*************************************"

    for (text of bad_words) {
        var regEx = new RegExp(text, "ig");
        text = text.replaceAll(regEx, star.substring(0, text.length));
    }

    return content;
}

// Answer using Simsimi when users chatting.
async function Simsimi(sender_psid, text) {
    if (sender_psid != '306816786589318') console.log('Simsimi: ', sender_psid);

    // Remove all of the special symbols.
    text = text.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

    // Detect spam or emoji by counting the number of letter.
    let textDetect = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    let resultDetect = /[A-Z]/.test(textDetect)
    if(resultDetect == false || text.length < 3) { // If not found any letter:
        console.log('Spam detected: ', sender_psid, " Detect: ", textDetect);
        Database.ref("Telemetry/Simsimi").child("InternalReq").set(ServerValue.increment(1));
        // Random the response in the emoji array.
        let response = {"text": emojiResponse[Math.floor(Math.random()*emojiResponse.length)]};
        postMessenger(sender_psid, response);
        return;
    }

    // Server randomizing for balancing output.
    let ans;
    let retry = 1;
    if(text.length <= 10) {
        console.log('Simsimi SV1 / INFO: ', sender_psid);
        ans = await getSimsimi(text, Math.floor(Math.random()*2));
        retry = 2;
    }
    else {
        console.log('Simsimi SV2: ', sender_psid);
        ans = await getSimsimi(text);
    }

    // Checking the response if it is valid.
    while(retry > 0) {
        // If Simsimi understands, break:
        if(!notUnderstand.some(v => ans.success.includes(v))) break;

        // If Simsimi does not understand:
        console.log('Simsimi not understand: ', sender_psid);
        retry--;
        Database.ref("Telemetry/Simsimi").child("NotUnderstandReq").set(ServerValue.increment(1));

        if(retry > 0) {
            // If possible, switch to SV2:
            console.log('Switching to Simsimi SV2: ', sender_psid);
            ans = await getSimsimi(text);
        }
        else {
            // If not possible, random the response in the emoji array.
            Database.ref("Telemetry/Simsimi").child("InternalReq").set(ServerValue.increment(1));
            let response = {"text": emojiResponse[Math.floor(Math.random()*emojiResponse.length)]};
            postMessenger(sender_psid, response);
            return;
        }
    }

    // Send response
    console.log('Simsimi response: ', sender_psid, " Text: ", ans.success);
    let response = { "text": valid(ans.success) };
    postMessenger(sender_psid, response);
}

export default {
    Simsimi
}