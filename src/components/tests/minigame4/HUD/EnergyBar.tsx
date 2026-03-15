// File: src/features/minigames/SpaceRescue/components/HUD/EnergyBar.tsx
import React from 'react';
import styles from './EnergyBar.module.css';

interface EnergyBarProps {
  currentEnergy: number; // 0 - 100
}

const EnergyBar: React.FC<EnergyBarProps> = ({ currentEnergy }) => {
  const clampedEnergy = Math.min(100, Math.max(0, currentEnergy));

  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚡</div>
      <div className={styles.barBackground}>
        <div 
            className={styles.barFill} 
            style={{ width: `${clampedEnergy}%` }}
        >
            <div className={styles.stripes}></div>
        </div>
      </div>
      <span className={styles.text}>{clampedEnergy}%</span>
    </div>
  );
};

export default EnergyBar;