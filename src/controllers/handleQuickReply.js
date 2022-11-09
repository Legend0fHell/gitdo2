import * as indexFunction from "../functions/indexFunction.js";
import * as PostbackID from "./indexPostbackId.js";

export const handleQuickReply = (sender_psid, received_payload) => {
    console.log("Received QuickReply payload: ", sender_psid, "Content: ", received_payload);
    if (received_payload.includes("CLBP2")) {
        if (received_payload.substring(6) == "5") indexFunction.getInfoClub.CLBPhase1(sender_psid, "MH");
        else if (received_payload.substring(6) == "10") indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg2");
        else if (received_payload.substring(6) == "19") indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg1");
        else indexFunction.getInfoClub.CLBPhase2(sender_psid, received_payload.substring(6));
    } else if (received_payload.includes("HTHT")) {
        indexFunction.getSupport.HTHT(sender_psid, received_payload);
    } else if (received_payload.includes("INFO")) {
        if (!isNaN(received_payload.replace(/^(INFO_)/, ""))) {
            indexFunction.getInfo.Profile(sender_psid, received_payload.replace(/^(INFO_)/, ""));
        } else {
            const tmp = received_payload.split("_");
            indexFunction.getInfo.Info(sender_psid, tmp[2], parseInt(tmp[1].replace(/^(P)/, "")));
        }
    } else if (received_payload.includes(PostbackID.CLB)) {
        indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg1");
    } else if (received_payload.includes(PostbackID.TKB)) {
        indexFunction.getTimetable.TKBPhase1(sender_psid);
    } else if (received_payload.includes(PostbackID.LDT)) {
        indexFunction.getLDT.LDT(sender_psid);
    } else if (received_payload.includes(PostbackID.TKBChieu)) {
        indexFunction.getSubTimetable.TKBChieu(sender_psid);
    } else if (received_payload.includes(PostbackID.Info)) {
        indexFunction.getInfo.Help(sender_psid);
    } else if (received_payload.includes(PostbackID.TS10)) {
        indexFunction.getTS10.Help(sender_psid);
    } else if (received_payload.includes(PostbackID.THPTQG)) {
        indexFunction.getTHPTQG.Help(sender_psid);
    } else if (payload.includes(PostbackID.NotiOptIn)) {
        indexFunction.postOptinNoti.NotiOptIn(sender_psid);
    } else if (received_payload.includes(PostbackID.Help)) {
        indexFunction.postHelp.Help(sender_psid, "");
    }
};
