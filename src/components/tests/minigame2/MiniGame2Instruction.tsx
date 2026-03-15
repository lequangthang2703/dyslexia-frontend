import { useTestStep } from "../../../contexts/TestStepContext";

export default function MiniGame2Instruction() {
  const { goToNextStep } = useTestStep();

  return (
    <div className="w-[920px] max-w-[92vw] bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(236,72,153,0.35)] p-8 border border-pink-100">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-pink-600 mb-3">
        Minigame 2: Lắp Ráp Robot
      </h1>

      {/* Tagline */}
      <p className="text-slate-800 mb-6">
        Trò chơi đánh giá tốc độ đọc và khả năng hiểu nội dung. Trả lời đúng để{" "}
        <b className="text-pink-600">lắp ráp robot hoàn chỉnh</b>.
      </p>

      {/* Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-200 via-pink-300 to-pink-200 rounded-full mb-6" />

      {/* HƯỚNG DẪN */}
      <h2 className="text-xl font-extrabold text-slate-900 tracking-wide mb-4">
        HƯỚNG DẪN
      </h2>

      <div className="space-y-3">
        <div className="rounded-2xl border border-pink-200 bg-pink-50/70 px-5 py-3 text-slate-800">
          Bạn sẽ thấy một <b>câu mệnh đề</b>. Nhiệm vụ là đọc và trả lời{" "}
          <span className="text-emerald-600 font-semibold">Đúng</span> hoặc{" "}
          <span className="text-red-600 font-semibold">Sai</span>.
        </div>

        <div className="rounded-2xl border border-pink-200 bg-white px-5 py-3 text-slate-800">
          Mỗi câu trả lời <b className="text-emerald-600">đúng</b> sẽ giúp robot
          được lắp ráp thêm một phần.
        </div>

        <div className="rounded-2xl border border-pink-200 bg-pink-50/70 px-5 py-3 text-slate-800">
          Mỗi câu trả lời <b className="text-red-600">sai</b> sẽ không lắp ráp
          thêm phần nào.
        </div>
      </div>

      {/* Callout */}
      <p className="mt-5 text-pink-600 font-semibold">
        Hoàn thành tất cả câu hỏi để lắp ráp robot hoàn chỉnh!
      </p>

      {/* Start button */}
      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg shadow-pink-200"
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
}
