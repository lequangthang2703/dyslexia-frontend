import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { TestSession } from "../types/testSession";

type MainTestType = "auditory" | "visual" | "language";

interface TestStatus {
  completed: boolean;
  completedAt?: Date;
  score?: number;
  difficultyRating?: number;
}

interface TestProgressState {
  auditory: TestStatus;
  visual: TestStatus;
  language: TestStatus;
  currentSessionId: number | null;
  currentSession: TestSession | null;
}

interface TestCompletionData {
  score?: number;
  difficultyRating?: number;
}

interface TestProgressContextType {
  progress: TestProgressState;
  markTestComplete: (testType: MainTestType, data: TestCompletionData) => void;
  getNextIncompleteTest: () => MainTestType | null;
  resetProgress: () => void;
  isAllTestsComplete: boolean;
  setCurrentSession: (session: TestSession | null) => void;
  setCurrentSessionId: (id: number | null) => void;
  syncWithBackendSession: (session: TestSession) => void;
}

const TestProgressContext = createContext<TestProgressContextType | undefined>(
  undefined
);

const STORAGE_KEY = "dyslexia_test_progress";

const initialState: TestProgressState = {
  auditory: { completed: false },
  visual: { completed: false },
  language: { completed: false },
  currentSessionId: null,
  currentSession: null,
};

export const TestProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [progress, setProgress] = useState<TestProgressState>(() => {
    // Load from localStorage on init
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert ISO date strings back to Date objects
        if (parsed.auditory?.completedAt) {
          parsed.auditory.completedAt = new Date(parsed.auditory.completedAt);
        }
        if (parsed.visual?.completedAt) {
          parsed.visual.completedAt = new Date(parsed.visual.completedAt);
        }
        if (parsed.language?.completedAt) {
          parsed.language.completedAt = new Date(parsed.language.completedAt);
        }
        return { ...initialState, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load test progress from localStorage:", error);
    }
    return initialState;
  });

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save test progress to localStorage:", error);
    }
  }, [progress]);

  const markTestComplete = (
    testType: MainTestType,
    data: TestCompletionData
  ) => {
    setProgress((prev) => ({
      ...prev,
      [testType]: {
        completed: true,
        completedAt: new Date(),
        score: data.score,
        difficultyRating: data.difficultyRating,
      },
    }));
  };

  const getNextIncompleteTest = (): MainTestType | null => {
    const testOrder: MainTestType[] = ["auditory", "visual", "language"];
    for (const testType of testOrder) {
      if (!progress[testType].completed) {
        return testType;
      }
    }
    return null; // All tests completed
  };

  const resetProgress = () => {
    setProgress(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear test progress from localStorage:", error);
    }
  };

  const setCurrentSession = (session: TestSession | null) => {
    setProgress((prev) => ({
      ...prev,
      currentSession: session,
      currentSessionId: session?.id || null,
    }));
  };

  const setCurrentSessionId = (id: number | null) => {
    setProgress((prev) => ({
      ...prev,
      currentSessionId: id,
    }));
  };

  // Sync local progress with backend session data
  const syncWithBackendSession = (session: TestSession) => {
    setProgress((prev) => ({
      ...prev,
      currentSessionId: session.id,
      currentSession: session,
      auditory: {
        ...prev.auditory,
        completed: session.taken_auditory_test,
      },
      visual: {
        ...prev.visual,
        completed: session.taken_visual_test,
      },
      language: {
        ...prev.language,
        completed: session.taken_language_test,
      },
    }));
  };

  const isAllTestsComplete =
    progress.auditory.completed &&
    progress.visual.completed &&
    progress.language.completed;

  return (
    <TestProgressContext.Provider
      value={{
        progress,
        markTestComplete,
        getNextIncompleteTest,
        resetProgress,
        isAllTestsComplete,
        setCurrentSession,
        setCurrentSessionId,
        syncWithBackendSession,
      }}
    >
      {children}
    </TestProgressContext.Provider>
  );
};

export const useTestProgress = () => {
  const context = useContext(TestProgressContext);
  if (!context) {
    throw new Error(
      "useTestProgress must be used within a TestProgressProvider"
    );
  }
  return context;
};
