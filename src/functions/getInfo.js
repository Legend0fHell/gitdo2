import {postMessenger, postGoogle} from "../controllers/chatbotController.js";

const genderMale = ["thay", "chu", "ong", "bac", "anh", "a", "th", "t."];
const genderFemale = ["co", "ba", "chi", "c"];

function Help(sender_psid) {
    const response = {
        "text": `
Tìm bằng !info [danh xưng] [tên] [môn/chức vụ].
Cú pháp bắt buộc phải có tên hoặc môn/chức vụ.
VD: !info Cô Duyên Tin; !info Toán; ...
===
PS: Dữ liệu hiện tại chưa đầy đủ/lỗi thời. Nếu biết, bạn có thể nhắn
trực tiếp dữ liệu mới vào đây để chúng mình xem xét cập nhật nhé!`,
    };
    postMessenger(sender_psid, response);
}

async function Profile(sender_psid, id, info = null) {
    console.log("Info: ", sender_psid, "PersonID: ", id);
    if (info == null) {
        info = await postGoogle({
            "mode": 6,
            "id": id,
        });
    }
    const button = [];
    if (info[8] != "") {
        button.push({
            "type": "phone_number",
            "title": "Gọi SĐT",
            "payload": info[8].replace(/^(0)/, "+84"),
        });
    }
    if (info[9] != "") {
        button.push({
            "type": "web_url",
            "url": info[9],
            "title": "Facebook",
        });
    }
    if (button.length == 0) {
        button.push({
            "type": "web_url",
            "url": "https://fb.com/cybtechno",
            "title": "Không info!",
        });
    }
    const response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": `${info[5]} ${info[1]} (${info[4]})`,
                    "image_url": info[10],
                    "subtitle": `SĐT: ${info[8]}.\nEmail: ${info[7]}\n${info[11]}`,
                    "buttons": button,
                }],
            },
        },
    };
    postMessenger(sender_psid, response);
}

// Set the cache if the user asked to get started.
async function Info(sender_psid, text, page = 1) {
    if (sender_psid != "306816786589318") console.log("Info: ", sender_psid, "Command: ", text);
    let textSplit;
    try {
        textSplit = text.split(" ");
    } catch (error) {
        Help(sender_psid);
        return;
    }
    if (textSplit.length < 2 || textSplit[0].toLowerCase() != "!info") {
        Help(sender_psid);
        return;
    }
    const firstArg = textSplit[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

    let gender = "Không";
    if (textSplit.length > 2) {
        if (genderFemale.includes(firstArg)) gender = "Nữ";
        else if (genderMale.includes(firstArg)) gender = "Nam";
    }

    const subj = (`${(textSplit.length > 2 ? textSplit.at(-2)+" " : "")}${textSplit.at(-1)}`).replace(/lí/, "lý").toLowerCase();
    const name = text.replace(/^(!info )/, "").toLowerCase();

    const resG = await postGoogle({
        "mode": 5,
        "name": name,
        "subj": subj,
        "gender": gender,
        "page": page,
    });
    const res2 = resG.data;
    if (sender_psid != "306816786589318") console.log("Info Found: ", name, subj, gender, page, resG.num);
    if (resG.num == 0) {
        postMessenger(sender_psid, {"text": "Không tìm thấy dữ liệu trùng khớp! Hãy kiểm tra lại cú pháp! (nhắn '!info')"});
        return;
    }
    if (resG.num == 1) {
        Profile(sender_psid, res2[0][0], res2[0]);
        return;
    }
    let navB = 0; let navF = 0;
    if (resG.num > 10) {
        if (page > 1) navB = 1;
        if (page < Math.ceil(resG.num/10)) navF = 1;
    }
    const arraySend = [];
    if (navB == 1) {
        arraySend.push({
            "content_type": "text",
            "title": "[<< TRANG TRƯỚC]",
            "payload": `INFO_P${page-1}_${text}`,
        });
    }
    res2.forEach((info) => {
        arraySend.push({
            "content_type": "text",
            "title": `${info[5]} ${info[6]} ${info[4]}`,
            "payload": `INFO_${info[0]}`,
        });
    });
    if (navF == 1) {
        arraySend.push({
            "content_type": "text",
            "title": "[TRANG SAU >>]",
            "payload": `INFO_P${page+1}_${text}`,
        });
    }
    const response = {
        "text": `Đã tìm thấy ${resG.num} kết quả! [Trang ${page}/${Math.ceil(resG.num/10)}]`,
        "quick_replies": arraySend,
    };
    postMessenger(sender_psid, response);
}

export {
    Info, Help, Profile,
};
