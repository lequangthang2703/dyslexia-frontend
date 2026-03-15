import { Outlet } from "react-router-dom";
import { TestStepProvider } from "../contexts/TestStepContext";

// Khai báo kiểu string[] thay vì readonly tuple
const MINIGAME1_STEPS: string[] = ["instruction", "start", "rating"];

const MiniGame1Layout = () => (
  <TestStepProvider testType="minigame1" testSteps={MINIGAME1_STEPS}>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-cyan-50">
      <div>
        <Outlet />
      </div>
    </div>
  </TestStepProvider>
);

export default MiniGame1Layout;
