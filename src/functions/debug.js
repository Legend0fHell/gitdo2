/* eslint-disable no-unused-vars */
// import {postMessenger, postGoogle, cache} from "../controllers/chatbotController";
// import {Firestore, FieldValue, Database, ServerValue} from "../controllers/handleFirestore";
import request from "request";
import UserAgent from "user-agents";
// Debugging/Testing here (running locally instead of real testing on Heroku's servers.)
// Need NodeJS initialized.
// Run Debug by accessing localhost:8080.

export const Debug = async () => {
    request({
        uri: "https://diemthi.tuyensinh247.com/tsHighSchool/ajaxTracuuXephang",
        method: "POST",
        followAllRedirects: true,
        headers: {"User-Agent": new UserAgent().toString()},
    }, (err, res, body) => {
        if (!err) {
            // Database.ref("Telemetry/ExternalAPICall").child("TS247API").set(ServerValue.increment(1));
            try {
                const matches = body.match(/[\d\.]+/g);
                console.log(matches[8], matches[10], matches[11]);
            } catch (error) {
                console.error("Unable to resolve JSON: " + body + "\nError: " + error + body);
                // resolve("error");
            }
        } else {
            console.error("Unable to POST: " + body + "\nError: " + err);
            // resolve("error");
        }
    }).form({
        vung: "CN",
        block_code: "D00",
        total_mark: "26.25",
    });
};
