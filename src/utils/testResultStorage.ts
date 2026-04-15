export type StoredTestType = "auditory" | "visual" | "language";

export interface StoredTestResult<TDetails = unknown> {
  testType: StoredTestType;
  score: number;
  rawScore?: number;
  maxScore?: number;
  startedAt: string;
  completedAt: string;
  durationMs?: number;
  details: TDetails;
}

const getStorageKey = (testType: StoredTestType) =>
  `dyslexia_${testType}_test_result`;

export const saveTestResult = <TDetails>(
  testType: StoredTestType,
  result: Omit<StoredTestResult<TDetails>, "testType">
) => {
  const payload: StoredTestResult<TDetails> = {
    ...result,
    testType,
    score: Math.max(0, Math.min(100, Math.round(result.score))),
  };

  localStorage.setItem(getStorageKey(testType), JSON.stringify(payload));
  return payload;
};

export const getTestResult = <TDetails = unknown>(
  testType: StoredTestType
): StoredTestResult<TDetails> | null => {
  const stored = localStorage.getItem(getStorageKey(testType));
  if (!stored) return null;

  try {
    return JSON.parse(stored) as StoredTestResult<TDetails>;
  } catch (error) {
    console.error(`Failed to parse ${testType} test result`, error);
    return null;
  }
};

export const clearTestResult = (testType: StoredTestType) => {
  localStorage.removeItem(getStorageKey(testType));
};
