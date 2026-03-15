import type { FormEvent } from "react";

interface VisualTestInstructionProps {
  onStartTest: () => void;
}

const VisualTestInstruction = ({ onStartTest }: VisualTestInstructionProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onStartTest();
  };

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 py-14 px-4 sm:px-8 min-h-screen rounded-[1.5rem] flex items-center justify-center">
      <form
        className="flex flex-col bg-white/90 border-4 border-pink-200 p-10 rounded-[2em] items-center space-y-7 shadow-xl max-w-lg w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl text-pink-600 font-bold text-center mb-1 drop-shadow font-[Comic Sans MS,cursive,sans-serif]">
          Visual Test Instruction
        </h2>

        <div className="text-pink-500 font-semibold mb-2 text-center text-lg font-[Comic Sans MS,cursive,sans-serif]">
          Step 3 of 4: <span className="text-gray-700 font-normal">Visual features</span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full mb-4">
          <div className="bg-pink-400 h-2 rounded-full transition-all" style={{ width: "75%" }} />
        </div>

        <div className="flex flex-col items-center">
          <div className="my-2">
            <span className="inline-block bg-pink-50 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          </div>

          <div className="font-bold text-black text-center mb-2 mt-2 font-[Comic Sans MS,cursive,sans-serif]">
            Read carefully to the instructions.
          </div>
          <div className="text-center mb-2 text-gray-700 font-[Comic Sans MS,cursive,sans-serif]">
            You will play a series of memory games using images. Your goal is to
            find and match the images.
          </div>

          <div className="mb-1 text-black font-bold text-center uppercase font-[Comic Sans MS,cursive,sans-serif]">
            Instructions
          </div>
          <div className="text-center text-gray-700 text-sm leading-relaxed px-2 font-[Comic Sans MS,cursive,sans-serif]">
            First, you'll see a <strong>target visual cue for 3 seconds</strong>
            —memorize it. Next, click on the target among several images{" "}
            <strong>as many times as you can in 15 seconds</strong>. The positions
            will shuffle after each click. Each stage has two rounds with
            increasing number of images. Good luck!
          </div>
        </div>

        <button
          type="submit"
          className="bg-pink-500 py-3 w-full rounded-lg text-white font-semibold hover:bg-pink-600 transition-all transform hover:scale-105 font-[Comic Sans MS,cursive,sans-serif]"
        >
          Start Visual Test
        </button>
      </form>
    </div>
  );
};

export default VisualTestInstruction;