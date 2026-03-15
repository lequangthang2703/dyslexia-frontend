import { useTestStep } from "../../../contexts/TestStepContext";
import SpeakerIcon from "../auditory/SpeakerIcon";

export default function MiniGame4Instruction() {
  const { goToNextStep } = useTestStep();

  const playIntroAudio = () => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(
        "Chào mừng phi hành gia nhí! Hãy viết chữ cái để nạp năng lượng cho tàu vũ trụ."
      );
      msg.lang = "vi-VN";
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className="w-[920px] max-w-[92vw] bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-20px_rgba(79,70,229,0.35)] p-8 border border-indigo-100">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-3">
        🚀 Minigame 4: Cứu Hộ Vũ Trụ
      </h1>

      {/* Tagline */}
      <p className="text-slate-800 mb-6">
        Giúp tàu vũ trụ nạp năng lượng bằng cách{" "}
        <b className="text-indigo-600">viết đúng chữ cái</b> mà bạn nghe được!
      </p>

      {/* Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-200 rounded-full mb-6" />

      {/* HƯỚNG DẪN */}
      <h2 className="text-xl font-extrabold text-slate-900 tracking-wide mb-4">
        HƯỚNG DẪN
      </h2>

      <div className="space-y-3">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 px-5 py-3 text-slate-800">
          <span className="font-semibold">Bấm</span>{" "}
          <button
            type="button"
            onClick={playIntroAudio}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500 text-white text-sm shadow hover:bg-indigo-600 align-middle"
          >
            <SpeakerIcon className="w-4 h-4" />
            Nghe
          </button>{" "}
          để nghe chữ cái cần viết.
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-slate-800">
          <b>Dùng ngón tay</b> hoặc <b>chuột</b> để viết chữ cái trên bảng vẽ.
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 px-5 py-3 text-slate-800">
          Bấm <b className="text-green-600">"Nộp bài"</b> khi viết xong, hoặc{" "}
          <b className="text-orange-600">"Xóa"</b> để viết lại.
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-slate-800">
          Viết đúng sẽ nạp <b className="text-yellow-600">⚡ năng lượng</b> cho
          tàu vũ trụ bay đến hành tinh mới!
        </div>
      </div>

      {/* Start button */}
      <div className="mt-7 flex justify-center">
        <button
          onClick={goToNextStep}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200 transform hover:scale-105 transition-all"
        >
          🚀 Bắt đầu phiêu lưu
        </button>
      </div>
    </div>
  );
}
