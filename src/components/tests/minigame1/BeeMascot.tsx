import React from "react";
export default function BeeMascot({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      // Clip-path được áp dụng trực tiếp vào container này để tạo hiệu ứng "mở khóa"
      style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
    >
      {/* --- ANIMATION CONTAINER (Để ong bay lên xuống) --- */}
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
          
          {/* Highlight bóng sáng trên lưng */}
          <div className="absolute top-2 left-4 w-20 h-8 bg-white/30 rounded-full -rotate-6" />
        </div>

        {/* 3. MẮT (Eyes) */}
        <div className="absolute top-8 left-6 z-20 flex gap-12">
           {/* Mắt trái */}
           <div className="w-4 h-6 bg-slate-900 rounded-full relative">
             <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
           </div>
           {/* Mắt phải */}
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