import { useEffect, useState } from "react";
import SpeakerIcon from "./SpeakerIcon";

export interface TestComponentProps {
  updateScore: (isCorrect: boolean) => void;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
}

export type Option = {
	text: string;
	image?: string;
};

export type AuditorySoundOptionChoiceQuestion = {
	questionText: string;
	audios: string[];
	options: Option[];
	correctOptionIndex: number;
};

export interface AuditorySoundOptionChoiceProps extends TestComponentProps {
	question: AuditorySoundOptionChoiceQuestion;
}

const AuditorySoundOptionChoice = ({
	updateScore,
	showFeedback,
	setShowFeedback,
	question,
}: AuditorySoundOptionChoiceProps) => {
	const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(
		null
	);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

	// Auto play the first audio when component mounts
	useEffect(() => {
		setSelectedAnswer(null);
		setShowFeedback(false);

		if (playingAudio) {
			playingAudio.pause();
			playingAudio.currentTime = 0;
			setPlayingAudio(null);
		}

		const timeoutId = setTimeout(() => {
			console.log("Playing first audio:", question.audios[0]);

			const firstAudio = new Audio(question.audios[0]);
			setPlayingAudio(firstAudio);

			firstAudio.onended = () => {
				setPlayingAudio(null);

				if (question.audios.length != 2) return;
				const secondTimeoutId = setTimeout(() => {
					if (question.audios[1]) {
						console.log(
							"Playing second audio:",
							question.audios[1]
						);
						const secondAudio = new Audio(question.audios[1]);
						setPlayingAudio(secondAudio);
						secondAudio.onended = () => {
							setPlayingAudio(null);
						};
						secondAudio.play().catch(console.error);
					}
				}, 800);

				return () => clearTimeout(secondTimeoutId);
			};

			firstAudio.play().catch(console.error);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [question]);

	const playAudio = (audioSrc: string) => {
		console.log("playAudio called with:", audioSrc);

		if (playingAudio) {
			playingAudio.pause();
			playingAudio.currentTime = 0;
		}

		const audio = new Audio(audioSrc);
		setPlayingAudio(audio);

		audio.play().catch(console.error);

		audio.onended = () => {
			setPlayingAudio(null);
		};
	};

	const handleAnswerSelect = (answerIndex: number) => {
		if (showFeedback) return;
		setSelectedAnswer(answerIndex);
		const correct = answerIndex === question.correctOptionIndex;
		setIsCorrect(correct);
		setShowFeedback(true);

		updateScore(correct);
	};

	return (
		<div className="space-y-6">
			{/* Two speakers side by side for audio comparison */}
			<div className="flex justify-center space-x-8">
				{question.audios.map((audioSrc, idx) => (
					<div
						key={idx}
						className="flex flex-col items-center space-y-2"
					>
						<button
							onClick={() => {
								playAudio(audioSrc);
								console.log(question);
								console.log(idx);
							}}
							className="w-24 h-24 border-4 border-pink-400 rounded-2xl p-2 hover:bg-pink-50 transition"
						>
							<SpeakerIcon size={64} />
						</button>
						<span className="text-sm font-semibold text-pink-600">
							Âm {idx + 1}
						</span>
					</div>
				))}
			</div>

			{/* Question text */}
			<p className="text-xl font-semibold text-center text-pink-600 font-[Comic Sans MS,cursive,sans-serif]">
				{question.questionText}
			</p>

			{/* Options */}
			<div className="grid gap-4 max-w-md mx-auto">
				{question.options.map((option: Option, index: number) => (
					<button
						key={index}
						onClick={() => handleAnswerSelect(index)}
						disabled={showFeedback}
						className={`
                p-4 rounded-xl border-2 font-semibold text-lg transition-all
                ${
					showFeedback && selectedAnswer === index
						? isCorrect
							? "bg-green-100 border-green-400 text-green-700"
							: "bg-red-100 border-red-400 text-red-700"
						: "bg-white border-pink-300 hover:border-pink-400 hover:bg-pink-50"
				}
                ${
					showFeedback
						? "cursor-not-allowed"
						: "cursor-pointer hover:scale-105"
				}
            `}
					>
						{option.image && (
							<div className="mt-2 flex justify-center">
								<img
									src={option.image}
									alt={option.text}
									className="w-70 object-cover rounded-md"
								/>
							</div>
						)}
						{option.text}
					</button>
				))}
			</div>
		</div>
	);
};

export default AuditorySoundOptionChoice;
