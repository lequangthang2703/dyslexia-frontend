import VisualTestInstruction from "../../../components/tests/visual/VisualTestInstruction";
import { useTestStep } from "../../../contexts/TestStepContext";

const VisualTestInstructionPage = () => {
  const { goToNextStep } = useTestStep();

  return <VisualTestInstruction onStartTest={goToNextStep} />;
};

export default VisualTestInstructionPage;
