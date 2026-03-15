import apiClient from "./apiClient";
import type { Account, CreateProfileData, Profile } from "../types/account";

/**
 * Service for account-related operations.
 */
export const accountService = {
  /**
   * Fetch current account details.
   */
  getCurrentAccount: async (): Promise<Account> => {
    return await apiClient.get("/account/me");
  },

  /**
   * Fetch all profiles for the current account.
   */
  getProfiles: async (): Promise<Profile[]> => {
    return await apiClient.get("/account/profiles");
  },

  /**
   * Create a new profile for the current account.
   */
  createProfile: async (profileData: CreateProfileData): Promise<Profile> => {
    return await apiClient.post("/account/profiles", profileData);
  },

  /**
   * Get the active (selected) profile for this account.
   */
  getCurrentProfile: async (): Promise<Profile> => {
    return await apiClient.get("/user/profiles/me");
  },

  /**
   * Retrieve a profile by ID.
   */
  getProfileById: async (profileId: number): Promise<Profile> => {
    return await apiClient.get(`/account/profiles/${profileId}`);
  },

  /**
   * Update an existing profile.
   */
  updateProfile: async (
    profileId: number,
    profileData: Partial<Profile>
  ): Promise<Profile> => {
    return await apiClient.put(`/account/profiles/${profileId}`, profileData);
  },

  /**
   * Delete a profile by ID.
   */
  deleteProfile: async (profileId: number): Promise<void> => {
    return await apiClient.delete(`/account/profiles/${profileId}`);
  },

  /**
   * Select a profile and receive an access token.
   */
  selectProfile: async (
    profileId: number
  ): Promise<{ access_token: string; token_type: string }> => {
    return await apiClient.post(`/account/profiles/${profileId}/select`);
  },
};
