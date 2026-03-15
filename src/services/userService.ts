import apiClient from "./apiClient";
import type { Profile } from "../types/account";

interface ProfileUpdateInfo {
  name: string;
  year_of_birth: number;
  email: string;
  gender: string;
  mother_tongue: string;
  official_dyslexia_diagnosis: string;
}

const userService = {
  /**
   * Updates profile information via /account/profiles/{profile_id}.
   * @param profileId - The profile ID to update.
   * @param profileInfo - The profile information to update.
   */
  updateProfile: async (
    profileId: number,
    profileInfo: Partial<ProfileUpdateInfo>
  ): Promise<Profile> => {
    return await apiClient.put(`/account/profiles/${profileId}`, profileInfo);
  },
};

export default userService;
