
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, createUser, findUserById } from "@/lib/users";
import { type User } from "@/lib/types";
import type { LoginCredentials, SignUpCredentials } from "@/lib/types";
import { useToast } from "./use-toast";
import { useLocalStorage } from "./use-local-storage";

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
  const [userId, setUserId] = useLocalStorage<string | null>("userId", null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    if (userId) {
        const allUsers = getAllUsers();
        const loggedInUser = findUserById(userId, allUsers);
        setUser(loggedInUser || null);
    } else {
        setUser(null);
    }
    setIsLoading(false);
  }, [userId]);

  const router = useRouter();
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(u => u.email === credentials.email);
    if (foundUser && foundUser.password === credentials.password) {
      setUserId(foundUser.id);
      toast({ title: "Login Successful", description: `Welcome back, ${foundUser.name}!` });
      if (foundUser.role === 'admin') {
          router.push("/admin");
      } else {
          router.push("/patient/dashboard");
      }
      return true;
    }
    toast({ variant: 'destructive', title: "Login Failed", description: "Invalid email or password." });
    return false;
  };

  const signup = async (credentials: SignUpCredentials): Promise<boolean> => {
    const allUsers = getAllUsers();
    if (allUsers.some(u => u.email === credentials.email)) {
        toast({ variant: 'destructive', title: "Signup Failed", description: "An account with this email already exists." });
        return false;
    }

    const newUser = createUser(credentials);
    setUserId(newUser.id);
    toast({ title: "Signup Successful", description: `Welcome, ${newUser.name}!` });
    router.push("/patient/dashboard");
    return true;
  };

  const logout = useCallback(() => {
    setUserId(null);
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  }, [router, toast, setUserId]);
  

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
