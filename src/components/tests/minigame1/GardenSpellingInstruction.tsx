import { useTranslation } from "react-i18next";
import { useTestStep } from "../../../contexts/TestStepContext";
import SpeakerIcon from "../auditory/SpeakerIcon";
import GameLanguageSwitch from "../../common/GameLanguageSwitch";

export default function GardenSpellingInstruction() {
  const { goToNextStep } = useTestStep();
  const { t } = useTranslation();

  return (
    <div className="w-[920px] max-w-[92vw] rounded-lg border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(16,185,129,0.30)]">
      
      {/* 1. Header Row: Tag and Language Dropdown cleanly aligned */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-sm font-semibold uppercase text-emerald-700 mt-2">
          {t("minigame1.instruction.tag")}
        </p>
        <GameLanguageSwitch />
      </div>

      <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
        {t("minigame1.instruction.title")}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-800">
        {t("minigame1.instruction.desc")}
      </p>

      <div className="my-6 h-[2px] w-full rounded bg-gradient-to-r from-emerald-200 via-sky-200 to-amber-200" />

      <h2 className="text-xl font-extrabold text-slate-900">
        {t("minigame1.instruction.guide_title")}
      </h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-slate-800">
          {t("minigame1.instruction.listen_1")}{" "}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-bold text-white align-middle"
          >
            <SpeakerIcon className="h-4 w-4" />
            {t("minigame1.instruction.listen_btn")}
          </button>{" "}
          {t("minigame1.instruction.listen_2")}
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-slate-800">
          {t("minigame1.instruction.guess_1")} <b>{t("minigame1.instruction.guess_desc")}</b> {t("minigame1.instruction.guess_and")} <b>{t("minigame1.instruction.guess_ex")}</b> {t("minigame1.instruction.guess_2")}
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 px-5 py-3 text-slate-800">
          {t("minigame1.instruction.typing_rule")}
        </div>
      </div>

      <p className="mt-5 font-semibold text-emerald-700">
        {t("minigame1.instruction.encouragement")}
      </p>

      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="rounded-lg bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 active:scale-[0.98]"
          type="button"
        >
          {t("minigame1.instruction.start_btn")}
        </button>
      </div>
    </div>
  );
}