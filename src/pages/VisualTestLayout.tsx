import { Outlet } from "react-router-dom";
import { TestStepProvider } from "../contexts/TestStepContext";

// ĐỊNH NGHĨA CÁC BƯỚC CHÍNH XÁC (8 VÒNG TEST)
const VISUAL_TEST_STEPS = [
	"instruction",
	"simple/1", // Round 1 (Lẻ - Simple)
	"hard/2",   // Round 2 (Chẵn - Hard)
	"simple/3", // Round 3 (Lẻ - Simple)
	"hard/4",   // Round 4 (Chẵn - Hard)
	"simple/5", // Round 5 (Lẻ - Simple)
	"hard/6",   // Round 6 (Chẵn - Hard)
	"simple/7", // Round 7 (Lẻ - Simple)
	"hard/8",   // Round 8 (Chẵn - Hard)
	"rating",
];

const VisualTestLayout = () => (
	<TestStepProvider testType="visual" testSteps={VISUAL_TEST_STEPS}>
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100">
			<div>
				<Outlet />
			</div>
		</div>
	</TestStepProvider>
);

export default VisualTestLayout;