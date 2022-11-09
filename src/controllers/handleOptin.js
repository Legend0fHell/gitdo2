import * as indexFunction from "../functions/indexFunction.js";

export const handleOptin = (sender_psid, received_optin) => {
    // Don't analyze message from the bot itself.
    if (sender_psid == "306816786589318") return;

    // Debugging line
    console.log("Received OptIn: ", sender_psid, "Content: ", received_optin);

    if (received_optin.payload == "RecurNotiOptIn") {
        indexFunction.postOptinNoti.RNOptIn(sender_psid, received_optin);
    }
};
