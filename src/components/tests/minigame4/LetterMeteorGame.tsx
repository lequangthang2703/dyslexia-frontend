import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type ConfusionGroup = {
  id: string;
  label: string;
  letters: string[];
};

type MeteorQuestion = {
  id: string;
  target: string;
  options: string[];
  groupLabel: string;
};

type AnswerLog = {
  id: string;
  target: string;
  selected: string;
  correct: boolean;
  reactionTimeMs: number;
  groupLabel: string;
};

const QUESTIONS_PER_GAME = 10;
const FEEDBACK_DELAY = 850;

const CONFUSION_GROUPS: ConfusionGroup[] = [
  { id: "mirror", label: "Chữ đảo chiều", letters: ["b", "d", "p", "q"] },
  { id: "similar-strokes", label: "Nét gần giống", letters: ["m", "n", "u", "v"] },
  { id: "vowel-a", label: "Nguyên âm a", letters: ["a", "ă", "â", "e"] },
  { id: "vowel-o", label: "Nguyên âm o", letters: ["o", "ô", "ơ", "u"] },
  { id: "vowel-e", label: "Nguyên âm e", letters: ["e", "ê", "i", "l"] },
  { id: "vowel-u", label: "Nguyên âm u", letters: ["u", "ư", "n", "m"] },
  { id: "line", label: "Nét thẳng", letters: ["i", "l", "t", "f"] },
  { id: "tone-word", label: "Dấu thanh", letters: ["ca", "cá", "cà", "cả"] },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const buildQuestions = (): MeteorQuestion[] =>
  Array.from({ length: QUESTIONS_PER_GAME }, (_, index) => {
    const group = CONFUSION_GROUPS[index % CONFUSION_GROUPS.length];
    const letters = shuffle(group.letters);
    const target = letters[0];

    return {
      id: `${group.id}-${index}`,
      target,
      options: shuffle(letters.slice(0, 4)),
      groupLabel: group.label,
    };
  });

function speakTarget(target: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`Tìm chữ ${target}`);
  utterance.lang = "vi-VN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function MeteorOption({
  value,
  index,
  selected,
  target,
  disabled,
  onSelect,
}: {
  value: string;
  index: number;
  selected: string | null;
  target: string;
  disabled: boolean;
  onSelect: (value: string) => void;
}) {
  const top = [18, 36, 57, 75][index] ?? 50;
  const left = [18, 70, 32, 82][index] ?? 50;
  const isChosen = selected === value;
  const isTarget = value === target;
  const reveal = selected !== null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={`absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 text-4xl font-extrabold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-default ${
        reveal && isTarget
          ? "border-emerald-300 bg-emerald-200 text-emerald-900"
          : reveal && isChosen
          ? "border-rose-300 bg-rose-200 text-rose-900"
          : "border-amber-200 bg-amber-100 text-slate-900"
      }`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
      }}
      aria-label={`Chọn ${value}`}
    >
      <span className="absolute -left-8 top-8 h-2 w-10 rounded bg-amber-300/70" />
      <span className="relative">{value}</span>
    </button>
  );
}

function MissionMap({
  answered,
  correct,
  total,
}: {
  answered: number;
  correct: number;
  total: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
        <div className="text-xs font-semibold text-slate-500">Cứu đúng</div>
        <div className="text-2xl font-extrabold text-emerald-700">
          {correct}
        </div>
      </div>
      <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
        <div className="text-xs font-semibold text-slate-500">Tiến độ</div>
        <div className="text-2xl font-extrabold text-sky-700">
          {answered}/{total}
        </div>
      </div>
    </div>
  );
}

