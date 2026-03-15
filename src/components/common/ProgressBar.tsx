interface ProgressBarProps {
	currentStep: number;
	totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
	return (
		<div className="w-full h-2 bg-pink-100 rounded-full mb-4">
			<div
				className="bg-pink-400 h-2 rounded-full transition-all"
				style={{
					width: `${(currentStep / totalSteps) * 100}%`,
				}}
			/>
		</div>
	);
};

export default ProgressBar;
