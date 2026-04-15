import { useCallback, useEffect, useRef, useState } from "react";
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

export type AuditoryAnswerTelemetry = {
	selectedOptionIndex: number;
	isCorrect: boolean;
	reactionTimeMs: number;
	replayCount: number;
	answeredAt: string;
};

export interface AuditorySoundOptionChoiceProps extends TestComponentProps {
	question: AuditorySoundOptionChoiceQuestion;
	onAnswer?: (telemetry: AuditoryAnswerTelemetry) => void;
}

const AuditorySoundOptionChoice = ({
	updateScore,
	showFeedback,
	setShowFeedback,
	question,
	onAnswer,
}: AuditorySoundOptionChoiceProps) => {
	const [, setPlayingAudio] = useState<HTMLAudioElement | null>(
		null
	);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const startedAtRef = useRef(Date.now());
	const replayCountRef = useRef(0);
	const playingAudioRef = useRef<HTMLAudioElement | null>(null);

	const stopCurrentAudio = useCallback(() => {
		if (!playingAudioRef.current) return;
		playingAudioRef.current.pause();
		playingAudioRef.current.currentTime = 0;
		playingAudioRef.current = null;
		setPlayingAudio(null);
	}, []);

	// Auto play the first audio when component mounts
	useEffect(() => {
		setSelectedAnswer(null);
		setShowFeedback(false);
		startedAtRef.current = Date.now();
		replayCountRef.current = 0;

		stopCurrentAudio();

		const timeoutId = setTimeout(() => {
			const firstAudio = new Audio(question.audios[0]);
			playingAudioRef.current = firstAudio;
			setPlayingAudio(firstAudio);

			firstAudio.onended = () => {
				if (playingAudioRef.current === firstAudio) {
					playingAudioRef.current = null;
				}
				setPlayingAudio(null);

				if (question.audios.length != 2) return;
				const secondTimeoutId = setTimeout(() => {
					if (question.audios[1]) {
						const secondAudio = new Audio(question.audios[1]);
						playingAudioRef.current = secondAudio;
						setPlayingAudio(secondAudio);
						secondAudio.onended = () => {
							if (playingAudioRef.current === secondAudio) {
								playingAudioRef.current = null;
							}
							setPlayingAudio(null);
						};
						secondAudio.play().catch(console.error);
					}
				}, 800);

				return () => clearTimeout(secondTimeoutId);
			};

			firstAudio.play().catch(console.error);
		}, 500);

		return () => {
			clearTimeout(timeoutId);
			stopCurrentAudio();
		};
	}, [question, setShowFeedback, stopCurrentAudio]);

	const playAudio = (audioSrc: string) => {
		replayCountRef.current += 1;
		stopCurrentAudio();

		const audio = new Audio(audioSrc);
		playingAudioRef.current = audio;
		setPlayingAudio(audio);

		audio.play().catch(console.error);

		audio.onended = () => {
			if (playingAudioRef.current === audio) {
				playingAudioRef.current = null;
			}
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
		onAnswer?.({
			selectedOptionIndex: answerIndex,
			isCorrect: correct,
			reactionTimeMs: Date.now() - startedAtRef.current,
			replayCount: replayCountRef.current,
			answeredAt: new Date().toISOString(),
		});
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
