import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTestResult } from "../../../utils/testResultStorage";

type LanguageCategory =
  | "sound_letter"
  | "tone_mark"
  | "syllable_blending"
  | "word_correction";

type LanguageQuestion = {
  id: string;
  category: LanguageCategory;
  skillLabel: string;
  instruction: string;
  prompt: string;
  audioText?: string;
  options: string[];
  correctAnswer: string;
};

type LanguageAttempt = {
  questionId: string;
  questionIndex: number;
  category: LanguageCategory;
  skillLabel: string;
  prompt: string;
  audioText?: string;
  expectedAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
  reactionTimeMs: number;
  replayCount: number;
  answeredAt: string;
};

type CategorySummary = {
  category: LanguageCategory;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
};

type LanguageTestDetails = {
  totalQuestions: number;
  correctAnswers: number;
  categorySummaries: CategorySummary[];
  attempts: LanguageAttempt[];
};

const QUESTIONS: LanguageQuestion[] = [
  {
    id: "sound-letter-1",
    category: "sound_letter",
    skillLabel: "Nghe âm và chọn tiếng",
    instruction: "Nghe âm thanh, sau đó chọn tiếng em nghe được.",
    prompt: "Âm thanh phát ra là tiếng nào?",
    audioText: "ba",
    options: ["ba", "pa", "da", "bà"],
    correctAnswer: "ba",
  },
  {
    id: "sound-letter-2",
    category: "sound_letter",
    skillLabel: "Nghe âm và chọn tiếng",
    instruction: "Nghe âm thanh, sau đó chọn tiếng em nghe được.",
    prompt: "Âm thanh phát ra là tiếng nào?",
    audioText: "đi",
    options: ["di", "đi", "bi", "ti"],
    correctAnswer: "đi",
  },
  {
    id: "sound-letter-3",
    category: "sound_letter",
    skillLabel: "Nghe âm và chọn tiếng",
    instruction: "Nghe âm thanh, sau đó chọn tiếng em nghe được.",
    prompt: "Âm thanh phát ra là tiếng nào?",
    audioText: "nơ",
    options: ["mơ", "nơ", "rơ", "ngơ"],
    correctAnswer: "nơ",
  },
  {
    id: "tone-mark-1",
    category: "tone_mark",
    skillLabel: "Phân biệt dấu thanh",
    instruction: "Nghe từ, rồi chọn cách viết đúng dấu thanh.",
    prompt: "Từ em nghe được viết như thế nào?",
    audioText: "má",
    options: ["ma", "má", "mà", "mã"],
    correctAnswer: "má",
  },
  {
    id: "tone-mark-2",
    category: "tone_mark",
    skillLabel: "Phân biệt dấu thanh",
    instruction: "Nghe từ, rồi chọn cách viết đúng dấu thanh.",
    prompt: "Từ em nghe được viết như thế nào?",
    audioText: "cỏ",
    options: ["co", "có", "cò", "cỏ"],
    correctAnswer: "cỏ",
  },
  {
    id: "tone-mark-3",
    category: "tone_mark",
    skillLabel: "Phân biệt dấu thanh",
    instruction: "Nghe từ, rồi chọn cách viết đúng dấu thanh.",
    prompt: "Từ em nghe được viết như thế nào?",
    audioText: "bạn",
    options: ["ban", "bán", "bàn", "bạn"],
    correctAnswer: "bạn",
  },
  {
    id: "blend-1",
    category: "syllable_blending",
    skillLabel: "Ghép âm và vần",
    instruction: "Ghép âm đầu với vần để tạo thành tiếng đúng.",
    prompt: "Ghép: c + á",
    options: ["cá", "ca", "cà", "cả"],
    correctAnswer: "cá",
  },
  {
    id: "blend-2",
    category: "syllable_blending",
    skillLabel: "Ghép âm và vần",
    instruction: "Ghép âm đầu với vần để tạo thành tiếng đúng.",
    prompt: "Ghép: m + eo",
    options: ["neo", "meo", "mèo", "mẹo"],
    correctAnswer: "meo",
  },
  {
    id: "blend-3",
    category: "syllable_blending",
    skillLabel: "Ghép âm và vần",
    instruction: "Ghép âm đầu với vần để tạo thành tiếng đúng.",
    prompt: "Ghép: tr + ăng",
    options: ["trăng", "chăng", "tăng", "trăn"],
    correctAnswer: "trăng",
  },
  {
    id: "word-correction-1",
    category: "word_correction",
    skillLabel: "Tìm từ viết đúng",
    instruction: "Chọn từ được viết đúng nhất.",
    prompt: "Con ___ đang kêu meo meo.",
    options: ["mèo", "mẹo", "meo", "mẽo"],
    correctAnswer: "mèo",
  },
  {
    id: "word-correction-2",
    category: "word_correction",
    skillLabel: "Tìm từ viết đúng",
    instruction: "Chọn từ được viết đúng nhất.",
    prompt: "Em đi ___ vào buổi sáng.",
    options: ["học", "hộc", "hoc", "hóc"],
    correctAnswer: "học",
  },
  {
    id: "word-correction-3",
    category: "word_correction",
    skillLabel: "Tìm từ viết đúng",
    instruction: "Chọn từ được viết đúng nhất.",
    prompt: "Quả ___ màu đỏ.",
    options: ["bong", "bóng", "bòng", "bỏng"],
    correctAnswer: "bóng",
  },
];

