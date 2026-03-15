// VisualTestCard.tsx

type VisualTestCardProps = {
  img: string;
  onClick: () => void;
};
const VisualTestCard = ({ img, onClick }: VisualTestCardProps) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-center shadow hover:ring-2 hover:ring-indigo-300"
    tabIndex={-1}
  >
    <img src={img} alt="" className="h-16 w-16 object-contain" />
  </button>
);

export default VisualTestCard;