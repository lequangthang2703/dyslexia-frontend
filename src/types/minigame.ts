export type MinigameNumber = "one" | "two" | "three" | "four" | "five";

export interface MinigameBase {
  minigame_number: MinigameNumber;
  score: number;
  minigame_details: Record<string, any>;
  attempted_at: string;
}

export interface MinigameCreate extends MinigameBase {}

export interface MinigameResponse extends MinigameBase {
  id: number;
  profile_id: number;
}
