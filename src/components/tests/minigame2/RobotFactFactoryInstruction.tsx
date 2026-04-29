import { useTranslation } from "react-i18next";
import { useTestStep } from "../../../contexts/TestStepContext";
import GameLanguageSwitch from "../../common/GameLanguageSwitch";

export default function RobotDeliveryInstruction() {
  const { goToNextStep } = useTestStep();
  const { t } = useTranslation();

  return (
    <div className="w-[920px] max-w-[92vw] rounded-lg border border-sky-100 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(14,165,233,0.30)]">
      
      {/* Top Header with Language Dropdown neatly aligned */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-sm font-semibold uppercase text-sky-700 mt-2">
          {t("minigame2.instruction.tag", "Minigame 2")}
        </p>
        <GameLanguageSwitch />
      </div>

      <h1 className="mt-1 text-4xl font-extrabold text-slate-900">
        {t("minigame2.instruction.title", "Robot Delivery: Giao Hàng Sự Thật")}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-800">
        {t("minigame2.instruction.desc", "Đọc từng mệnh đề và đưa robot vào làn ĐÚNG hoặc làn SAI để giao kiện hàng.")}
      </p>

      <div className="my-6 h-[2px] w-full rounded bg-gradient-to-r from-sky-200 via-emerald-200 to-amber-200" />

      <h2 className="text-xl font-extrabold text-slate-900">
        {t("minigame2.instruction.guide_title", "Hướng dẫn")}
      </h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-slate-800">
          {t("minigame2.instruction.step_1", "Đọc kỹ kiện hàng thông tin xuất hiện trên màn hình.")}
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-slate-800">
          {t("minigame2.instruction.step_2", "Chọn LÀN ĐÚNG nếu mệnh đề là sự thật.")}
        </div>

        <div className="rounded-lg border border-rose-100 bg-rose-50 px-5 py-3 text-slate-800">
          {t("minigame2.instruction.step_3", "Chọn LÀN SAI nếu mệnh đề không chính xác.")}
        </div>
      </div>

      <p className="mt-5 font-semibold text-sky-700">
        {t("minigame2.instruction.encouragement", "Mục tiêu là đọc hiểu nhanh, chọn đúng làn và giao đủ 5 kiện hàng.")}
      </p>

      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="rounded-lg bg-sky-600 px-8 py-3 font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
          type="button"
        >
          {t("minigame2.instruction.start_btn", "Bắt đầu chơi")}
        </button>
      </div>
    </div>
  );
}