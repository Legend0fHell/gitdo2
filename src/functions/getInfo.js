import {postMessenger, postGoogle} from "../controllers/chatbotController";

const genderMale = ["thay", "chu", "ong", "bac", "anh", "a", "th", "t."];
const genderFemale = ["co", "ba", "chi", "c"];

function Help(sender_psid) {
    const response = {"text": "Tìm bằng !info [danh xưng] [tên] [môn/chức vụ]. \n Cú pháp bắt buộc phải có tên hoặc môn/chức vụ.\nVD: !info Thầy Nghĩa trẻ Toán"};
    postMessenger(sender_psid, response);
}

// Set the cache if the user asked to get started.
async function Info(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("Info: ", sender_psid);
    let textSplit;
    try {
        textSplit = text.split(" ");
    } catch (error) {
        Help(sender_psid);
        return;
    }
    if (textSplit.length < 2) {
        Help(sender_psid);
        return;
    }
    const firstArg = textSplit[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

    let gender = "Không";
    if (genderFemale.includes(firstArg)) gender = "Nữ";
    else if (genderMale.includes(firstArg)) gender = "Nam";

    const subj = (`${(textSplit.length > 2 ? textSplit.at(-2)+" " : "")}${textSplit.at(-1)}`).replace(/lí/, "lý").toLowerCase();
    const name = text.replace(/^(!info )/, "").toLowerCase();

    const res2 = await postGoogle({
        "mode": 5,
        "name": name,
        "subj": subj,
        "gender": gender,
    });
    if (res2.length == 0) {
        postMessenger(sender_psid, {"text": "Không tìm thấy dữ liệu trùng khớp! Hãy kiểm tra lại cú pháp! (nhắn '!info')"});
        return;
    }
    if (res2.length > 11) {
        postMessenger(sender_psid, {"text": `Đã tìm thấy ${res2.length} kết quả, vượt quá khả năng hiển thị! Hãy tra cứu chính xác hơn! (nhắn '!info')`});
        return;
    }
    const arraySend = [];
    res2.forEach((info) => {
        arraySend.push({
            "content_type": "text",
            "title": `${info[5]} ${info[6]} ${info[4]}`,
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
    Info, Help,
};
