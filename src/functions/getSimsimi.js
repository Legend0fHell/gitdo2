import {postMessenger, getSimsimi} from "../controllers/chatbotController";
import {Database, ServerValue} from "../controllers/handleFirestore";
import {bad_words} from "./vn_offensive_words";

const emojiResponse = ["😀", "😁", "😂", "🤣", "😄", "😅", "😆", "😉", "😊", "😋", "😍", "😘", "🥰", "😚", "☺", "🤗", "🤩", "😛", "😜", "😝", "=)))", ":))", "=]]]]", ":>", ":]]]"];
const notUnderstand = [
    "Sim kh\u00f4ng bi\u1ebft b\u1ea1n \u0111ang n\u00f3i g\u00ec. Xin h\u00e3y ch\u1ec9 d\u1ea1y cho t\u1edb",
    "T\u00f4i kh\u00f4ng bi\u1ebft b\u1ea1n \u0111ang n\u00f3i g\u00ec. H\u00e3y d\u1ea1y t\u00f4i",
    "L\u1ed7i  r\u1ed3i",
];

// Filter bad words
function valid(content) {
    const star = "*************************************";

    bad_words.forEach((text) => {
        const regEx = new RegExp(text, "ig");
        content = content.replaceAll(regEx, star.substring(0, text.length));
    });

    content = content.replace(/simsimi|simi|sim/gi, "GitDo");
    content = content.replace(/tao/gi, "tớ");
    content = content.replace(/mày/gi, "cậu");

    return content;
}

// Answer using Simsimi when users chatting.
async function Simsimi(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("Simsimi: ", sender_psid);

    // Remove all of the special symbols.
    text = text.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, "");

    // Change subject.
    text = text.replace(/gitdo|GitDo|Gitdo/gi, "simsimi");

    // Detect spam or emoji by counting the number of letter.
    const textDetect = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();
    const resultDetect = /[A-Z]/.test(textDetect);
    if (resultDetect == false || text.length < 3) { // If not found any letter:
        console.log("Spam detected: ", sender_psid, " Detect: ", textDetect);
        Database.ref("Telemetry/Simsimi").child("InternalReq").set(ServerValue.increment(1));
        // Random the response in the emoji array.
        const response = {"text": emojiResponse[~~ (Math.random()*emojiResponse.length)]};
        postMessenger(sender_psid, response);
        return;
    }

    // Server randomizing for balancing output.
    let retry = 1;
    const randArray = [0, 1, 2];
    for (let i = randArray.length - 1; i > 0; i--) {
        const j = ~~ (Math.random() * (i + 1));
        [randArray[i], randArray[j]] = [randArray[j], randArray[i]];
    }
    console.log("Simsimi SV", randArray[0], ":", sender_psid);
    let ans = await getSimsimi(text, randArray[0]);
    retry = 2;

    // Checking the response if it is valid.
    while (retry > 0) {
        let fll = 0;
        // If Simsimi understands, break:
        try {
            if (!notUnderstand.some((v) => ans.success.includes(v))) fll = 1;
        } catch (error) {
            console.log("Simsimi error: " + error);
            const response = {"text": emojiResponse[~~ (Math.random()*emojiResponse.length)]};
            postMessenger(sender_psid, response);
            return;
        }

        if (fll == 1) break;
        // If Simsimi does not understand:
        console.log("Simsimi not understand: ", sender_psid);
        retry--;
        Database.ref("Telemetry/Simsimi").child("NotUnderstandReq").set(ServerValue.increment(1));

        if (retry > 0) {
            // If possible, switch to other SV
            console.log("Switching to Simsimi SV", randArray[1], ":", sender_psid);
            ans = await getSimsimi(text, randArray[1]);
        } else {
        // If not possible, random the response in the emoji array.
            Database.ref("Telemetry/Simsimi").child("InternalReq").set(ServerValue.increment(1));
            const response = {"text": emojiResponse[~~ (Math.random()*emojiResponse.length)]};
            postMessenger(sender_psid, response);
            return;
        }
    }

    // Send response
    console.log("Simsimi response: ", sender_psid, " Text: ", ans.success);
    const response = {"text": valid(ans.success)};
    postMessenger(sender_psid, response);
}

export default {
    Simsimi,
};
