import { useTestStep } from "../../../contexts/TestStepContext";

export default function RobotFactFactoryInstruction() {
  const { goToNextStep } = useTestStep();

  return (
    <div className="w-[920px] max-w-[92vw] rounded-lg border border-sky-100 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(14,165,233,0.30)]">
      <p className="text-sm font-semibold uppercase text-sky-700">
        Minigame 2
      </p>
      <h1 className="mt-1 text-4xl font-extrabold text-slate-900">
        Robot Delivery: Giao Hàng Sự Thật
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-800">
        Đọc từng mệnh đề và đưa robot vào làn ĐÚNG hoặc làn SAI để giao kiện
        hàng.
      </p>

      <div className="my-6 h-[2px] w-full rounded bg-gradient-to-r from-sky-200 via-emerald-200 to-amber-200" />

      <h2 className="text-xl font-extrabold text-slate-900">Hướng dẫn</h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-slate-800">
          Đọc kỹ <b>kiện hàng thông tin</b> xuất hiện trên màn hình.
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-slate-800">
          Chọn <b className="text-emerald-700">LÀN ĐÚNG</b> nếu mệnh đề là sự thật.
        </div>

        <div className="rounded-lg border border-rose-100 bg-rose-50 px-5 py-3 text-slate-800">
          Chọn <b className="text-rose-700">LÀN SAI</b> nếu mệnh đề không chính xác.
        </div>
      </div>

      <p className="mt-5 font-semibold text-sky-700">
        Mục tiêu là đọc hiểu nhanh, chọn đúng làn và giao đủ 5 kiện hàng.
      </p>

      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="rounded-lg bg-sky-600 px-8 py-3 font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
          type="button"
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
}
