"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Types for role
type Role = "user" | "admin";

interface AuthContextType {
  role: Role | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    // Try to load role from localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole === "user" || storedRole === "admin") {
      setRole(storedRole);
    }
  }, []);

  const login = (username: string, password: string) => {
    // Static credentials
    if (username === "admin" && password === "admin123") {
      setRole("admin");
      localStorage.setItem("role", "admin");
      return true;
    }
    if (username === "user" && password === "user123") {
      setRole("user");
      localStorage.setItem("role", "user");
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
