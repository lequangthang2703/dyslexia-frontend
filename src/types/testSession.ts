export interface StartSpecificTestSessionParams {
  test_type: "AUDITORY" | "VISUAL" | "LANGUAGE";
}

export interface SubmitSpecificTestSessionParams {
  score: number;
  test_details: any;
  test_type: "AUDITORY" | "VISUAL" | "LANGUAGE";
}

export interface TestSession {
  id: number;
  profile_id: number;
  start_time: string;
  end_time: string | null;
  completed: boolean;
  taken_auditory_test: boolean;
  taken_visual_test: boolean;
  taken_language_test: boolean;
  result: string | null;
  total_score: number | null;
  auditory_score: number | null;
  visual_score: number | null;
  language_score: number | null;
}
