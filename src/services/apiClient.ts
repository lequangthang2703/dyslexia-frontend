import axios from "axios";
import type {
	InternalAxiosRequestConfig,
	AxiosInstance,
	AxiosResponse,
} from "axios";

const API_BASE_URL: string =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/v1";

const API_TIMEOUT: number = parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000;

const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: API_TIMEOUT,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const profileToken = localStorage.getItem("profile_token");
    const token = localStorage.getItem("access_token");
    config.headers.Authorization = profileToken
      ? `Bearer ${profileToken}`
      : token
      ? `Bearer ${token}`
      : "";
    return config;
  },
  (error: any) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => response.data,
	(error: any) => {
		if (error.response && error.response.status === 401) {
			console.error("UNAUTHORIZED: 401 detected, initiating logout...");

			// 1. Clear all tokens from localStorage
			localStorage.removeItem('access_token');
			localStorage.removeItem('profile_token');
			localStorage.removeItem('selected_profile');
			localStorage.removeItem('dyslexia_test_progress');

			// 2. Show toast notification (dynamic import to avoid circular dependencies)
			import('../utils/toast').then(({ toastError }) => {
				toastError('Session expired. Please login again.');
			}).catch(err => {
				console.error('Failed to show toast:', err);
			});

			// 3. Dispatch custom event for AuthContext to update React state
			window.dispatchEvent(new CustomEvent('auth:unauthorized'));

			// 4. Redirect to login page
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default apiClient;
