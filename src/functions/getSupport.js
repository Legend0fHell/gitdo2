import { postMessenger, postGoogle, cache } from '../controllers/chatbotController';
import { Firestore, FieldValue, Database, ServerValue } from "../controllers/handleFirestore";

// Set the cache if the user asked to get started.
async function HTHT(sender_psid, parentsDir = 'HTHT') {
    if (sender_psid != '306816786589318') console.log('HTHT: ', sender_psid);
    let arraySend = [];
    const refer = Database.ref(parentsDir);
    await refer.once('value', (snap) => {
        if(snap.numChildren() == 0) {
            let button = [];
            let links = snap.val().split(",");
            links.forEach((link, idx) => {
                button.push({
                    "type": "web_url",
                    "url": link,
                    "title": `Link ${idx+1}`
                });
            });
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Các đường link tài liệu và chuyên đề ôn luyện:",
                        "buttons": button
                    }
                }
            }
            postMessenger(sender_psid, response);
            return;
        }
        snap.forEach((childSnapshot) => { 
            arraySend.push({
                "content_type": "text",
                "title": childSnapshot.key,
                "payload": parentsDir + "/" + childSnapshot.key
            });
        });
    }, (errorObject) => {
        console.log("HTHT failed: ",sender_psid, "Error: ", errorObject.name);
    });
    let numOccurence = (parentsDir.match(/\//g)||[]).length;
    let responseText;
    switch (numOccurence) {
        case 0:
            await postMessenger(sender_psid, { "text": "Hãy để GitDo hỗ trợ các cậu học tập thật tốt nhaaa!" });
            responseText = "Cậu cần tớ giúp gì thế nhỉ? :>";
            break;
        case 1:
            responseText = "Cậu muốn GitDo giúp môn gì đây nhỉ?";
            break;
        case 2:
            responseText = "Cậu muốn hỏi kiến thức khối nào thế?";
            break;
        default:
            responseText = "Cậu muốn hỏi tớ gì nào?";
            break;
    };
    let response = {
        "text": responseText,
        "quick_replies": arraySend
    };
    postMessenger(sender_psid, response);
}

export default {
    HTHT
}