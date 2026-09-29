"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types";
import { apiClient, extractApiData } from "../api/client";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<User | null>;
  register: (name: string, phone: string, password?: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("usta_top_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<any>("/auth/me/");
      const userData = extractApiData<User>(res);
      if (userData && (userData.id || userData.phone)) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem("usta_top_token");
      localStorage.removeItem("usta_top_refresh");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (phone: string, password = "password123") => {
    const res = await apiClient.post<any>("/auth/login/", { phone, password });
    const data = extractApiData<any>(res);
    if (data?.tokens?.access) {
      localStorage.setItem("usta_top_token", data.tokens.access);
      if (data.tokens.refresh) {
        localStorage.setItem("usta_top_refresh", data.tokens.refresh);
      }
    }
    if (data?.user) {
      setUser(data.user);
      return data.user;
    }
    await refreshUser();
    return null;
  };

  const register = async (name: string, phone: string, password = "password123", role: UserRole = "CUSTOMER") => {
    const res = await apiClient.post<any>("/auth/register/", { name, phone, password, role });
    const data = extractApiData<any>(res);
    if (data?.tokens?.access) {
      localStorage.setItem("usta_top_token", data.tokens.access);
      if (data.tokens.refresh) {
        localStorage.setItem("usta_top_refresh", data.tokens.refresh);
      }
    }
    if (data?.user) {
      setUser(data.user);
      return;
    }
    await refreshUser();
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      const refresh = localStorage.getItem("usta_top_refresh");
      if (refresh) {
        apiClient.post("/auth/logout/", { refresh }).catch(() => {});
      }
      localStorage.removeItem("usta_top_token");
      localStorage.removeItem("usta_top_refresh");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "CUSTOMER",
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
