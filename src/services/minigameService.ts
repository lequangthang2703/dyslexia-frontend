import apiClient from "./apiClient";
import type {
  MinigameCreate,
  MinigameResponse,
  MinigameNumber,
} from "../types/minigame";

/**
 * Service for minigame-related operations.
 */
export const minigameService = {
  /**
   * Fetch all minigame attempts for the current profile.
   * @param minigameNumber - Optional filter by minigame number.
   */
  getAllMinigames: async (
    minigameNumber?: MinigameNumber
  ): Promise<MinigameResponse[]> => {
    const params = minigameNumber ? { minigame_number: minigameNumber } : {};
    return await apiClient.get("/minigame/", { params });
  },

  /**
   * Fetch a specific minigame attempt by ID.
   * @param minigameId - The ID of the minigame attempt.
   */
  getMinigameById: async (minigameId: number): Promise<MinigameResponse> => {
    return await apiClient.get(`/minigame/${minigameId}`);
  },

  /**
   * Submit a new minigame attempt.
   * @param minigameData - The minigame attempt data.
   */
  submitMinigame: async (
    minigameData: MinigameCreate
  ): Promise<MinigameResponse> => {
    return await apiClient.post("/minigame/", minigameData);
  },
};
