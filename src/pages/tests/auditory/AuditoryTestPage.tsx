// This will be extracted from the existing AuditoryTest.tsx
// For now, we'll use the existing AuditoryTest component
// TODO: Extract the question handling logic from AuditoryTest.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuditorySoundOptionChoice, {
  type AuditorySoundOptionChoiceQuestion,
} from "../../../components/tests/auditory/AuditorySoundOptionChoice";

import A_audio from "../../../assets/audioTestVowel/A.mp3";
import B_audio from "../../../assets/audioTestVowel/B.mp3";
import M_audio from "../../../assets/audioTestVowel/M.mp3";
import N_audio from "../../../assets/audioTestVowel/N.mp3";
import D_audio from "../../../assets/audioTestVowel/D.mp3";
import Đ_audio from "../../../assets/audioTestVowel/Đ.mp3";
import ca_audio from "../../../assets/audioTestVowel/ca.mp3";
import cá_audio from "../../../assets/audioTestVowel/cá.mp3";
import cà_audio from "../../../assets/audioTestVowel/cà.mp3";
import cả_audio from "../../../assets/audioTestVowel/cả.mp3";
import khiAnChuoi_audio from "../../../assets/audioTestVowel/khiAnChuoi.mp3";
import meoAnCa_audio from "../../../assets/audioTestVowel/meoAnCa.mp3";
import choAnXuong_audio from "../../../assets/audioTestVowel/choAnXuong.mp3";
import thichAnKem_vn_audio from "../../../assets/audioTestVowel/thichAnKem_vn.mp3";
import thichAnKem_ko_audio from "../../../assets/audioTestVowel/thichAnKem_ko.mp3.mp3";
import thichAnKem_en_audio from "../../../assets/audioTestVowel/thichAnKem_en.mp3";
import buoiTruaAnBuoiChua_audio from "../../../assets/audioTestVowel/buoiTruaAnBuoiChua.mp3";
import buoiTruaUongSuaChua_audio from "../../../assets/audioTestVowel/buoiTruaUongSuaChua.mp3";

import monkeyBananaImg from "../../../assets/image/testVowels/monkeyBanana.jpg";
import catFishImg from "../../../assets/image/testVowels/catFish.jpg";
import dogBoneImg from "../../../assets/image/testVowels/dogBone.jpg";

