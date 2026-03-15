import React from 'react';
import styles from './Mascot.module.css';

// Export type này để useGameLogic có thể dùng
export type MascotEmotion = 'idle' | 'happy' | 'thinking' | 'worried';

interface MascotProps {
  emotion: MascotEmotion;
}

const Mascot: React.FC<MascotProps> = ({ emotion }) => {
  return (
    <div className={styles.mascotContainer}>
      {/* Mũ phi hành gia */}
      <div className={styles.helmet}>
        <div className={styles.visor}>
          <div className={styles.reflection}></div>
          
          {/* Khuôn mặt bên trong thay đổi theo cảm xúc */}
          <div className={`${styles.face} ${styles[emotion]}`}>
            <div className={`${styles.eye} ${styles.left}`}></div>
            <div className={`${styles.eye} ${styles.right}`}></div>
            <div className={styles.mouth}></div>
            {/* Má hồng */}
            <div className={`${styles.blush} ${styles.left}`}></div>
            <div className={`${styles.blush} ${styles.right}`}></div>
          </div>
        </div>
      </div>
      
      {/* Thân nhỏ phía dưới */}
      <div className={styles.bodyTop}></div>

      {/* Dấu hỏi chấm bay lên khi đang suy nghĩ */}
      {emotion === 'thinking' && <div className={styles.questionMark}>?</div>}
    </div>
  );
};

export default Mascot;