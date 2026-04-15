import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTestResult } from "../../../utils/testResultStorage";

type VisualCategory =
  | "letter_confusion"
  | "visual_search"
  | "word_discrimination"
  | "visual_memory";

type VisualQuestion = {
  id: string;
  category: VisualCategory;
  skillLabel: string;
  instruction: string;
  prompt: string;
  cue?: string;
  grid?: string[];
  options: string[];
  correctAnswer: string;
  hideCueAfterMs?: number;
};

type VisualAttempt = {
  questionId: string;
  questionIndex: number;
  category: VisualCategory;
  skillLabel: string;
  prompt: string;
  cue?: string;
  grid?: string[];
  expectedAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
  reactionTimeMs: number;
  answeredAt: string;
};

type CategorySummary = {
  category: VisualCategory;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
};

type VisualTestDetails = {
  totalQuestions: number;
  correctAnswers: number;
  averageReactionTimeMs: number;
  categorySummaries: CategorySummary[];
  attempts: VisualAttempt[];
};

const QUESTIONS: VisualQuestion[] = [
  {
    id: "letter-confusion-1",
    category: "letter_confusion",
    skillLabel: "Phân biệt chữ dễ nhầm",
    instruction: "Nhìn chữ mẫu và chọn chữ giống hệt.",
    prompt: "Chọn chữ giống mẫu:",
    cue: "b",
    options: ["b", "d", "p", "q"],
    correctAnswer: "b",
  },
  {
    id: "letter-confusion-2",
    category: "letter_confusion",
    skillLabel: "Phân biệt chữ dễ nhầm",
    instruction: "Nhìn chữ mẫu và chọn chữ giống hệt.",
    prompt: "Chọn chữ giống mẫu:",
    cue: "d",
    options: ["p", "b", "d", "q"],
    correctAnswer: "d",
  },
  {
    id: "letter-confusion-3",
    category: "letter_confusion",
    skillLabel: "Phân biệt chữ dễ nhầm",
    instruction: "Nhìn chữ mẫu và chọn chữ giống hệt.",
    prompt: "Chọn chữ giống mẫu:",
    cue: "n",
    options: ["m", "u", "n", "h"],
    correctAnswer: "n",
  },
  {
    id: "visual-search-1",
    category: "visual_search",
    skillLabel: "Tìm chữ trong dãy nhiễu",
    instruction: "Đếm số lần chữ mục tiêu xuất hiện trong bảng.",
    prompt: "Có bao nhiêu chữ m?",
    cue: "m",
    grid: ["n", "m", "n", "m", "u", "n", "m", "n", "u", "m", "n", "n"],
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
  },
  {
    id: "visual-search-2",
    category: "visual_search",
    skillLabel: "Tìm chữ trong dãy nhiễu",
    instruction: "Đếm số lần chữ mục tiêu xuất hiện trong bảng.",
    prompt: "Có bao nhiêu chữ q?",
    cue: "q",
    grid: ["p", "q", "d", "p", "q", "b", "p", "d", "q", "p", "b", "d"],
    options: ["1", "2", "3", "4"],
    correctAnswer: "3",
  },
  {
    id: "visual-search-3",
    category: "visual_search",
    skillLabel: "Tìm chữ trong dãy nhiễu",
    instruction: "Đếm số lần chữ mục tiêu xuất hiện trong bảng.",
    prompt: "Có bao nhiêu chữ a?",
    cue: "a",
    grid: ["a", "e", "o", "a", "ă", "â", "e", "a", "o", "ă", "a", "e"],
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
  },
  {
    id: "word-discrimination-1",
    category: "word_discrimination",
    skillLabel: "Phân biệt từ gần giống",
    instruction: "Chọn từ giống hệt từ mẫu.",
    prompt: "Từ mẫu:",
    cue: "cá",
    options: ["ca", "cá", "cà", "cả"],
    correctAnswer: "cá",
  },
  {
    id: "word-discrimination-2",
    category: "word_discrimination",
    skillLabel: "Phân biệt từ gần giống",
    instruction: "Chọn từ giống hệt từ mẫu.",
    prompt: "Từ mẫu:",
    cue: "bạn",
    options: ["ban", "bàn", "bạn", "bán"],
    correctAnswer: "bạn",
  },
  {
    id: "word-discrimination-3",
    category: "word_discrimination",
    skillLabel: "Phân biệt từ gần giống",
    instruction: "Chọn từ giống hệt từ mẫu.",
    prompt: "Từ mẫu:",
    cue: "mẹo",
    options: ["mèo", "meo", "mẹo", "mẽo"],
    correctAnswer: "mẹo",
  },
  {
    id: "visual-memory-1",
    category: "visual_memory",
    skillLabel: "Nhớ chuỗi chữ ngắn",
    instruction: "Nhìn chuỗi mẫu trong 2 giây, sau đó chọn lại đúng chuỗi.",
    prompt: "Ghi nhớ chuỗi này:",
    cue: "b d p",
    options: ["b d p", "d b p", "b p d", "p d b"],
    correctAnswer: "b d p",
    hideCueAfterMs: 2000,
  },
  {
    id: "visual-memory-2",
    category: "visual_memory",
    skillLabel: "Nhớ chuỗi chữ ngắn",
    instruction: "Nhìn chuỗi mẫu trong 2 giây, sau đó chọn lại đúng chuỗi.",
    prompt: "Ghi nhớ chuỗi này:",
    cue: "m n u",
    options: ["n m u", "m n u", "m u n", "u n m"],
    correctAnswer: "m n u",
    hideCueAfterMs: 2000,
  },
  {
    id: "visual-memory-3",
    category: "visual_memory",
    skillLabel: "Nhớ chuỗi chữ ngắn",
    instruction: "Nhìn chuỗi mẫu trong 2 giây, sau đó chọn lại đúng chuỗi.",
    prompt: "Ghi nhớ chuỗi này:",
    cue: "cá cà cả",
    options: ["cá cà cả", "ca cá cả", "cà cá cả", "cá cả cà"],
    correctAnswer: "cá cà cả",
    hideCueAfterMs: 2200,
  },
];

