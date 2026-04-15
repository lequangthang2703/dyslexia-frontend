import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "../../../data/minigame2";

type Lane = "truth" | "noise";

type DeliveryLogItem = {
  id: number;
  correct: boolean;
  lane: Lane;
};

const FEEDBACK_DELAY = 900;
const QUESTIONS_PER_GAME = 5;

const getRandomItems = <T,>(items: T[], count: number) =>
  [...items].sort(() => Math.random() - 0.5).slice(0, count);

function DeliveryRobot({
  lane,
  progress,
  feedback,
}: {
  lane: Lane;
  progress: number;
  feedback: "idle" | "right" | "wrong";
}) {
  const laneTop = lane === "truth" ? 34 : 68;
  const left = 10 + progress * 70;

  return (
    <div
      className="absolute z-20 h-24 w-24 transition-all duration-700 ease-out"
      style={{
        left: `${left}%`,
        top: `${laneTop}%`,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      <div
        className={`relative h-full w-full transition-transform duration-300 ${
          feedback === "wrong" ? "animate-[shake_0.45s_ease-in-out]" : ""
        }`}
      >
        <div className="absolute left-1/2 top-0 h-10 w-14 -translate-x-1/2 rounded-lg border-[3px] border-slate-800 bg-white shadow-md">
          <div className="absolute left-3 top-4 h-2.5 w-2.5 rounded-full bg-sky-500" />
          <div className="absolute right-3 top-4 h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="absolute left-1/2 top-10 h-12 w-16 -translate-x-1/2 rounded-lg border-[3px] border-slate-800 bg-amber-300">
          <div className="absolute left-1/2 top-3 h-5 w-9 -translate-x-1/2 rounded border border-amber-600 bg-amber-100" />
        </div>
        <div className="absolute bottom-1 left-4 h-4 w-4 rounded-full border-[3px] border-slate-800 bg-slate-200" />
        <div className="absolute bottom-1 right-4 h-4 w-4 rounded-full border-[3px] border-slate-800 bg-slate-200" />
      </div>
    </div>
  );
}

function PackageShelf({
  delivered,
  total,
}: {
  delivered: number;
  total: number;
}) {
  return (
    <div className="rounded-lg border border-amber-100 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-bold text-slate-800">Kiện hàng đã giao</span>
        <span className="text-sm font-semibold text-slate-500">
          {delivered}/{total}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`relative h-14 rounded-lg border-2 transition-all duration-500 ${
              index < delivered
                ? "border-amber-300 bg-amber-300 shadow-md shadow-amber-100"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <div className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 bg-white/45" />
            <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 bg-white/35" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryRoute({
  lane,
  answered,
  delivered,
  totalQuestions,
  feedback,
  lastLane,
  deliveryLog,
}: {
  lane: Lane;
  answered: number;
  delivered: number;
  totalQuestions: number;
  feedback: "idle" | "right" | "wrong";
  lastLane: Lane | null;
  deliveryLog: DeliveryLogItem[];
}) {
  const progress = totalQuestions > 0 ? answered / totalQuestions : 0;

  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.30)] md:min-h-[600px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-sky-700">
            Robot Delivery
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
            Giao Hàng Sự Thật
          </h1>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white px-4 py-3 text-right shadow-sm">
          <div className="text-sm font-semibold text-slate-500">Nhiệm vụ</div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {answered}/{totalQuestions}
          </div>
        </div>
      </div>

      <div className="relative mt-8 h-72 overflow-hidden rounded-lg border border-slate-200 bg-slate-800">
        <div className="absolute inset-x-0 top-[28%] h-20 bg-emerald-500/20" />
        <div className="absolute inset-x-0 top-[57%] h-20 bg-rose-500/20" />
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-white/30" />
        <div className="pointer-events-none absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 text-lg font-extrabold tracking-wider text-emerald-100/80 drop-shadow">
          LÀN ĐÚNG
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 text-lg font-extrabold tracking-wider text-rose-100/80 drop-shadow">
          LÀN SAI
        </div>

        <div className="absolute bottom-4 left-6 right-6 h-3 overflow-hidden rounded bg-white/20">
          <div
            className="h-full rounded bg-amber-300 transition-all duration-700"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <DeliveryRobot lane={lane} progress={progress} feedback={feedback} />

        {feedback !== "idle" && (
          <div
            className={`absolute left-1/2 top-5 -translate-x-1/2 rounded-lg border bg-white px-5 py-3 text-center font-bold shadow-lg ${
              feedback === "right"
                ? "border-emerald-200 text-emerald-700"
                : "border-rose-200 text-rose-700"
            }`}
          >
            {feedback === "right"
              ? "Qua cổng an toàn, giao thêm một kiện hàng."
              : "Nhầm làn rồi, robot phải quay lại trạm."}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.8fr]">
        <PackageShelf delivered={delivered} total={totalQuestions} />

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 font-bold text-slate-800">Nhật ký làn</div>
          <div className="flex min-h-14 flex-wrap gap-2">
            {deliveryLog.map((entry) => (
              <span
                key={entry.id}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded border px-2 text-sm font-bold ${
                  entry.correct
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {entry.lane === "truth" ? "Đ" : "S"}
              </span>
            ))}
            {deliveryLog.length === 0 && (
              <span className="text-sm font-semibold text-slate-500">
                Robot đang chờ kiện hàng đầu tiên.
              </span>
            )}
          </div>
        </div>
      </div>

      {lastLane && feedback !== "idle" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700">
          Robot vừa chọn làn {lastLane === "truth" ? "ĐÚNG" : "SAI"}.
        </div>
      )}
    </section>
  );
}

export default function RobotDeliveryGame() {
  const navigate = useNavigate();
  const gameQuestions = useMemo(
    () => getRandomItems(QUESTIONS, QUESTIONS_PER_GAME),
    []
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [missed, setMissed] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [lane, setLane] = useState<Lane>("truth");
  const [lastLane, setLastLane] = useState<Lane | null>(null);
  const [deliveryLog, setDeliveryLog] = useState<DeliveryLogItem[]>([]);

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const answered = deliveryLog.length;

  const handleAnswer = (userAnswer: boolean) => {
    if (feedback !== "idle" || !currentQuestion) return;

    const selectedLane: Lane = userAnswer ? "truth" : "noise";
    const correct = userAnswer === currentQuestion.correctAnswer;
    const nextIndex = currentQuestionIndex + 1;

    setLane(selectedLane);
    setLastLane(selectedLane);
    setFeedback(correct ? "right" : "wrong");
    setDeliveryLog((previous) => [
      ...previous,
      { id: currentQuestion.id, correct, lane: selectedLane },
    ]);

    if (correct) {
      setDelivered((previous) => previous + 1);
    } else {
      setMissed((previous) => previous + 1);
    }

    window.setTimeout(() => {
      setFeedback("idle");
      if (nextIndex >= gameQuestions.length) {
        navigate("/test/minigame2/rating");
        return;
      }

      setCurrentQuestionIndex(nextIndex);
    }, FEEDBACK_DELAY);
  };

  return (
    <main className="w-[1280px] max-w-[98vw] p-3">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.08fr_0.92fr]">
        <DeliveryRoute
          lane={lane}
          answered={answered}
          delivered={delivered}
          totalQuestions={gameQuestions.length}
          feedback={feedback}
          lastLane={lastLane}
          deliveryLog={deliveryLog}
        />

        <section className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_55px_-28px_rgba(15,23,42,0.35)] md:min-h-[600px]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-sky-700">
                Phân loại tín hiệu
              </p>
              <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
                Đưa robot vào đúng làn
              </h2>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              <div className="text-sm font-semibold text-slate-500">Câu</div>
              <div className="text-2xl font-extrabold text-slate-900">
                {currentQuestionIndex + 1}/{gameQuestions.length}
              </div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                Giao được
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {delivered}
              </div>
            </div>
            <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
              <div className="text-xs font-semibold text-slate-500">
                Nhầm làn
              </div>
              <div className="text-2xl font-extrabold text-rose-700">
                {missed}
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center">
            <div className="w-full rounded-lg border border-sky-100 bg-sky-50 p-6">
              <div className="mb-3 text-sm font-bold uppercase text-sky-700">
                Kiện hàng cần phân loại
              </div>
              <p className="min-h-28 text-center text-2xl font-bold leading-relaxed text-slate-900">
                {currentQuestion?.sentence}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              disabled={feedback !== "idle"}
              className="rounded-lg bg-emerald-600 py-4 text-xl font-extrabold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
              type="button"
            >
              LÀN ĐÚNG
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={feedback !== "idle"}
              className="rounded-lg bg-rose-600 py-4 text-xl font-extrabold text-white shadow-md shadow-rose-100 transition hover:bg-rose-700 active:scale-[0.98] disabled:opacity-60"
              type="button"
            >
              LÀN SAI
            </button>
          </div>

          <div
            className={`mt-5 min-h-12 rounded-lg border px-4 py-3 text-center font-bold ${
              feedback === "right"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : feedback === "wrong"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            {feedback === "right" &&
              "Chính xác. Robot đã giao kiện hàng vào đúng cổng."}
            {feedback === "wrong" && "Chưa đúng. Hãy đọc kỹ kiện tiếp theo."}
            {feedback === "idle" &&
              "Chọn làn ĐÚNG hoặc SAI cho kiện hàng này."}
          </div>
        </section>
      </div>
    </main>
  );
}