import ProgressBar from "../../../components/common/ProgressBar";

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
    audios: [Đ_audio],
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
    audios: [cá_audio],
    options: [{ text: "ca" }, { text: "cá" }, { text: "cà" }, { text: "cả" }],
    correctOptionIndex: 1,
  },
  {
    questionText: "Chọn từ đúng theo âm thanh:",
    audios: [cà_audio],
    options: [{ text: "ca" }, { text: "cá" }, { text: "cà" }, { text: "cả" }],
    correctOptionIndex: 2,
  },
  {
    questionText: "Chọn từ đúng theo âm thanh:",
    audios: [cả_audio],
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

const LC_QUESTION_BANK: AuditorySoundOptionChoiceQuestion[] = [
  {
    questionText: "Đây có phải tiếng Việt không?",
    audios: [thichAnKem_vn_audio],
    options: [{ text: "Đúng" }, { text: "Sai" }],
    correctOptionIndex: 0,
  },
  {
    questionText: "Đây có phải tiếng Việt không?",
    audios: [thichAnKem_ko_audio],
    options: [{ text: "Đúng" }, { text: "Sai" }],
    correctOptionIndex: 1,
  },
  {
    questionText: "Đây có phải tiếng Việt không?",
    audios: [thichAnKem_en_audio],
    options: [{ text: "Đúng" }, { text: "Sai" }],
    correctOptionIndex: 1,
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

const QUESTIONS_INFO = [
	{ module: "PHONOLOGICAL_AWARENESS/1", text: "Nhận thức âm vị" },
	{ module: "PHONOLOGICAL_AWARENESS/2", text: "Nhận thức âm vị" },
	{ module: "DECODING/1", text: "Nhận diện chữ & giải mã" },
	{ module: "DECODING/2", text: "Nhận diện chữ & giải mã" },
	{ module: "UNDERSTANDING_FLUENCY/1", text: "Tốc độ hiểu" },
	{ module: "UNDERSTANDING_FLUENCY/2", text: "Tốc độ hiểu" },
	{ module: "LANGUAGE_COMPREHENSION/1", text: "Hiểu và nhận dạng ngôn ngữ" },
	{ module: "LANGUAGE_COMPREHENSION/2", text: "Hiểu và nhận dạng ngôn ngữ" },
	{
		module: "PHONOLOGICAL_AWARENESS_IN_A_SENTENCE/1",
		text: "Nhận thức âm vị trong câu",
	},
	{
		module: "PHONOLOGICAL_AWARENESS_IN_A_SENTENCE/2",
		text: "Nhận thức âm vị trong câu",
	},
];


const getRandomQuestions = () => {
  const pa_shuffled = PA_QUESTION_BANK.sort(() => 0.5 - Math.random());
  const pa_questions = pa_shuffled.slice(0, 2);

  const d_shuffled_1 = D_QUESTION_BANK.sort(() => 0.5 - Math.random());
  const d_questions_1 = d_shuffled_1.slice(0, 1);

  const d_shuffled_2 = D_QUESTION_BANK_2.sort(() => 0.5 - Math.random());
  const d_questions_2 = d_shuffled_2.slice(0, 1);
  const d_questions = [...d_questions_1, ...d_questions_2];

  const uf_shuffled = UF_QUESTION_BANK.sort(() => 0.5 - Math.random());
  const uf_questions = uf_shuffled.slice(0, 2);

  const lc_shuffled = LC_QUESTION_BANK.sort(() => 0.5 - Math.random());
  const lc_questions = lc_shuffled.slice(0, 2);

  const paias_shuffled = PAIAS_QUESTION_BANK.sort(() => 0.5 - Math.random());
  const paias_questions = paias_shuffled.slice(0, 2);
  return [
    ...pa_questions,
    ...d_questions,
    ...uf_questions,
    ...lc_questions,
    ...paias_questions,
  ];
};

const AuditoryTestPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions] = useState(getRandomQuestions());
  const [score, setScore] = useState(0);

  const updateScore = (isCorrect: boolean) => {
    setScore((s) => s + (isCorrect ? 1 : 0));
  };

  const goToNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex === QUESTIONS_INFO.length - 1) {
      // Last question, go to rating
      navigate("/test/auditory/rating");
    } else {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const currentModule = QUESTIONS_INFO[currentQuestionIndex].module;
  let stepContent;

  switch (currentModule) {
    case "PHONOLOGICAL_AWARENESS/1":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[0]}
        />
      );
      break;
    case "PHONOLOGICAL_AWARENESS/2":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[1]}
        />
      );
      break;
    case "DECODING/1":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[2]}
        />
      );
      break;
    case "DECODING/2":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[3]}
        />
      );
      break;
    case "UNDERSTANDING_FLUENCY/1":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[4]}
        />
      );
      break;
    case "UNDERSTANDING_FLUENCY/2":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[5]}
        />
      );
      break;
    case "LANGUAGE_COMPREHENSION/1":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[6]}
        />
      );
      break;
    case "LANGUAGE_COMPREHENSION/2":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[7]}
        />
      );
      break;
    case "PHONOLOGICAL_AWARENESS_IN_A_SENTENCE/1":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[8]}
        />
      );
      break;
    case "PHONOLOGICAL_AWARENESS_IN_A_SENTENCE/2":
      stepContent = (
        <AuditorySoundOptionChoice
          updateScore={updateScore}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
          question={questions[9]}
        />
      );
      break;
    default:
      stepContent = <div>Unknown question</div>;
  }

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
            {QUESTIONS_INFO[currentQuestionIndex].text} - Câu{" "}
            {currentQuestionIndex + 1} / {QUESTIONS_INFO.length}
          </div>
          <ProgressBar
            currentStep={currentQuestionIndex + 1}
            totalSteps={QUESTIONS_INFO.length}
          />
        </div>

        {/* Score display */}
        <div className="text-center text-sm text-pink-600">
          <span className="font-semibold">
            Điểm số: {score}/{QUESTIONS_INFO.length}
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
              {currentQuestionIndex === QUESTIONS_INFO.length - 1
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
