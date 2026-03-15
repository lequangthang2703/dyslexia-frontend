import { createContext, useState, useEffect } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { authService } from "../services/authService";
import { accountService } from "../services/accountService";

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  profiles?: Profile[];
  selected_profile?: Profile | null;
}

export interface Profile {
  id: number;
  account_id?: number;
  profile_type: string;
  created_at: string;

  name?: string;
  year_of_birth?: number;
  email?: string;
  mother_tongue?: string;
  gender?: string;
  official_dyslexia_diagnosis?: string;
  hobbies?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface ProfileSelectionResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  token: string | null;
  profileToken: string | null;
  user: User | null;
  selectedProfile: Profile | null;
  isAuthenticated: boolean;
  hasSelectedProfile: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  selectProfile: (profileId: number) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const TOKEN_KEY = "access_token";
const PROFILE_TOKEN_KEY = "profile_token";
const SELECTED_PROFILE_KEY = "selected_profile";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [profileToken, setProfileToken] = useState<string | null>(() =>
    localStorage.getItem(PROFILE_TOKEN_KEY)
  );
  const [user, setUser] = useState<User | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(() => {
    const stored = localStorage.getItem(SELECTED_PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate and fetch user on auth_token
  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      // Check profile token first, then auth token
      const currentToken = profileToken || token;

      if (currentToken) {
        try {
          const decoded: JwtPayload = jwtDecode(currentToken);
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            handleLogout();
          } else {
            await fetchUserProfile();
          }
        } catch (error: any) {
          console.error("Token validation error:", error);
          handleLogout();
        }
      } else {
        setLoading(false);
      }
    };

    validateTokenAndFetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, profileToken]);

  // Listen for unauthorized events from API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Received auth:unauthorized event, logging out...");
      handleLogout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user and profiles
  const fetchUserProfile = async () => {
    try {
      // const response = await apiClient.get<User>("/account/me");
      const accountDetails = await accountService.getCurrentAccount();
      setUser(() => ({
        id: accountDetails.id,
        email: accountDetails.email,
        name: accountDetails.profiles?.[0]?.name || "DEFAULT",
        created_at: accountDetails.created_at,
        profiles: accountDetails.profiles,
      }));
    } catch (error: any) {
      console.error("Fetch user profile error:", error);
      // If profile token fails, try with auth token only
      if (profileToken && token) {
        setProfileToken(null);
        setSelectedProfile(null);
        localStorage.removeItem(PROFILE_TOKEN_KEY);
        localStorage.removeItem(SELECTED_PROFILE_KEY);
        // This will trigger useEffect again with just the auth token
        return;
      }
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setProfileToken(null);
    setUser(null);
    setSelectedProfile(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_TOKEN_KEY);
    localStorage.removeItem(SELECTED_PROFILE_KEY);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: LoginResponse = await authService.login({
        email,
        password,
      });

      if (data.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setToken(data.access_token);
      } else {
        throw new Error("No access token in login response");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
      handleLogout();
    } finally {
      // Loading is set to false in fetchUserProfile's finally block
      // or immediately if there's an error
      if (error) {
        setLoading(false);
      }
    }
  };

  const selectProfile = async (profileId: number) => {
    setLoading(true);
    setError(null);

    try {
      const data: ProfileSelectionResponse = await accountService.selectProfile(
        profileId
      );

      setUser((prev) => {
        if (prev) {
          const selected = prev.profiles?.find((p) => p.id === profileId);

          console.log("Selected profile hehe:", {
            ...prev,
            selected_profile: selected || null,
          });

          return {
            ...prev,
            selected_profile: selected || null,
          };
        }
        return prev;
      });

      setSelectedProfile(() => {
        const selected = user?.profiles?.find((p) => p.id === profileId);
        return selected || null;
      });

      if (data.access_token) {
        localStorage.setItem(PROFILE_TOKEN_KEY, data.access_token);
        setProfileToken(data.access_token);
      } else {
        throw new Error("No access token in profile selection response");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Profile selection failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    handleLogout();
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    token,
    profileToken,
    user,
    selectedProfile,
    isAuthenticated: !!user,
    hasSelectedProfile: !!profileToken,
    loading,
    error,
    login,
    selectProfile,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
