import apiClient from "./apiClient";
import type {
  SubmitSpecificTestSessionParams,
  TestSession,
} from "../types/testSession";

// interface SubmitAuditoryFeatureParams {
//   question_type: string;
//   start_time: string;
//   end_time: string;
//   first_click_interval: string;
//   second_click_interval: string;
//   third_click_interval: string;
//   fourth_click_interval: string;
//   fifth_click_interval: string;
//   sixth_click_interval: string;
//   duration_from_round: string;
//   duration_from_interaction: string;
//   total_clicks: number;
//   logic: boolean;
//   instructions_viewed: number;
// }

// interface SubmitVisualFeatureParams {
//   question_type: string;
//   start_time: string;
//   end_time: string;
//   total_clicks: number;
//   first_click_interval: string;
//   second_click_interval: string;
//   third_click_interval: string;
//   fourth_click_interval: string;
//   fifth_click_interval: string;
//   sixth_click_interval: string;
//   time_last_click: string;
//   correct_answers: number;
//   wrong_answers: number;
// }

// interface SubmitLanguageFeatureParams {
//   question_type: string;
//   start_time: string;
//   end_time: string;
//   clicks: number;
//   hits: number;
//   misses: number;
// }

// interface RatingFeatureParams {
//   feature: string;
//   rating: number;
// }

export const testSessionService = {
  /**
   * Fetches all test sessions.
   */
  getAllTestSessions: async (): Promise<TestSession[]> => {
    const response = await apiClient.get("/test-session/");
    return response as unknown as TestSession[];
  },

  /**
   * Starts a new test session.
   */
  startTestSession: async (): Promise<TestSession> => {
    const response = await apiClient.post("/test-session/");
    return response as unknown as TestSession;
  },

  /**
   * Fetches a test session by ID.
   */
  getTestSessionById: async (testSessionId: number): Promise<TestSession> => {
    const response = await apiClient.get(`/test-session/${testSessionId}`);
    return response as unknown as TestSession;
  },

  /**
   * Submits a specific test session.
   */
  submitTestSection: async (
    testSessionId: number,
    submitTestParams: SubmitSpecificTestSessionParams
  ) => {
    const response = await apiClient.post(
      `/test-session/${testSessionId}/submit`,
      submitTestParams
    );
    return response;
  },
};
