import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { allWords, vietnameseAlphabet } from "../../../data/minigame3";
import "../../../styles/GameCanvas.css";
import "../../../styles/Tree.css";

type PuzzleChar =
  | string
  | { char: string; status: "empty" | "correct" | "incorrect" };

const getRandomItems = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
};

interface TreeProps {
  progress: number;
  hideProgressBar?: boolean;
}

const Tree = ({ progress, hideProgressBar = false }: TreeProps) => {
  const trunkHeight = (progress / 100) * 250;
  const growthBoost = progress >= 80 ? 1.2 : 1;
  const mainFoliageScale = progress >= 20 ? 1 * growthBoost : 0;
  const leftBranchScale = progress >= 40 ? 1 * growthBoost : 0;
  const rightBranchScale = progress >= 60 ? 1 * growthBoost : 0;
  const fruitScale = progress >= 100 ? 1 : 0;

  return (
    <div className="tree-and-progress">
      <div className="tree-container">
        <div className="ground" />
        <div
          className="trunk"
          style={
            { "--trunk-height": `${trunkHeight}px` } as React.CSSProperties
          }
        />
        <div
          className="foliage foliage-main"
          style={
            {
              "--scale": mainFoliageScale,
              "--trunk-height": `${trunkHeight}px`,
            } as React.CSSProperties
          }
        >
          <div
            className="fruit"
            style={
              {
                top: "30%",
                left: "25%",
                "--fruit-scale": fruitScale,
              } as React.CSSProperties
            }
          ></div>
          <div
            className="fruit"
            style={
              {
                top: "55%",
                left: "70%",
                "--fruit-scale": fruitScale,
              } as React.CSSProperties
            }
          ></div>
        </div>
        <div
          className="foliage foliage-left"
          style={
            {
              "--scale": leftBranchScale,
              "--trunk-height": `${trunkHeight}px`,
            } as React.CSSProperties
          }
        >
          <div
            className="fruit"
            style={
              {
                top: "25%",
                left: "20%",
                "--fruit-scale": fruitScale,
              } as React.CSSProperties
            }
          ></div>
          <div
            className="fruit"
            style={
              {
                top: "60%",
                left: "50%",
                "--fruit-scale": fruitScale,
              } as React.CSSProperties
            }
          ></div>
        </div>
        <div
          className="foliage foliage-right"
          style={
            {
              "--scale": rightBranchScale,
              "--trunk-height": `${trunkHeight}px`,
            } as React.CSSProperties
          }
        >
          <div
            className="fruit"
            style={
              {
                top: "50%",
                left: "45%",
                "--fruit-scale": fruitScale,
              } as React.CSSProperties
            }
          ></div>
        </div>
      </div>
      {!hideProgressBar && (
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

// --- MAIN GAME COMPONENT ---
const MiniGame3: React.FC = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(1);
  const [showIntro, setShowIntro] = useState(true);

  const wordsPerGame = 5;
  const currentWords = useMemo(
    () => getRandomItems(allWords, wordsPerGame),
    [gameId]
  );

  const totalBlanksInGame = useMemo(
    () => currentWords.reduce((acc, word) => acc + word.answer.length, 0),
    [currentWords]
  );
  const [totalCorrectBlanks, setTotalCorrectBlanks] = useState(0);

  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [filledBlanks, setFilledBlanks] = useState<number>(0);
  const [puzzleDisplay, setPuzzleDisplay] = useState<PuzzleChar[]>([]);
  const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);
  const [showFullWord, setShowFullWord] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentWord = useMemo(
    () => currentWords[currentWordIndex],
    [currentWords, currentWordIndex]
  );

  // --- Helper to play System Sounds (Correct/Wrong) ---
  const playSystemSound = (type: "correct" | "wrong") => {
    try {
      const soundPath = `/minigame3/audio/${type}.mp3`;
      const audio = new Audio(soundPath);
      audio.volume = 0.8;
      audio.play().catch((e) => console.error("System sound play failed:", e));
    } catch (error) {
      console.error("Audio setup failed", error);
    }
  };

  const playWordSound = useCallback(() => {
    if (!currentWord) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      const audioFileName = currentWord.img.replace(/\.[^/.]+$/, ".mp3");
      const audioPath = `/minigame3/audio/${audioFileName}`;

      const audio = new Audio(audioPath);
      audioRef.current = audio;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      }
    } catch (error) {
      console.error("Audio setup failed", error);
    }
  }, [currentWord]);

  const loadWord = useCallback(() => {
    if (!currentWord) return;
    setFilledBlanks(0);
    setNextButtonDisabled(true);
    setShowFullWord(false);
    const initialPuzzle: PuzzleChar[] = currentWord.puzzle
      .split("")
      .map((char) => (char === "_" ? { char: "", status: "empty" } : char));
    setPuzzleDisplay(initialPuzzle);
  }, [currentWord]);

  useEffect(() => {
    if (!gameCompleted && currentWord && !showIntro) {
      loadWord();
      const timer = setTimeout(() => {
        playWordSound();
      }, 500);

      return () => clearTimeout(timer);
    } else if (!gameCompleted && currentWord && showIntro) {
      loadWord();
    }
  }, [
    currentWordIndex,
    loadWord,
    gameCompleted,
    currentWord,
    playWordSound,
    showIntro,
  ]);

  // --- Handle Letter Click with Correct/Wrong Sounds ---
  const handleLetterClick = (letter: string) => {
    if (!nextButtonDisabled || gameCompleted || !currentWord || showIntro)
      return;

    const firstEmptyBlankIndex = puzzleDisplay.findIndex(
      (item) => typeof item === "object" && item.status === "empty"
    );

    if (firstEmptyBlankIndex !== -1) {
      const newPuzzleDisplay = [...puzzleDisplay];
      const expectedLetter = currentWord.answer[filledBlanks];
      const isLastWordOfGame = currentWordIndex === currentWords.length - 1;

      if (letter === expectedLetter) {
        // --- CORRECT CASE ---
        playSystemSound("correct");

        (newPuzzleDisplay[firstEmptyBlankIndex] as any) = {
          char: letter,
          status: "correct",
        };
        setFilledBlanks((prev) => prev + 1);

        setTotalCorrectBlanks((prev) => prev + 1);

        const isWordFinished = filledBlanks + 1 === currentWord.answer.length;

        if (isWordFinished) {
          setShowFullWord(true);

          if (isLastWordOfGame) {
            setNextButtonDisabled(true);
            setTimeout(() => {
              setGameCompleted(true);
            }, 2000);
          } else {
            setNextButtonDisabled(false);
          }
        }
      } else {
        // --- INCORRECT CASE ---
        playSystemSound("wrong");

        (newPuzzleDisplay[firstEmptyBlankIndex] as any) = {
          char: letter,
          status: "incorrect",
        };

        setShowFullWord(true);

        if (isLastWordOfGame) {
          setNextButtonDisabled(true);
          setTimeout(() => {
            setGameCompleted(true);
          }, 2000);
        } else {
          setNextButtonDisabled(false);
        }
      }
      setPuzzleDisplay(newPuzzleDisplay);
    }
  };

  const loadNextWord = () => {
    if (currentWordIndex + 1 < currentWords.length) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    }
  };

  const restartGame = () => {
    setGameId((id) => id + 1);
    setCurrentWordIndex(0);
    setGameCompleted(false);
    setTotalCorrectBlanks(0);
  };

  const handleStartGame = () => {
    setShowIntro(false);
  };

  const progressPercentage =
    totalBlanksInGame > 0 ? (totalCorrectBlanks / totalBlanksInGame) * 100 : 0;

  const imagePath = `/minigame3/images/${
    currentWord?.img || "placeholder.jpg"
  }`;

  if (gameCompleted) {
    let resultTitle = "";
    let resultSubtitle = "";

    if (progressPercentage === 100) {
      resultTitle = "Perfect Harvest!";
      resultSubtitle = "You grew a magnificent, full tree!";
    } else if (progressPercentage >= 75) {
      resultTitle = "Excellent Work!";
      resultSubtitle = "Your tree is thriving and beautiful.";
    } else if (progressPercentage >= 40) {
      resultTitle = "Good Effort!";
      resultSubtitle = "Your tree is growing, keep practicing!";
    } else if (progressPercentage > 0) {
      resultTitle = "Nice Try!";
      resultSubtitle = "The tree is small, but it's a start. Try again!";
    } else {
      resultTitle = "Don't Give Up!";
      resultSubtitle = "Let's try again to help the seed grow.";
    }

    return (
      <div className="flex flex-col items-center justify-between p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-sky-200 text-slate-800 relative">
        <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-white rounded-full opacity-30 blur-2xl z-0"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-24 bg-white rounded-full opacity-20 blur-xl z-0"></div>

        <div className="text-center z-10">
          <h1 className="text-5xl font-extrabold text-blue-800 drop-shadow-md mb-2">
            {resultTitle}
          </h1>
          <p className="text-xl text-blue-700 font-medium">{resultSubtitle}</p>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-6xl mb-8 z-10">
          <div className="transform transition hover:scale-105 duration-300">
            <Tree progress={progressPercentage} hideProgressBar={true} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 z-10">
          <button
            className="py-4 px-10 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xl font-bold rounded-full shadow-xl shadow-blue-300 transform transition hover:-translate-y-1 active:translate-y-0.5"
            onClick={restartGame}
          >
            Plant New Tree
          </button>

          <button
            className="py-4 px-10 bg-white/80 hover:bg-white text-blue-700 font-semibold rounded-full border-2 border-blue-200 hover:border-blue-300 transition-colors shadow-md"
            onClick={() => navigate("/training")}
          >
            Kết thúc
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="game-wrapper">
      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-500">
          <h1 className="absolute top-10 text-4xl font-bold text-white drop-shadow-lg">
            Minigame 3: <span className="text-green-400">Cây Thần Kỳ🌳</span>
          </h1>
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full relative animate-[fadeInUp_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center drop-shadow-sm">
              Hướng dẫn chơi
            </h2>

            <div className="space-y-6 text-lg text-slate-700 mb-8 px-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                  1
                </div>
                <p className="leading-tight pt-0.5">
                  Nhìn hình ảnh minh họa và lắng nghe âm thanh của từ.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                  2
                </div>
                <p className="leading-tight pt-0.5">
                  Chọn các chữ cái trên màn hình để điền vào chỗ trống cho đúng.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                  3
                </div>
                <p className="leading-tight pt-0.5">
                  Mỗi câu trả lời đúng sẽ giúp{" "}
                  <span className="font-bold text-green-600">
                    Cây Thần Kỳ🌳
                  </span>{" "}
                  của bạn lớn lên!
                </p>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white text-xl font-bold rounded-full shadow-lg shadow-blue-200 transform transition hover:-translate-y-1 active:translate-y-0.5"
            >
              Bắt đầu ngay!
            </button>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/training")}>
        ❮ Quay lại
      </button>

      <div className="game-container">
        <div className="left-panel">
          <div
            className={`image-container ${
              showFullWord ? "show-full-word" : ""
            }`}
          >
            <img
              src={imagePath}
              alt={currentWord.full}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/350x280/e0e0e0/757575?text=Image+Missing";
              }}
            />
            <p>{currentWord.full}</p>
          </div>

          <div className="puzzle-platform">
            {puzzleDisplay.map((item, index) => {
              if (typeof item === "string") {
                if (item === " ") {
                  return <span key={index} className="puzzle-space"></span>;
                }
                return (
                  <span key={index} className="puzzle-char">
                    {item}
                  </span>
                );
              }
              return (
                <span key={index} className={`puzzle-blank ${item.status}`}>
                  {item.char}
                </span>
              );
            })}
          </div>
        </div>

        <div className="middle-panel">
          <div className="keyboard-container">
            {vietnameseAlphabet.map((letter) => (
              <button
                key={letter}
                className="keyboard-button"
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="controls-container">
            <button className="control-btn sound-btn" onClick={playWordSound}>
              🔊
            </button>
            <button
              className="control-btn next-btn"
              onClick={loadNextWord}
              disabled={nextButtonDisabled}
            >
              Next ➔
            </button>
          </div>
        </div>

        <div className="right-panel">
          <div className="progress-info">
            <div className="word-counter">
              Word {currentWordIndex + 1} / {currentWords.length}
            </div>
          </div>
          <Tree progress={progressPercentage} />
        </div>
      </div>
    </div>
  );
};

export default MiniGame3;
