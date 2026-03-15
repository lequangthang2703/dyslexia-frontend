import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../../data/minigame2";

const ROBOT_FULL_IMAGE_PATH = "/mascot.jpg";

const TOTAL_QUESTIONS = QUESTIONS.length;
const REVEAL_INCREMENT = 100 / TOTAL_QUESTIONS;

const MiniGame2 = () => {
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [imageRevealPercent, setImageRevealPercent] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [testActive, setTestActive] = useState(true);
  const [testFinished, setTestFinished] = useState(false);

  const currentQ = QUESTIONS[currentQuestionIndex];

  const handleAnswer = (userAnswer: boolean) => {
    if (!testActive || feedbackVisible || testFinished) return;

    const isCorrectAnswer = userAnswer === currentQ.correctAnswer;
    setIsCorrect(isCorrectAnswer);
    setFeedbackVisible(true);

    if (isCorrectAnswer) {
      setScore((s) => s + 1);
      setImageRevealPercent((prev) => Math.min(100, prev + REVEAL_INCREMENT));
    } else {
      setWrongCount((w) => w + 1);
    }

    const nextIndex = currentQuestionIndex + 1;
    setTimeout(() => {
      setFeedbackVisible(false);
      if (nextIndex < TOTAL_QUESTIONS) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setTestActive(false);
        setTestFinished(true);
        navigate("/test/minigame2/rating");
      }
    }, 1200);
  };

  /* ---------------- RENDERING LOGIC ---------------- */
  if (testFinished) {
    return (
      <div className="text-center p-10 bg-white rounded-xl shadow-2xl max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">
          Yeah! Bạn đã lắp ráp xong Robot 🤖
        </h2>
        <p className="text-xl text-gray-700">
          Final Score:{" "}
          <span className="font-extrabold text-green-500">
            {score} / {TOTAL_QUESTIONS}
          </span>
        </p>
        <p className="text-md text-gray-500">Wrong Answers: {wrongCount}</p>
      </div>
    );
  }

  return (
    <div className="w-[1280px] max-w-[98vw] mx-auto">
      {/* ====== CONTAINER BAO QUANH 2 KHỐI ====== */}
      <div
        className="
          rounded-3xl p-4 md:p-6
          bg-gradient-to-br from-pink-50 via-white to-cyan-100
          border border-pink-100 shadow-[0_25px_80px_-30px_rgba(236,72,153,0.20)]
        "
      >
        {/* ====== GRID 2 KHỐI ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ========== KHỐI TRÁI: ROBOT + TIẾN ĐỘ ========== */}
          <div className="relative rounded-2xl bg-pink-50 border border-pink-100 shadow-[0_20px_60px_-20px_rgba(236,72,153,0.18)] overflow-hidden min-h-[520px] md:min-h-[600px]">
            {/* Nền radial dịu */}
            <div className="absolute inset-0 bg-[radial-gradient(720px_720px_at_35%_48%,rgba(236,72,153,0.22),rgba(6,182,212,0.12)_45%,transparent_75%)]" />

            {/* Robot – cân đối với vòng */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[440px] md:h-[440px] rounded-full overflow-hidden">
                <img
                  src={ROBOT_FULL_IMAGE_PATH}
                  alt="robot"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    clipPath: `inset(${100 - imageRevealPercent}% 0 0 0)`,
                  }}
                />
                <div className="absolute inset-0 bg-pink-400/30 mix-blend-multiply" />
              </div>
            </div>

            {/* Thanh tiến độ */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[66%] md:w-[62%]">
              <div className="w-full h-3 bg-pink-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 transition-all duration-500"
                  style={{ width: `${imageRevealPercent}%` }}
                />
              </div>
              <div className="mt-1 text-center text-sm text-pink-600">
                {Math.round(imageRevealPercent)}%
              </div>
            </div>
          </div>

          {/* ========== KHỐI PHẢI: PANEL CÂU HỎI ========== */}
          <div className="rounded-2xl bg-white/95 border border-pink-100 shadow-[0_10px_40px_-15px_rgba(236,72,153,0.18)] p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-pink-600 text-xl">
                Lắp Ráp Robot
              </div>
              <div className="text-pink-500 font-medium">
                Câu {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
              </div>
            </div>

            {/* Câu hỏi */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full p-6 bg-pink-50 border border-pink-200 rounded-xl">
                <p className="text-xl font-medium text-slate-800 text-center">
                  {currentQ.sentence}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleAnswer(true)}
                disabled={feedbackVisible}
                className="flex-1 py-4 text-white text-lg font-semibold rounded-xl transition-all bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 shadow-lg"
              >
                ✓ ĐÚNG
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={feedbackVisible}
                className="flex-1 py-4 text-white text-lg font-semibold rounded-xl transition-all bg-red-500 hover:bg-red-600 disabled:opacity-50 shadow-lg"
              >
                ✗ SAI
              </button>
            </div>

            {/* Feedback */}
            {feedbackVisible && (
              <div
                className={`mt-4 text-center text-lg font-semibold ${
                  isCorrect ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {isCorrect
                  ? "Chính xác! Bộ phận robot đã được lắp."
                  : "Chưa đúng, thử lại câu tiếp nhé!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame2;
