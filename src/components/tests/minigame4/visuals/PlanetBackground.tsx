import React from 'react';
import styles from './PlanetBackground.module.css';

// Định nghĩa các chủ đề (Theme) màu sắc cho hành tinh
export type PlanetTheme = 'ice' | 'candy' | 'jungle';

interface PlanetBackgroundProps {
  /** Chủ đề hiện tại (Mặc định là 'ice') */
  theme?: PlanetTheme; 
}

const PlanetBackground: React.FC<PlanetBackgroundProps> = ({ theme = 'ice' }) => {
  
  // Helper: Chọn màu núi dựa trên theme để tô màu cho SVG
  const getMountainColor = (currentTheme: PlanetTheme): string => {
    switch(currentTheme) {
      case 'candy': return '#f48fb1'; // Hồng
      case 'jungle': return '#66bb6a'; // Xanh lá
      case 'ice':
      default: return '#90a4ae'; // Xám xanh
    }
  };

  return (
    // Class cha sẽ là: styles.scene + styles.ice (hoặc styles.candy...)
    <div className={`${styles.scene} ${styles[theme]}`}>
      
      {/* Lớp sao lấp lánh */}
      <div className={styles.stars}></div>
      
      {/* Mặt trăng / Hành tinh xa */}
      <div className={styles.moon}></div>

      {/* Lớp núi xa (Sử dụng SVG để vẽ hình dạng núi phức tạp nhưng nhẹ) */}
      <div className={styles.mountains}>
         <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
                fill={getMountainColor(theme)} 
                fillOpacity="0.6" 
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
         </svg>
      </div>

      {/* Lớp đất nền dưới chân tàu */}
      <div className={styles.ground}></div>
    </div>
  );
};

export default PlanetBackground;