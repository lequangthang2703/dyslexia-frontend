export type SpellingItem = {
  id: string;
  word: string;           // đáp án đúng
  description: string;    // mô tả / định nghĩa ngắn
  example: string;        // ví dụ ngữ cảnh
  audioUrl?: string;      // nếu có file .mp3; nếu không có sẽ dùng speechSynthesis
  hint?: string;          // gợi ý nhẹ (tuỳ chọn)
};

export const MG1_ITEMS: SpellingItem[] = [
  // --- Nhóm 1: Cơ bản & Phần cứng ---
  {
    id: "w1",
    word: "máy tính",
    description: "Thiết bị điện tử dùng để xử lý thông tin và dữ liệu.",
    example: "Tôi sử dụng máy tính để làm việc mỗi ngày."
  },
  {
    id: "w2",
    word: "bàn phím",
    description: "Thiết bị ngoại vi dùng để nhập ký tự vào máy tính.",
    example: "Bàn phím cơ giúp gõ văn bản nhanh hơn."
  },
  {
    id: "w3",
    word: "màn hình",
    description: "Thiết bị hiển thị hình ảnh và thông tin từ máy tính.",
    example: "Màn hình độ phân giải cao cho hình ảnh sắc nét."
  },
  {
    id: "w4",
    word: "chuột",
    description: "Thiết bị cầm tay dùng để điều khiển con trỏ trên màn hình.",
    example: "Hãy nhấp chuột trái để chọn tệp tin."
  },
  {
    id: "w5",
    word: "tai nghe",
    description: "Thiết bị phát âm thanh đeo vào tai.",
    example: "Đeo tai nghe giúp bạn tập trung nghe nhạc hơn."
  },
  {
    id: "w6",
    word: "máy in",
    description: "Thiết bị dùng để in văn bản hoặc hình ảnh ra giấy.",
    example: "Máy in đang bị kẹt giấy."
  },
  {
    id: "w7",
    word: "phần cứng",
    description: "Các bộ phận vật lý cấu thành nên hệ thống máy tính.",
    example: "Nâng cấp phần cứng giúp máy chạy mượt hơn."
  },
  {
    id: "w8",
    word: "vi mạch",
    description: "Một mạch điện tử nhỏ chứa nhiều linh kiện bán dẫn.",
    example: "Vi mạch này rất quan trọng trong bo mạch chủ."
  },
  {
    id: "w9",
    word: "cảm biến",
    description: "Thiết bị phát hiện và phản ứng với các tín hiệu từ môi trường.",
    example: "Cảm biến nhiệt độ sẽ kích hoạt máy lạnh."
  },
  {
    id: "w10",
    word: "động cơ",
    description: "Cỗ máy chuyển đổi năng lượng thành chuyển động cơ học.",
    example: "Động cơ xe điện hoạt động rất êm ái."
  },

  // --- Nhóm 2: Phần mềm & Internet ---
  {
    id: "w11",
    word: "phần mềm",
    description: "Tập hợp các chỉ thị và dữ liệu để máy tính thực hiện nhiệm vụ.",
    example: "Bạn cần cài đặt phần mềm diệt virus."
  },
  {
    id: "w12",
    word: "trình duyệt",
    description: "Ứng dụng dùng để truy cập và xem các trang web.",
    example: "Google Chrome là một trình duyệt phổ biến."
  },
  {
    id: "w13",
    word: "mật khẩu",
    description: "Chuỗi ký tự bí mật dùng để xác thực người dùng.",
    example: "Không nên chia sẻ mật khẩu của bạn cho người khác."
  },
  {
    id: "w14",
    word: "tài khoản",
    description: "Hồ sơ cá nhân để truy cập vào một hệ thống dịch vụ.",
    example: "Tôi vừa đăng ký một tài khoản mới."
  },
  {
    id: "w15",
    word: "kết nối",
    description: "Sự liên kết giữa các thiết bị hoặc hệ thống với nhau.",
    example: "Kiểm tra lại kết nối wifi của bạn."
  },
  {
    id: "w16",
    word: "dữ liệu",
    description: "Thông tin được lưu trữ và xử lý bởi máy tính.",
    example: "Sao lưu dữ liệu là việc rất quan trọng."
  },
  {
    id: "w17",
    word: "trực tuyến",
    description: "Trạng thái đang kết nối với mạng internet.",
    example: "Khóa học này được tổ chức trực tuyến."
  },
  {
    id: "w18",
    word: "tải xuống",
    description: "Hành động sao chép dữ liệu từ mạng về máy cá nhân.",
    example: "Quá trình tải xuống sẽ mất vài phút."
  },
  {
    id: "w19",
    word: "cập nhật",
    description: "Làm mới hoặc nâng cấp lên phiên bản mới hơn.",
    example: "Hệ thống đang tự động cập nhật."
  },
  {
    id: "w20",
    word: "bảo mật",
    description: "Việc bảo vệ thông tin và hệ thống khỏi sự xâm nhập.",
    example: "Công ty rất chú trọng đến vấn đề bảo mật."
  },

  // --- Nhóm 3: Lập trình & Kỹ thuật ---
  {
    id: "w21",
    word: "lập trình",
    description: "Việc viết mã lệnh để tạo ra phần mềm máy tính.",
    example: "Cô ấy đang học ngôn ngữ lập trình Python."
  },
  {
    id: "w22",
    word: "thuật toán",
    description: "Tập hợp các bước tuần tự để giải quyết một vấn đề.",
    example: "Thuật toán tìm kiếm của Google rất phức tạp."
  },
  {
    id: "w23",
    word: "giao diện",
    description: "Nơi người dùng tương tác với phần mềm hoặc thiết bị.",
    example: "Ứng dụng này có giao diện rất thân thiện."
  },
  {
    id: "w24",
    word: "cơ sở dữ liệu",
    description: "Hệ thống lưu trữ thông tin có cấu trúc.",
    example: "Kỹ sư đang truy vấn vào cơ sở dữ liệu khách hàng."
  },
  {
    id: "w25",
    word: "gỡ lỗi",
    description: "Quá trình tìm và sửa các lỗi trong phần mềm.",
    example: "Lập trình viên mất cả ngày để gỡ lỗi."
  },
  {
    id: "w26",
    word: "mã nguồn",
    description: "Các dòng lệnh do lập trình viên viết ra.",
    example: "Mã nguồn mở cho phép mọi người cùng đóng góp."
  },
  {
    id: "w27",
    word: "hệ điều hành",
    description: "Phần mềm nền tảng quản lý phần cứng và phần mềm máy tính.",
    example: "Windows và macOS là hai hệ điều hành phổ biến."
  },
  {
    id: "w28",
    word: "trí tuệ nhân tạo",
    description: "Công nghệ mô phỏng trí thông minh của con người bằng máy móc.",
    example: "Trí tuệ nhân tạo đang thay đổi nhiều ngành công nghiệp."
  },
  {
    id: "w29",
    word: "tự động hóa",
    description: "Sử dụng máy móc để làm việc thay cho con người.",
    example: "Nhà máy đang hướng tới tự động hóa hoàn toàn."
  },
  {
    id: "w30",
    word: "điện toán đám mây",
    description: "Việc cung cấp dịch vụ máy tính qua Internet.",
    example: "Dữ liệu của tôi được lưu trên điện toán đám mây."
  },

  // --- Nhóm 4: Khoa học & Vật lý ---
  {
    id: "w31",
    word: "vệ tinh",
    description: "Thiết bị được phóng lên quỹ đạo để truyền tín hiệu.",
    example: "Vệ tinh giúp dự báo thời tiết chính xác hơn."
  },
  {
    id: "w32",
    word: "kính hiển vi",
    description: "Dụng cụ quang học để quan sát các vật nhỏ bé.",
    example: "Học sinh quan sát tế bào qua kính hiển vi."
  },
  {
    id: "w33",
    word: "nguyên tử",
    description: "Đơn vị cơ bản cấu tạo nên vật chất.",
    example: "Mọi vật chất đều được tạo thành từ nguyên tử."
  },
  {
    id: "w34",
    word: "trọng lực",
    description: "Lực hút của Trái Đất giữ mọi vật trên mặt đất.",
    example: "Trọng lực làm quả táo rơi xuống đất."
  },
  {
    id: "w35",
    word: "năng lượng",
    description: "Khả năng thực hiện công việc hoặc tạo ra nhiệt.",
    example: "Chúng ta cần tiết kiệm năng lượng điện."
  },
  {
    id: "w36",
    word: "hóa chất",
    description: "Chất được tạo ra từ phản ứng hóa học.",
    example: "Cần cẩn thận khi tiếp xúc với hóa chất trong phòng thí nghiệm."
  },
  {
    id: "w37",
    word: "vũ trụ",
    description: "Khoảng không gian bao la chứa các thiên thể.",
    example: "Con người luôn khao khát khám phá vũ trụ."
  },
  {
    id: "w38",
    word: "bức xạ",
    description: "Sự phát ra năng lượng dưới dạng sóng hoặc hạt.",
    example: "Tiếp xúc nhiều với bức xạ mặt trời có hại cho da."
  },
  {
    id: "w39",
    word: "phát minh",
    description: "Sự tạo ra một cái gì đó mới chưa từng tồn tại.",
    example: "Bóng đèn điện là một phát minh vĩ đại."
  },
  {
    id: "w40",
    word: "thí nghiệm",
    description: "Quy trình thực hiện để kiểm chứng một giả thuyết.",
    example: "Nhà khoa học đang tiến hành thí nghiệm mới."
  },

  // --- Nhóm 5: Công nghệ & Đời sống ---
  {
    id: "w41",
    word: "thông minh",
    description: "Có khả năng xử lý tình huống và học hỏi nhanh.",
    example: "Điện thoại thông minh tích hợp nhiều tính năng."
  },
  {
    id: "w42",
    word: "kỹ thuật số",
    description: "Hệ thống sử dụng các tín hiệu rời rạc (0 và 1).",
    example: "Chúng ta đang sống trong kỷ nguyên kỹ thuật số."
  },
  {
    id: "w43",
    word: "thực tế ảo",
    description: "Môi trường giả lập do máy tính tạo ra.",
    example: "Kính thực tế ảo mang lại trải nghiệm chơi game sống động."
  },
  {
    id: "w44",
    word: "mạng xã hội",
    description: "Nền tảng trực tuyến để mọi người giao lưu và chia sẻ.",
    example: "Mạng xã hội giúp kết nối bạn bè khắp nơi."
  },
  {
    id: "w45",
    word: "thương mại điện tử",
    description: "Việc mua bán hàng hóa thông qua internet.",
    example: "Thương mại điện tử đang phát triển rất mạnh."
  },
  {
    id: "w46",
    word: "thiết bị",
    description: "Dụng cụ hoặc máy móc phục vụ mục đích cụ thể.",
    example: "Hãy tắt các thiết bị điện khi không sử dụng."
  },
  {
    id: "w47",
    word: "công nghệ",
    description: "Việc áp dụng kiến thức khoa học vào thực tiễn.",
    example: "Công nghệ mới giúp tăng năng suất lao động."
  },
  {
    id: "w48",
    word: "sáng tạo",
    description: "Khả năng tạo ra những ý tưởng mới mẻ và độc đáo.",
    example: "Sự sáng tạo là chìa khóa của thành công."
  },
  {
    id: "w49",
    word: "lưu trữ",
    description: "Việc giữ gìn dữ liệu ở một nơi an toàn.",
    example: "Ổ cứng này có dung lượng lưu trữ lớn."
  },
  {
    id: "w50",
    word: "hiển thị",
    description: "Việc trình bày thông tin để người dùng nhìn thấy.",
    example: "Kết quả tìm kiếm được hiển thị trên màn hình."
  }
];