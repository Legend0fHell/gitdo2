import {Firestore} from "./handleFirestore";

export const handleOptin = (sender_psid, received_optin) => {
    // Don't analyze message from the bot itself.
    if (sender_psid == "306816786589318") return;

    // Debugging line
    console.log("Received OptIn: ", sender_psid, "Content: ", received_optin);

    if (received_optin.payload == "RecurNotiOptIn") {
        console.log("Received RN Optin: ", sender_psid, "Token: ", received_optin.notification_messages_token, "Exp: ", received_optin.token_expiry_timestamp);
        Firestore.collection("RecurNoti").doc(sender_psid).set({
            "RNToken": received_optin.notification_messages_token,
            "RNExp": received_optin.token_expiry_timestamp,
        });
    }
};
