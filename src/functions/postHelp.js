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
                VD: !tkb 11sd; !tkb 10s; ...
                `,
            };
            break;
        case "clb": 

            break;
        case "restart":
            
            break;
        case "ldt":
            
            break;
        case "about":
            
            break;
        case "htht":
            
            break;
        case "info":
            
            break;
        case "admin":
            
            break;
        case "ts10":
            
            break;
        case "noti":
            
            break;
        default:
            // TODO: Add help since this is the "Not found command" case.
            break;
        }
    postMessenger(sender_psid, response);
}

export default {
    Help,
};
