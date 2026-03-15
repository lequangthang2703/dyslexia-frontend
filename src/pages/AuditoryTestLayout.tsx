import { Outlet } from "react-router-dom";
import { TestStepProvider } from "../contexts/TestStepContext";

const AUDITORY_TEST_STEPS = ["instruction", "questions", "rating"];

const AuditoryTestLayout = () => {
  return (
    <TestStepProvider testType="auditory" testSteps={AUDITORY_TEST_STEPS}>
      <Outlet />
    </TestStepProvider>
  );
};

export default AuditoryTestLayout;
