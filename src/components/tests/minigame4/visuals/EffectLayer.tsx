import React from 'react';
import styles from './EffectLayer.module.css';

interface EffectLayerProps {
  /** Loại hiệu ứng muốn kích hoạt. null = không có gì */
  effectType: 'success' | 'error' | null; 
}

const EffectLayer: React.FC<EffectLayerProps> = ({ effectType }) => {
  if (!effectType) return null;

  return (
    <div className={styles.layerContainer}>
      {/* HIỆU ỨNG ĐÚNG: SAO BAY (STAR BURST) */}
      {effectType === 'success' && (
        <div className={styles.burstWrapper}>
          {/* Tạo 8 tia sao bay ra */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`${styles.starParticle} ${styles[`p${i}`]}`}>
              ★
            </div>
          ))}
        </div>
      )}

      {/* HIỆU ỨNG SAI: RUNG MÀN HÌNH (SHAKE) */}
      {effectType === 'error' && (
        <div className={styles.shakeOverlay}></div>
      )}
    </div>
  );
};

export default EffectLayer;