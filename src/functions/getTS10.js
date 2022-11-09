import {postMessenger, postGoogle} from "../controllers/chatbotController.js";

function Help(sender_psid) {
    const response = {
        "text": `
Tìm bằng !ts10 [số báo danh]
Cú pháp bắt buộc phải có số báo danh hợp lệ.
VD: !ts10 100696; !ts10 100420; ...
`,
    };
    postMessenger(sender_psid, response);
}

// Set the cache if the user asked to get started.
async function TS10(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("TS10: ", sender_psid);
    const textSplit = text.split(" ");
    if (textSplit.length < 2 || isNaN(textSplit[1])) {
        Help(sender_psid);
        return;
    }
    console.log("TS10 valid: ", sender_psid, "ID: ", textSplit[1]);
    const res = await postGoogle({
        "mode": 8,
        "id": textSplit[1],
    });
    if (res[0] == "FAILED") {
        Help(sender_psid);
        return;
    }
    postMessenger(sender_psid, {
        "text": `
SBD ${res[0]} | ${res[1]}

Điểm Đại trà:
Toán: ${res[9]} (#${res[10]} trường)
Anh: ${res[11]} (#${res[12]} trường)
Văn: ${res[13]} (#${res[14]} trường)
Tổng điểm ĐT: ${res[15]} (#${res[16]} trường)

Điểm Chuyên:
Điểm Chuyên NV1: ${res[7]}
Điểm Chuyên NV2: ${res[8]}
Tổng điểm XT NV1: ${res[17]}
Tổng điểm XT NV2: ${res[18]}

Xét lớp: ${(res[19] != "" ? `${res[19]} (#${res[20]} lớp).` : "Rất tiếc! Bạn không đỗ cả 2 nguyện vọng.")}

From GitDo with love <3
`,
    });
}

export {
    TS10, Help,
};
