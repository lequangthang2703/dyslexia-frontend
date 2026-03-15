import LanguageTestInstruction from "../../../components/tests/language/LanguageTestInstruction";
import { useTestStep } from "../../../contexts/TestStepContext";

const LanguageTestInstructionPage = () => {
  const { goToNextStep } = useTestStep();

  return <LanguageTestInstruction onStartTest={goToNextStep} />;
};

export default LanguageTestInstructionPage;
