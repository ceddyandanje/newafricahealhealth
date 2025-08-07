
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { findUserByEmail, createUser, findUserById } from "@/lib/users";
import { type User } from "@/lib/types";
import type { LoginCredentials, SignUpCredentials } from "@/lib/types";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignUpCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        const loggedInUser = findUserById(storedUserId);
        if (loggedInUser) {
          setUser(loggedInUser);
        }
      }
    } catch (error) {
      console.error("Failed to load user from local storage", error);
      setUser(null);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const foundUser = findUserByEmail(credentials.email);
    if (foundUser && foundUser.password === credentials.password) {
      setUser(foundUser);
      localStorage.setItem("userId", foundUser.id);
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name}!` });
      if (foundUser.role === 'admin') {
          router.push("/admin");
      } else {
          router.push("/profile");
      }
      return true;
    }
    toast({ variant: 'destructive', title: "Login Failed", description: "Invalid email or password." });
    return false;
  };

  const signup = async (credentials: SignUpCredentials): Promise<boolean> => {
    const existingUser = findUserByEmail(credentials.email);
    if (existingUser) {
        toast({ variant: 'destructive', title: "Signup Failed", description: "An account with this email already exists." });
        return false;
    }

    const newUser = createUser(credentials);
    setUser(newUser);
    localStorage.setItem("userId", newUser.id);
    toast({ title: "Signup Successful", description: `Welcome, ${newUser.name}!` });
    router.push("/profile");
    return true;
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userId");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  }, [router, toast]);
  

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
