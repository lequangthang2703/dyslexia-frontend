import { useEffect, useState } from "react";
import { useTestStep } from "../../../contexts/TestStepContext";

import { ChevronIcon, ZIcon, RectangleIcon, FaceIcon } from "./icons";
import { ClockFace, TestStats } from "../shared/ClockAndStats";
import type { Direction, Variant, RectangleVariant } from "./icons";

/* ---------------- TYPES & LOGIC HELPERS ---------------- */

export type CardType = {
  id: number;
  type: "chevron" | "z" | "rectangle" | "face";
  direction?: Direction;
  variant?: Variant;
  rectangleVariant?: RectangleVariant;
  isTarget?: boolean;
  found?: boolean;
};

const makeChevron = (
  id: number,
  direction: Direction,
  isTarget = false
): CardType => ({ id, type: "chevron", direction, isTarget, found: false });
const makeZ = (id: number, variant: Variant, isTarget = false): CardType => ({
  id,
  type: "z",
  variant,
  isTarget,
  found: false,
});
const makeRectangle = (
  id: number,
  variant: RectangleVariant,
  isTarget = false
): CardType => ({
  id,
  type: "rectangle",
  rectangleVariant: variant,
  isTarget,
  found: false,
});
const makeFace = (
  id: number,
  variant: Variant,
  isTarget = false
): CardType => ({ id, type: "face", variant, isTarget, found: false });

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeCardCopy = (card: CardType, newId: number): CardType => {
  const copy: CardType = { ...card, id: newId, found: false };
  if (newId >= 100 && newId < 200) {
    copy.isTarget = true;
  } else {
    copy.isTarget = false;
  }
  return copy;
};

const getRandomDirection = (): Direction =>
  shuffle(["up", "down", "left", "right"])[0] as Direction;
const getRandomVariant = (): Variant => shuffle([1, 2, 3, 4])[0] as Variant;
const getRandomRectangleVariant = (): RectangleVariant =>
  shuffle(["tl", "tr", "bl", "br"])[0] as RectangleVariant;

const getIconType = (round: number): CardType["type"] => {
  if (round <= 2) return "chevron";
  if (round <= 4) return "z";
  if (round <= 6) return "rectangle";
  return "face";
};

// Hàm buildCards (Logic tạo thẻ)
const buildCards = (
  roundNum: number
): { target: CardType; cards: CardType[] } => {
  const type = getIconType(roundNum);
  const isOdd = roundNum % 2 === 1;

  let target: CardType;
  let allVariants: CardType[];
  let targetsInSet: CardType[];
  let distractors: CardType[];

  // 1. CHỌN NGẪU NHIÊN MỤC TIÊU (TARGET) VÀ TẠO TẤT CẢ 4 BIẾN THỂ
  if (type === "chevron") {
    const randomDirection = getRandomDirection();
    target = makeChevron(1, randomDirection, true);
    allVariants = [
      target,
      ...(["up", "down", "left", "right"] as Direction[])
        .filter((d) => d !== randomDirection)
        .map((d, i) => makeChevron(i + 2, d)),
    ];
  } else if (type === "z") {
    const randomVariant = getRandomVariant();
    target = makeZ(1, randomVariant, true);
    allVariants = [
      target,
      ...([1, 2, 3, 4] as Variant[])
        .filter((v) => v !== randomVariant)
        .map((v, i) => makeZ(i + 2, v)),
    ];
  } else if (type === "rectangle") {
    const randomVariant = getRandomRectangleVariant();
    target = makeRectangle(1, randomVariant, true);
    allVariants = [
      target,
      ...(["tl", "tr", "bl", "br"] as RectangleVariant[])
        .filter((v) => v !== randomVariant)
        .map((v, i) => makeRectangle(i + 2, v)),
    ];
  } else {
    // type === "face"
    const randomVariant = getRandomVariant();
    target = makeFace(1, randomVariant, true);
    allVariants = [
      target,
      ...([1, 2, 3, 4] as Variant[])
        .filter((v) => v !== randomVariant)
        .map((v, i) => makeFace(i + 2, v)),
    ];
  }

  // 2. TẠO TẬP HỢP THẺ CUỐI CÙNG DỰA TRÊN TARGET NGẪU NHIÊN
  if (isOdd) {
    return { target, cards: shuffle(allVariants) };
  } else {
    targetsInSet = [makeCardCopy(target, 101), makeCardCopy(target, 102)];
    distractors = allVariants.filter((card) => !card.isTarget);

    const extraDistractors = [
      makeCardCopy(distractors[0], 201),
      makeCardCopy(distractors[0], 202),
      makeCardCopy(distractors[0], 203),
      makeCardCopy(distractors[1], 301),
      makeCardCopy(distractors[1], 302),
      makeCardCopy(distractors[2], 401),
      makeCardCopy(distractors[2], 402),
    ];

    return { target, cards: shuffle([...targetsInSet, ...extraDistractors]) };
  }
};

