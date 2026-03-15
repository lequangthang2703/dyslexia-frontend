import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MG1_ITEMS } from "../../../data/minigame1";
import SpeakerIcon from "../auditory/SpeakerIcon";

// ==========================================
// PHẦN 1: COMPONENT CON ONG (VẼ BẰNG CSS)
// ==========================================
function BeeMascot({ progress }: { progress: number }) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      // Hiệu ứng "hé lộ" dần dần dựa trên tiến độ (clip-path)
      style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
    >
      {/* Container tạo hiệu ứng bay nhấp nhô */}
      <div className="relative animate-[bounce_3s_infinite]">
        
        {/* 1. CÁNH (Wings) - Vẽ trước để nằm sau lưng */}
        <div className="absolute -top-12 -left-6 w-24 h-24 bg-sky-200/80 rounded-full rotate-[-20deg] border-2 border-sky-100 animate-[pulse_1s_infinite]" />
        <div className="absolute -top-12 left-6 w-24 h-24 bg-sky-200/80 rounded-full rotate-[20deg] border-2 border-sky-100 animate-[pulse_1s_infinite]" />

        {/* 2. THÂN (Body) */}
        <div className="relative w-40 h-32 bg-yellow-400 rounded-[50px] border-4 border-slate-900 overflow-hidden shadow-xl z-10">
          {/* Sọc đen 1 */}
          <div className="absolute left-10 top-0 w-8 h-full bg-slate-900 -rotate-6 scale-110" />
          {/* Sọc đen 2 */}
          <div className="absolute left-24 top-0 w-8 h-full bg-slate-900 -rotate-6 scale-110" />
          {/* Highlight bóng sáng */}
          <div className="absolute top-2 left-4 w-20 h-8 bg-white/30 rounded-full -rotate-6" />
        </div>

        {/* 3. MẮT (Eyes) */}
        <div className="absolute top-8 left-6 z-20 flex gap-12">
          <div className="w-4 h-6 bg-slate-900 rounded-full relative">
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="w-4 h-6 bg-slate-900 rounded-full relative">
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* 4. MIỆNG (Mouth) */}
        <div className="absolute top-16 left-12 z-20 w-8 h-4 border-b-4 border-slate-900 rounded-full" />

        {/* 5. RÂU (Antennae) */}
        <div className="absolute -top-8 left-8 w-1 h-10 bg-slate-900 -rotate-12 z-0">
          <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-slate-900 rounded-full" />
        </div>
        <div className="absolute -top-8 left-28 w-1 h-10 bg-slate-900 rotate-12 z-0">
          <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-slate-900 rounded-full" />
        </div>

        {/* 6. NGÒI (Stinger) */}
        <div className="absolute top-[60px] -right-4 w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-slate-900 border-b-[10px] border-b-transparent z-0" />
      </div>
    </div>
  );
}

// ==========================================
// PHẦN 2: LOGIC GAME CHÍNH
// ==========================================
type State = {
  index: number;
  correct: number;
  input: string;
  feedback: "idle" | "right" | "wrong";
};