export default function LetterMeteorGame() {
  const navigate = useNavigate();
  const questions = useMemo(() => buildQuestions(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [answerLog, setAnswerLog] = useState<AnswerLog[]>([]);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const correctCount = answerLog.filter((item) => item.correct).length;
  const progress = Math.round((answerLog.length / questions.length) * 100);

  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartedAt(Date.now());
      const timer = window.setTimeout(() => speakTarget(currentQuestion.target), 400);
      return () => window.clearTimeout(timer);
    }
  }, [currentQuestion]);

  const handleSelect = (value: string) => {
    if (selected || !currentQuestion) return;

    const correct = value === currentQuestion.target;
    const reactionTimeMs = Date.now() - questionStartedAt;
    const nextIndex = currentIndex + 1;

    setSelected(value);
    setFeedback(correct ? "right" : "wrong");
    setAnswerLog((previous) => [
      ...previous,
      {
        id: currentQuestion.id,
        target: currentQuestion.target,
        selected: value,
        correct,
        reactionTimeMs,
        groupLabel: currentQuestion.groupLabel,
      },
    ]);

    window.setTimeout(() => {
      if (nextIndex >= questions.length) {
        navigate("/test/minigame4/rating");
        return;
      }

      setCurrentIndex(nextIndex);
      setSelected(null);
      setFeedback("idle");
    }, FEEDBACK_DELAY);
  };

  if (!currentQuestion) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 p-4 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-[1280px] max-w-[98vw] grid-cols-1 gap-5 md:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden rounded-lg border border-white/15 bg-slate-950/60 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(125,211,252,0.22),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(52,211,153,0.20),transparent_34%)]" />
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 26 }, (_, index) => (
              <span
                key={index}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{
                  left: `${(index * 37) % 100}%`,
                  top: `${(index * 53) % 100}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-semibold uppercase text-sky-200">
                Minigame 4
              </p>
              <h1 className="mt-1 text-3xl font-extrabold">
                Trạm Chữ Sao Băng
              </h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/test/minigame4/rating")}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-bold text-white transition hover:bg-white/20"
            >
              Kết thúc
            </button>
          </div>

          <div className="relative z-10 mx-5 h-[480px] rounded-lg border border-white/10 bg-slate-900/55">
            {currentQuestion.options.map((option, index) => (
              <MeteorOption
                key={`${currentQuestion.id}-${option}`}
                value={option}
                index={index}
                selected={selected}
                target={currentQuestion.target}
                disabled={selected !== null}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="relative z-10 p-5">
            <div className="h-3 overflow-hidden rounded bg-white/15">
              <div
                className="h-full rounded bg-gradient-to-r from-emerald-400 via-sky-300 to-amber-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-center text-sm font-semibold text-sky-100">
              {progress}% nhiệm vụ
            </div>
          </div>
        </section>

        <section className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.35)]">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase text-sky-700">
              Nhiệm vụ hiện tại
            </p>
            <h2 className="mt-1 text-3xl font-extrabold">
              Tìm đúng chữ trong sao băng
            </h2>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
              <div className="text-xs font-semibold text-slate-500">Câu</div>
              <div className="text-2xl font-extrabold text-amber-700">
                {currentIndex + 1}/{questions.length}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                Nhóm chữ
              </div>
              <div className="text-lg font-extrabold text-slate-800">
                {currentQuestion.groupLabel}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-sky-100 bg-sky-50 p-6 text-center">
            <div className="text-sm font-bold uppercase text-sky-700">
              Hãy chọn
            </div>
            <div className="mt-3 text-7xl font-extrabold text-slate-900">
              {currentQuestion.target}
            </div>
            <button
              type="button"
              onClick={() => speakTarget(currentQuestion.target)}
              className="mt-5 rounded-lg bg-sky-600 px-5 py-3 font-bold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
            >
              Nghe lại
            </button>
          </div>

          <div
            className={`mt-5 min-h-14 rounded-lg border px-4 py-3 text-center font-bold ${
              feedback === "right"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : feedback === "wrong"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {feedback === "right" && "Chính xác. Sao băng đã được cứu."}
            {feedback === "wrong" &&
              `Chưa đúng. Chữ cần tìm là ${currentQuestion.target}.`}
            {feedback === "idle" && "Nhìn kỹ các chữ dễ nhầm rồi chọn."}
          </div>

          <div className="mt-5">
            <MissionMap
              answered={answerLog.length}
              correct={correctCount}
              total={questions.length}
            />
          </div>

          <div className="mt-5 flex-1 rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 font-bold text-slate-800">Nhật ký chọn chữ</div>
            <div className="flex flex-wrap gap-2">
              {answerLog.map((item) => (
                <span
                  key={item.id}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded border px-2 text-sm font-bold ${
                    item.correct
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                  title={`${item.groupLabel}: ${item.reactionTimeMs}ms`}
                >
                  {item.selected}
                </span>
              ))}
              {answerLog.length === 0 && (
                <span className="text-sm font-semibold text-slate-500">
                  Kết quả từng lượt sẽ hiện tại đây.
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
