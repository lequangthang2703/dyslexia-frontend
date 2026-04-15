// This will be extracted from the existing AuditoryTest.tsx
// For now, we'll use the existing AuditoryTest component
// TODO: Extract the question handling logic from AuditoryTest.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuditorySoundOptionChoice, {
  type AuditoryAnswerTelemetry,
  type AuditorySoundOptionChoiceQuestion,
} from "../../../components/tests/auditory/AuditorySoundOptionChoice";

import A_audio from "../../../assets/audioTestVowel/A.mp3";
import B_audio from "../../../assets/audioTestVowel/B.mp3";
import M_audio from "../../../assets/audioTestVowel/M.mp3";
import N_audio from "../../../assets/audioTestVowel/N.mp3";
import D_audio from "../../../assets/audioTestVowel/D.mp3";
import DD_audio from "../../../assets/audioTestVowel/Đ.mp3";
import ca_audio from "../../../assets/audioTestVowel/ca.mp3";
import ca_sac_audio from "../../../assets/audioTestVowel/cá.mp3";
import ca_huyen_audio from "../../../assets/audioTestVowel/cà.mp3";
import ca_hoi_audio from "../../../assets/audioTestVowel/cả.mp3";
import khiAnChuoi_audio from "../../../assets/audioTestVowel/khiAnChuoi.mp3";
import meoAnCa_audio from "../../../assets/audioTestVowel/meoAnCa.mp3";
import choAnXuong_audio from "../../../assets/audioTestVowel/choAnXuong.mp3";
import buoiTruaAnBuoiChua_audio from "../../../assets/audioTestVowel/buoiTruaAnBuoiChua.mp3";
import buoiTruaUongSuaChua_audio from "../../../assets/audioTestVowel/buoiTruaUongSuaChua.mp3";

import monkeyBananaImg from "../../../assets/image/testVowels/monkeyBanana.jpg";
import catFishImg from "../../../assets/image/testVowels/catFish.jpg";
import dogBoneImg from "../../../assets/image/testVowels/dogBone.jpg";

import ProgressBar from "../../../components/common/ProgressBar";
import { saveTestResult } from "../../../utils/testResultStorage";

