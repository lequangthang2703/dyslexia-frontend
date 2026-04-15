import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MG1_ITEMS } from "../../../data/minigame1";
import SpeakerIcon from "../auditory/SpeakerIcon";

type Feedback = "idle" | "right" | "wrong";

type GameState = {
  index: number;
  correct: number;
  streak: number;
  input: string;
  feedback: Feedback;
};

const FLOWER_COUNT = 10;
const FEEDBACK_DELAY = 850;
const QUESTIONS_PER_GAME = 5;

const getRandomItems = <T,>(items: T[], count: number) =>
  [...items].sort(() => Math.random() - 0.5).slice(0, count);

const normalizeAnswer = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function FlyingBee({ progress }: { progress: number }) {
  const left = 7 + progress * 86;
  const top = 52 - Math.sin(progress * Math.PI) * 22;

  return (
    <div
      className="absolute z-20 h-20 w-24 transition-all duration-700 ease-out"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      <div className="relative h-full w-full animate-[bounce_2.4s_infinite]">
        <div className="absolute left-3 top-1 h-12 w-10 rotate-[-24deg] rounded-full border border-sky-100 bg-sky-200/75" />
        <div className="absolute left-9 top-1 h-12 w-10 rotate-[24deg] rounded-full border border-sky-100 bg-sky-200/75" />
        <div className="absolute left-4 top-8 h-10 w-16 rounded-full border-4 border-slate-900 bg-yellow-300 shadow-lg">
          <div className="absolute left-4 top-0 h-full w-2 -rotate-6 bg-slate-900" />
          <div className="absolute left-9 top-0 h-full w-2 -rotate-6 bg-slate-900" />
          <div className="absolute left-2 top-2 h-3 w-7 rounded-full bg-white/45" />
        </div>
        <div className="absolute left-[18px] top-[42px] h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute left-[34px] top-[42px] h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute left-[58px] top-[46px] h-0 w-0 border-y-[7px] border-l-[14px] border-y-transparent border-l-slate-900" />
      </div>
    </div>
  );
}

function FlowerField({
  correct,
  progress,
  feedback,
  totalQuestions,
}: {
  correct: number;
  progress: number;
  feedback: Feedback;
  totalQuestions: number;
}) {
  const bloomedFlowers = Math.floor((correct / totalQuestions) * FLOWER_COUNT);
  const flowers = Array.from({ length: FLOWER_COUNT }, (_, index) => {
    const isBloomed = index < bloomedFlowers;
    const petalColor =
      index % 3 === 0
        ? "bg-rose-400"
        : index % 3 === 1
        ? "bg-sky-400"
        : "bg-emerald-400";

    return (
      <div
        key={index}
        className="relative flex h-24 min-w-[72px] flex-col items-center justify-end"
      >
        <div
          className={`h-10 w-1 rounded bg-emerald-600 transition-all duration-500 ${
            isBloomed ? "scale-y-100 opacity-100" : "scale-y-75 opacity-45"
          }`}
        />
        <div
          className={`relative -mt-12 h-16 w-16 transition-all duration-500 ${
            isBloomed ? "scale-100 opacity-100" : "scale-75 opacity-35"
          }`}
        >
          {[0, 1, 2, 3, 4, 5].map((petal) => (
            <span
              key={petal}
              className={`absolute left-1/2 top-1/2 h-7 w-4 origin-bottom rounded-full ${petalColor}`}
              style={{
                transform: `translate(-50%, -95%) rotate(${petal * 60}deg)`,
              }}
            />
          ))}
          <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300" />
        </div>
      </div>
    );
  });

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-emerald-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 shadow-[0_20px_60px_-25px_rgba(16,185,129,0.25)] md:min-h-[600px]">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-emerald-100" />
      <div className="absolute inset-x-8 bottom-28 h-2 rounded-full bg-emerald-300" />
      <div className="absolute left-8 top-6 rounded-lg border border-sky-100 bg-white/80 px-4 py-3 shadow-sm">
        <div className="text-sm font-semibold text-slate-500">Mật đã thu</div>
        <div className="text-3xl font-extrabold text-emerald-700">
          {correct}/{totalQuestions}
        </div>
      </div>
      <div className="absolute right-8 top-6 rounded-lg border border-amber-100 bg-white/80 px-4 py-3 text-right shadow-sm">
        <div className="text-sm font-semibold text-slate-500">Vườn hoa</div>
        <div className="text-3xl font-extrabold text-amber-600">
          {bloomedFlowers}/{FLOWER_COUNT}
        </div>
      </div>

      <div className="absolute inset-x-8 bottom-20 flex items-end justify-between gap-2">
        {flowers}
      </div>

      <FlyingBee progress={progress} />

      {feedback === "right" && (
        <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-lg border border-emerald-200 bg-white px-4 py-2 font-bold text-emerald-700 shadow-md">
          Ong đã lấy được mật
        </div>
      )}
      {feedback === "wrong" && (
        <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-lg border border-rose-200 bg-white px-4 py-2 font-bold text-rose-700 shadow-md">
          Bay tiếp sang bông sau
        </div>
      )}

      <div className="absolute inset-x-8 bottom-5">
        <div className="h-3 overflow-hidden rounded bg-white/85">
          <div
            className="h-full rounded bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400 transition-all duration-700"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <div className="mt-2 text-center text-sm font-semibold text-slate-600">
          {Math.round(progress * 100)}% đường bay
        </div>
      </div>
    </div>
  );
}

