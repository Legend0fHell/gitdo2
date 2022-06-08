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
VD: !tkb 11sd; !tkb 10s; ...`,};
            break;
        case "clb": 
            response = {
                "text": `Nhập !clb để biết thêm thông tin về những CLB của CYB :>`,
            };
            break;
        case "restart":
            response = {
                "text": `Nhập !restart để khởi động lại phiên.`,
            };
            break;
        case "ldt":
            response = {
                "text": `Nhập !ldt để biết thêm lịch dạy thay của nhà trường`,
            };
            break;
        case "about":
            
            break;
        case "htht":
            
            break;
        case "info":
            response = {
                "text": `
Tìm bằng !info [danh xưng] [tên] [môn/chức vụ].
Cú pháp bắt buộc phải có tên hoặc môn/chức vụ.
VD: !info Cô Duyên Tin; !info Toán; ...
===
PS: Dữ liệu hiện tại chưa đầy đủ/lỗi thời. Nếu biết, bạn có thể nhắn
trực tiếp dữ liệu mới vào đây để chúng mình xem xét cập nhật nhé!`,};
            break;
        case "admin":
            
            break;
        case "ts10":
            response = {
                "text": `
Tìm bằng !ts10 [số báo danh]
Cú pháp bắt buộc phải có số báo danh hợp lệ.
VD: !ts10 100001; !ts10 100420; ...
===
NOTE: DỮ LIỆU NĂM 2020, GitDo sẽ cập nhật sớm nhất có thể!
PS: Xếp hạng và điểm chuyên được tính trước khi phúc khảo.
Hãy kiên nhẫn chờ đợi thông tin chính thức của nhà trường!
Xếp lớp chỉ mang tính chất tham khảo (Trường hợp mọi lớp đều nhận 34 chỉ tiêu, không tính học sinh chuyển trường, không tính học sinh phúc khảo).`,};
            break;
        case "noti":
            
            break;
        default:
            // TODO: Add help since this is the "Not found command" case.
            response = {
                "text": `
Nhập: !help <lệnh> để được nhận hỗ trợ

Lệnh:\n[tkb | restart | ldt | about | htht | info | admin | ts10]
`,
            };
            break;
        }
    postMessenger(sender_psid, response);
}

export default {
    Help,
};
