"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, signupUser, logoutUser } from "@/lib/api";

interface User {
  email: string;
  username: string;
  full_name?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, full_name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (storedUser && accessToken && refreshToken) {
      setUser({ ...JSON.parse(storedUser), accessToken, refreshToken });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(username, password);
      const userData: User = {
        email: data.email,
        username: data.username,
        full_name: data.full_name,
        accessToken: data.tokens.access,
        refreshToken: data.tokens.refresh,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (email: string, username: string, full_name: string, password: string): Promise<boolean> => {
    try {
      await signupUser(email, username, full_name, password);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = async () => {
    if (user?.refreshToken) {
      try {
        await logoutUser(user.refreshToken);
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
