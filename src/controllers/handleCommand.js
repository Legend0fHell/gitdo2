import * as indexFunction from "../functions/indexFunction";
import {cache} from "./chatbotController";

export const handleCommand = (sender_psid, received_command) => {
    if (sender_psid != "306816786589318") console.log("Received command: ", sender_psid, "Command: ", received_command);

    // Split arguments by whitespace. Normalize the command arg.
    const args = received_command.split(" ");
    args.forEach((element) => {
        element = element.toLowerCase();
    });

    // Normalize case by uppercase, de-Vietnamese.
    let strNormalized = "";
    try {
        strNormalized = received_command.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase();
    } catch (error) {
        return;
    }

    switch (args[0]) {
    case "!tkb":
        if (/\d/.test(strNormalized)) {
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
        break;
    case "!clb":
        indexFunction.getInfoClub.CLBPhase1(sender_psid, "Pg1");
        break;
    case "!restart":
        indexFunction.postGetStarted.HelloWorld(sender_psid);
        break;
    case "!ldt":
        indexFunction.getLDT.LDT(sender_psid);
        break;
    case "!about":
        indexFunction.postAbout.about(sender_psid);
        break;
    case "!htht":
        indexFunction.getSupport.HTHT(sender_psid);
        break;
    case "!info":
        indexFunction.getInfo.Info(sender_psid, received_command);
        break;
    case "!admin":
        indexFunction.postAdmin.AdminCre(sender_psid);
        break;
    case "!ts10":
        indexFunction.getTS10.TS10(sender_psid, received_command);
        break;
    case "!noti":
        indexFunction.postOptinNoti.NotiOptIn(sender_psid);
        break;
    case "!help":
        indexFunction.postHelp.Help(sender_psid, args[1]);
    default:
        indexFunction.postHelp.Help(sender_psid, "");
        break;
    }
};
