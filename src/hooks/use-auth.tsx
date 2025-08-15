
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    type User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { type User, type LoginCredentials, type SignUpCredentials } from "@/lib/types";
import { useToast } from "./use-toast";
import { createUserInFirestore } from "@/lib/users";
import { addLog } from "@/lib/logs";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignUpCredentials) => Promise<boolean>;
  logout: () => void;
  reauthenticateAndChangePassword: (currentPass: string, newPass: string) => Promise<boolean>;
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
                const userData = { id: userDoc.id, ...userDoc.data() } as User;
                setUser(userData);
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

  const handleRedirect = (user: User | null) => {
    if (!user) {
      router.push('/login');
      return;
    }
    switch (user.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'doctor':
        router.push('/doctor/dashboard');
        break;
      default:
        router.push('/patient/dashboard');
        break;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password!);
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() } as User;
            toast({ title: "Login Successful", description: `Welcome back, ${userData.name}!` });
            handleRedirect(userData);
            return true;
        }
        toast({ variant: 'destructive', title: "Login Failed", description: "User profile not found in database." });
        return false;
    } catch (error: any) {
        let description = "An unknown error occurred. Please try again.";
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-email':
                description = "No account found with this email address. Please check your email or sign up.";
                break;
            case 'auth/wrong-password':
                description = "Incorrect password. Please try again.";
                break;
            case 'auth/invalid-credential':
                 description = "The email or password you entered is incorrect. Please try again.";
                 break;
            case 'auth/too-many-requests':
                description = "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
                break;
            default:
                description = error.message;
        }
        toast({ variant: 'destructive', title: "Login Failed", description });
        return false;
    }
  };

  const signup = async (credentials: SignUpCredentials): Promise<boolean> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password!);
        const fbUser = userCredential.user;
        const newUser = await createUserInFirestore(credentials, fbUser.uid);
        
        if (newUser) {
          toast({ title: "Signup Successful", description: `Welcome, ${credentials.name}!` });
          handleRedirect(newUser);
          return true;
        } else {
          throw new Error("Could not create user document in Firestore.");
        }

    } catch (error: any) {
        let description = "An unknown error occurred. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This email address is already in use by another account.";
        } else {
            description = error.message;
        }
         toast({ variant: 'destructive', title: "Signup Failed", description });
        return false;
    }
  };

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push("/login");
  }, [router, toast]);

  const reauthenticateAndChangePassword = async (currentPass: string, newPass: string) => {
    if (!firebaseUser || !firebaseUser.email) {
      toast({ variant: 'destructive', title: "Error", description: "No user is currently signed in." });
      return false;
    }

    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPass);
      await reauthenticateWithCredential(firebaseUser, credential);
      
      // If re-authentication is successful, update the password
      await updatePassword(firebaseUser, newPass);
      addLog("INFO", `User ${firebaseUser.email} successfully changed their password.`);
      toast({ title: "Success", description: "Your password has been changed successfully." });
      return true;

    } catch (error: any) {
      let description = "An unknown error occurred.";
      switch (error.code) {
        case 'auth/wrong-password':
          description = "The current password you entered is incorrect.";
          break;
        case 'auth/too-many-requests':
            description = "Too many failed attempts. Please try again later.";
            break;
        default:
          description = "Failed to re-authenticate. Please try logging out and in again.";
      }
      addLog("WARN", `Failed password change attempt for user ${firebaseUser.email}. Reason: ${error.code}`);
      toast({ variant: 'destructive', title: "Password Change Failed", description });
      return false;
    }
  };
  

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isAdmin, login, signup, logout, reauthenticateAndChangePassword, isLoading }}>
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
