import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TestStepContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: string[];
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const TestStepContext = createContext<TestStepContextType | undefined>(
  undefined
);

export const useTestStep = () => {
  const context = useContext(TestStepContext);
  if (!context)
    throw new Error("useTestStep must be used within a TestStepProvider");
  return context;
};

interface TestStepProviderProps {
  testType: string;
  testSteps: string[];
  children: React.ReactNode;
}

export const TestStepProvider = ({
  testType,
  testSteps,
  children,
}: TestStepProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = testSteps;
  const location = useLocation();
  const navigate = useNavigate();

  const goToNextStep = () => {
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < steps.length) {
      // 🚨 BƯỚC SỬA 1: Cập nhật currentStep ngay lập tức
      setCurrentStep(nextStepIndex); 
      // 🚨 BƯỚC SỬA 2: Điều hướng đến bước tiếp theo
      navigate(`/test/${testType}/${steps[nextStepIndex]}`);
    }
  };

  const goToPreviousStep = () => {
    const prevStepIndex = currentStep - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
      navigate(`/test/${testType}/${steps[prevStepIndex]}`);
    }
  };

  useEffect(() => {
    const path = location.pathname
      .replace(`/test/${testType}/`, "")
      .replace(/^\//, "");
    const idx = steps.findIndex((s) => s === path);
    // Nếu URL khớp với một bước khác với bước hiện tại, cập nhật nó (đây là logic cho nút Back/Forward)
    if (idx !== -1 && idx !== currentStep) {
      setCurrentStep(idx);
    }
  }, [location.pathname, steps, currentStep, testType]);

  return (
    <TestStepContext.Provider
      value={{ currentStep, setCurrentStep, steps, goToNextStep, goToPreviousStep }}
    >
      {children}
    </TestStepContext.Provider>
  );
};