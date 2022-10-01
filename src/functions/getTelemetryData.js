import {postMessenger} from "../controllers/chatbotController";
import {Database} from "../controllers/handleFirestore";

async function TelemetryData(sender_psid) {
    if (sender_psid != "306816786589318") console.log("Get Telemetry Data: ", sender_psid);

    const response = {"text": `
Sử dụng API:
=================
Messenger: ${Database.ref("Telemetry/ExternalAPICall").child("MessAPI").get()}
Google Sheet: ${Database.ref("Telemetry/ExternalAPICall").child("GoogleAPI").get()}
Simsimi: ${Database.ref("Telemetry/ExternalAPICall").child("SimsimiAPI").get()}
TS247: ${Database.ref("Telemetry/ExternalAPICall").child("TS247API").get()}

API Simsimi:
=================
Servers: ${Database.ref("Telemetry/Simsimi").child("0").get()} | ${Database.ref("Telemetry/Simsimi").child("1").get()} | ${Database.ref("Telemetry/Simsimi").child("2").get()}
Emoji Reply: ${Database.ref("Telemetry/Simsimi").child("InternalReq").get()}
NotUnderstand: ${Database.ref("Telemetry/Simsimi").child("NotUnderstandReq").get()}

Users:
=================
Tổng Người dùng: ${Database.ref("Telemetry/Users").child("UserCnt").get()}
Người dùng HĐ: ${Database.ref("Telemetry/Users").child("UserCnt").get()}
`};
    postMessenger(sender_psid, response);
}

export default {
    TelemetryData,
};
