import apiClient from "./apiClient";
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "../types/auth";

/**
 * Service for handling authentication-related operations.
 */
export const authService = {
	/**
	 * Logs in a user.
	 */
	login: async (loginRequest: LoginRequest): Promise<LoginResponse> => {
		return await apiClient.post("/public/auth/login", loginRequest);
	},

	/**
	 * Logs out the user by removing the token.
	 */
	logout: (): void => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("profile_token");
	},

	/**
	 * Registers a new user.
	 */
	register: async (registerRequest: RegisterRequest): Promise<RegisterResponse> => {
		return await apiClient.post("/public/auth/register", registerRequest);
	}
}