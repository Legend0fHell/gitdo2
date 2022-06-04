const bad_words = [
    "ditmethangoccho",
    "tiên sư nhà mày",
    "dellhieukieugi",
    "ditmemayconcho",
    "cái lề gì thốn",
    "mẹ cha nhà anh",
    "mẹ cha nhà mày",
    "me cha nha may",
    "mả cha nhà mày",
    "ma cha nha may",
    "nhucaidaubuoi",
    "deohieukieugi",
    "ditmecondicho",
    "dellnoinhieu",
    "đốn cửa lòng",
    "tien su may ",
    "ditmeconcho",
    "con di cho'",
    "thangmatlon",
    "cờ lờ gờ tờ",
    "chich choac",
    "tiên sư mày",
    "caidaubuoi",
    "ditmecondi",
    "condimemay",
    "con di cho",
    "chổng mông",
    "thang cho'",
    "thằng điên",
    "thang dien",
    "mẹ cha mày",
    "me cha may",
    "mẹ cha anh",
    "mả cha mày",
    "ma cha may",
    "bà cha mày",
    "tiên sư bố",
    "caidauboi",
    "caidauboy",
    "caiconcac",
    "caiconcak",
    "dell ngửi",
    "dell ngui",
    "dell chịu",
    "dell chiu",
    "dell hiểu",
    "dell hieu",
    "dell biết",
    "dell biet",
    "dell nghe",
    "dell được",
    "dell duoc",
    "dell chạy",
    "dell chay",
    "đú con mẹ",
    "sapmatlol",
    "sapmatlon",
    "sapmatloz",
    "banh háng",
    "thằng chó",
    "thang cho",
    "dau buoi",
    "dell nói",
    "dell noi",
    "dell làm",
    "dell lam",
    "ditmemay",
    "dmconcho",
    "đờ ma ma",
    "đê ma ma",
    "đề ma ma",
    "condimay",
    "condicho",
    "con bích",
    "tuổi lol",
    "tuoi lol",
    "nứng lol",
    "nung lol",
    "rảnh lol",
    "ranh lol",
    "đách lol",
    "dach lol",
    "banh lol",
    "vạch lol",
    "vach lol",
    "tung lol",
    "tuổi lon",
    "tuoi lon",
    "nứng lon",
    "nung lon",
    "rảnh lon",
    "ranh lon",
    "đách lon",
    "dach lon",
    "banh lon",
    "vạch lon",
    "vach lon",
    "tung lon",
    "nốn lừng",
    "xéo háng",
    "chó điên",
    "sủa tiếp",
    "chết mịa",
    "chết mja",
    "chết mịe",
    "chết mie",
    "chet mia",
    "chet mie",
    "chet mja",
    "chet mje",
    "thấy mịe",
    "thấy mịa",
    "thay mie",
    "thay mia",
    "daubuoi",
    "dau boi",
    "đầu bòy",
    "đầu bùi",
    "dau boy",
    "nungcak",
    "cười ỉa",
    "dell ăn",
    "dell an",
    "dell đi",
    "dell di",
    "địt mịe",
    "địt mía",
    "địt cha",
    "địt con",
    "dis mia",
    "dis mie",
    "đis mịa",
    "đis mịe",
    "đờ mama",
    "đê mama",
    "đề mama",
    "dimemay",
    "condime",
    "bít chi",
    "con bic",
    "con bíc",
    "con bít",
    "thangml",
    "xàm lol",
    "xam lol",
    "xạo lol",
    "xao lol",
    "con lol",
    "mát lol",
    "mat lol",
    "cái lol",
    "cai lol",
    "lòi lol",
    "loi lol",
    "ham lol",
    "ngu lol",
    "mõm lol",
    "mồm lol",
    "mom lol",
    "như lol",
    "nhu lol",
    "nug lol",
    "tét lol",
    "tet lol",
    "cào lol",
    "cao lol",
    "mặt lol",
    "mát lol",
    "mat lol",
    "xàm lon",
    "xam lon",
    "xạo lon",
    "xao lon",
    "con lon",
    "mát lon",
    "mat lon",
    "cái lon",
    "cai lon",
    "lòi lon",
    "loi lon",
    "ham lon",
    "ngu lon",
    "mõm lon",
    "mồm lon",
    "mom lon",
    "như lon",
    "nhu lon",
    "nug lon",
    "tét lon",
    "tet lon",
    "cào lon",
    "cao lon",
    "mặt lon",
    "mát lon",
    "mat lon",
    "sấp mặt",
    "sap mat",
    "vai lon",
    "vai lol",
    "đút đít",
    "xephinh",
    "la liếm",
    "lao cho",
    "láo chó",
    "đồ điên",
    "sủa bậy",
    "sủa càn",
    "chet me",
    "chết mẹ",
    "thấy mẹ",
    "thay me",
    "Tiên sư",
    "dauboi",
    "dauboy",
    "concak",
    "cuccut",
    "cutcut",
    "cười ẻ",
    "đmmmmm",
    "dmmmmm",
    "đcmmmm",
    "dcmmmm",
    "địt mẹ",
    "địt má",
    "địt ba",
    "địt bà",
    "địt bố",
    "địt cụ",
    "dis me",
    "dismje",
    "dismia",
    "đụ mịa",
    "đụ mịe",
    "đụ cha",
    "đú cha",
    "đù cha",
    "đù mịe",
    "đù mịa",
    "đủ cha",
    "đủ mía",
    "đủ mịa",
    "đủ mịe",
    "đủ mie",
    "đủ mia",
    "dou má",
    "duo má",
    "dou ma",
    "đou má",
    "đìu má",
    "đậu mẹ",
    "đậu má",
    "condi~",
    "matlon",
    "cailon",
    "matlol",
    "matloz",
    "đỗn lì",
    "ăn lol",
    "an lol",
    "củ lol",
    "cu lol",
    "nuglol",
    "mu lol",
    "ăn lon",
    "an lon",
    "củ lon",
    "cu lon",
    "nuglon",
    "mu lon",
    "cái lờ",
    "vailon",
    "vailol",
    "húp sò",
    "óc chó",
    "bố láo",
    "chó má",
    "sủa đi",
    "Mẹ cha",
    "mả cha",
    "kệ mịe",
    "kệ mịa",
    "kệ mje",
    "kệ mja",
    "ke mie",
    "ke mia",
    "ke mja",
    "ke mje",
    "bỏ mịa",
    "bỏ mịe",
    "bỏ mja",
    "bỏ mje",
    "bo mia",
    "bo mie",
    "bo mje",
    "bo mja",
    "chetme",
    "tổ cha",
    "bucak",
    "đmmmm",
    "dmmmm",
    "đcmmm",
    "dcmmm",
    "disme",
    "đụ mẹ",
    "đụ má",
    "đụ bà",
    "đú má",
    "đú mẹ",
    "đù má",
    "đù mẹ",
    "đủ má",
    "đủ mẹ",
    "đủ mé",
    "đờ mờ",
    "đê mờ",
    "duoma",
    "á đìu",
    "đilol",
    "điloz",
    "đilon",
    "diloz",
    "dilol",
    "dilon",
    "condi",
    "di me",
    "bitch",
    "chịch",
    "chich",
    "đổ vỏ",
    "bỏ bú",
    "buscu",
    "occho",
    "cờ hó",
    "mẹ bà",
    "mả mẹ",
    "kệ mẹ",
    "ke me",
    "bỏ mẹ",
    "bo me",
    "tổ sư",
    "chich",
    "chịch",
    "buồi",
    "buoi",
    "giái",
    "đếch",
    "đách",
    "dech",
    "đmmm",
    "dmmm",
    "đcmm",
    "dcmm",
    "đệch",
    "dmcs",
    "doma",
    "á đù",
    "điếm",
    "cdi~",
    "dime",
    "nulo",
    "thml",
    "thml",
    "diml",
    "clgt",
    "vlon",
    "vloz",
    "vlol",
    "vleu",
    "nứng",
    "xhct",
    "xoạc",
    "xoac",
    "fuck",
    "sảng",
    "cmnl",
    "bòi",
    "cặc",
    "cak",
    "kak",
    "kac",
    "cac",
    "cặk",
    "cak",
    "dái",
    "zái",
    "kiu",
    "cứt",
    "cứk",
    "cuk",
    "chó",
    "đéo",
    "đếk",
    "dek",
    "đết",
    "đệt",
    "deo",
    "đel",
    "đél",
    "del",
    "địt",
    "đmm",
    "dmm",
    "đcm",
    "dcm",
    "đệt",
    "dit",
    "dis",
    "diz",
    "đjt",
    "djt",
    "đìu",
    "dou",
    "di~",
    "đuỹ",
    "cđĩ",
    "biz",
    "phò",
    "lồn",
    "loz",
    "lìn",
    "tml",
    "dml",
    "hãm",
    "sml",
    "vcl",
    "vãi",
    "nug",
    "fck",
    "ngu",
    "cmn",
    "xàm",
    "b`",
    "cu",
    "đ'",
    "d'",
    "đm",
    "dm",
    "đù",
    "đụ",
    "đĩ",
    "4`",
    "l`",
    "ml",
    "cl",
    "vl",
    "v~",
    "đụ",
    "đụ",
];

export {
    bad_words,
};
