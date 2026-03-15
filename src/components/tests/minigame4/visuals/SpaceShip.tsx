import React from 'react';
import styles from './Spaceship.module.css';

interface SpaceshipProps {
  /** Trạng thái tăng tốc (true = bay vút đi, false = bay lơ lửng) */
  isBoosting: boolean;
}

const Spaceship: React.FC<SpaceshipProps> = ({ isBoosting }) => {
  // Ghép class động: Nếu isBoosting = true thì thêm class .boosting
  const containerClass = `${styles.container} ${isBoosting ? styles.boosting : ''}`;

  return (
    <div className={containerClass}>
      {/* Thân tàu */}
      <div className={styles.body}>
        <div className={styles.window}>
          <div className={styles.reflection}></div>
        </div>
        <div className={styles.stripe}></div>
      </div>

      {/* 3 Cánh tàu: Trên, Dưới, Sau */}
      <div className={`${styles.fin} ${styles.finTop}`}></div>
      <div className={`${styles.fin} ${styles.finBottom}`}></div>
      <div className={`${styles.fin} ${styles.finBack}`}></div>

      {/* Động cơ & Hiệu ứng lửa */}
      <div className={styles.engineWrapper}>
        <div className={styles.flameMain}></div>
        <div className={styles.flameCore}></div>
        {/* Các hạt bụi lửa nhỏ bay ra phía sau */}
        <div className={styles.particle1}></div>
        <div className={styles.particle2}></div>
      </div>
    </div>
  );
};

export default Spaceship;