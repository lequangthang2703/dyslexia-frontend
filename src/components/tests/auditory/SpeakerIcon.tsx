interface SpeakerIconProps {
  /** Kích thước fallback nếu không truyền className (px) */
  size?: number;
  /** Class áp vào <svg>. Nếu có className thì Tailwind sẽ quyết định width/height. */
  className?: string;
  /** Class cho wrapper (nếu render wrapper mặc định) */
  wrapperClassName?: string;
}

/**
 * Hành vi:
 * - Nếu có `className` → chỉ render <svg> (không có wrapper), phù hợp dùng trong nút, inline icon.
 * - Nếu KHÔNG có `className` → render demo kèm wrapper nền hồng như bản gốc (giữ backward-compat).
 */
const SpeakerIcon = ({ size = 64, className, wrapperClassName }: SpeakerIconProps) => {
  const svg = (
    <svg
      {...(className ? { className } : { width: size, height: size })}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      {/* Speaker body */}
      <rect x="20" y="35" width="25" height="30" fill="#ec4899" rx="3" />
      {/* Speaker cone */}
      <path d="M 45 35 L 65 25 L 65 75 L 45 65 Z" fill="#ec4899" />
      {/* Sound waves */}
      <path d="M 70 40 Q 75 50 70 60" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 75 35 Q 82 50 75 65" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );

  // Nếu có className → icon inline (không wrapper)
  if (className) return svg;

  // Giữ wrapper cũ khi không truyền className (backward-compat)
  return (
    <div
      className={
        wrapperClassName ??
        "w-full h-full bg-pink-50 rounded-xl border-2 border-pink-200 flex items-center justify-center"
      }
    >
      {svg}
    </div>
  );
};

export default SpeakerIcon;
