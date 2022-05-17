import getTimetable from "../functions/getTimetable";
import getInfoClub from "../functions/getInfoClub";
import postGetStarted from "../functions/postGetStarted";
import { cache } from "./chatbotController";

const CLBPostbackID = 'postback_card_626f69d246be3760af000038';
const TKBPostbackID = 'postback_card_626f695446be37888700002d';
const GetStartedPostbackID = 'GetStartedPostback';

export let handlePostback = (sender_psid, received_postback) => {
    let payload = received_postback.payload;
    if (sender_psid != '306816786589318') console.log('Received postback: ', sender_psid, 'Type: ', payload);
    if (payload.includes(TKBPostbackID)) {
        getTimetable.TKBPhase1(sender_psid);
    }
    else if (payload.includes(CLBPostbackID)) {
        getInfoClub.CLBPhase1(sender_psid, "Pg1");
    }
    else if (payload.includes(GetStartedPostbackID) || payload.includes("WELCOME_MESSAGE")) {
        postGetStarted.HelloWorld(sender_psid);
    }
}