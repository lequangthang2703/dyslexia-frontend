import { Outlet } from "react-router-dom";
import { TestStepProvider } from "../contexts/TestStepContext";

const MINIGAME2_STEPS = [
	"instruction",
	"start",
	"rating",
];

const MiniGame2Layout = () => (
	<TestStepProvider testType="minigame2" testSteps={MINIGAME2_STEPS}>
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-cyan-50">
			<div>
				<Outlet />
			</div>
		</div>
	</TestStepProvider>
);

export default MiniGame2Layout;