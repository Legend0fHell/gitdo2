import {postMessenger, postGoogle} from "../controllers/chatbotController";

const genderMale = ["thay", "chu", "ong", "bac", "anh", "a", "th"];
const genderFemale = ["co", "ba", "chi", "c"];

function Invalid(sender_psid) {
    const response = {"text": "Không hợp lệ."};
    postMessenger(sender_psid, response);
}

// Set the cache if the user asked to get started.
async function Info(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("Info: ", sender_psid);
    const textSplit = text.split(" ");
    if (textSplit.length == 1) Invalid(sender_psid);
    const firstArg = textSplit[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

    let gender = "Không";
    if (genderFemale.includes(firstArg)) gender = "Nữ";
    else if (genderMale.includes(firstArg)) gender = "Nam";

    const subj = (`${(textSplit.length > 2 ? textSplit.at(-2)+" " : "")}${textSplit.at(-1)}`).toLowerCase();
    const name = text.replace(/^(!info )/, "").toLowerCase();

    const res2 = await postGoogle({
        "mode": 5,
        "name": name,
        "subj": subj,
        "gender": gender,
    });
    const arraySend = [];
    res2.forEach((info) => {
        arraySend.push({
            "content_type": "text",
            "title": `${info[5]} ${info[1]} (${info[4]})`,
            "payload": `INFO_${info[0]}`,
        });
    });
    const response = {
        "text": `Đã tìm thấy ${res2.length} kết quả!`,
        "quick_replies": arraySend,
    };
    postMessenger(sender_psid, response);
}

export default {
    Info,
};
