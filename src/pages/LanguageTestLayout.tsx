import { Outlet } from "react-router-dom";
import { TestStepProvider } from "../contexts/TestStepContext";

const LANGUAGE_TEST_STEPS = ["instruction", "test", "rating"];

const LanguageTestLayout = () => {
  return (
    <TestStepProvider testType="language" testSteps={LANGUAGE_TEST_STEPS}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100">
        <div className="w-full max-w-4xl px-4 py-8">
          <Outlet />
        </div>
      </div>
    </TestStepProvider>
  );
};

export default LanguageTestLayout;
