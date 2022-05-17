import getTimetable from "../functions/getTimetable";
import getInfoClub from "../functions/getInfoClub";
import postGetStarted from "../functions/postGetStarted";
import { cache } from "./chatbotController";

export let handleQuickReply = (sender_psid, received_payload) => {
    console.log('Received QuickReply payload: ', sender_psid, 'Content: ', received_payload);
    if (received_payload.includes('CLBP2')) {
        if (received_payload.substring(6) == '5') getInfoClub.CLBPhase1(sender_psid, "MH");
        else if (received_payload.substring(6) == '10') getInfoClub.CLBPhase1(sender_psid, "Pg2");
        else if (received_payload.substring(6) == '19') getInfoClub.CLBPhase1(sender_psid, "Pg1");
        else getInfoClub.CLBPhase2(sender_psid, received_payload.substring(6));
    }
    else if (received_payload.includes(CLBPostbackID)) {
        getInfoClub.CLBPhase1(sender_psid, "Pg1");
    }
    else if (received_payload.includes(TKBPostbackID)) {
        getTimetable.TKBPhase1(sender_psid);
    }
}