/* ---------------- MAIN COMPONENT ---------------- */
const VisualTest = () => {
  const { currentStep, goToNextStep: contextGoToNextStep } = useTestStep();

  const [targetCard, setTargetCard] = useState<CardType | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [timeLeft, setTimeLeft] = useState(3);
  const [testActive, setTestActive] = useState(false);
  const [testTimeFloat, setTestTimeFloat] = useState(15); // Chỉ dùng float
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<{ wrongId: number | null }>({
    wrongId: null,
  });

  // get current round number (1..8)
  const getCurrentRound = () =>
    currentStep >= 1 && currentStep <= 8 ? currentStep : 1;
  const round = getCurrentRound();
  const isOddRound = round % 2 === 1;
  const totalTargetsInRound = isOddRound ? 1 : 2;

  const goToNextStep = () => {
    // Sử dụng contextGoToNextStep thay vì logic điều hướng cục bộ
    contextGoToNextStep();
  };

  /* --- EFFECTS --- */
  useEffect(() => {
    // Reset state khi chuyển vòng
    setCorrectCount(0);
    setWrongCount(0);
    setFeedback({ wrongId: null });

    const { target, cards: built } = buildCards(round);
    setTargetCard(target);
    setCards(built);
    setTimeLeft(3);
    setTestActive(false);
    setTestTimeFloat(15); // Reset float timer
  }, [currentStep, round]);

  // Xóa hiệu ứng rung và viền đỏ sau 500ms
  useEffect(() => {
    if (feedback.wrongId !== null) {
      const t = setTimeout(
        () => setFeedback((f) => ({ ...f, wrongId: null })),
        500
      );
      return () => clearTimeout(t);
    }
  }, [feedback.wrongId]);

  // 3-second countdown
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined; // Khai báo 't' ở đây

    if (timeLeft > 0) {
      t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    } else {
      setTestActive(true);
      setTestTimeFloat(15); // Đảm bảo timer bắt đầu từ 15
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [timeLeft]);

  // 15-second test timer (FIXED)
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (testActive && testTimeFloat > 0) {
      const start = Date.now();
      const startValue = testTimeFloat;

      intervalId = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        const newTimeFloat = startValue - elapsed;

        // 🚨 FIX: Kiểm tra newTimeFloat <= 0 trước khi cập nhật state
        if (newTimeFloat <= 0) {
          setTestTimeFloat(0);
          clearInterval(intervalId);
          goToNextStep();
          return;
        }

        setTestTimeFloat(newTimeFloat);
      }, 50);
    }
    // 🚨 FIX LỖI ĐỒNG BỘ: Sử dụng currentStep để reset khi chuyển vòng
    return () => clearInterval(intervalId);
  }, [testActive, currentStep]); // testTimeFloat ĐÃ BỊ LOẠI BỎ khỏi dependency

  /* --- HANDLERS --- */
  const handleCardClick = (card: CardType) => {
    if (!testActive) return;

    if (isOddRound) {
      // Logic cũ cho vòng lẻ
      if (card.isTarget) {
        setScore((s) => s + 1);
        setCorrectCount((c) => c + 1);
      } else {
        setWrongCount((w) => w + 1);
      }
      setCards((prev) => shuffle(prev));
      return;
    }

    // LOGIC CHO VÒNG CHẴN
    if (card.isTarget) {
      if (card.found) return;

      setScore((s) => s + 1);

      setCards((prevCards) => {
        const newCards = prevCards.map((c) =>
          c.id === card.id ? { ...c, found: true } : c
        );

        const totalTargetsFound = newCards.filter(
          (c) => c.isTarget && c.found
        ).length;

        if (totalTargetsFound >= totalTargetsInRound) {
          // Nếu tìm thấy hết (2 target): Xáo trộn và reset 'found'
          setCorrectCount((c) => c + 1); // Cập nhật tổng số lần đúng
          return shuffle(newCards.map((c) => ({ ...c, found: false })));
        }

        return newCards;
      });
    } else {
      // Chọn sai
      setWrongCount((w) => w + 1);
      setFeedback({ wrongId: card.id });
    }
  };

  const renderCard = (card: CardType) => {
    switch (card.type) {
      case "chevron":
        return <ChevronIcon direction={card.direction!} size={60} />;
      case "z":
        return <ZIcon variant={card.variant!} size={60} />;
      case "rectangle":
        return <RectangleIcon variant={card.rectangleVariant!} size={60} />;
      case "face":
        return <FaceIcon variant={card.variant!} size={60} />;
    }
  };

  const getCardClassName = (card: CardType) => {
    let className =
      "w-32 h-32 rounded-xl p-2 bg-white transition-all transform hover:scale-105";

    if (feedback.wrongId === card.id) {
      className += " border-4 border-red-500 animate-wiggle";
    } else if (!isOddRound && card.isTarget && card.found) {
      className +=
        " border-4 border-green-500 shadow-lg scale-105 pointer-events-none";
    } else {
      className +=
        " border-2 border-pink-300 hover:bg-pink-100 hover:border-pink-400";
    }

    return className;
  };

  return (
    <div className="flex flex-col bg-white/90 border-4 border-pink-200 p-10 rounded-[2em] items-center space-y-7 shadow-xl max-w-3xl w-full mx-auto">
      {/* Tailwind CSS keyframe for wiggle animation */}
      <style>
        {`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-3px) rotate(0.5deg); }
          40%, 80% { transform: translateX(3px) rotate(-0.5deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.2s ease-in-out;
        }
        `}
      </style>

      <h2 className="text-3xl text-pink-600 font-bold text-center mb-1 drop-shadow font-[Comic Sans MS,cursive,sans-serif]">
        Visual Test
      </h2>

      <div className="w-full">
        <div className="text-pink-500 font-semibold mb-2 text-center text-lg font-[Comic Sans MS,cursive,sans-serif]">
          Round {round} of 8
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full mb-4">
          <div
            className="bg-pink-400 h-2 rounded-full transition-all"
            style={{ width: `${(round / 8) * 100}%` }}
          />
        </div>
      </div>

      <TestStats
        correctCount={correctCount}
        wrongCount={wrongCount}
        score={score}
        testActive={testActive}
      />

      {!testActive ? (
        <div className="text-center">
          <p className="text-lg font-semibold mb-3 font-[Comic Sans MS,cursive,sans-serif]">
            Remember this symbol!
          </p>
          {targetCard && (
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 border-4 border-pink-400 rounded-2xl p-2">
                {renderCard(targetCard)}
              </div>
            </div>
          )}
          <p className="text-pink-600 text-3xl font-bold">{timeLeft}</p>
        </div>
      ) : (
        <div className="w-full">
          {/* ĐÃ SỬA: Thay thế div bằng ClockFace */}
          <div className="flex justify-end items-center mb-6">
            <ClockFace timeLeft={testTimeFloat} totalTime={15} />
          </div>

          <p className="text-center font-semibold mb-4 font-[Comic Sans MS,cursive,sans-serif]">
            Find the symbol and click as many times as possible!
          </p>

          <div
            className={`grid gap-4 ${
              isOddRound ? "grid-cols-2" : "grid-cols-3"
            } justify-items-center`}
          >
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={getCardClassName(card)}
                disabled={!isOddRound && card.isTarget && card.found}
              >
                {renderCard(card)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualTest;
