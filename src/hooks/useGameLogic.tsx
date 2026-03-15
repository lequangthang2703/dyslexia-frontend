import { useState, useCallback, useMemo, useEffect } from "react";

// --- IMPORTS TYPES (Giữ nguyên đường dẫn của bạn) ---
import type { PlanetTheme } from "../components/tests/minigame4/visuals/PlanetBackground";
import type { MascotEmotion } from "../components/tests/minigame4/visuals/Mascot";

// --- IMPORTS SERVICES & CONFIG ---
// Lưu ý: Import thêm initAI để preload model
import { 
  checkHandwritingAI 
  // Nếu bạn đã export initAI trong file mockAI.ts thì uncomment dòng dưới
  // , initAI 
} from "../components/tests/minigame4/uncheck/services/mockAI"; 

import {
  GAME_CONFIG,
  LETTERS_POOL,
  PRAISE_MESSAGES,
  ENCOURAGE_MESSAGES,
} from "../components/tests/minigame4/uncheck/services/gameConfig";

// --- INTERFACE STATE ---
export interface GameState {
  level: number;
  energy: number;
  targetLetter: string;
  mascotEmotion: MascotEmotion;
  currentTheme: PlanetTheme;
  isBoosting: boolean;
  isProcessing: boolean;
  feedbackMessage: string;
  effectType: "success" | "error" | null;
  
  // State quản lý lượt chơi
  round: number;
  maxRounds: number;
  isGameFinished: boolean;
  correctCount: number;
}

const THEMES: PlanetTheme[] = ["ice", "candy", "jungle"];
const MAX_ROUNDS = 10; // Giới hạn 10 vòng

// --- HELPER: Xáo trộn mảng (Fisher-Yates Shuffle) ---
const shuffleArray = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const useGameLogic = () => {
  // 1. TẠO DANH SÁCH CÂU HỎI (Chạy 1 lần duy nhất khi vào game)
  // Xáo trộn toàn bộ bảng chữ cái để đảm bảo không trùng lặp
  const questionSequence = useMemo(() => shuffleArray(LETTERS_POOL), []);

  // --- STATE ---
  const [level, setLevel] = useState(1);
  const [energy, setEnergy] = useState(0);
  
  // Lấy chữ cái đầu tiên trong danh sách đã xáo trộn
  const [targetLetter, setTargetLetter] = useState(questionSequence[0]);
  
  const [themeIndex, setThemeIndex] = useState(0);
  const [isBoosting, setIsBoosting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("Hãy viết chữ cái bạn nghe được!");
  const [effectType, setEffectType] = useState<"success" | "error" | null>(null);

  const [round, setRound] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const getRandomMsg = (list: string[]) => list[Math.floor(Math.random() * list.length)];

  // --- EFFECT: PRELOAD AI ---
  // Tải model Tiếng Việt ngay khi vào game để lúc bé nộp bài không bị đợi lâu
  useEffect(() => {
    // Nếu trong mockAI.ts bạn có export hàm initAI thì gọi nó ở đây
    // initAI().catch(e => console.error("Lỗi khởi động AI:", e));
    
    // Fallback: Gọi thử 1 lần để Tesseract tải worker (nếu chưa có hàm initAI riêng)
    // checkHandwritingAI("", "a").then(() => console.log("AI Warmup done"));
  }, []);

  // --- HELPER: CHUYỂN CÂU HỎI ---
  const nextQuestion = useCallback(() => {
    // Nếu đã làm xong câu thứ 10 (tức là chuẩn bị sang câu 11) -> KẾT THÚC
    if (round >= MAX_ROUNDS) {
      setIsGameFinished(true);
      setFeedbackMessage("Nhiệm vụ hoàn tất!");
      setMascotEmotion('happy');
      setEffectType('success');
      return; 
    }

    // Tăng số thứ tự vòng chơi
    const nextRound = round + 1;
    setRound(nextRound);

    // Lấy chữ cái tiếp theo trong danh sách đã xáo trộn (index = round mới - 1)
    // Ví dụ: Round 2 thì lấy phần tử index 1
    const nextChar = questionSequence[nextRound - 1];
    
    setTargetLetter(nextChar);
    setMascotEmotion("idle");
    setFeedbackMessage("Hãy viết chữ cái tiếp theo!");
  }, [round, questionSequence]);

  // --- ACTION: XỬ LÝ NỘP BÀI ---
  const handleSubmitAnswer = useCallback(
    async (imageBase64: string) => {
      if (isProcessing || isGameFinished) return;

      setIsProcessing(true);
      setMascotEmotion("thinking");
      setFeedbackMessage("Đang chấm điểm...");
      setEffectType(null);

      try {
        const isCorrect = await checkHandwritingAI(imageBase64, targetLetter);

        if (isCorrect) {
          // === TRƯỜNG HỢP ĐÚNG ===
          setCorrectCount(prev => prev + 1);
          setMascotEmotion("happy");
          setFeedbackMessage(getRandomMsg(PRAISE_MESSAGES));
          setEffectType("success");

          // Cộng năng lượng
          setEnergy((prev) => {
            const newEnergy = prev + GAME_CONFIG.POINTS_PER_CORRECT;
            if (newEnergy >= GAME_CONFIG.MAX_ENERGY) {
              triggerLevelUp(); 
              return GAME_CONFIG.MAX_ENERGY;
            }
            return newEnergy;
          });

          // Nếu không Level Up thì chuyển câu sau 1.5s
          const willLevelUp = (energy + GAME_CONFIG.POINTS_PER_CORRECT) >= GAME_CONFIG.MAX_ENERGY;
          if (!willLevelUp) {
            setTimeout(() => {
              setEffectType(null);
              nextQuestion(); 
            }, GAME_CONFIG.WAIT_TIME_NEXT_QUESTION);
          }

        } else {
          // === TRƯỜNG HỢP SAI (LOGIC MỚI: QUA CÂU LUÔN) ===
          setMascotEmotion("worried");
          setFeedbackMessage("Tiếc quá, chưa đúng rồi!"); 
          setEffectType("error");
          
          // Chờ 1.5s rồi chuyển câu hỏi mới luôn, không cho làm lại
          setTimeout(() => {
            setEffectType(null);
            nextQuestion(); 
          }, GAME_CONFIG.WAIT_TIME_NEXT_QUESTION);
        }

      } finally {
        setIsProcessing(false);
      }
    },
    [targetLetter, isProcessing, isGameFinished, energy, nextQuestion]
  );

  // --- LOGIC: LEVEL UP (Giữ nguyên) ---
  const triggerLevelUp = () => {
    setIsBoosting(true);
    setFeedbackMessage("Năng lượng đầy! Phóng thôiiii!");

    setTimeout(() => {
      setLevel((prev) => prev + 1);
      setEnergy(0);
      setIsBoosting(false);
      setMascotEmotion("idle");
      setEffectType(null);
      setThemeIndex((prev) => (prev + 1) % THEMES.length);
      setFeedbackMessage(`Chào mừng đến Hành tinh số ${level + 1}!`);
      
      nextQuestion();
    }, GAME_CONFIG.WAIT_TIME_LEVEL_UP);
  };

  return {
    gameState: {
      level,
      energy,
      targetLetter,
      mascotEmotion,
      currentTheme: THEMES[themeIndex],
      isBoosting,
      isProcessing,
      feedbackMessage,
      effectType,
      round,
      maxRounds: MAX_ROUNDS,
      isGameFinished,
      correctCount,
    },
    actions: {
      submitAnswer: handleSubmitAnswer,
    },
  };
};