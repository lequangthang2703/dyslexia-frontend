import { useTranslation } from "react-i18next";
import { useTestStep } from "../../../contexts/TestStepContext";
import SpeakerIcon from "../auditory/SpeakerIcon";
import GameLanguageSwitch from "../../common/GameLanguageSwitch";

export default function LetterMeteorInstruction() {
  const { goToNextStep } = useTestStep();
  const { t } = useTranslation();

  const playIntroAudio = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Defaulting to Vietnamese speech logic as per your original file
    const utterance = new SpeechSynthesisUtterance("Hãy tìm đúng chữ trong các sao băng.");
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-[920px] max-w-[92vw] rounded-lg border border-sky-100 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(14,165,233,0.30)]">
      
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="mt-2 text-sm font-semibold uppercase text-sky-700">
          {t("minigame4.instruction.tag")}
        </p>
        <GameLanguageSwitch />
      </div>

      <h1 className="mt-1 text-4xl font-extrabold text-slate-900">
        {t("minigame4.instruction.title")}
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-800">
        {t("minigame4.instruction.desc")}
      </p>

      <div className="my-6 h-[2px] w-full rounded bg-gradient-to-r from-sky-200 via-emerald-200 to-amber-200" />

      <h2 className="text-xl font-extrabold text-slate-900">{t("minigame4.instruction.guide_title")}</h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-slate-800">
          {t("minigame4.instruction.step_1")}{" "}
          <button
            type="button"
            onClick={playIntroAudio}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-bold text-white align-middle"
          >
            <SpeakerIcon className="h-4 w-4" />
            {t("minigame4.instruction.step_1_btn")}
          </button>{" "}
          {t("minigame4.instruction.step_1_after")}
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-slate-800">
          {t("minigame4.instruction.step_2")}
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 px-5 py-3 text-slate-800">
          {t("minigame4.instruction.step_3")}
        </div>
      </div>

      <p className="mt-5 font-semibold text-sky-700">
        {t("minigame4.instruction.encouragement")}
      </p>

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          onClick={goToNextStep}
          className="rounded-lg bg-sky-600 px-8 py-3 font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
        >
          {t("minigame4.instruction.start_btn")}
        </button>
      </div>
    </div>
  );
}