export default function MiniGame1() {
  const navigate = useNavigate();
  const [st, setSt] = useState<State>({
    index: 0,
    correct: 0,
    input: "",
    feedback: "idle",
  });
  const item = MG1_ITEMS[st.index];

  // Tính % hoàn thành
  const progress = useMemo(
    () => Math.round((st.correct / MG1_ITEMS.length) * 100),
    [st.correct]
  );

  // Xử lý âm thanh
  const playAudio = () => {
    if (item?.audioUrl) {
      const a = new Audio(item.audioUrl);
      a.play().catch(() => {});
    } else if (item?.word && "speechSynthesis" in window) {
      const ut = new SpeechSynthesisUtterance(item.word);
      ut.lang = "en-US"; // Có thể đổi thành 'en-GB' nếu muốn giọng Anh-Anh
      window.speechSynthesis.speak(ut);
    }
  };

  const norm = (s: string) => s.trim().toLowerCase();

  // Xử lý submit
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    const isRight = norm(st.input) === norm(item.word);
    setSt((p) => ({
      ...p,
      feedback: isRight ? "right" : "wrong",
      correct: isRight ? p.correct + 1 : p.correct,
    }));

    // Chờ 0.7s rồi chuyển câu (hoặc kết thúc)
    setTimeout(() => {
      const next = st.index + 1;
      if (next >= MG1_ITEMS.length) {
        navigate("/test/minigame1/rating");
      } else {
        setSt({
          index: next,
          correct: isRight ? st.correct + 1 : st.correct,
          input: "",
          feedback: "idle",
        });
      }
    }, 700);
  };

  // Auto focus vào ô input mỗi khi đổi câu hỏi
  const inpRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inpRef.current?.focus();
  }, [st.index]);

  return (
    <div className="w-[1280px] max-w-[98vw] mx-auto">
      {/* ====== CONTAINER CHÍNH ====== */}
      <div
        className="
          rounded-3xl p-4 md:p-6
          bg-gradient-to-br from-rose-50 via-white to-rose-100
          border border-rose-100 shadow-[0_25px_80px_-30px_rgba(244,63,94,0.20)]
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* ========== KHỐI TRÁI: CON ONG (CSS) + THANH TIẾN ĐỘ ========== */}
          <div className="relative rounded-2xl bg-rose-50 border border-rose-100 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.18)] overflow-hidden min-h-[520px] md:min-h-[600px]">
            {/* Nền radial dịu */}
            <div className="absolute inset-0 bg-[radial-gradient(720px_720px_at_35%_48%,rgba(244,114,182,0.22),rgba(168,85,247,0.12)_45%,transparent_75%)]" />

            {/* Vùng hiển thị Con Ong */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[440px] md:h-[440px] rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30">
                {/* Gọi Component BeeMascot ở đây */}
                <BeeMascot progress={progress} />
                
                {/* Lớp phủ màu nhẹ */}
                <div className="absolute inset-0 bg-fuchsia-400/10 mix-blend-multiply pointer-events-none" />
              </div>
            </div>

            {/* Thanh tiến độ */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[66%] md:w-[62%]">
              <div className="w-full h-3 bg-rose-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-center text-sm text-rose-600 font-medium">
                {progress}% hoàn thành
              </div>
            </div>
          </div>

          {/* ========== KHỐI PHẢI: INTERFACE CHƠI GAME ========== */}
          <div className="rounded-2xl bg-white/95 border border-rose-100 shadow-[0_10px_40px_-15px_rgba(244,63,94,0.18)] p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-xl text-rose-600">Spelling Bee 🐝</div>
              <button
                onClick={playAudio}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-md shadow-rose-200"
              >
                <SpeakerIcon className="w-5 h-5" />
                Nghe lại
              </button>
            </div>

            {/* Phần hiển thị Gợi ý */}
            <div className="text-slate-800 text-sm space-y-4 mb-6 flex-1">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                <span className="text-rose-600 font-bold block mb-1">Mô tả:</span>
                <span className="text-slate-700">{item?.description}</span>
              </div>
              
              <div className="pl-2 border-l-4 border-rose-200">
                <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Ví dụ:</span>
                <p className="italic text-slate-800 text-lg">"{item?.example}"</p>
              </div>

              {item?.hint && (
                <div className="text-rose-500 text-sm flex items-center gap-2">
                  <span>💡 Gợi ý:</span> 
                  <span className="font-medium">{item.hint}</span>
                </div>
              )}
            </div>

            {/* Form nhập liệu */}
            <form onSubmit={submit} className="mt-auto">
              <input
                ref={inpRef}
                value={st.input}
                onChange={(e) => setSt((p) => ({ ...p, input: e.target.value }))}
                placeholder="Nhập từ bạn nghe được..."
                className="w-full px-5 py-4 rounded-xl bg-slate-50 text-slate-900 text-lg outline-none ring-2 ring-transparent focus:ring-rose-400 focus:bg-white transition-all border border-slate-200"
                autoComplete="off"
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-slate-500 font-medium">
                  Câu hỏi: <span className="text-rose-600">{st.index + 1}</span> <span className="text-slate-300">/</span> {MG1_ITEMS.length}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 transform active:scale-95 transition-all"
                >
                  Kiểm tra
                </button>
              </div>
            </form>

            {/* Thông báo kết quả (Feedback) */}
            {st.feedback !== "idle" && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-bold animate-pulse ${
                  st.feedback === "right" 
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                    : "bg-rose-100 text-rose-700 border border-rose-200"
                }`}
              >
                {st.feedback === "right"
                  ? "🎉 Chính xác! Ong thợ đang dần xuất hiện."
                  : "😅 Chưa đúng rồi, cố gắng câu sau nhé!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}