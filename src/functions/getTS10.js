import {postMessenger, postGoogle} from "../controllers/chatbotController";

function Help(sender_psid) {
    const response = {
        "text": `
Tìm bằng !ts10 [số báo danh]
Cú pháp bắt buộc phải có số báo danh hợp lệ.
VD: !ts10 100001; !ts10 100420; ...
===
NOTE: DỮ LIỆU NĂM 2020, GitDo sẽ cập nhật sớm nhất có thể!
PS: Xếp hạng và điểm chuyên được tính trước khi phúc khảo.
Hãy kiên nhẫn chờ đợi thông tin chính thức của nhà trường!
Xếp lớp chỉ mang tính chất tham khảo (Trường hợp mọi lớp đều nhận 34 chỉ tiêu, không tính học sinh chuyển trường, không tính học sinh phúc khảo).`,
    };
    postMessenger(sender_psid, response);
}

// Set the cache if the user asked to get started.
async function TS10(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("TS10: ", sender_psid);
    textSplit = text.split(" ");
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
SBD ${res[0]} | ${res[1]} (${res[2]})
SN: ${res[3]} | ${res[4]}

Điểm Đại trà:
Toán: ${res[9]} (#${res[10]} trường)
Anh: ${res[11]} (#${res[12]} trường)
Văn: ${res[13]} (#${res[14]} trường)
Tổng điểm ĐT: ${res[15]} (#${res[16]} trường)

Điểm Chuyên:
Nguyện vọng: ${res[5]}, ${res[6]}.
Điểm Chuyên NV1: ${res[7]} (#${res[21]} NV1)
Điểm Chuyên NV2: ${res[8]} (#${res[23]} NV2)
Tổng điểm XT NV1: ${res[17]} (#${res[22]} NV1)
Tổng điểm XT NV2: ${res[18]} (#${res[24]} NV1)

Xét lớp: ${(res[19] != "" ? `${res[19]} (#${res[20]} lớp).` : "Chưa thể xét lớp. Hãy kiên nhẫn chờ thông tin chính thức của trường!")}

Ghi chú: 
Xếp hạng và điểm chuyên được tính trước khi phúc khảo.
Hãy kiên nhẫn chờ đợi thông tin chính thức của nhà trường!
Xếp lớp chỉ mang tính chất tham khảo (Trường hợp mọi lớp đều nhận 34 chỉ tiêu, không tính học sinh chuyển trường, không tính học sinh phúc khảo).
From GitDo with love <3
`,
    });
}

export default {
    TS10, Help,
};
