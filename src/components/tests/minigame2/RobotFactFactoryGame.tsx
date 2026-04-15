import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../../data/minigame2";

type AnswerLogItem = {
  id: number;
  correct: boolean;
};

const FEEDBACK_DELAY = 900;
const POWER_CELLS = 12;
const CHECKPOINTS = 10;
const QUESTIONS_PER_GAME = 5;

const getRandomItems = <T,>(items: T[], count: number) =>
  [...items].sort(() => Math.random() - 0.5).slice(0, count);

function RobotPilot({ energyPercent }: { energyPercent: number }) {
  const glow = Math.max(0.15, energyPercent / 100);

  return (
    <div className="relative h-56 w-48" aria-hidden="true">
      <div
        className="absolute left-1/2 top-5 h-20 w-28 -translate-x-1/2 rounded-lg border-4 border-slate-800 bg-slate-100 shadow-lg"
        style={{
          boxShadow: `0 0 ${18 + glow * 26}px rgba(14, 165, 233, ${glow})`,
        }}
      >
        <div className="absolute left-5 top-7 h-5 w-5 rounded-full bg-sky-500" />
        <div className="absolute right-5 top-7 h-5 w-5 rounded-full bg-emerald-500" />
        <div className="absolute bottom-4 left-1/2 h-2 w-14 -translate-x-1/2 rounded bg-slate-700" />
      </div>
      <div className="absolute left-1/2 top-[108px] h-28 w-36 -translate-x-1/2 rounded-lg border-4 border-slate-800 bg-white">
        <div className="absolute left-1/2 top-5 h-14 w-20 -translate-x-1/2 rounded-lg border border-sky-200 bg-sky-50">
          <div
            className="absolute inset-x-2 bottom-2 rounded bg-sky-500 transition-all duration-700"
            style={{ height: `${Math.max(8, energyPercent * 0.48)}%` }}
          />
        </div>
      </div>
      <div className="absolute left-0 top-32 h-5 w-16 rounded bg-slate-800" />
      <div className="absolute right-0 top-32 h-5 w-16 rounded bg-slate-800" />
      <div className="absolute bottom-0 left-10 h-12 w-5 rounded bg-slate-800" />
      <div className="absolute bottom-0 right-10 h-12 w-5 rounded bg-slate-800" />
      <div className="absolute left-1/2 top-0 h-8 w-1 -translate-x-1/2 bg-slate-800" />
      <div className="absolute left-1/2 -top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-amber-400" />
    </div>
  );
}

