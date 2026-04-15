import { useTestStep } from "../../../contexts/TestStepContext";
import SpeakerIcon from "../auditory/SpeakerIcon";

export default function GardenSpellingInstruction() {
  const { goToNextStep } = useTestStep();

  return (
    <div className="w-[920px] max-w-[92vw] rounded-lg border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(16,185,129,0.30)]">
      <p className="text-sm font-semibold uppercase text-emerald-700">
        Minigame 1
      </p>
      <h1 className="mt-1 text-4xl font-extrabold text-slate-900">
        Spelling Bee: Vườn Hoa Mật
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-800">
        Nghe phát âm, đọc mô tả và gõ lại từ bạn nghe được để giúp ong thu mật
        và làm vườn hoa nở dần.
      </p>

      <div className="my-6 h-[2px] w-full rounded bg-gradient-to-r from-emerald-200 via-sky-200 to-amber-200" />

      <h2 className="text-xl font-extrabold text-slate-900">Hướng dẫn</h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-slate-800">
          Bấm{" "}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-bold text-white align-middle"
          >
            <SpeakerIcon className="h-4 w-4" />
            Nghe lại
          </button>{" "}
          để nghe từ cần trả lời.
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-slate-800">
          Dựa vào <b>mô tả</b> và <b>ví dụ</b> để đoán từ chính xác.
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 px-5 py-3 text-slate-800">
          Có thể gõ <b>không dấu</b>. Hệ thống tự bỏ dấu và bỏ khoảng trắng dư
          khi chấm.
        </div>
      </div>

      <p className="mt-5 font-semibold text-emerald-700">
        Cố gắng giữ chuỗi đúng để ong bay mượt qua cả vườn.
      </p>

      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="rounded-lg bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 active:scale-[0.98]"
          type="button"
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
}
