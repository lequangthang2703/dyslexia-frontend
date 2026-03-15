// Danh sách các chữ cái sẽ xuất hiện trong đề bài
export const LETTERS_POOL = [
  'a', 'ă', 'â', 'b', 'c', 'd', 'đ', 
  'e', 'ê', 'g', 'h', 'i', 'k', 'l', 
  'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 
  'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'
];
// Cấu hình điểm số
export const GAME_CONFIG = {
  POINTS_PER_CORRECT: 20,    // Đúng 1 câu được 20% năng lượng
  MAX_ENERGY: 100,           // Đầy bình là 100%
  WINNING_SCORE: 100,        // Đạt 100 thì qua màn
  
  // Thời gian chờ (miliseconds)
  WAIT_TIME_NEXT_QUESTION: 1500, // Chờ 1.5s sau khi đúng để chuyển câu
  WAIT_TIME_LEVEL_UP: 2500,      // Chờ 2.5s tàu bay xong mới qua màn
};

// Danh sách các câu khen ngợi ngẫu nhiên
export const PRAISE_MESSAGES = [
  "Tuyệt vời!",
  "Xuất sắc!",
  "Nạp năng lượng thành công!",
  "Phi hành gia giỏi quá!",
  "Chuẩn không cần chỉnh!"
];

// Danh sách câu an ủi khi sai
export const ENCOURAGE_MESSAGES = [
  "Gần đúng rồi, thử lại nhé!",
  "Cố lên, viết nắn nót hơn xíu!",
  "Không sao, làm lại nào!",
  "Chưa chính xác lắm."
];