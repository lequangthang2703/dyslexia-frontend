import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GameLanguageSwitch from "../../common/GameLanguageSwitch";

interface MinigameSuccessPageProps {
  gameName?: string;
  score?: number;
  maxScore?: number;
  message?: string;
  onPlayAgain?: () => void;
}

// Simple confetti animation using CSS
const Confetti = () => {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    const colors = [
      "#ff69b4",
      "#ffd700",
      "#00bcd4",
      "#9c27b0",
      "#4caf50",
      "#ff5722",
    ];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-fall"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: "3s",
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

const MinigameSuccessPage = ({
  gameName,
  score,
  maxScore,
  message,
  onPlayAgain,
}: MinigameSuccessPageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center relative w-full">
      {/* Language Switch fixed to the top right */}
      <div className="fixed top-4 right-4 z-50">
        <GameLanguageSwitch />
      </div>

      {/* Confetti Animation */}
      <Confetti />

      {/* Success Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center border-4 border-yellow-300 relative z-10 mx-4">
        {/* Trophy Icon */}
        <div className="text-8xl mb-6 animate-bounce">🏆</div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 font-[Comic Sans MS,cursive,sans-serif]">
          {t("rating.awesome", "Tuyệt vời!")}
        </h1>

        {/* Game Name */}
        <p className="text-xl text-gray-700 font-semibold mb-2">
          {gameName || t("rating.default_game", "Trò chơi")}
        </p>

        {/* Message */}
        <p className="text-lg text-pink-500 mb-6">
          {message || t("rating.default_msg", "Con đã hoàn thành xuất sắc!")}
        </p>

        {/* Score Display (if provided) */}
        {score !== undefined && maxScore !== undefined && (
          <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-6 mb-6">
            <p className="text-gray-600 font-medium mb-2">
              {t("rating.your_score", "Điểm số của con")}
            </p>
            <p className="text-5xl font-extrabold text-pink-600">
              {score}
              <span className="text-2xl text-gray-500">/{maxScore}</span>
            </p>
          </div>
        )}

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className="text-4xl animate-pulse"
              style={{ animationDelay: `${star * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              🔄 {t("rating.play_again", "Chơi lại")}
            </button>
          )}
          <button
            onClick={() => navigate("/training")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            🎮 {t("rating.play_other", "Chơi trò khác")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinigameSuccessPage;