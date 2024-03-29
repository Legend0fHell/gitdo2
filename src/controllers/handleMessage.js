import * as indexFunction from "../functions/indexFunction.js";
import {handleCommand} from "./handleCommand.js";
import {cache} from "./chatbotController.js";
import {handleCache} from "./handleCache.js";

export const handleMessage = (sender_psid, received_message) => {
    // Don't analyze message from the bot itself.
    if (sender_psid == "306816786589318" || received_message.text === undefined) return;

    // Debugging line
    console.log("Received message: ", sender_psid, "Content: ", received_message.text);

    if (received_message.text.charAt(0) == "!") {
        handleCommand(sender_psid, received_message.text);
    } else if (cache[sender_psid]) {
        handleCache(sender_psid, received_message.text, cache[sender_psid]);
    } else {
        indexFunction.getSimsimi.Simsimi(sender_psid, received_message.text);
    }
};
