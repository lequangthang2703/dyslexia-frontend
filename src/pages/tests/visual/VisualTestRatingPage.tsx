import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTestProgress } from "../../../hooks/useTestProgress";
import TestDifficultyRating from "../../../components/tests/shared/TestDifficultyRating";
import { toastSuccess, toastInfo, toastError } from "../../../utils/toast";
import { testSessionService } from "../../../services/testSessionService";
import type { TestSession } from "../../../types/testSession";

const VisualTestRatingPage = () => {
  const navigate = useNavigate();
  const {
    markTestComplete,
    progress,
    setCurrentSessionId,
    syncWithBackendSession,
  } = useTestProgress();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to determine next test based on backend session state
  const getNextTestFromSession = (session: TestSession): string | null => {
    // Order: auditory > visual > language
    if (!session.taken_auditory_test) return "auditory";
    if (!session.taken_visual_test) return "visual";
    if (!session.taken_language_test) return "language";
    return null; // All tests completed
  };

  const handleSubmit = async (rating: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Get or create test session
      let testSessionId: number | null = progress.currentSessionId;

      if (!testSessionId) {
        // Try to find an incomplete session or create a new one
        const sessions = await testSessionService.getAllTestSessions();
        const incompleteSession = Array.isArray(sessions)
          ? sessions.find((s: any) => !s.completed)
          : null;
        if (incompleteSession) {
          testSessionId = incompleteSession.id;
        } else {
          const newSession = await testSessionService.startTestSession();
          testSessionId = newSession.id;
        }
        setCurrentSessionId(testSessionId);
      }

      if (!testSessionId) {
        throw new Error("Could not get or create test session");
      }

      const score = progress.visual.score || 80;

      await testSessionService.submitTestSection(testSessionId, {
        score,
        test_details: {
          difficultyRating: rating,
          completedAt: new Date().toISOString(),
        },
        test_type: "VISUAL",
      });

      // Mark visual test as complete
      markTestComplete("visual", { difficultyRating: rating, score });

      // Fetch updated session from backend to get accurate state
      const updatedSession = await testSessionService.getTestSessionById(
        testSessionId
      );
      syncWithBackendSession(updatedSession);

      // Determine next test based on backend session state
      const nextTest = getNextTestFromSession(updatedSession);

      if (nextTest) {
        toastSuccess("Hoàn thành bài test thị giác!");
        const testNames: Record<string, string> = {
          auditory: "thính giác",
          visual: "thị giác",
          language: "ngôn ngữ",
        };
        toastInfo(`Tiếp tục với bài test ${testNames[nextTest]}...`);
        navigate(`/test/${nextTest}/instruction`);
      } else {
        // All tests completed - navigate to results
        toastSuccess("Hoàn thành tất cả bài test!");
        navigate(`/results/${testSessionId}`);
      }
    } catch (error: any) {
      console.error("Failed to submit test:", error);
      toastError("Gửi kết quả thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <TestDifficultyRating testType="visual" onSubmit={handleSubmit} />;
};

export default VisualTestRatingPage;
