import React, { useEffect } from "react";
import styles from "./SpaceRescueGame.module.css";
import { useGameLogic } from "../../../../hooks/useGameLogic";

// IMPORT VISUALS & COMPONENTS (Giữ nguyên đường dẫn của bạn)
import PlanetBackground from "../visuals/PlanetBackground";
import Spaceship from "../visuals/SpaceShip";
import Mascot from "../visuals/Mascot";
import EffectLayer from "../visuals/EffectLayer";
import GameHeader from "../HUD/GameHeader";
import DrawingPad from "../playArea/DrawingPad";

interface SpaceRescueGameProps {
  studentName?: string;
  onExit?: () => void;
}

const SpaceRescueGame: React.FC<SpaceRescueGameProps> = ({
  studentName = "Phi Hành Gia Tí Hon",
  onExit,
}) => {
  const { gameState, actions } = useGameLogic();

  const {
    level,
    energy,
    targetLetter,
    mascotEmotion,
    currentTheme,
    isBoosting,
    isProcessing,
    feedbackMessage,
    effectType,
    round,
    maxRounds,
    isGameFinished,
    correctCount, // [MỚI] Lấy số câu đúng để hiển thị
  } = gameState;

  // --- TTS LOGIC ---
  useEffect(() => {
    if (!isGameFinished) {
      const speak = () => {
        if ("speechSynthesis" in window) {
          const msg = new SpeechSynthesisUtterance(`Hãy viết chữ ${targetLetter}`);
          msg.lang = "vi-VN";
          msg.rate = 0.9;
          window.speechSynthesis.speak(msg);
        }
      };
      const timer = setTimeout(speak, 500);
      return () => clearTimeout(timer);
    }
  }, [targetLetter, isGameFinished]);

  const handleReplayAudio = () => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(targetLetter);
      msg.lang = "vi-VN";
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className={styles.gameContainer} style={{ position: 'relative', overflow: 'hidden' }}>
      <PlanetBackground theme={currentTheme} />
      <EffectLayer effectType={effectType} />

      <div className={styles.hudLayer}>
        <GameHeader
          playerName={studentName}
          level={level}
          energy={energy}
          onExit={onExit || (() => console.log("Exit Game"))}
        />
        
        {/* Bộ đếm lượt chơi */}
        <div style={{
            position: 'absolute', top: '80px', right: '20px', 
            color: 'white', fontWeight: 'bold', fontSize: '18px',
            background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px',
            pointerEvents: 'none', zIndex: 101, border: '1px solid rgba(255,255,255,0.3)'
        }}>
            Câu: {round} / {maxRounds}
        </div>
      </div>

      {/* --- MÀN HÌNH KẾT THÚC (Cập nhật hiển thị điểm) --- */}
      {isGameFinished && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)', zIndex: 200,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', animation: 'fadeIn 0.5s'
        }}>
          <h1 style={{ fontSize: '40px', color: '#ffd54f', marginBottom: '20px', textShadow: '0 0 10px orange' }}>
             KẾT QUẢ NHIỆM VỤ
          </h1>
          
          {/* Icon cúp hoặc huy chương tùy theo điểm số */}
          <div style={{ fontSize: '100px', marginBottom: '10px' }}>
             {correctCount >= 8 ? '🏆' : (correctCount >= 5 ? '🎖️' : '⭐')}
          </div>

          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
             Bạn làm đúng: <span style={{color: '#76ff03', fontSize: '30px'}}>{correctCount}</span> / {maxRounds} chữ cái
          </p>

          <p style={{ marginTop: '10px', fontSize: '18px', fontStyle: 'italic', color: '#b0bec5' }}>
            {correctCount === 10 ? "Xuất sắc! Bạn là phi hành gia tài ba!" : 
             correctCount >= 5 ? "Làm tốt lắm! Cố gắng hơn nữa nhé!" : 
             "Cần luyện tập thêm nhé phi hành gia!"}
          </p>

          <button 
             onClick={() => window.location.reload()} 
             style={{
               marginTop: '40px', padding: '15px 40px', fontSize: '22px',
               background: 'linear-gradient(to bottom, #2196f3, #1976d2)', 
               color: 'white', border: 'none', borderRadius: '50px',
               cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
             }}
          >
             CHƠI LẠI
          </button>
        </div>
      )}

      {/* --- PHẦN CHƠI GAME --- */}
      {!isGameFinished && (
        <>
          <div className={styles.stageArea}>
            <div className={styles.spaceshipWrapper}>
              <Spaceship isBoosting={isBoosting} />
            </div>

            <div className={styles.mascotWrapper}>
              <div className={styles.speechBubble}>{feedbackMessage}</div>
              <Mascot emotion={mascotEmotion} />
            </div>
          </div>

          <div className={styles.interactionArea}>
            <button onClick={handleReplayAudio} className={styles.audioBtn}>
              🔊 Nghe lại
            </button>
            <div className={styles.padWrapper}>
              <DrawingPad
                onCheckSubmit={actions.submitAnswer}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceRescueGame;