import * as indexFunction from "../functions/indexFunction";
import * as PostbackID from "./indexPostbackId";

export const handleQuickReply = (sender_psid, received_payload) => {
    console.log("Received QuickReply payload: ", sender_psid, "Content: ", received_payload);
    if (received_payload.includes("CLBP2")) {
        if (received_payload.substring(6) == "5") indexFunction.getInfoClub.CLBPhase1(sender_psid, "MH");
        else if (received_payload.substring(6) == "10") indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg2");
        else if (received_payload.substring(6) == "19") indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg1");
        else indexFunction.getInfoClub.CLBPhase2(sender_psid, received_payload.substring(6));
    } else if (received_payload.includes("HTHT")) {
        indexFunction.getSupport.HTHT(sender_psid, received_payload);
    } else if (received_payload.includes(PostbackID.CLB)) {
        indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg1");
    } else if (received_payload.includes(PostbackID.TKB)) {
        indexFunction.getTimetable.TKBPhase1(sender_psid);
    } else if (received_payload.includes(PostbackID.LDT)) {
        indexFunction.getLDT.LDT(sender_psid);
    }
};
