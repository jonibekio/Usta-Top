"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { MOCK_USERS } from "../mock-data/users";
import { apiClient, extractApiData } from "../api/client";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  login: (phone: string, passwordOrRole?: string | UserRole, roleOrNothing?: UserRole) => Promise<void>;
  register: (name: string, phone: string, passwordOrRole?: string | UserRole, roleArg?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return MOCK_USERS.customer;
    const savedRole = localStorage.getItem("usta_top_active_role") as UserRole | null;
    if (savedRole === "PROVIDER") return MOCK_USERS.provider;
    if (savedRole === "ADMIN") return MOCK_USERS.admin;
    return MOCK_USERS.customer;
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("usta_top_token") : null;
    if (token) {
      apiClient
        .get<any>("/auth/me/")
        .then((res) => {
          const userData = extractApiData<User>(res);
          if (userData && (userData.id || userData.phone)) {
            setUser(userData);
            localStorage.setItem("usta_top_active_role", userData.role);
          }
        })
        .catch(() => {
          // Token expired or server unreachable, maintain current session role
        });
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    if (newRole === "PROVIDER") {
      setUser(MOCK_USERS.provider);
      localStorage.setItem("usta_top_active_role", "PROVIDER");
    } else if (newRole === "ADMIN") {
      setUser(MOCK_USERS.admin);
      localStorage.setItem("usta_top_active_role", "ADMIN");
    } else {
      setUser(MOCK_USERS.customer);
      localStorage.setItem("usta_top_active_role", "CUSTOMER");
    }
  };

  const login = async (phone: string, passwordOrRole?: string | UserRole, roleOrNothing?: UserRole) => {
    let password = "password123";
    let targetRole: UserRole = "CUSTOMER";

    if (passwordOrRole === "CUSTOMER" || passwordOrRole === "PROVIDER" || passwordOrRole === "ADMIN") {
      targetRole = passwordOrRole;
    } else if (typeof passwordOrRole === "string" && passwordOrRole.length > 0) {
      password = passwordOrRole;
      if (roleOrNothing) targetRole = roleOrNothing;
    }

    try {
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
        localStorage.setItem("usta_top_active_role", data.user.role);
        return;
      }
    } catch (err) {
      console.warn("Real API login failed, using fallback:", err);
    }
    switchRole(targetRole);
  };

  const register = async (name: string, phone: string, passwordOrRole?: string | UserRole, roleArg?: UserRole) => {
    let password = "password123";
    let role: UserRole = "CUSTOMER";
    if (passwordOrRole === "CUSTOMER" || passwordOrRole === "PROVIDER" || passwordOrRole === "ADMIN") {
      role = passwordOrRole;
    } else if (typeof passwordOrRole === "string" && passwordOrRole.length > 0) {
      password = passwordOrRole;
      if (roleArg) role = roleArg;
    }

    try {
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
        localStorage.setItem("usta_top_active_role", data.user.role);
        return;
      }
    } catch (err) {
      console.warn("Real API register failed, fallback locally:", err);
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      role,
      avatar: role === "PROVIDER" ? MOCK_USERS.provider.avatar : MOCK_USERS.customer.avatar,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("usta_top_active_role", role);
  };

  const logout = () => {
    const refresh = localStorage.getItem("usta_top_refresh");
    if (refresh) {
      apiClient.post("/auth/logout/", { refresh }).catch(() => {});
    }
    localStorage.removeItem("usta_top_token");
    localStorage.removeItem("usta_top_refresh");
    localStorage.removeItem("usta_top_active_role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "CUSTOMER",
        isAuthenticated: !!user,
        switchRole,
        login,
        register,
        logout,
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
