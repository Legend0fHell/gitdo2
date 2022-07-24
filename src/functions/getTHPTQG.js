import {postMessenger} from "../controllers/chatbotController";
import {Database, ServerValue} from "../controllers/handleFirestore";
import request from "request";
import UserAgent from "user-agents";

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

Ghi chú: Tên khối hỗ trợ tra cứu: A00 đến A02, A07 đến A09, B00, B08, C00 đến C05, D00 đến D10, D14, D15.
`,
    };
    postMessenger(sender_psid, response);
}

const blockList = ["A00", "A01", "A02", "A07", "A08", "A09", "B00", "B08", "C00", "C01", "C02", "C03", "C04", "C05", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10", "D14", "D15"];
async function THPTQG(sender_psid, text) {
    if (sender_psid != "306816786589318") console.log("THPTQG master: ", sender_psid);
    text = text.toUpperCase().replace(/,/gi, ".");
    const textSplit = text.split(" ");
    if (textSplit.length < 3 || isNaN(textSplit[2])) {
        Help(sender_psid);
        return;
    }
    console.log("THPTQG valid: ", sender_psid, "ID: ", textSplit[2]);
    if (textSplit[1] == "MB" || textSplit[1] == "MT" || textSplit[1] == "MN" || textSplit[1] == "CN") {
        let aftCorrect;
        if (textSplit[3].length == 2) aftCorrect = textSplit[3].insert(1, "0");
        else aftCorrect = textSplit[3];
        if (aftCorrect == "D00") aftCorrect = "D01";
        if (aftCorrect.length != 3 || !blockList.some((v) => aftCorrect.equals(v))) {
            Help(sender_psid);
            return;
        }
        THPTRank(sender_psid, textSplit[1], aftCorrect, textSplit[2]);
        return;
    }
    const response = {
        "text": "Hiện tại tính năng đang được phát triển! Bạn quay lại sau nha!",
    };
    postMessenger(sender_psid, response);
}
const postTS247 = (vung, block_code, total_mark) => {
    return new Promise((resolve) => {
        request({
            uri: "https://diemthi.tuyensinh247.com/tsHighSchool/ajaxTracuuXephang",
            method: "POST",
            followAllRedirects: true,
            headers: {"User-Agent": new UserAgent().toString()},
        }, (err, res, body) => {
            if (!err) {
                Database.ref("Telemetry/ExternalAPICall").child("TS247API").set(ServerValue.increment(1));
                try {
                    const matches = body.match(/[\d\.]+/g);
                    resolve([matches[8], matches[10], matches[11], matches[7]]);
                } catch (error) {
                    console.error("Unable to resolve JSON: " + body + "\nError: " + error + body);
                    resolve(["error"]);
                }
            } else {
                console.error("Unable to POST: " + body + "\nError: " + err);
                resolve(["error"]);
            }
        }).form({
            vung: vung,
            block_code: block_code,
            total_mark: total_mark,
        });
    });
};

async function THPTRank(sender_psid, vung, block_code, total_mark) {
    const res = await postTS247(vung, block_code, total_mark);
    if (res[0] == "error") {
        Help(sender_psid);
        return;
    }
    let vungViet;
    if (vung == "MB") vungViet = "Miền Bắc";
    if (vung == "MT") vungViet = "Miền Trung";
    if (vung == "MN") vungViet = "Miền Nam";
    if (vung == "CN") vungViet = "Toàn quốc";
    const res1 = parseInt(res[1]);
    const res2 = parseInt(res[2]);
    postMessenger(sender_psid, {
        "text": `
Điểm bạn đang xét là: ${res[3]}. Khối ${block_code}. Khu vực: ${vungViet}.

Số lượng thí sinh có điểm bằng ${res[3]} là: ${res[0]},
Số lượng thí sinh có điểm hơn ${res[3]} là: ${res[1]},
Số lượng thí sinh trong khối ${block_code} là: ${res[2]},
Bạn đang nằm trong top ${res1 < 100 ? `${res1 +1} thí sinh` : `${(100.0*res1/res2).toFixed(2)}%`} tốt nhất ${vungViet}.

Ghi chú: Xếp hạng chưa bao gồm điểm cộng, điểm ưu tiên. Số lượng HS trong khối là số HS thi đủ 3 môn nhưng có thể không xét tuyển bằng khối đó.
From GitDo with love <3
`,
    });
}

export default {
    Help, THPTQG,
};
