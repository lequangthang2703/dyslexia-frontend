// File: src/features/minigames/SpaceRescue/components/HUD/GameHeader.tsx
import React from 'react';
import styles from './GameHeader.module.css';
import EnergyBar from './EnergyBar';

interface GameHeaderProps {
  playerName: string;
  level: number;
  energy: number;
  onExit: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ playerName, level, energy, onExit }) => {
  return (
    <header className={styles.header}>
      {/* Khu vực trái: Nút thoát & Level */}
      <div className={styles.leftSection}>
        <button onClick={onExit} className={styles.exitBtn}>
           ✕
        </button>
        <div className={styles.levelBadge}>
           <span className={styles.lvlLabel}>LEVEL</span>
           <span className={styles.lvlNum}>{level}</span>
        </div>
      </div>

      {/* Khu vực giữa: Tên phi công */}
      <div className={styles.centerSection}>
         <span className={styles.pilotLabel}>Phi công:</span>
         <span className={styles.pilotName}>{playerName}</span>
      </div>

      {/* Khu vực phải: Thanh năng lượng */}
      <div className={styles.rightSection}>
        <EnergyBar currentEnergy={energy} />
      </div>
    </header>
  );
};

export default GameHeader;