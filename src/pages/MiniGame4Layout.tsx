import { Outlet, useLocation } from "react-router-dom";
import { TestStepProvider } from "../contexts/TestStepContext";

// Define steps for MiniGame4: Space Rescue
const MINIGAME4_STEPS: string[] = ["instruction", "start", "rating"];

const MiniGame4Layout = () => {
  const location = useLocation();
  const isGamePage = location.pathname.includes("/start");

  // Game page needs full screen without wrapper constraints
  if (isGamePage) {
    return (
      <TestStepProvider testType="minigame4" testSteps={MINIGAME4_STEPS}>
        <Outlet />
      </TestStepProvider>
    );
  }

  // Instruction and rating pages use centered layout
  return (
    <TestStepProvider testType="minigame4" testSteps={MINIGAME4_STEPS}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div>
          <Outlet />
        </div>
      </div>
    </TestStepProvider>
  );
};

export default MiniGame4Layout;
