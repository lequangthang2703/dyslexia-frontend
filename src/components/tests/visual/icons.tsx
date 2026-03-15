/* ---------------- TYPES ---------------- */
export type Direction = "up" | "down" | "left" | "right";
export type RectangleVariant = "tl" | "tr" | "bl" | "br";
export type Variant = 1 | 2 | 3 | 4;

/* ---------------- ICONS ---------------- */
export const ChevronIcon = ({
  direction,
  size = 64,
}: {
  direction: Direction;
  size?: number;
}) => {
  const getRotation = () => {
    switch (direction) {
      case "up":
        return -90;
      case "down":
        return 90;
      case "left":
        return 180;
      case "right":
        return 0;
    }
  };
  return (
    <div className="w-full h-full bg-pink-50 rounded-xl border-2 border-pink-200 flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ transform: `rotate(${getRotation()}deg)` }}
      >
        <path
          d="M 35 30 L 65 50 L 35 70"
          stroke="#ec4899"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export const ZIcon = ({
  variant,
  size = 64,
}: {
  variant: Variant;
  size?: number;
}) => {
  const paths: Record<number, string> = {
    1: "M 20 20 L 80 20 L 20 80 L 80 80",
    2: "M 80 20 L 20 20 L 80 80 L 20 80",
    3: "M 20 80 L 20 20 L 80 80 L 80 20",
    4: "M 80 80 L 80 20 L 20 80 L 20 20",
  };
  return (
    <div className="w-full h-full bg-pink-50 rounded-xl border-2 border-pink-200 flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path
          d={paths[variant]}
          stroke="#ec4899"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export const RectangleIcon = ({
  variant,
  size = 64,
}: {
  variant: RectangleVariant;
  size?: number;
}) => {
  const triangleMap: Record<string, string> = {
    tl: "M 0 0 L 100 0 L 0 100 Z",
    tr: "M 100 0 L 100 100 L 0 0 Z",
    bl: "M 0 100 L 100 100 L 0 0 Z",
    br: "M 100 100 L 100 0 L 0 100 Z",
  };
  return (
    <div className="w-full h-full bg-pink-50 rounded-xl border-2 border-pink-200 flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="white"
          stroke="#ec4899"
          strokeWidth="6"
        />
        <path d={triangleMap[variant]} fill="#ec4899" />
      </svg>
    </div>
  );
};

export const FaceIcon = ({
  variant,
  size = 64,
}: {
  variant: Variant;
  size?: number;
}) => {
  const transforms: Record<number, string> = {
    1: "rotate(0 50 50)",
    2: "rotate(10 50 50)",
    3: "rotate(-10 50 50)",
    4: "rotate(0 50 50) translate(0,2)",
  };

  const eyePositions: Record<number, { x1: number; x2: number; y: number }> = {
    1: { x1: 35, x2: 65, y: 35 },
    2: { x1: 38, x2: 62, y: 35 },
    3: { x1: 35, x2: 65, y: 32 },
    4: { x1: 35, x2: 65, y: 38 },
  };
  const pos = eyePositions[variant];

  const renderEye = (
    shape: "circle" | "triangle" | "star" | "square",
    cx: number,
    cy: number
  ) => {
    switch (shape) {
      case "circle":
        return <circle cx={cx} cy={cy} r="5" fill="#ec4899" />;
      case "triangle":
        const side = 14;
        const height = (Math.sqrt(3) / 2) * side;
        return (
          <polygon
            points={`
              ${cx},${cy - height / 2} 
              ${cx - side / 2},${cy + height / 2} 
              ${cx + side / 2},${cy + height / 2}
            `}
            fill="#ec4899"
          />
        );
      case "star":
        const R = 8;
        const r = 3.5;
        const points = Array.from({ length: 10 }, (_, i) => {
          const angle = (i * 36 - 90) * (Math.PI / 180);
          const rad = i % 2 === 0 ? R : r;
          return `${cx + rad * Math.cos(angle)},${cy + rad * Math.sin(angle)}`;
        }).join(" ");
        return <polygon points={points} fill="#ec4899" />;
      case "square":
      default:
        return (
          <rect x={cx - 5} y={cy - 5} width="10" height="10" fill="#ec4899" />
        );
    }
  };

  const eyeShapeMap: Record<number, "circle" | "triangle" | "star" | "square"> =
    {
      1: "circle",
      2: "triangle",
      3: "star",
      4: "square",
    };

  return (
    <div className="w-full h-full bg-pink-50 rounded-xl border-2 border-pink-200 flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ transform: transforms[variant] }}
      >
        <path
          d="M 10 50 A 40 40 0 0 1 90 50 L 90 90 L 10 90 Z"
          stroke="#ec4899"
          strokeWidth="5"
          fill="white"
        />
        {renderEye(eyeShapeMap[variant], pos.x1, pos.y)}
        {renderEye(eyeShapeMap[variant], pos.x2, pos.y)}
      </svg>
    </div>
  );
};
