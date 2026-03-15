import React, { useRef, useState, useEffect } from 'react';
import styles from './DrawingPad.module.css';

interface DrawingPadProps {
  /** Callback khi trẻ nhấn nút "Kiểm tra" */
  onCheckSubmit: (imageBase64: string) => void;
  /** Có đang trong trạng thái chờ (ví dụ: đang đợi AI chấm điểm) không? */
  isProcessing?: boolean;
}

const DrawingPad: React.FC<DrawingPadProps> = ({ onCheckSubmit, isProcessing = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Cấu hình nét vẽ ban đầu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 8;          // Nét to cho trẻ dễ nhìn
      ctx.lineCap = "round";      // Đầu nét tròn
      ctx.lineJoin = "round";     // Góc bo tròn
      ctx.strokeStyle = "#263238"; // Màu mực xanh đen đậm
    }
  }, []);

  // --- HÀM HỖ TRỢ LẤY TỌA ĐỘ (Cho cả Mouse và Touch) ---
  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): { x: number, y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      // Sự kiện Touch
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      // Sự kiện Mouse
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // --- XỬ LÝ VẼ ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isProcessing) return;
    setIsDrawing(true);
    
    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isProcessing) return;
    
    // Ngăn chặn scroll màn hình khi đang vẽ trên điện thoại
    if ('touches' in e && e.cancelable) {
      // Lưu ý: React Synthetic Event có thể cần e.preventDefault() ở mức DOM thật nếu cần thiết
      // Nhưng ở đây ta dùng CSS touch-action: none sẽ hiệu quả hơn.
    }

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.closePath();
    setIsDrawing(false);
  };

  // --- CÁC NÚT CHỨC NĂNG ---
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    if (isProcessing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      onCheckSubmit(image);
      
      // Tự động xóa bảng sau 1s (Tùy chọn logic game)
      setTimeout(clearCanvas, 1000);
    }
  };

  return (
    <div className={styles.padContainer}>
      {/* Vùng vẽ Canvas */}
      <div className={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          width={320} 
          height={320}
          className={styles.canvas}
          
          // Mouse Events (Desktop)
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          
          // Touch Events (Mobile/Tablet)
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Hiệu ứng Loading che mờ khi đang xử lý */}
        {isProcessing && (
           <div className={styles.processingOverlay}>
             <span>Đang gửi...</span>
           </div>
        )}
      </div>

      {/* Thanh công cụ bên dưới */}
      <div className={styles.toolsBar}>
        <button onClick={clearCanvas} className={`${styles.btn} ${styles.btnClear}`} disabled={isProcessing}>
          <span className={styles.icon}>↺</span> Xóa
        </button>
        
        <button onClick={handleSubmit} className={`${styles.btn} ${styles.btnSubmit}`} disabled={isProcessing}>
          <span className={styles.icon}>✓</span> Nộp bài
        </button>
      </div>
    </div>
  );
};

export default DrawingPad;