const categoryOrder: VisualCategory[] = [
  "letter_confusion",
  "visual_search",
  "word_discrimination",
  "visual_memory",
];

const VietnameseVisualTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [showCue, setShowCue] = useState(true);
  const startedAtRef = useRef(new Date().toISOString());
  const questionStartedAtRef = useRef(Date.now());
  const attemptsRef = useRef<VisualAttempt[]>([]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercent =
    ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const canAnswer = !currentQuestion.hideCueAfterMs || !showCue;

  const saveVisualResult = useCallback(() => {
    const correctAnswers = attemptsRef.current.filter(
      (attempt) => attempt.isCorrect
    ).length;
    const completedAt = new Date().toISOString();
    const reactionTimes = attemptsRef.current.map(
      (attempt) => attempt.reactionTimeMs
    );
    const averageReactionTimeMs =
      reactionTimes.length > 0
        ? Math.round(
            reactionTimes.reduce((sum, value) => sum + value, 0) /
              reactionTimes.length
          )
        : 0;
    const categorySummaries = categoryOrder.map((category) => {
      const questionsInCategory = QUESTIONS.filter(
        (question) => question.category === category
      );
      const correctInCategory = attemptsRef.current.filter(
        (attempt) => attempt.category === category && attempt.isCorrect
      ).length;

      return {
        category,
        totalQuestions: questionsInCategory.length,
        correctAnswers: correctInCategory,
        score: Math.round(
          (correctInCategory / questionsInCategory.length) * 100
        ),
      };
    });

    saveTestResult<VisualTestDetails>("visual", {
      score: (correctAnswers / QUESTIONS.length) * 100,
      rawScore: correctAnswers,
      maxScore: QUESTIONS.length,
      startedAt: startedAtRef.current,
      completedAt,
      durationMs:
        new Date(completedAt).getTime() -
        new Date(startedAtRef.current).getTime(),
      details: {
        totalQuestions: QUESTIONS.length,
        correctAnswers,
        averageReactionTimeMs,
        categorySummaries,
        attempts: attemptsRef.current,
      },
    });
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setFeedback(null);
    setShowCue(true);
    questionStartedAtRef.current = Date.now();

    if (currentQuestion.hideCueAfterMs) {
      const timeoutId = window.setTimeout(() => {
        setShowCue(false);
        questionStartedAtRef.current = Date.now();
      }, currentQuestion.hideCueAfterMs);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [currentQuestion]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex === QUESTIONS.length - 1) {
      saveVisualResult();
      navigate("/test/visual/rating");
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || !canAnswer) return;

    const isCorrect = answer === currentQuestion.correctAnswer;

    setSelectedAnswer(answer);
    setFeedback(isCorrect ? "correct" : "incorrect");

    attemptsRef.current = [
      ...attemptsRef.current,
      {
        questionId: currentQuestion.id,
        questionIndex: currentQuestionIndex,
        category: currentQuestion.category,
        skillLabel: currentQuestion.skillLabel,
        prompt: currentQuestion.prompt,
        cue: currentQuestion.cue,
        grid: currentQuestion.grid,
        expectedAnswer: currentQuestion.correctAnswer,
        selectedAnswer: answer,
        isCorrect,
        reactionTimeMs: Date.now() - questionStartedAtRef.current,
        answeredAt: new Date().toISOString(),
      },
    ];

    window.setTimeout(goToNextQuestion, 900);
  };

  return (
    <div className="flex flex-col bg-white/90 border-4 border-pink-200 p-6 sm:p-10 rounded-2xl items-center gap-6 shadow-xl max-w-3xl w-full mx-auto">
      <div className="w-full">
        <h1 className="text-3xl text-pink-600 font-bold text-center mb-3">
          Bài Test Thị Giác Chữ
        </h1>
        <div className="flex justify-between text-sm sm:text-base text-pink-600 font-semibold mb-2">
          <span>{currentQuestion.skillLabel}</span>
          <span>
            Câu {currentQuestionIndex + 1}/{QUESTIONS.length}
          </span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full">
          <div
            className="h-2 bg-pink-400 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="w-full text-center space-y-4">
        <p className="text-gray-700 font-semibold">
          {currentQuestion.instruction}
        </p>

        <div className="bg-pink-50 border-2 border-pink-100 rounded-lg px-4 py-5 min-h-28 flex flex-col items-center justify-center gap-3">
          <p className="text-xl font-semibold text-gray-700">
            {currentQuestion.prompt}
          </p>

          {currentQuestion.cue && (
            <div className="min-h-14 flex items-center justify-center">
              {showCue ? (
                <span className="text-5xl font-bold text-gray-950 tracking-normal">
                  {currentQuestion.cue}
                </span>
              ) : (
                <span className="text-lg font-semibold text-gray-500">
                  Chọn lại chuỗi em vừa thấy
                </span>
              )}
            </div>
          )}

          {currentQuestion.grid && (
            <div className="grid grid-cols-4 gap-2">
              {currentQuestion.grid.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="w-12 h-12 rounded-lg border-2 border-pink-200 bg-white flex items-center justify-center text-2xl font-bold"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;
          const showCorrect = selectedAnswer && isCorrectAnswer;
          const showIncorrect = isSelected && !isCorrectAnswer;

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswer(option)}
              disabled={Boolean(selectedAnswer) || !canAnswer}
              className={`min-h-16 rounded-lg border-2 px-5 py-4 text-xl font-bold transition ${
                showCorrect
                  ? "bg-green-100 border-green-500 text-green-700"
                  : showIncorrect
                  ? "bg-red-100 border-red-500 text-red-700"
                  : "bg-white border-pink-300 text-gray-900 hover:bg-pink-50 hover:border-pink-500"
              } ${
                selectedAnswer || !canAnswer
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="min-h-7 text-center font-semibold">
        {!canAnswer && (
          <span className="text-pink-700">Ghi nhớ mẫu trước khi chọn</span>
        )}
        {feedback === "correct" && (
          <span className="text-green-700">Chính xác</span>
        )}
        {feedback === "incorrect" && (
          <span className="text-red-700">
            Đáp án đúng là: {currentQuestion.correctAnswer}
          </span>
        )}
      </div>
    </div>
  );
};

export default VietnameseVisualTest;
