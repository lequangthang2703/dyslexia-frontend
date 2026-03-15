/* ---------------- CLOCK ICON ---------------- */
export const ClockFace = ({
  timeLeft,
  totalTime,
}: {
  timeLeft: number;
  totalTime: number;
}) => {
  const degreesPerSec = 360 / totalTime;
  const angle = (totalTime - timeLeft) * degreesPerSec;
  const counterClockwiseAngle = 360 - angle;

  return (
    <div className="flex flex-col items-center">
      <svg width="80" height="80" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#ec4899"
          strokeWidth="4"
          fill="white"
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke="#ec4899"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${counterClockwiseAngle} 50 50)`}
        />
      </svg>
      <span className="mt-1 text-pink-600 font-bold text-xl">
        {Math.ceil(timeLeft)}s
      </span>
    </div>
  );
};

/* ---------------- STATS DISPLAY ---------------- */
export const TestStats = ({
  correctCount,
  wrongCount,
  score,
  testActive,
}: {
  correctCount: number;
  wrongCount: number;
  score: number;
  testActive: boolean;
}) => {
  if (!testActive) return null;

  return (
    <div className="flex justify-between items-center mb-4 text-sm w-full">
      <div className="flex gap-4 mx-auto">
        <span className="text-green-600 font-semibold">
          Correct: {correctCount}
        </span>
        <span className="text-red-600 font-semibold">Wrong: {wrongCount}</span>
        <span className="text-pink-600 font-semibold">
          Total Score: {score}
        </span>
      </div>
    </div>
  );
};
