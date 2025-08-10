
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    type User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { type User, type LoginCredentials, type SignUpCredentials } from "@/lib/types";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignUpCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setIsLoading(true);
        if (fbUser) {
            setFirebaseUser(fbUser);
            const userDocRef = doc(db, "users", fbUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUser({ id: userDoc.id, ...userDoc.data() } as User);
            } else {
                 setUser(null);
            }
        } else {
            setFirebaseUser(null);
            setUser(null);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password!);
        // onAuthStateChanged will handle the rest
        toast({ title: "Login Successful", description: `Welcome back!` });
        // The redirect will be handled by the effect in layouts based on the user role
        return true;
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Login Failed", description: error.message });
        return false;
    }
  };

  const signup = async (credentials: SignUpCredentials): Promise<boolean> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password!);
        const fbUser = userCredential.user;
        const role = credentials.email === 'rootaccessdenied4312@gmail.com' ? 'admin' : 'user';

        const newUser: User = {
            id: fbUser.uid,
            name: credentials.name,
            email: credentials.email,
            role: role,
            status: 'active',
            createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", fbUser.uid), newUser);
        
        // onAuthStateChanged will set the user state
        toast({ title: "Signup Successful", description: `Welcome, ${credentials.name}!` });
        return true;
    } catch (error: any) {
         toast({ variant: 'destructive', title: "Signup Failed", description: error.message });
        return false;
    }
  };

  const logout = useCallback(async () => {
    await signOut(auth);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  }, [router, toast]);
  

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isAdmin, login, signup, logout, isLoading }}>
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
