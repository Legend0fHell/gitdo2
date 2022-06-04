import * as indexFunction from "../functions/indexFunction";
import {cache} from "./chatbotController";

const TKBPhrases = ["TKB", "THOIKHOABIEU", "MONGI", "HOCGI", "HOCJ"];

export const handleMessage = (sender_psid, received_message) => {
    // Don't analyze message from the bot itself.
    if (sender_psid == "306816786589318") return;

    // Debugging line
    console.log("Received message: ", sender_psid, "Content: ", received_message.text);

    // Normalize case by uppercase, trim whitespace, de-Vietnamese.
    let strNormalized = "";
    try {
        strNormalized = received_message.text.replace(/ +/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();
    } catch (error) {
        return;
    }

    // Check if the line is saying about TKB:
    if (cache[sender_psid] === "TKB" || TKBPhrases.some((v) => strNormalized.includes(v))) {
        if (/\d/.test(strNormalized) || strNormalized.includes("DIU")) {
            // If the line contains number, auto pass it to the GSheet to try it:
            indexFunction.getTimetable.TKBPhase2(sender_psid, strNormalized);
        } else {
            // If the line doesn't contain number, if it was from phase1, incorrect input, else ask:
            if (cache[sender_psid] === "TKB") {
                indexFunction.getTimetable.TKBNotFound(sender_psid);
            } else {
                indexFunction.getTimetable.TKBPhase1(sender_psid);
            }
        }
        return;
    }
    indexFunction.getSimsimi.Simsimi(sender_psid, received_message.text);
};
