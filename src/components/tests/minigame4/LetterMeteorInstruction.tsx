import { useTestStep } from "../../../contexts/TestStepContext";
import SpeakerIcon from "../auditory/SpeakerIcon";

export default function LetterMeteorInstruction() {
  const { goToNextStep } = useTestStep();

  const playIntroAudio = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Hãy tìm đúng chữ trong các sao băng."
    );
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-[920px] max-w-[92vw] rounded-lg border border-sky-100 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(14,165,233,0.30)]">
      <p className="text-sm font-semibold uppercase text-sky-700">
        Minigame 4
      </p>
      <h1 className="mt-1 text-4xl font-extrabold text-slate-900">
        Trạm Chữ Sao Băng
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-slate-800">
        Giúp phi thuyền tìm đúng chữ giữa các sao băng gây nhiễu. Hãy nhìn kỹ
        vì nhiều chữ có hình dạng rất giống nhau.
      </p>

      <div className="my-6 h-[2px] w-full rounded bg-gradient-to-r from-sky-200 via-emerald-200 to-amber-200" />

      <h2 className="text-xl font-extrabold text-slate-900">Hướng dẫn</h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 px-5 py-3 text-slate-800">
          Bấm{" "}
          <button
            type="button"
            onClick={playIntroAudio}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-bold text-white align-middle"
          >
            <SpeakerIcon className="h-4 w-4" />
            Nghe
          </button>{" "}
          để nghe nhiệm vụ.
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-slate-800">
          Nhìn chữ mục tiêu ở bảng bên phải, rồi chọn sao băng có chữ giống hệt.
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 px-5 py-3 text-slate-800">
          Một số chữ dễ nhầm như <b>b/d/p/q</b>, <b>a/ă/â</b>, <b>o/ô/ơ</b>. Hãy
          quan sát thật chậm và chắc.
        </div>
      </div>

      <p className="mt-5 font-semibold text-sky-700">
        Mỗi câu đúng sẽ cứu được một sao băng và giúp phi thuyền hoàn thành
        nhiệm vụ.
      </p>

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          onClick={goToNextStep}
          className="rounded-lg bg-sky-600 px-8 py-3 font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 active:scale-[0.98]"
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
}