export default function GardenSpellingGame() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const gameItems = useMemo(
    () => getRandomItems(MG1_ITEMS, QUESTIONS_PER_GAME),
    []
  );
  const [state, setState] = useState<GameState>({
    index: 0,
    correct: 0,
    streak: 0,
    input: "",
    feedback: "idle",
  });

  const item = gameItems[state.index];
  const progress = useMemo(
    () => state.correct / gameItems.length,
    [gameItems.length, state.correct]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [state.index]);

  const playAudio = () => {
    if (!item) return;

    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.play().catch(() => {});
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.word);
      utterance.lang = "vi-VN";
      utterance.rate = 0.86;
      window.speechSynthesis.speak(utterance);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!item || state.feedback !== "idle") return;

    const isRight = normalizeAnswer(state.input) === normalizeAnswer(item.word);
    const nextCorrect = isRight ? state.correct + 1 : state.correct;
    const nextStreak = isRight ? state.streak + 1 : 0;
    const nextIndex = state.index + 1;

    setState((previous) => ({
      ...previous,
      correct: nextCorrect,
      streak: nextStreak,
      feedback: isRight ? "right" : "wrong",
    }));

    window.setTimeout(() => {
      if (nextIndex >= gameItems.length) {
        navigate("/test/minigame1/rating");
        return;
      }

      setState({
        index: nextIndex,
        correct: nextCorrect,
        streak: nextStreak,
        input: "",
        feedback: "idle",
      });
    }, FEEDBACK_DELAY);
  };

  return (
    <main className="w-[1280px] max-w-[98vw] p-3">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.08fr_0.92fr]">
        <FlowerField
          correct={state.correct}
          progress={progress}
          feedback={state.feedback}
          totalQuestions={gameItems.length}
        />

        <section className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.35)] md:min-h-[600px]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-700">
                Spelling Bee
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
                Nghe và gõ từ
              </h1>
            </div>
            <button
              onClick={playAudio}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-3 font-bold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
              type="button"
            >
              <SpeakerIcon className="h-5 w-5" />
              Nghe lại
            </button>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                Câu hỏi
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {state.index + 1}/{gameItems.length}
              </div>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                Chuỗi đúng
              </div>
              <div className="text-2xl font-extrabold text-amber-700">
                {state.streak}
              </div>
            </div>
            <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                Chính xác
              </div>
              <div className="text-2xl font-extrabold text-sky-700">
                {state.correct}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <span className="mb-1 block font-bold text-emerald-700">
                Mô tả
              </span>
              <p className="text-lg leading-relaxed text-slate-800">
                {item?.description}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="mb-1 block font-bold text-slate-700">Ví dụ</span>
              <p className="text-lg italic leading-relaxed text-slate-800">
                "{item?.example}"
              </p>
            </div>

            <p className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              Có thể gõ không dấu. Hãy nghe âm thanh, đọc gợi ý, rồi đưa ong
              đến bông hoa tiếp theo.
            </p>
          </div>

          <form onSubmit={submit} className="mt-5">
            <input
              ref={inputRef}
              value={state.input}
              onChange={(event) =>
                setState((previous) => ({
                  ...previous,
                  input: event.target.value,
                }))
              }
              placeholder="Nhập từ bạn nghe được..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              autoComplete="off"
              disabled={state.feedback !== "idle"}
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div
                className={`min-h-7 font-bold ${
                  state.feedback === "right"
                    ? "text-emerald-700"
                    : state.feedback === "wrong"
                    ? "text-rose-700"
                    : "text-slate-500"
                }`}
              >
                {state.feedback === "right" && "Chính xác, thêm một giọt mật."}
                {state.feedback === "wrong" &&
                  `Chưa đúng. Đáp án là "${item?.word}".`}
                {state.feedback === "idle" && "Sẵn sàng kiểm tra."}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
                disabled={state.feedback !== "idle" || !state.input.trim()}
              >
                Kiểm tra
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
