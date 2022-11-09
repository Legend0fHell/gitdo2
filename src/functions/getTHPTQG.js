import {postMessenger, postGoogle} from "../controllers/chatbotController.js";
import {Database, ServerValue} from "../controllers/handleFirestore.js";
import request from "request";
import UserAgent from "user-agents";

const HDT = [
    "THÀNH PHỐ HÀ NỘI",
    "THÀNH PHỐ HỒ CHÍ MINH",
    "THÀNH PHỐ HẢI PHÒNG",
    "THÀNH PHỐ ĐÀ NẴNG",
    "TỈNH HÀ GIANG",
    "TỈNH CAO BẰNG",
    "TỈNH LAI CHÂU",
    "TỈNH LÀO CAI",
    "TỈNH TUYÊN QUANG",
    "TỈNH LẠNG SƠN",
    "TỈNH BẮC KẠN",
    "TỈNH THÁI NGUYÊN",
    "TỈNH YÊN BÁI",
    "TỈNH SƠN LA",
    "TỈNH PHÚ THỌ",
    "TỈNH VĨNH PHÚC",
    "TỈNH QUẢNG NINH",
    "TỈNH BẮC GIANG",
    "TỈNH BẮC NINH",
    "",
    "TỈNH HẢI DƯƠNG",
    "TỈNH HƯNG YÊN",
    "TỈNH HÒA BÌNH",
    "TỈNH HÀ NAM",
    "TỈNH NAM ĐỊNH",
    "TỈNH THÁI BÌNH",
    "TỈNH NINH BÌNH",
    "TỈNH THANH HÓA",
    "TỈNH NGHỆ AN",
    "TỈNH HÀ TĨNH",
    "TỈNH QUẢNG BÌNH",
    "TỈNH QUẢNG TRỊ",
    "TỈNH THỪA THIÊN - HUẾ",
    "TỈNH QUẢNG NAM",
    "TỈNH QUẢNG NGÃI",
    "TỈNH KON TUM",
    "TỈNH BÌNH ĐỊNH",
    "TỈNH GIA LAI",
    "TỈNH PHÚ YÊN",
    "TỈNH ĐẮK LẮK",
    "TỈNH KHÁNH HÒA",
    "TỈNH LÂM ĐỒNG",
    "TỈNH BÌNH PHƯỚC",
    "TỈNH BÌNH DƯƠNG",
    "TỈNH NINH THUẬN",
    "TỈNH TÂY NINH",
    "TỈNH BÌNH THUẬN",
    "TỈNH ĐỒNG NAI",
    "TỈNH LONG AN",
    "TỈNH ĐỒNG THÁP",
    "TỈNH AN GIANG",
    "TỈNH BÀ RỊA – VŨNG TÀU",
    "TỈNH TIỀN GIANG",
    "TỈNH KIÊN GIANG",
    "THÀNH PHỐ CẦN THƠ",
    "TỈNH BẾN TRE",
    "TỈNH VĨNH LONG",
    "TỈNH TRÀ VINH",
    "TỈNH SÓC TRĂNG",
    "TỈNH BẠC LIÊU",
    "TỈNH CÀ MAU",
    "TỈNH ĐIỆN BIÊN",
    "TỈNH ĐĂK NÔNG",
    "TỈNH HẬU GIANG"];
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
    if (textSplit.length == 4 && (textSplit[1] == "MB" || textSplit[1] == "MT" || textSplit[1] == "MN" || textSplit[1] == "CN")) {
        let aftCorrect;
        if (textSplit[3].length == 2) aftCorrect = [textSplit[3].slice(0, 1), "0", textSplit[3].slice(1)].join("");
        else aftCorrect = textSplit[3];
        if (aftCorrect == "D00") aftCorrect = "D01";
        if (aftCorrect.length != 3 || !blockList.some((v) => aftCorrect === v)) {
            Help(sender_psid);
            return;
        }
        THPTRank(sender_psid, textSplit[1], aftCorrect, textSplit[2]);
        return;
    } else if (textSplit[1] == "SBD") {
        if (parseInt(textSplit[2]) <= 1000000 || parseInt(textSplit[2]) >= 65000000) {
            Help(sender_psid);
            return;
        }
        THPTGet(sender_psid, textSplit[2]);
    } else {
        Help(sender_psid);
        return;
    }
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
                    console.error("Unable to resolve: " + body + "\nError: " + error);
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
    if (parseInt(res[3]) == 0 && parseInt(total_mark) != 0) {
        THPTRank(sender_psid, vung, block_code, total_mark);
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

async function THPTGet(sender_psid, sbd) {
    const res = await postGoogle({
        "mode": 9,
        "id": sbd,
    });
    if (res[0] == "FAILED" || res[0] != sbd) {
        Help(sender_psid);
        return;
    }
    postMessenger(sender_psid, {
        "text": `
SBD ${res[0]}. Bạn thuộc hội đồng thi ${HDT[~~(parseInt(res[0])/1000000)-1]}.

${res[1] != "-1" ? `Toán: ${res[1]}; ` : ""}${res[2] != "-1" ? `Văn: ${res[2]}; ` : ""}${res[3] != "-1" ? `Anh: ${res[3]} ` : ""}
${res[4] != "-1" ? `Lý: ${res[4]}; ` : ""}${res[5] != "-1" ? `Hóa: ${res[5]} ` : ""}${res[6] != "-1" ? `Sinh: ${res[6]} ` : ""}${res[7] != "-1" ? `Sử: ${res[7]}; ` : ""}${res[8] != "-1" ? `Địa: ${res[8]}; ` : ""}${res[9] != "-1" ? `Công dân: ${res[9]} ` : ""}

Tổng điểm xét một số tổ hợp:
${(res[1] < 0 || res[4] < 0 || res[5] < 0) ? "" : `A00: ${res[1] + res[4] + res[5]}; `}${(res[1] < 0 || res[4] < 0 || res[3] < 0) ? "" : `A01: ${res[1] + res[4] + res[3]}; `}${(res[1] < 0 || res[5] < 0 || res[6] < 0) ? "" : `B00: ${res[1] + res[5] + res[6]}; `}${(res[2] < 0 || res[7] < 0 || res[8] < 0) ? "" : `C00: ${res[2] + res[7] + res[8]}; `}${(res[2] < 0 || res[1] < 0 || res[7] < 0) ? "" : `C03: ${res[2] + res[1] + res[7]}; `}${(res[1] < 0 || res[2] < 0 || res[3] < 0) ? "" : `D00: ${res[1] + res[2] + res[3]}; `}${(res[1] < 0 || res[5] < 0 || res[3] < 0) ? "" : `D07: ${res[1] + res[5] + res[3]} `}

Sau khi biết điểm rồi, bạn có thể nhập cú pháp "!thptqg [MB/MT/MN/CN] [điểm thi] [tên khối]" để xem xếp hạng của mình nhé!
From GitDo with love <3 
`,
    });
}

export {
    Help, THPTQG,
};
