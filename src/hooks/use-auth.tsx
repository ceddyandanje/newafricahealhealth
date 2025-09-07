
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
    getRedirectResult,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    type User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { type User, type LoginCredentials, type SignUpCredentials } from "@/lib/types";
import { useToast } from "./use-toast";
import { createUserInFirestore, updateUserInFirestore } from "@/lib/users";
import { addLog } from "@/lib/logs";
import OnboardingDialog from "@/components/auth/onboarding-dialog";
import TermsDialog from "@/components/auth/terms-dialog";
import { addNotification } from "@/lib/notifications";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignUpCredentials) => Promise<boolean>;
  logout: () => void;
  reauthenticateAndChangePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isProfileComplete = (user: User) => {
    return !!user.phone && !!user.age && !!user.location;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleLoginChecks = useCallback((userData: User) => {
    if (!userData.termsAccepted) {
        setShowTerms(true);
    } else if (userData.role === 'user' && !isProfileComplete(userData)) {
        setShowOnboarding(true);
    } else {
        setShowOnboarding(false);
        setShowTerms(false);
    }
  }, []);

  const handleRedirect = useCallback((loggedInUser: User) => {
    const roleMap: { [key: string]: string | undefined } = {
        'admin': '/admin',
        'doctor': '/doctor/dashboard',
        'user': '/patient/dashboard',
        'delivery-driver': '/delivery/dashboard',
        'lab-technician': '/labs/dashboard',
        'emergency-services': '/emergency/dashboard'
    }
    const destination = roleMap[loggedInUser.role];
    if (destination && window.location.pathname !== destination) {
      router.push(destination);
    }
  }, [router]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
            setFirebaseUser(fbUser);
            const userDocRef = doc(db, "users", fbUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = { id: userDoc.id, ...userDoc.data() } as User;
                setUser(userData);
                handleLoginChecks(userData);
                if (userData.termsAccepted && (isProfileComplete(userData) || userData.role !== 'user')) {
                    handleRedirect(userData);
                }
            } else {
                // This case handles a user authenticated in Firebase Auth but without a DB record.
                // This can happen if a user signs in with Google but doesn't complete onboarding.
                // We'll create the user doc here.
                const newUser = await createUserInFirestore({
                    name: fbUser.displayName,
                    email: fbUser.email,
                    avatarUrl: fbUser.photoURL
                }, fbUser.uid);
                 if(newUser) {
                    setUser(newUser);
                    handleLoginChecks(newUser);
                 } else {
                    await signOut(auth);
                 }
            }
        } else {
            setUser(null);
            setFirebaseUser(null);
        }
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [handleLoginChecks, handleRedirect]);


  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then(userCredential => {
          // The onAuthStateChanged listener will handle the rest,
          // but we wait for the user state to be set before resolving.
          const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser && fbUser.uid === userCredential.user.uid) {
              // Wait for the user data to be loaded from Firestore
              const checkUser = setInterval(async () => {
                const userDoc = await getDoc(doc(db, "users", fbUser.uid));
                if (userDoc.exists()) {
                  clearInterval(checkUser);
                  unsubscribe();
                  resolve(true);
                }
              }, 100);
            }
          });
        })
        .catch(error => {
          let description = "An unknown error occurred. Please try again.";
          switch (error.code) {
              case 'auth/user-not-found':
                  description = "No account found with this email address. Please check your email or sign up.";
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
          setIsLoading(false);
          reject(error);
          resolve(false);
        });
    });
  };

  const signup = async (credentials: SignUpCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const fbUser = userCredential.user;
        
        // Exclude password from the data to be saved to Firestore
        const { password, ...firestoreCredentials } = credentials;

        const newUser = await createUserInFirestore({
            ...firestoreCredentials, 
            avatarUrl: fbUser.photoURL
        }, fbUser.uid);
        
        if (newUser) {
          toast({ title: "Signup Successful", description: `Welcome, ${credentials.name}!` });
          addLog("INFO", `New user signed up: ${newUser.name} (${newUser.email}).`);
          addNotification({ recipientId: 'admin_role', type: 'system_update', title: 'New User Created', description: `An account for ${newUser.name} has been created.`});
          // Let onAuthStateChanged handle setting user state
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
         setIsLoading(false);
        return false;
    }
  };
  

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    setShowOnboarding(false);
    setShowTerms(false);
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
      
      await updatePassword(firebaseUser, newPass);
      addLog("INFO", `User ${firebaseUser.email} successfully changed their password.`);
      toast({ title: "Success", description: "Your password has been changed successfully." });
      return true;

    } catch (error: any) {
      let description = "An unknown error occurred.";
      switch (error.code) {
        case 'auth/invalid-credential':
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

  const handleSaveOnboarding = async (data: { name: string, phone: string, ageRange: string, location: string }) => {
    if (!user) return;
    setIsSaving(true);
    const updates = { name: data.name, phone: data.phone, age: data.ageRange, location: data.location };
    const success = await updateUserInFirestore(user.id, updates);

    if (success) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        setShowOnboarding(false);
        handleRedirect(updatedUser);
        addLog("INFO", `User ${user.email} completed their profile onboarding.`);
        toast({ title: "Profile Complete!", description: "Thank you for completing your profile." });
    } else {
        toast({ variant: 'destructive', title: "Update Failed", description: "Could not save your profile. Please try again." });
    }
    setIsSaving(false);
  }

  const handleAcceptTerms = async () => {
    if (!user) return;
    setIsSaving(true);
    const success = await updateUserInFirestore(user.id, { termsAccepted: true });

    if (success) {
        const updatedUser = { ...user, termsAccepted: true };
        setUser(updatedUser);
        setShowTerms(false);
        handleLoginChecks(updatedUser);
        addLog("INFO", `User ${user.email} accepted the Terms of Service.`);
    } else {
        toast({ variant: 'destructive', title: "Update Failed", description: "Could not save your preference. Please try again." });
    }
    setIsSaving(false);
  };
  
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, setUser, firebaseUser, isAdmin, login, signup, logout, reauthenticateAndChangePassword, isLoading }}>
      {children}
      {user && showOnboarding && (
        <OnboardingDialog 
            user={user} 
            isOpen={showOnboarding} 
            onSave={handleSaveOnboarding}
            isSaving={isSaving}
        />
      )}
      {user && showTerms && (
        <TermsDialog
          isOpen={showTerms}
          onAccept={handleAcceptTerms}
          isSaving={isSaving}
        />
      )}
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
