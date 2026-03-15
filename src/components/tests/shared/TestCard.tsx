import React from "react";
interface TestCardProps {
	children?: React.ReactNode; // for image/icon
	label?: string;
	onClick?: () => void;
	className?: string;
}

const TestCard = ({
	children,
	label,
	onClick,
	className = "",
}: TestCardProps) => (
	<button
		type="button"
		className={`w-30 h-35 bg-teal-50 border-6 border-teal-400 rounded-2xl flex flex-col items-center justify-center shadow transition hover:scale-105 focus:ring-2 focus:ring-teal-200 ${className}`}
		onClick={onClick}
	>
		<div className="flex items-center justify-center mb-1">{children}</div>
		{label && (
			<span className="text-teal-600 text-sm font-semibold">{label}</span>
		)}
	</button>
);

export default TestCard;