const categoryOrder: LanguageCategory[] = [
  "sound_letter",
  "tone_mark",
  "syllable_blending",
  "word_correction",
];

const VietnameseLanguageTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const startedAtRef = useRef(new Date().toISOString());
  const questionStartedAtRef = useRef(Date.now());
  const attemptsRef = useRef<LanguageAttempt[]>([]);
  const replayCountsRef = useRef<Record<string, number>>({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercent =
    ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const speakText = useCallback(
    (text: string, countReplay = true) => {
      if (!("speechSynthesis" in window)) return;

      if (countReplay) {
        replayCountsRef.current[text] = (replayCountsRef.current[text] ?? 0) + 1;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      const vietnameseVoice =
        voices.find((voice) => voice.lang.toLowerCase().startsWith("vi")) ??
        voices.find((voice) =>
          voice.name.toLowerCase().includes("vietnamese")
        );

      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  const saveLanguageResult = useCallback(() => {
    const correctAnswers = attemptsRef.current.filter(
      (attempt) => attempt.isCorrect
    ).length;
    const completedAt = new Date().toISOString();
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

    saveTestResult<LanguageTestDetails>("language", {
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
        categorySummaries,
        attempts: attemptsRef.current,
      },
    });
  }, []);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());

    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setFeedback(null);
    questionStartedAtRef.current = Date.now();

    if (currentQuestion.audioText) {
      const timeoutId = window.setTimeout(() => {
        speakText(currentQuestion.audioText!, false);
      }, 450);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [currentQuestion, speakText]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex === QUESTIONS.length - 1) {
      saveLanguageResult();
      navigate("/test/language/rating");
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const replayCount = currentQuestion.audioText
      ? replayCountsRef.current[currentQuestion.audioText] ?? 0
      : 0;

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
        audioText: currentQuestion.audioText,
        expectedAnswer: currentQuestion.correctAnswer,
        selectedAnswer: answer,
        isCorrect,
        reactionTimeMs: Date.now() - questionStartedAtRef.current,
        replayCount,
        answeredAt: new Date().toISOString(),
      },
    ];

    window.setTimeout(goToNextQuestion, 900);
  };

  return (
    <div className="flex flex-col bg-white/90 border-4 border-pink-200 p-6 sm:p-10 rounded-2xl items-center gap-6 shadow-xl max-w-3xl w-full mx-auto">
      <div className="w-full">
        <h1 className="text-3xl text-pink-600 font-bold text-center mb-3">
          Bài Test Ngôn Ngữ Tiếng Việt
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

        {currentQuestion.audioText && (
          <button
            type="button"
            onClick={() => speakText(currentQuestion.audioText!)}
            disabled={isSpeaking || Boolean(selectedAnswer)}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSpeaking ? "Đang phát..." : "Nghe lại"}
          </button>
        )}

        <div className="bg-pink-50 border-2 border-pink-100 rounded-lg px-4 py-5">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {currentQuestion.prompt}
          </p>
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
              disabled={Boolean(selectedAnswer)}
              className={`min-h-16 rounded-lg border-2 px-5 py-4 text-xl font-bold transition ${
                showCorrect
                  ? "bg-green-100 border-green-500 text-green-700"
                  : showIncorrect
                  ? "bg-red-100 border-red-500 text-red-700"
                  : "bg-white border-pink-300 text-gray-900 hover:bg-pink-50 hover:border-pink-500"
              } ${selectedAnswer ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="min-h-7 text-center font-semibold">
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

export default VietnameseLanguageTest;
