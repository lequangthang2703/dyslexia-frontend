import AuditoryTestInstruction from "../../../components/tests/auditory/AuditoryTestInstruction";
import { useTestStep } from "../../../contexts/TestStepContext";

const AuditoryTestInstructionPage = () => {
  const { goToNextStep } = useTestStep();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-cyan p-8 rounded-2xl">
      <AuditoryTestInstruction goToNextStep={goToNextStep} />
    </div>
  );
};

export default AuditoryTestInstructionPage;
