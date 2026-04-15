import VietnameseVisualTestInstruction from "../../../components/tests/visual/VietnameseVisualTestInstruction";
import { useTestStep } from "../../../contexts/TestStepContext";

const VisualTestInstructionPage = () => {
  const { goToNextStep } = useTestStep();

  return <VietnameseVisualTestInstruction onStartTest={goToNextStep} />;
};

export default VisualTestInstructionPage;
