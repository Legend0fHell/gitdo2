import * as indexFunction from "../functions/indexFunction";

export const handleCache = (sender_psid, received_message, cacheType) => {
    // Don't analyze message from the bot itself.
    if (sender_psid == "306816786589318") return;

    // Debugging line
    console.log("Received message with cache: ", sender_psid, "Content: ", received_message.text, "Cache type: ", cacheType);

    // Normalize case by uppercase, de-Vietnamese.
    let strNormalized = "";
    try {
        strNormalized = received_command.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();
    } catch (error) {
        return;
    }

    switch (cacheType) {
    case "TKB":
        if (/\d/.test(strNormalized)) {
            // If the line contains number, auto pass it to the GSheet to try it:
            indexFunction.getTimetable.TKBPhase2(sender_psid, strNormalized);
        } else {
            indexFunction.getTimetable.TKBNotFound(sender_psid);
        }
        break;
    default:
        break;
    }
};
