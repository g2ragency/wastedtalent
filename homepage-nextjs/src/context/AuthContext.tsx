"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (
    firstName: string,
    lastName: string,
    email: string,
  ) => Promise<{ success: boolean; message?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "wtu_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from storage and validate on mount
  useEffect(() => {
    const storedToken =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const res = await fetch(
        `/api/auth/me?token=${encodeURIComponent(authToken)}`,
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          setToken(authToken);
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  };

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean = false,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          const authToken = data.data.token;
          setToken(authToken);
          setUser(data.data.user);

          // Store in localStorage (persistent) or sessionStorage (session only)
          if (rememberMe) {
            localStorage.setItem(TOKEN_KEY, authToken);
          } else {
            sessionStorage.setItem(TOKEN_KEY, authToken);
          }

          return { success: true };
        }

        return { success: false, message: data.message || "Login failed" };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          const authToken = data.data.token;
          setToken(authToken);
          setUser(data.data.user);
          localStorage.setItem(TOKEN_KEY, authToken);

          return { success: true };
        }

        return {
          success: false,
          message: data.message || "Registration failed",
        };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, []);

  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          return { success: true };
        }

        return { success: false, message: data.message || "Request failed" };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [],
  );

  const updateProfile = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const currentToken =
          token ||
          localStorage.getItem(TOKEN_KEY) ||
          sessionStorage.getItem(TOKEN_KEY);

        if (!currentToken) {
          return { success: false, message: "Not authenticated" };
        }

        const res = await fetch("/api/auth/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: currentToken,
            firstName,
            lastName,
            email,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setUser(data.data);
          return { success: true };
        }

        return { success: false, message: data.message || "Update failed" };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [token],
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const currentToken =
          token ||
          localStorage.getItem(TOKEN_KEY) ||
          sessionStorage.getItem(TOKEN_KEY);

        if (!currentToken) {
          return { success: false, message: "Not authenticated" };
        }

        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: currentToken,
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Update token since password change generates a new one
          if (data.data?.token) {
            const newToken = data.data.token;
            setToken(newToken);
            if (localStorage.getItem(TOKEN_KEY)) {
              localStorage.setItem(TOKEN_KEY, newToken);
            } else {
              sessionStorage.setItem(TOKEN_KEY, newToken);
            }
          }
          return { success: true };
        }

        return {
          success: false,
          message: data.message || "Password change failed",
        };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    [token],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