// Question banks (copied from AuditoryTest.tsx)
const PA_QUESTION_BANK: AuditorySoundOptionChoiceQuestion[] = [
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [A_audio, A_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [A_audio, B_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 1,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [B_audio, B_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [B_audio, A_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 1,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [M_audio, M_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [M_audio, N_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 1,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [N_audio, N_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Hai âm này có giống nhau không?",
    audios: [N_audio, M_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 1,
  },
];

const D_QUESTION_BANK: AuditorySoundOptionChoiceQuestion[] = [
  {
    questionText: "Chọn chữ cái đúng theo âm thanh:",
    audios: [D_audio],
    options: [{ text: "D" }, { text: "Đ" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Chọn chữ cái đúng theo âm thanh:",
    audios: [DD_audio],
    options: [{ text: "D" }, { text: "Đ" }],
    correctOptionIndex: 1,
  },
];

const D_QUESTION_BANK_2: AuditorySoundOptionChoiceQuestion[] = [
  {
    questionText: "Chọn từ đúng theo âm thanh:",
    audios: [ca_audio],
    options: [{ text: "ca" }, { text: "cá" }, { text: "cà" }, { text: "cả" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Chọn từ đúng theo âm thanh:",
    audios: [ca_sac_audio],
    options: [{ text: "ca" }, { text: "cá" }, { text: "cà" }, { text: "cả" }],
    correctOptionIndex: 1,
  },
  {
    questionText: "Chọn từ đúng theo âm thanh:",
    audios: [ca_huyen_audio],
    options: [{ text: "ca" }, { text: "cá" }, { text: "cà" }, { text: "cả" }],
    correctOptionIndex: 2,
  },
  {
    questionText: "Chọn từ đúng theo âm thanh:",
    audios: [ca_hoi_audio],
    options: [{ text: "ca" }, { text: "cá" }, { text: "cà" }, { text: "cả" }],
    correctOptionIndex: 3,
  },
];

const UF_QUESTION_BANK: AuditorySoundOptionChoiceQuestion[] = [
  {
    questionText: "Chọn câu đang được phát âm:",
    audios: [khiAnChuoi_audio],
    options: [
      { text: "Khỉ ăn chuối", image: monkeyBananaImg },
      { text: "Mèo ăn cá", image: catFishImg },
      { text: "Chó ăn xương", image: dogBoneImg },
    ],
    correctOptionIndex: 0,
  },
  {
    questionText: "Chọn câu đang được phát âm:",
    audios: [meoAnCa_audio],
    options: [
      { text: "Khỉ ăn chuối", image: monkeyBananaImg },
      { text: "Mèo ăn cá", image: catFishImg },
      { text: "Chó ăn xương", image: dogBoneImg },
    ],
    correctOptionIndex: 1,
  },
  {
    questionText: "Chọn câu đang được phát âm:",
    audios: [choAnXuong_audio],
    options: [
      { text: "Khỉ ăn chuối", image: monkeyBananaImg },
      { text: "Mèo ăn cá", image: catFishImg },
      { text: "Chó ăn xương", image: dogBoneImg },
    ],
    correctOptionIndex: 2,
  },
];


const PAIAS_QUESTION_BANK: AuditorySoundOptionChoiceQuestion[] = [
  {
    questionText: "Hai câu này có giống nhau không?",
    audios: [buoiTruaAnBuoiChua_audio, buoiTruaAnBuoiChua_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Hai câu này có giống nhau không?",
    audios: [buoiTruaUongSuaChua_audio, buoiTruaUongSuaChua_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Hai câu này có giống nhau không?",
    audios: [buoiTruaAnBuoiChua_audio, buoiTruaUongSuaChua_audio],
    options: [{ text: "Giống nhau" }, { text: "Khác nhau" }],
    correctOptionIndex: 1,
  },
];


const AUDITORY_QUESTIONS_INFO = [
  { module: "PHONOLOGICAL_AWARENESS/1", text: "Nhận thức âm vị" },
  { module: "PHONOLOGICAL_AWARENESS/2", text: "Nhận thức âm vị" },
  { module: "PHONOLOGICAL_AWARENESS/3", text: "Nhận thức âm vị" },
  { module: "LETTER_SOUND_DECODING/1", text: "Liên kết âm và chữ" },
  { module: "LETTER_SOUND_DECODING/2", text: "Liên kết âm và chữ" },
  { module: "TONE_DISCRIMINATION/1", text: "Phân biệt dấu thanh" },
  { module: "TONE_DISCRIMINATION/2", text: "Phân biệt dấu thanh" },
  { module: "TONE_DISCRIMINATION/3", text: "Phân biệt dấu thanh" },
  { module: "UNDERSTANDING_FLUENCY/1", text: "Nghe hiểu câu" },
  { module: "UNDERSTANDING_FLUENCY/2", text: "Nghe hiểu câu" },
  {
    module: "PHONOLOGICAL_AWARENESS_IN_A_SENTENCE/1",
    text: "Nhận thức âm vị trong câu",
  },
  {
    module: "PHONOLOGICAL_AWARENESS_IN_A_SENTENCE/2",
    text: "Nhận thức âm vị trong câu",
  },
];

type AuditoryAttempt = {
  questionIndex: number;
  module: string;
  moduleLabel: string;
  questionText: string;
  audioCount: number;
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  reactionTimeMs: number;
  replayCount: number;
  answeredAt: string;
};

type AuditoryTestDetails = {
  questionCount: number;
  correctCount: number;
  categorySummaries: {
    module: string;
    label: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
  }[];
  attempts: AuditoryAttempt[];
};


const shuffleQuestions = (questions: AuditorySoundOptionChoiceQuestion[]) =>
  [...questions].sort(() => 0.5 - Math.random());

const getRandomQuestions = () => {
  const pa_questions = shuffleQuestions(PA_QUESTION_BANK).slice(0, 3);
  const d_questions_1 = shuffleQuestions(D_QUESTION_BANK).slice(0, 2);
  const d_questions_2 = shuffleQuestions(D_QUESTION_BANK_2).slice(0, 3);
  const uf_questions = shuffleQuestions(UF_QUESTION_BANK).slice(0, 2);
  const paias_questions = shuffleQuestions(PAIAS_QUESTION_BANK).slice(0, 2);

  return [
    ...pa_questions,
    ...d_questions_1,
    ...d_questions_2,
    ...uf_questions,
    ...paias_questions,
  ];
};

const AuditoryTestPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions] = useState(getRandomQuestions());
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<AuditoryAttempt[]>([]);
  const [startedAt] = useState(() => new Date().toISOString());

  const updateScore = (isCorrect: boolean) => {
    setScore((s) => s + (isCorrect ? 1 : 0));
  };

  const recordAnswer = (
    questionIndex: number,
    telemetry: AuditoryAnswerTelemetry
  ) => {
    const question = questions[questionIndex];
    const info = AUDITORY_QUESTIONS_INFO[questionIndex];

    const attempt: AuditoryAttempt = {
      questionIndex,
      module: info.module,
      moduleLabel: info.text,
      questionText: question.questionText,
      audioCount: question.audios.length,
      options: question.options.map((option) => option.text),
      correctOptionIndex: question.correctOptionIndex,
      selectedOptionIndex: telemetry.selectedOptionIndex,
      isCorrect: telemetry.isCorrect,
      reactionTimeMs: telemetry.reactionTimeMs,
      replayCount: telemetry.replayCount,
      answeredAt: telemetry.answeredAt,
    };

    setAttempts((previousAttempts) =>
      [
        ...previousAttempts.filter((item) => item.questionIndex !== questionIndex),
        attempt,
      ].sort((a, b) => a.questionIndex - b.questionIndex)
    );
  };

  const saveAuditoryResult = () => {
    const correctCount = attempts.filter((attempt) => attempt.isCorrect).length;
    const finalScore = (correctCount / AUDITORY_QUESTIONS_INFO.length) * 100;
    const categorySummaries = AUDITORY_QUESTIONS_INFO.reduce<
      AuditoryTestDetails["categorySummaries"]
    >((summaries, info) => {
      const module = info.module.split("/")[0];
      if (summaries.some((summary) => summary.module === module)) {
        return summaries;
      }

      const moduleAttempts = attempts.filter((attempt) =>
        attempt.module.startsWith(module)
      );
      const correctAnswers = moduleAttempts.filter(
        (attempt) => attempt.isCorrect
      ).length;

      summaries.push({
        module,
        label: info.text,
        totalQuestions: moduleAttempts.length,
        correctAnswers,
        score:
          moduleAttempts.length > 0
            ? Math.round((correctAnswers / moduleAttempts.length) * 100)
            : 0,
      });

      return summaries;
    }, []);
    const completedAt = new Date().toISOString();

    saveTestResult<AuditoryTestDetails>("auditory", {
      score: finalScore,
      rawScore: correctCount,
      maxScore: AUDITORY_QUESTIONS_INFO.length,
      startedAt,
      completedAt,
      durationMs: new Date(completedAt).getTime() - new Date(startedAt).getTime(),
      details: {
        questionCount: AUDITORY_QUESTIONS_INFO.length,
        correctCount,
        categorySummaries,
        attempts,
      },
    });
  };

  const goToNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex === AUDITORY_QUESTIONS_INFO.length - 1) {
      saveAuditoryResult();
      // Last question, go to rating
      navigate("/test/auditory/rating");
    } else {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const stepContent = currentQuestion ? (
    <AuditorySoundOptionChoice
      updateScore={updateScore}
      showFeedback={showFeedback}
      setShowFeedback={setShowFeedback}
      question={currentQuestion}
      onAnswer={(telemetry) => recordAnswer(currentQuestionIndex, telemetry)}
    />
  ) : (
    <div>Unknown question</div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-cyan p-8 rounded-2xl">
      <div className="sm: min-w-sm flex flex-col bg-white/90 border-4 border-pink-200 p-10 rounded-2xl items-center space-y-7 shadow-xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl text-pink-600 font-bold text-center mb-1 drop-shadow font-[Comic Sans MS,cursive,sans-serif]">
          Bài Test Ngôn Ngữ Thính Giác
        </h2>

        {/* Progress */}
        <div className="w-full">
          <div className="text-pink-500 font-semibold mb-2 text-center text-lg font-[Comic Sans MS,cursive,sans-serif]">
            {AUDITORY_QUESTIONS_INFO[currentQuestionIndex].text} - Câu{" "}
            {currentQuestionIndex + 1} / {AUDITORY_QUESTIONS_INFO.length}
          </div>
          <ProgressBar
            currentStep={currentQuestionIndex + 1}
            totalSteps={AUDITORY_QUESTIONS_INFO.length}
          />
        </div>

        {/* Score display */}
        <div className="text-center text-sm text-pink-600">
          <span className="font-semibold">
            Điểm số: {score}/{AUDITORY_QUESTIONS_INFO.length}
          </span>
        </div>

        {/* Step Content */}
        <div className="w-full">{stepContent}</div>

        {/* Next button */}
        {showFeedback && (
          <div className="flex justify-center mt-6">
            <button
              onClick={goToNextQuestion}
              className="px-8 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition text-lg"
            >
              {currentQuestionIndex === AUDITORY_QUESTIONS_INFO.length - 1
                ? "Hoàn thành"
                : "Câu tiếp theo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditoryTestPage;