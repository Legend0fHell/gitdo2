import * as indexFunction from "../functions/indexFunction";
import * as PostbackID from "./indexPostbackId";

export const handlePostback = (sender_psid, received_postback) => {
    const payload = received_postback.payload;
    if (sender_psid != "306816786589318") console.log("Received postback: ", sender_psid, "Type: ", payload);
    if (payload.includes(PostbackID.TKB)) {
        indexFunction.getTimetable.TKBPhase1(sender_psid);
    } else if (payload.includes(PostbackID.CLB)) {
        indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg1");
    } else if (payload.includes(PostbackID.LDT)) {
        indexFunction.getLDT.LDT(sender_psid);
    } else if (payload.includes(PostbackID.About)) {
        indexFunction.postAbout.about(sender_psid);
    } else if (payload.includes(PostbackID.HTHT)) {
        indexFunction.getSupport.HTHT(sender_psid);
    } else if (payload.includes(PostbackID.Info)) {
        indexFunction.getInfo.Help(sender_psid);
    } else if (payload.includes(PostbackID.Admin)) {
        indexFunction.postAdmin.AdminCre(sender_psid);
    } else if (payload.includes(PostbackID.TS10)) {
        indexFunction.getTS10.Help(sender_psid);
    } else if (payload.includes(PostbackID.THPTQG)) {
        indexFunction.getTHPTQG.Help(sender_psid);
    } else if (payload.includes(PostbackID.NotiOptIn)) {
        indexFunction.postOptinNoti.NotiOptIn(sender_psid);
    } else if (payload.includes(PostbackID.Help)) {
        indexFunction.postHelp.Help(sender_psid, "");
    } else {
        indexFunction.postGetStarted.HelloWorld(sender_psid);
    }
};
