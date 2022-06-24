import {postMessenger} from "../controllers/chatbotController";


function Help(sender_psid, name) {
    if (sender_psid != "306816786589318") console.log("help: ", sender_psid, " name: ", name);
    let response;
    switch (name) {
    case "tkb":
        response = {
            "text": `
Tìm bằng !tkb [tên lớp]
Cú pháp bắt buộc phải có tên lớp hợp lệ.
VD: !tkb 11sd; !tkb 10s; ...`};
        break;
    case "clb":
        response = {
            "text": "Nhập: !clb để biết thêm thông tin về những CLB của CYB :>",
        };
        break;
    case "restart":
        response = {
            "text": "Nhập: !restart để khởi động lại phiên.",
        };
        break;
    case "ldt":
        response = {
            "text": "Nhập: !ldt để biết thêm lịch dạy thay của nhà trường",
        };
        break;
    case "about":
        response = {
            "text": "Nhập: !about để biết được những thông tin chi tiết về nhà trường :))",
        };
        break;
    case "htht":
        response = {
            "text": "Cậu đang gặp khó khăn trong học tập?\nHãy để GitDo hỗ trợ cậu bằng cách nhập: !htht",
        };
        break;
    case "info":
        response = {
            "text": `
Tìm bằng !info [danh xưng] [tên] [môn/chức vụ].
Cú pháp bắt buộc phải có tên hoặc môn/chức vụ.
VD: !info Cô Duyên Tin; !info Toán; ...
===
PS: Dữ liệu hiện tại chưa đầy đủ/lỗi thời. Nếu biết, bạn có thể nhắn
trực tiếp dữ liệu mới vào đây để chúng mình xem xét cập nhật nhé!`};
        break;
    case "admin":
        response = {
            "text": "Nhập: !admin để nhận thông tin về gia đình GitDo",
        };
        break;
    case "ts10":
        response = {
            "text": `
Tìm bằng !ts10 [số báo danh]
Cú pháp bắt buộc phải có số báo danh hợp lệ.
VD: !ts10 100696; !ts10 100420; ...
`};
        break;
    case "noti":
        response = {
            "text": "Nhập: !noti và nhấn vào nút \"Nhận tin nhắn hằng ngày\" để nhận được những thông báo mới nhất từ CYB nhaa!",
        };
        break;
    default:
        response = {
            "text": `
Nhập: !help <lệnh> để nhận hỗ trợ. 
VD: !help info; ...
Lệnh trong GitDo:\n[!tkb | !clb | !ldt | !about | !htht | !info | !admin | !ts10 | !noti | !clb].
`,
        };
        break;
    }
    postMessenger(sender_psid, response);
}

export default {
    Help,
};
