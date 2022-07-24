import {postMessenger} from "../controllers/chatbotController";

function Help(sender_psid) {
    const response = {
        "text": `
Để tra cứu điểm thi, hãy nhập cú pháp:
!thptqg SBD [số báo danh]
VD: !thptqg SBD 13000078; !thptqg SBD 13000420; ...
Cú pháp bắt buộc phải có số báo danh hợp lệ.

Để tra cứu xếp hạng điểm thi của bạn tại Miền Bắc, Miền Trung, Miền Nam hay Cả nước hãy nhập cú pháp:
!thptqg [MB/MT/MN/CN] [điểm thi của bạn] [tên khối]
VD: !thptqg MB 28.9 A01; !thptqg CN 26.65 D00; ...

Ghi chú: Tên khối hỗ trợ tra cứu: A00 đến A02, A07 đến A09, B00, B08, C00 đến C05, D01 đến D10, D14, D15.
`,
    };
    postMessenger(sender_psid, response);
}

async function THPTQG(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("THPTQG master: ", sender_psid);
    const textSplit = text.split(" ");
    if (textSplit.length < 3 || isNaN(textSplit[1])) {
        Help(sender_psid);
        return;
    }
    console.log("THPTQG valid: ", sender_psid, "ID: ", textSplit[1]);
    const response = {
        "text": "Hiện tại tính năng đang được phát triển! Bạn quay lại sau nha!",
    };
    postMessenger(sender_psid, response);
}

export default {
    Help, THPTQG,
};
