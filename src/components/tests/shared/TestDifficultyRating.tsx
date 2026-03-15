import { useState } from "react";
import _ from "lodash";
import type { TestType } from "../../../enum";

const DEFAULT_LABELS = {
	1: "Very Easy",
	2: "Easy",
	3: "Moderate",
	4: "Difficult",
	5: "Very Difficult",
};

const specialStyle = `
  .custom-range {
    width: 100%;
    max-width: 320px;
    height: 8px;
    border-radius: 4px;
    accent-color: #db2777; /* pink-600 */
    background: transparent;
  }
  .custom-range::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(
      to right,
      #db2777 0%,
      #db2777 var(--val, 50%),
      #fff var(--val, 50%),
      #fff 100%
    );
  }
  .custom-range::-moz-range-track {
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(
      to right,
      #db2777 0%,
      #db2777 var(--val, 50%),
      #fff var(--val, 50%),
      #fff 100%
    );
  }
  .custom-range::-ms-fill-lower {
    background: #db2777;
    border-radius: 4px 0 0 4px;
  }
  .custom-range::-ms-fill-upper {
    background: #fff;
    border-radius: 0 4px 4px 0;
  }
  .custom-range::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
    background: #db2777;
    border: 3px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -4px;
    box-shadow: 0 2px 8px #db277724;
    transition: background 0.2s;
  }
  .custom-range:focus::-webkit-slider-thumb {
    outline: 2px solid #be185d; /* pink-700 for focus state */
  }
  .custom-range::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #db2777;
    border: 3px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px #db277724;
    transition: background 0.2s;
  }
  .custom-range:focus::-moz-range-thumb {
    outline: 2px solid #be185d; /* pink-700 */
  }
  .custom-range::-ms-thumb {
    width: 24px;
    height: 24px;
    background: #db2777;
    border: 3px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px #db277724;
    transition: background 0.2s;
  }
  .custom-range:focus::-ms-thumb {
    outline: 2px solid #be185d; /* pink-700 */
  }
  .custom-range:focus {
    outline: none;
  }
  .custom-range::-moz-focus-outer {
    border: 0;
  }
`;

interface TestDifficultyRatingProps {
	testType: TestType;
	onSubmit: (rating: number) => void;
	defaultValue?: number;
	min?: number;
	max?: number;
	ratingLabels?: Record<number, string>;
}

const TestDifficultyRating = ({
	testType,
	onSubmit,
	defaultValue = 3,
	min = 1,
	max = 5,
	ratingLabels = DEFAULT_LABELS,
}: TestDifficultyRatingProps) => {
	const [rating, setRating] = useState(defaultValue);

	// Calculate percent for background
	const percent = ((rating - min) / (max - min)) * 100;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRating(Number(e.target.value));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// alert(`You rated the ${testType} test as: ${rating}`);
		onSubmit(rating);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col bg-white/90 border-4 border-pink-200  p-8 rounded-2xl items-center space-y-4 shadow-lg max-w-md w-full mx-auto mt-10"
		>
			{/* Heading, icon, instructions */}
			<div className="flex flex-col items-center w-full">
				<h2 className="text-2xl text-pink-600 font-bold text-center mb-1">
					{_.capitalize(testType)} Test Difficulty Rating
				</h2>
				<div className="font-bold text-black text-center mb-2 mt-2">
					How difficult was that for you?
				</div>
				<div className="text-justify text-gray-700 mb-2">
					Please rate how difficult you found the {testType} test you
					just completed.
				</div>
				<div className="mb-3 text-black font-semibold text-justify">
					Rating from 1 to 5 (1 = Very Easy, 5 = Very Difficult) on
					the difficulty of the {testType} test.
				</div>
			</div>
			{/* Range Slider (styled to match) */}
			<div className="w-full flex flex-col items-center">
				<style>{specialStyle}</style>
				<input
					type="range"
					min={min}
					max={max}
					step={1}
					value={rating}
					onChange={handleChange}
					className="custom-range"
					style={{ "--val": `${percent}%` } as React.CSSProperties}
				/>
				{/* Numbers */}
				<div className="flex justify-between w-full max-w-xs text-pink-600 font-bold select-none mt-3 text-lg">
					{Array.from({ length: 5 }).map((_, i) => (
						<span key={i} className="text-[18px]">
							{i + 1}
						</span>
					))}
				</div>
				{/* Label below the current rating */}
				{ratingLabels[rating as keyof typeof ratingLabels] && (
					<div className="mt-2 text-black font-semibold text-[17px]">
						{ratingLabels[rating as keyof typeof ratingLabels]}
					</div>
				)}
			</div>
			{/* Submit button */}
			<button
				type="submit"
				className="bg-pink-500 py-2 w-full rounded-lg text-white font-semibold hover:bg-pink-600 transition focus:ring-2 focus:ring-pink-200 focus:outline-none"
			>
				Submit
			</button>
		</form>
	);
};

export default TestDifficultyRating;
