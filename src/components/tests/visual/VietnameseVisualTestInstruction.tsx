import type { FormEvent } from "react";

interface VietnameseVisualTestInstructionProps {
  onStartTest: () => void;
}

const VietnameseVisualTestInstruction = ({
  onStartTest,
}: VietnameseVisualTestInstructionProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onStartTest();
  };

  return (
    <form
      className="flex flex-col bg-white/90 border-4 border-pink-200 p-10 rounded-2xl items-center space-y-6 shadow-xl max-w-lg w-full mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl text-pink-600 font-bold text-center mb-1 drop-shadow">
        Bài Test Thị Giác Chữ
      </h2>

      <div className="text-pink-500 font-semibold text-center text-lg">
        Bước 3/4: <span className="text-gray-700 font-normal">Phân biệt chữ và từ</span>
      </div>

      <div className="w-full h-2 bg-pink-100 rounded-full">
        <div
          className="bg-pink-400 h-2 rounded-full transition-all"
          style={{ width: "75%" }}
        />
      </div>

      <div className="text-center text-gray-700 space-y-3">
        <p className="font-bold text-gray-900">
          Bài test có 12 câu ngắn, mỗi câu chỉ chọn một lần.
        </p>
        <p>
          Em sẽ phân biệt chữ dễ nhầm, tìm chữ trong dãy nhiễu, chọn từ giống
          mẫu và ghi nhớ chuỗi chữ ngắn.
        </p>
        <p className="text-sm text-gray-600">
          Với câu ghi nhớ, mẫu sẽ biến mất sau vài giây trước khi em chọn đáp
          án.
        </p>
      </div>

      <button
        type="submit"
        className="bg-pink-500 py-3 w-full rounded-lg text-white font-semibold hover:bg-pink-600 transition-all transform hover:scale-105"
      >
        Bắt đầu bài test
      </button>
    </form>
  );
};

export default VietnameseVisualTestInstruction;