function DiagnosticBoard({
  score,
  wrongCount,
  answered,
  answerLog,
  feedbackVisible,
  isCorrect,
  totalQuestions,
}: {
  score: number;
  wrongCount: number;
  answered: number;
  answerLog: AnswerLogItem[];
  feedbackVisible: boolean;
  isCorrect: boolean;
  totalQuestions: number;
}) {
  const energyPercent = Math.round((score / totalQuestions) * 100);
  const missionPercent = Math.round((answered / totalQuestions) * 100);
  const poweredCells = Math.floor((score / totalQuestions) * POWER_CELLS);
  const passedCheckpoints = Math.floor((answered / totalQuestions) * CHECKPOINTS);

  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.30)] md:min-h-[600px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-sky-700">
            Robot Fact Lab
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Kiểm định thông tin
          </h1>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white px-4 py-3 text-right shadow-sm">
          <div className="text-sm font-semibold text-slate-500">Năng lượng</div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {energyPercent}%
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <RobotPilot energyPercent={energyPercent} />
        <div className="mt-5 w-full">
          <div className="relative h-14 rounded-lg border border-slate-200 bg-white">
            <div className="absolute left-5 right-5 top-1/2 h-2 -translate-y-1/2 rounded bg-slate-200" />
            <div className="absolute left-5 right-5 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded">
              <div
                className="h-full rounded bg-sky-500 transition-all duration-700"
                style={{ width: `${missionPercent}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg border-2 border-slate-800 bg-amber-300 transition-all duration-700"
              style={{
                left: `${5 + missionPercent * 0.9}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          <div className="mt-2 text-center text-sm font-semibold text-slate-600">
            {answered}/{totalQuestions} mệnh đề đã kiểm định
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
          <div className="text-xs font-semibold text-slate-500">Đúng</div>
          <div className="text-2xl font-extrabold text-emerald-700">{score}</div>
        </div>
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
          <div className="text-xs font-semibold text-slate-500">Sai</div>
          <div className="text-2xl font-extrabold text-rose-700">
            {wrongCount}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-bold text-slate-800">Pin phản hồi</span>
          <span className="text-sm font-semibold text-slate-500">
            {poweredCells}/{POWER_CELLS}
          </span>
        </div>
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: POWER_CELLS }, (_, index) => (
            <div
              key={index}
              className={`h-8 rounded border transition-all duration-500 ${
                index < poweredCells
                  ? "border-emerald-300 bg-emerald-400 shadow-sm shadow-emerald-100"
                  : "border-slate-200 bg-slate-100"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-bold text-slate-800">Trạm kiểm định</span>
          <span className="text-sm font-semibold text-slate-500">
            {passedCheckpoints}/{CHECKPOINTS}
          </span>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: CHECKPOINTS }, (_, index) => (
            <div
              key={index}
              className={`h-3 rounded ${
                index < passedCheckpoints ? "bg-sky-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 min-h-12 rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {answerLog.slice(-12).map((entry) => (
            <span
              key={entry.id}
              className={`inline-flex h-7 min-w-7 items-center justify-center rounded border px-2 text-sm font-bold ${
                entry.correct
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {entry.correct ? "Đ" : "S"}
            </span>
          ))}
          {answerLog.length === 0 && (
            <span className="text-sm font-semibold text-slate-500">
              Lịch sử phản hồi sẽ hiện tại đây.
            </span>
          )}
        </div>
      </div>

      {feedbackVisible && (
        <div
          className={`absolute left-1/2 top-28 -translate-x-1/2 rounded-lg border bg-white px-5 py-3 text-center font-bold shadow-lg ${
            isCorrect
              ? "border-emerald-200 text-emerald-700"
              : "border-rose-200 text-rose-700"
          }`}
        >
          {isCorrect ? "Tín hiệu hợp lệ, robot được nạp pin." : "Tín hiệu nhiễu, robot giữ nguyên pin."}
        </div>
      )}
    </section>
  );
}

export default function RobotFactFactoryGame() {
  const navigate = useNavigate();
  const gameQuestions = useMemo(
    () => getRandomItems(QUESTIONS, QUESTIONS_PER_GAME),
    []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerLogItem[]>([]);

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const answered = answerLog.length;
  const questionProgress = useMemo(
    () => Math.round(((currentQuestionIndex + 1) / gameQuestions.length) * 100),
    [currentQuestionIndex, gameQuestions.length]
  );

  const handleAnswer = (userAnswer: boolean) => {
    if (feedbackVisible || !currentQuestion) return;

    const correct = userAnswer === currentQuestion.correctAnswer;
    const nextIndex = currentQuestionIndex + 1;

    setIsCorrect(correct);
    setFeedbackVisible(true);
    setAnswerLog((previous) => [
      ...previous,
      { id: currentQuestion.id, correct },
    ]);

    if (correct) {
      setScore((previous) => previous + 1);
    } else {
      setWrongCount((previous) => previous + 1);
    }

    window.setTimeout(() => {
      setFeedbackVisible(false);
      if (nextIndex >= gameQuestions.length) {
        navigate("/test/minigame2/rating");
        return;
      }
      setCurrentQuestionIndex(nextIndex);
    }, FEEDBACK_DELAY);
  };

  return (
    <main className="w-[1280px] max-w-[98vw] p-3">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.05fr_0.95fr]">
        <DiagnosticBoard
          score={score}
          wrongCount={wrongCount}
          answered={answered}
          answerLog={answerLog}
          feedbackVisible={feedbackVisible}
          isCorrect={isCorrect}
          totalQuestions={gameQuestions.length}
        />

        <section className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.35)] md:min-h-[600px]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-sky-700">
                Đúng hay sai
              </p>
              <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
                Đọc nhanh, chọn chuẩn
              </h2>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <div className="text-sm font-semibold text-slate-500">Câu</div>
              <div className="text-2xl font-extrabold text-slate-900">
                {currentQuestionIndex + 1}/{gameQuestions.length}
              </div>
            </div>
          </div>

          <div className="mb-5 h-3 overflow-hidden rounded bg-slate-100">
            <div
              className="h-full rounded bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-400 transition-all duration-700"
              style={{ width: `${questionProgress}%` }}
            />
          </div>

          <div className="flex flex-1 items-center">
            <div className="w-full rounded-lg border border-sky-100 bg-sky-50 p-6">
              <div className="mb-3 text-sm font-bold uppercase text-sky-700">
                Mệnh đề cần kiểm định
              </div>
              <p className="min-h-28 text-center text-2xl font-bold leading-relaxed text-slate-900">
                {currentQuestion?.sentence}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              disabled={feedbackVisible}
              className="rounded-lg bg-emerald-600 py-4 text-xl font-extrabold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
              type="button"
            >
              ĐÚNG
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={feedbackVisible}
              className="rounded-lg bg-rose-600 py-4 text-xl font-extrabold text-white shadow-md shadow-rose-100 transition hover:bg-rose-700 active:scale-[0.98] disabled:opacity-60"
              type="button"
            >
              SAI
            </button>
          </div>

          <div
            className={`mt-5 min-h-12 rounded-lg border px-4 py-3 text-center font-bold ${
              feedbackVisible
                ? isCorrect
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {feedbackVisible
              ? isCorrect
                ? "Chính xác. Robot nhận thêm năng lượng."
                : "Chưa đúng. Hãy đọc kỹ mệnh đề kế tiếp."
              : "Chọn Đúng hoặc Sai để kiểm định tín hiệu."}
          </div>
        </section>
      </div>
    </main>
  );
}
