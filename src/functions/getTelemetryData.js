import {postMessenger} from "../controllers/chatbotController.js";
import {Database} from "../controllers/handleFirestore.js";

async function TelemetryData(sender_psid) {
    if (sender_psid != "306816786589318") console.log("Get Telemetry Data: ", sender_psid);
    const refer = Database.ref("Telemetry");
    await refer.once("value", (snap) => {
        console.log(snap.val());
        const response = {"text": `
Sử dụng API:
=================
Messenger: ${snap.val().ExternalAPICall.MessAPI}
Google Sheet: ${snap.val().ExternalAPICall.GoogleAPI}
Simsimi: ${snap.val().ExternalAPICall.SimsimiAPI}
TS247: ${snap.val().ExternalAPICall.TS247API}

API Simsimi:
=================
Servers: ${snap.val().Simsimi[0]} | ${snap.val().Simsimi[1]} | ${snap.val().Simsimi[2]}
Emoji Reply: ${snap.val().Simsimi.InternalReq}
NotUnderstand: ${snap.val().Simsimi.NotUnderstandReq}

Users:
=================
Tổng Người dùng: ${snap.val().Users.UserCnt}
Người dùng HĐ: ${snap.val().Users.UserCnt}
`};
        postMessenger(sender_psid, response);
    });
}

export default {
    TelemetryData,
};
