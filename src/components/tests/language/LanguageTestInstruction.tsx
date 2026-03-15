const LanguageTestInstruction = ({ onStartTest }: { onStartTest: () => void }) => (
  <form
    className="flex flex-col bg-white border border-gray-100 p-8 rounded-2xl items-center space-y-4 shadow-lg max-w-md w-full mx-auto mt-10"
    onSubmit={e => { e.preventDefault(); onStartTest(); }}
  >
    <h2 className="text-2xl text-pink-600 font-bold text-center mb-1">
      Language Test Instruction
    </h2>
    <div className="text-pink-600 font-medium mb-2 text-center text-lg">
      Step 4 of 4: <span className="text-gray-700 font-normal">Language features</span>
    </div>
    <div className="w-full h-1.5 bg-pink-100 rounded-full mb-4">
      <div className="bg-pink-400 h-1.5 rounded-full transition-all" style={{ width: "100%" }} />
    </div>
    <div className="flex flex-col items-center">
      {/* ABC Icon */}
      <div className="my-2">
        <span className="inline-block bg-pink-50 rounded-full p-3">
          {/* ABC SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#111" />
            <text x="8" y="28" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">abc</text>
          </svg>
        </span>
      </div>
      <div className="font-bold text-black text-center mt-2 mb-2">
        Read carefully to the instructions.
      </div>
      <div className="text-center mb-2 text-gray-700">
        You will play a series of memory games with language. The instruction will appear with the question, so remember to read it carefully.
      </div>
    </div>
    <button
      type="submit"
      className="bg-pink-500 py-2 w-full rounded-lg text-white font-semibold hover:bg-pink-600 transition focus:ring-2 focus:ring-pink-200 focus:outline-none"
    >
      Start Language Test
    </button>
  </form>
);

export default LanguageTestInstruction;