// tests/minigame4/uncheck/services/mockAI.ts

// Import type Worker để tránh lỗi TypeScript
import { createWorker, type Worker } from 'tesseract.js';

// 1. Singleton: Giữ Worker để không phải load lại nhiều lần
let workerInstance: Worker | null = null;

// Danh sách ký tự Tiếng Việt (Whitelist) - Giúp AI không đoán ra ký tự rác
const WHITELIST_CHARS = 'aăâbcdeêghiklmoôơpqrstuưvxyAĂÂBCDEÊGHIKLMOÔƠPQRSTUƯVXY';

/**
 * Hàm khởi tạo AI (Chế độ OFFLINE)
 */
export const initAI = async () => {
  if (!workerInstance) {
    console.log("[AI] Đang khởi động Tesseract (Chế độ Offline)...");
    
    try {
      // CẤU HÌNH LOAD FILE TỪ MÁY
      workerInstance = await createWorker('vie', 1, {
        // Trỏ đến thư mục /tessdata trong public
        // Tesseract sẽ tự tìm file: window.location.origin + '/tessdata/vie.traineddata'
        langPath: window.location.origin + '/tessdata', 
        
        // QUAN TRỌNG: File tải từ Github là file gốc (không nén), nên phải tắt gzip
        gzip: false,

        // Logger để bạn debug (tùy chọn)
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`[AI Progress] ${(m.progress * 100).toFixed(0)}%`);
          }
        }
      });
      
      // Cấu hình tham số nhận diện
      await workerInstance.setParameters({
        tessedit_char_whitelist: WHITELIST_CHARS,
        tessedit_pageseg_mode: '10' as any, // Chế độ Single Character (Ký tự đơn)
      });
      
      console.log("[AI] Sẵn sàng phục vụ!");
      
    } catch (error) {
      console.error("[AI] Lỗi khởi động! Kiểm tra lại file vie.traineddata trong public/tessdata", error);
    }
  }
  return workerInstance;
};

/**
 * Xử lý ảnh: Thêm nền trắng (Do Tesseract không đọc được nền trong suốt)
 */
const addWhiteBackground = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff'; // Nền trắng
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0); // Vẽ nét chữ lên
        resolve(canvas.toDataURL('image/jpeg')); // Xuất JPG
      } else {
        resolve(base64);
      }
    };
    img.onerror = () => resolve(base64);
  });
};

/**
 * Hàm nhận diện chính
 */
export const checkHandwritingAI = async (
  rawBase64: string, 
  targetLetter: string
): Promise<boolean> => {
  console.log(`[AI] Bắt đầu nhận diện... Target: ${targetLetter}`);

  try {
    // B1: Đảm bảo AI đã khởi động
    const worker = await initAI();
    if (!worker) return false; // Nếu lỗi init thì fail luôn

    // B2: Xử lý ảnh
    const cleanImage = await addWhiteBackground(rawBase64);

    // B3: Nhận diện
    const { data: { text } } = await worker.recognize(cleanImage);

    // B4: Làm sạch kết quả
    const predictedChar = text.trim().toLowerCase().charAt(0);

    console.log(`[AI Result] Đoán: "${predictedChar}" | Đáp án: "${targetLetter.toLowerCase()}"`);

    // B5: So sánh (Có thể thêm logic chấp nhận các ký tự nhìn giống nhau ở đây)
    return predictedChar === targetLetter.toLowerCase();

  } catch (error) {
    console.error("[AI Error]", error);
    return false;
  }
};