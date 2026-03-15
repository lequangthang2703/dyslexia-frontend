import { useTestStep } from "../../../contexts/TestStepContext";
import SpeakerIcon from "../auditory/SpeakerIcon";

export default function MiniGame1Instruction() {
  const { goToNextStep } = useTestStep();

  return (
    <div className="w-[920px] max-w-[92vw] bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(244,63,94,0.35)] p-8 border border-rose-100">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-rose-600 mb-3">
        Minigame 1: Spelling Bee
      </h1>

      {/* Tagline */}
      <p className="text-slate-800 mb-6">
        Trò chơi đánh giá khả năng nghe phát âm và ghép vần. Trả lời đúng để{" "}
        <b className="text-rose-600">mở khóa bộ phận robot</b>.
      </p>

      {/* Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200 rounded-full mb-6" />

      {/* HƯỚNG DẪN */}
      <h2 className="text-xl font-extrabold text-slate-900 tracking-wide mb-4">
        HƯỚNG DẪN
      </h2>

      <div className="space-y-3">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-5 py-3 text-slate-800">
          <span className="font-semibold">Bấm</span>{" "}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-sm shadow hover:bg-rose-600 align-middle"
          >
            <SpeakerIcon className="w-4 h-4" />
            Nghe
          </button>{" "}
          để nghe phát âm.
        </div>

        <div className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-slate-800">
          Xem <b>Mô tả</b> và <b>Ví dụ</b> để đoán từ.
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-5 py-3 text-slate-800">
          Gõ đáp án <b>không dấu</b>, không khoảng trắng dư. Không phân biệt
          hoa/thường.
        </div>
      </div>

      {/* Callout */}
      <p className="mt-5 text-rose-600 font-semibold">
        Hoàn thành tất cả câu hỏi để lắp ráp robot hoàn chỉnh!
      </p>

      {/* Start button */}
      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-lg shadow-rose-200"
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
}
