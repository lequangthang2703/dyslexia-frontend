import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameLanguageSwitch from "../../common/GameLanguageSwitch";

// Schema matching your DB
export type QuestionResponse = {
  id: number;
  minigame_number: string;
  game_payload: { group_id: string; letters: string[] };
  content: {
    vi: { word: string; description: string; example: string };
    en: { word: string; description: string; example: string };
  };
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

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

// Dynamically generate the questions based on DB data
const buildQuestions = (dbGroups: QuestionResponse[], currentLang: 'en' | 'vi'): MeteorQuestion[] => {
  if (!dbGroups || dbGroups.length === 0) return [];
  
  return Array.from({ length: QUESTIONS_PER_GAME }, (_, index) => {
    const group = dbGroups[index % dbGroups.length];
    const letters = shuffle(group.game_payload.letters);
    const target = letters[0];

    return {
      id: `${group.game_payload.group_id}-${index}`,
      target,
      options: shuffle(letters.slice(0, 4)),
      groupLabel: group.content[currentLang]?.word || "Unknown Group",
    };
  });
};

function speakTarget(target: string, langCode: 'en' | 'vi') {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const promptText = langCode === 'en' ? `Find the letter ${target}` : `Tìm chữ ${target}`;
  const utterance = new SpeechSynthesisUtterance(promptText);
  
  utterance.lang = langCode === 'en' ? "en-US" : "vi-VN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// ==========================================
// UNTOUCHED ANIMATION COMPONENTS
// ==========================================

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
      aria-label={`Select ${value}`}
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
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
        <div className="text-xs font-semibold text-slate-500">{t("minigame4.game.rescued")}</div>
        <div className="text-2xl font-extrabold text-emerald-700">
          {correct}
        </div>
      </div>
      <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
        <div className="text-xs font-semibold text-slate-500">{t("minigame4.game.progress")}</div>
        <div className="text-2xl font-extrabold text-sky-700">
          {answered}/{total}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN GAME LOGIC
// ==========================================

export default function LetterMeteorGame() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("en") ? "en" : "vi";

  const [dbGroups, setDbGroups] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the Confusion Groups from the DB
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8000/v1/questions/four");
        if (response.ok) {
          const data = await response.json();
          setDbGroups(data);
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 2. Generate questions dynamically whenever dbGroups changes
  const questions = useMemo(() => buildQuestions(dbGroups, currentLang), [dbGroups, currentLang]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [answerLog, setAnswerLog] = useState<AnswerLog[]>([]);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const correctCount = answerLog.filter((item) => item.correct).length;
  const progress = questions.length > 0 ? Math.round((answerLog.length / questions.length) * 100) : 0;

  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartedAt(Date.now());
      const timer = window.setTimeout(() => speakTarget(currentQuestion.target, currentLang), 400);
      return () => window.clearTimeout(timer);
    }
  }, [currentQuestion, currentLang]);

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

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-sky-600">Loading Game Data...</div>;
  if (!currentQuestion) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 p-4 text-white">
      {/* Top right language switch */}
      <div className="absolute top-4 right-4 z-50">
        <GameLanguageSwitch className="!bg-slate-800 border-slate-600" />
      </div>

      <div className="mx-auto mt-12 grid min-h-[calc(100vh-5rem)] w-[1280px] max-w-[98vw] grid-cols-1 gap-5 md:grid-cols-[1.08fr_0.92fr]">
        
        {/* Left Visualization Panel */}
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
                {t("minigame4.instruction.tag")}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold">
                {t("minigame4.instruction.title")}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/test/minigame4/rating")}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-bold text-white transition hover:bg-white/20"
            >
              {t("minigame4.game.exit")}
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
              {progress}% {t("minigame4.game.mission").toLowerCase()}
            </div>
          </div>
        </section>

        {/* Right Info Panel */}
        <section className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.35)]">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase text-sky-700">
              {t("minigame4.game.mission")}
            </p>
            <h2 className="mt-1 text-3xl font-extrabold">
              {t("minigame4.game.mission_title")}
            </h2>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
              <div className="text-xs font-semibold text-slate-500">{t("minigame4.game.question")}</div>
              <div className="text-2xl font-extrabold text-amber-700">
                {currentIndex + 1}/{questions.length}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                {t("minigame4.game.group")}
              </div>
              <div className="text-lg font-extrabold text-slate-800">
                {currentQuestion.groupLabel}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-sky-100 bg-sky-50 p-6 text-center">
            <div className="text-sm font-bold uppercase text-sky-700">
              {t("minigame4.game.select_prompt")}
            </div>
            <div className="mt-3 text-7xl font-extrabold text-slate-900">
              {currentQuestion.target}
            </div>
            <button
              type="button"
              onClick={() => speakTarget(currentQuestion.target, currentLang)}
              className="mt-5 rounded-lg bg-sky-600 px-5 py-3 font-bold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
            >
              {t("minigame4.game.listen_btn")}
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
            {feedback === "right" && t("minigame4.game.feedback_right")}
            {feedback === "wrong" && `${t("minigame4.game.feedback_wrong")} ${currentQuestion.target}.`}
            {feedback === "idle" && t("minigame4.game.feedback_idle")}
          </div>

          <div className="mt-5">
            <MissionMap answered={answerLog.length} correct={correctCount} total={questions.length} />
          </div>

          <div className="mt-5 flex-1 rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 font-bold text-slate-800">{t("minigame4.game.log_title")}</div>
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
                  {t("minigame4.game.log_empty")}
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}