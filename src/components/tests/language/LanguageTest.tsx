import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Shuffle helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type LetterTest = {
  title: string;
  type: "letters";
  questions: string[];
  sounds: Record<string, string>;
};

type RemoveTest = {
  title: string;
  type: "removeLetter";
  questions: { wrong: string; correct: string }[];
};

type AddTest = {
  title: string;
  type: "addLetter";
  questions: { wrong: string; correct: string }[];
};

type ReplaceTest = {
  title: string;
  type: "replaceLetter";
  questions: { wrong: string; correct: string }[];
};

type Test = LetterTest | RemoveTest | AddTest | ReplaceTest;

const LanguageTest: React.FC = () => {
  const navigate = useNavigate();
  // Tests
  const tests: Test[] = [
    {
      title: "Test 1: Vowels",
      type: "letters",
      questions: ["A", "E", "I", "O", "U"],
      sounds: { A: "A", E: "E", I: "I", O: "O", U: "U" },
    },
    {
      title: "Test 2: Consonants",
      type: "letters",
      questions: ["B", "Q", "P", "D"],
      sounds: { B: "B", Q: "Q", P: "P", D: "D" },
    },
    {
      title: "Test 3: Listen and choose the correct letter (alphabet)",
      type: "letters",
      questions: Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
      sounds: Object.fromEntries(
        Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((ch) => [ch, ch])
      ),
    },
    {
      title: "Test 4: Remove 1 letter to fix the spelling",
      type: "removeLetter",
      questions: [
        { wrong: "appple", correct: "apple" },
        { wrong: "bananna", correct: "banana" },
        { wrong: "occassion", correct: "occasion" },
        { wrong: "commmittee", correct: "committee" },
      ],
    },
    {
      title: "Test 5: Add 1 letter to fix the spelling",
      type: "addLetter",
      questions: [
        { wrong: "frind", correct: "friend" },
        { wrong: "schoo", correct: "school" },
        { wrong: "gardn", correct: "garden" },
        { wrong: "widow", correct: "window" },
      ],
    },
    {
      title: "Test 6: Replace 1 letter with the given letters to fix the spelling",
      type: "replaceLetter",
      questions: [
        { wrong: "planit", correct: "planet" },
        { wrong: "castee", correct: "castle" },
        { wrong: "bridga", correct: "bridge" },
        { wrong: "bottli", correct: "bottle" },
      ],
    },
  ];

  // State
  const [testIndex, setTestIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showTransition, setShowTransition] = useState(false);
  const [inputLetter, setInputLetter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentTest = tests[testIndex] as Test;
  const currentQuestion =
    (currentTest.type === "removeLetter" ||
      currentTest.type === "addLetter" ||
      currentTest.type === "replaceLetter") &&
    currentTest.questions.length > 0
      ? currentTest.questions[currentIndex]
      : null;
  const correctAnswer =
    currentTest.type === "letters" ? shuffledQuestions[currentIndex] : null;

  // Shuffle questions when switching test
  useEffect(() => {
    if (currentTest.type === "letters") {
      setShuffledQuestions(shuffleArray(currentTest.questions));
    }
    setCurrentIndex(0);
    setInputLetter("");
    setSelectedIndex(null);
  }, [testIndex]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => setVoices(speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Play any text
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const enVoice = voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
    speechSynthesis.speak(utterance);
  };

  // Play sound for letters
  const playAudio = () => {
    if (currentTest.type !== "letters" || !correctAnswer) return;
    speakText(currentTest.sounds[correctAnswer]);
  };

  // Handle answer (for Test 1,2,3)
  const handleAnswer = (choice: string) => {
    if (choice === correctAnswer) {
      setFeedback("✅ Correct");
      speakText("Correct");
      if (currentIndex < shuffledQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setFeedback(null);
        }, 1000);
      } else {
        setTimeout(() => {
          setFeedback(null);
          goNextTest();
        }, 1000);
      }
    } else {
      setFeedback("❌ Incorrect");
      speakText("Incorrect");
    }
  };

  // Handle remove letter (for Test 4)
  const handleRemoveLetter = (idx: number) => {
    if (!currentQuestion) return;
    const newWord =
      currentQuestion.wrong.slice(0, idx) +
      currentQuestion.wrong.slice(idx + 1);

    if (newWord.toLowerCase() === currentQuestion.correct.toLowerCase()) {
      setFeedback(`✅ Correct! ${currentQuestion.correct}`);
      speakText("Correct");
      setTimeout(() => {
        if (currentIndex < (currentTest as RemoveTest).questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setFeedback(null);
        } else {
          setFeedback(null);
          goNextTest();
        }
      }, 1200);
    } else {
      setFeedback("❌ Try again");
      speakText("Incorrect");
    }
  };

  // Helper for Test 5
  const getAddLetterInfo = () => {
    if (!currentQuestion) return null;
    const rawWrong = currentQuestion.wrong;
    const cleanWrong = rawWrong.replace(/_/g, "");
    const correct = currentQuestion.correct;

    const hasBlank = rawWrong.includes("_");
    let insertionIndex = cleanWrong.length;
    if (hasBlank) {
      insertionIndex = rawWrong.indexOf("_");
    } else {
      for (let i = 0; i < correct.length; i++) {
        if (cleanWrong[i] !== correct[i]) {
          insertionIndex = i;
          break;
        }
      }
    }

    const displayWithBlank = hasBlank
      ? rawWrong
      : cleanWrong.slice(0, insertionIndex) +
        "_" +
        cleanWrong.slice(insertionIndex);

    return { cleanWrong, correct, insertionIndex, displayWithBlank };
  };

  // Handle add letter (for Test 5)
  const handleAddLetter = () => {
    if (!currentQuestion) return;
    const info = getAddLetterInfo();
    if (!info) return;
    const ch = inputLetter.trim().charAt(0);
    if (!ch) return;

    const newWord =
      info.cleanWrong.slice(0, info.insertionIndex) +
      ch +
      info.cleanWrong.slice(info.insertionIndex);

    if (newWord.toLowerCase() === info.correct.toLowerCase()) {
      setFeedback(`✅ Correct! ${info.correct}`);
      speakText("Correct");
      setTimeout(() => {
        if (currentIndex < (currentTest as AddTest).questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setInputLetter("");
          setFeedback(null);
        } else {
          setFeedback(null);
          goNextTest();
        }
      }, 1300);
    } else {
      setFeedback("❌ Incorrect");
      speakText("Incorrect");
    }
  };

  const onAddLetterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddLetter();
    }
  };

  // Handle replace letter (for Test 6)
  const handleReplaceLetter = () => {
    if (!currentQuestion || selectedIndex === null) return;
    const ch = inputLetter.trim().charAt(0);
    if (!ch) return;

    const newWord =
      currentQuestion.wrong.slice(0, selectedIndex) +
      ch +
      currentQuestion.wrong.slice(selectedIndex + 1);

    if (newWord.toLowerCase() === currentQuestion.correct.toLowerCase()) {
      setFeedback(`✅ Correct! ${currentQuestion.correct}`);
      speakText("Correct");
      setTimeout(() => {
        if (currentIndex < (currentTest as ReplaceTest).questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setInputLetter("");
          setSelectedIndex(null);
          setFeedback(null);
        } else {
          setFeedback(null);
          setFinished(true); // tự động kết thúc nếu là câu cuối
        }
      }, 1300);
    } else {
      setFeedback("❌ Incorrect");
      speakText("Incorrect");
    }
  };

  // Next test or finish
  const goNextTest = () => {
    if (testIndex < tests.length - 1) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setTestIndex((prev) => prev + 1);
      }, 1000);
    } else {
      setFinished(true);
    }
  };

  // All finished
  if (finished) {
    // Navigate to rating page
    navigate("/test/language/rating");
    return null;
  }

  // Transition screen
  if (showTransition) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-green-600">
          ✅ Complete Test {testIndex + 1}. Ready Test {testIndex + 2}...
        </h1>
      </div>
    );
  }

  const addInfo = currentTest.type === "addLetter" ? getAddLetterInfo() : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-pink-600">{currentTest.title}</h1>

      {/* Letters test */}
      {currentTest.type === "letters" && (
        <button
          onClick={playAudio}
          className="px-6 py-3 bg-pink-700 text-white rounded-lg shadow hover:bg-pink-800"
        >
          🔊 LISTEN
        </button>
      )}

      {/* Test 1,2,3 */}
      {currentTest.type === "letters" &&
        (testIndex === 2 ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap justify-center">
              {currentTest.questions.slice(0, 13).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="px-6 py-3 text-xl font-bold bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {currentTest.questions.slice(13).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="px-6 py-3 text-xl font-bold bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap justify-center">
            {currentTest.questions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="px-6 py-3 text-xl font-bold bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

      {/* Test 4: remove letter */}
      {currentTest.type === "removeLetter" && currentQuestion && (
        <div className="flex gap-4 flex-wrap justify-center">
          {currentQuestion.wrong.split("").map((ch, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveLetter(idx)}
              className="px-6 py-3 text-xl font-bold bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
            >
              {ch.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Test 5: add letter */}
      {currentTest.type === "addLetter" && currentQuestion && addInfo && (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
          <p className="text-2xl font-semibold">
            Wrong spelling:{" "}
            <span className="text-red-600 font-bold">{addInfo.displayWithBlank}</span>
          </p>

          <input
            type="text"
            maxLength={1}
            value={inputLetter}
            onChange={(e) => setInputLetter(e.target.value)}
            onKeyDown={onAddLetterKeyDown}
            className="w-full px-4 py-3 border rounded text-2xl text-center"
            placeholder="_"
          />

          <button
            onClick={handleAddLetter}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
          >
            Submit
          </button>

          {feedback && (
            <p className="text-lg font-medium mt-4">{feedback}</p>
          )}
        </div>
      )}

      {/* Test 6: replace letter */}
      {currentTest.type === "replaceLetter" && currentQuestion && (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
          <p className="text-2xl font-semibold">
            Wrong spelling:{" "}
            <span className="text-red-600 font-bold">{currentQuestion.wrong}</span>
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            {currentQuestion.wrong.split("").map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`px-6 py-3 text-xl font-bold rounded-lg shadow
                  ${selectedIndex === idx ? "bg-yellow-500 text-white" : "bg-pink-500 text-white hover:bg-pink-600"}`}
              >
                {ch.toUpperCase()}
              </button>
            ))}
          </div>

          {selectedIndex !== null && (
            <>
              <input
                type="text"
                maxLength={1}
                value={inputLetter}
                onChange={(e) => setInputLetter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleReplaceLetter();
                }}
                className="w-full px-4 py-3 border rounded text-2xl text-center"
                placeholder="Enter letter"
              />
              <button
                onClick={handleReplaceLetter}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
              >
                Submit
              </button>
            </>
          )}

          {/* Nút Finish luôn hiển thị trong Test 6 */}
          {currentTest.type === "replaceLetter" && (
            <button
              onClick={() => setFinished(true)}
              className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
            >
              FINISH
            </button>
          )}

          {feedback && (
            <p className="text-lg font-medium mt-4">{feedback}</p>
          )}
        </div>
      )}

      {/* Feedback cho các test khác */}
      {currentTest.type !== "addLetter" &&
        currentTest.type !== "replaceLetter" &&
        feedback && <p className="text-lg font-medium mt-4">{feedback}</p>}

      {/* Next test button */}
      {testIndex < tests.length - 1 && (
        <button
          onClick={() => {
            setTestIndex((prev) => prev + 1);
            setCurrentIndex(0);
            setFeedback(null);
            setInputLetter("");
            setSelectedIndex(null);
          }}
          className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
        >
          ⏭ NEXT TEST
        </button>
      )}
    </div>
  );
};

export default LanguageTest;
