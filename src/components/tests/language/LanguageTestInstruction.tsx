const LanguageTestInstruction = ({
  onStartTest,
}: {
  onStartTest: () => void;
}) => (
  <form
    className="flex flex-col bg-white/90 border-4 border-pink-200 p-8 rounded-2xl items-center space-y-5 shadow-lg max-w-lg w-full mx-auto mt-10"
    onSubmit={(event) => {
      event.preventDefault();
      onStartTest();
    }}
  >
    <h2 className="text-2xl text-pink-600 font-bold text-center mb-1">
      Bài Test Ngôn Ngữ Tiếng Việt
    </h2>

    <div className="text-pink-600 font-medium mb-2 text-center text-lg">
      Bước 4/4: <span className="text-gray-700 font-normal">Âm, dấu, vần và từ</span>
    </div>

    <div className="w-full h-2 bg-pink-100 rounded-full mb-2">
      <div
        className="bg-pink-400 h-2 rounded-full transition-all"
        style={{ width: "100%" }}
      />
    </div>

    <div className="text-gray-700 text-center space-y-3">
      <p className="font-semibold text-gray-900">
        Bài test có 12 câu ngắn, mỗi câu chỉ chọn một lần.
      </p>
      <p>
        Em sẽ nghe tiếng Việt, phân biệt dấu thanh, ghép âm với vần và chọn từ
        viết đúng. Hãy nghe kỹ trước khi chọn đáp án.
      </p>
      <p className="text-sm text-gray-600">
        Với câu có âm thanh, em có thể bấm nghe lại. Số lần nghe lại và thời
        gian trả lời sẽ được ghi nhận để đánh giá chính xác hơn.
      </p>
    </div>

    <button
      type="submit"
      className="bg-pink-500 py-3 w-full rounded-lg text-white font-semibold hover:bg-pink-600 transition focus:ring-2 focus:ring-pink-200 focus:outline-none"
    >
      Bắt đầu bài test
    </button>
  </form>
);

export default LanguageTestInstruction;
