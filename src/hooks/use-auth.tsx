
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithPopup,
    GoogleAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    sendPasswordResetEmail,
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
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignUpCredentials, password:string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  reauthenticateAndChangePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isProfileComplete = (user: User) => {
    return !!user.phone && !!user.age && !!user.location;
}

const publicPaths = ['/login', '/signup', '/terms', '/privacy'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleRedirect = useCallback((userData: User) => {
    const roleMap: { [key: string]: string | undefined } = {
        'admin': '/admin',
        'doctor': '/doctor/dashboard',
        'user': '/patient/dashboard',
        'delivery-driver': '/delivery/dashboard',
        'lab-technician': '/labs/dashboard',
        'emergency-services': '/emergency/dashboard'
    };
    const destination = roleMap[userData.role];
    const isPublicPath = publicPaths.includes(pathname);

    if (destination && isPublicPath) {
      router.push(destination);
    }
  }, [router, pathname]);


  const handleUserCheck = useCallback((userData: User) => {
    if (!userData.termsAccepted) {
        setShowTerms(true);
    } else if (userData.role === 'user' && !isProfileComplete(userData)) {
        setShowOnboarding(true);
    } else {
        setShowOnboarding(false);
        setShowTerms(false);
        handleRedirect(userData);
    }
  }, [handleRedirect]);


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
                handleUserCheck(userData);
            } else {
                const newUser = await createUserInFirestore({
                    name: fbUser.displayName,
                    email: fbUser.email,
                    avatarUrl: fbUser.photoURL
                }, fbUser.uid);
                 if(newUser) {
                    setUser(newUser);
                    handleUserCheck(newUser);
                 } else {
                    await signOut(auth);
                 }
            }
        } else {
            setUser(null);
            setFirebaseUser(null);
            setShowOnboarding(false);
            setShowTerms(false);
        }
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [handleUserCheck]);


  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        // onAuthStateChanged will handle redirect and state updates
    } catch (error: any) {
        let description = "An unknown error occurred. Please try again.";
        switch (error.code) {
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
    }
  };
  
  const signup = async (credentials: SignUpCredentials, password: string): Promise<void> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, password);
        const fbUser = userCredential.user;
        
        await createUserInFirestore({
            name: credentials.name,
            email: credentials.email,
            phone: credentials.phone,
            age: credentials.age,
            location: credentials.location,
            avatarUrl: fbUser.photoURL
        }, fbUser.uid);
        
        addLog("INFO", `New user signed up: ${credentials.name} (${credentials.email}).`);
        addNotification({ recipientId: 'admin_role', type: 'system_update', title: 'New User Created', description: `An account for ${credentials.name} has been created.`});

    } catch (error: any) {
        let description = "An unknown error occurred. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This email address is already in use by another account. Try logging in or use a different email.";
        } else {
            description = error.message;
        }
         toast({ variant: 'destructive', title: "Signup Failed", description });
    }
  };
  
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will handle the rest
    } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential') {
            const email = error.customData.email;
            if (!email || !auth.currentUser) {
                toast({
                    title: "Link Failed",
                    description: "Could not link accounts. Please sign in with your password and link your Google account from settings.",
                    duration: 7000
                });
                return;
            }
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.includes(GoogleAuthProvider.PROVIDER_ID)) {
                toast({ title: "Already Linked", description: "This Google account is already linked." });
                return;
            }
            if (methods.includes(EmailAuthProvider.PROVIDER_ID)) {
                try {
                    const googleCredential = GoogleAuthProvider.credentialFromError(error);
                    if (googleCredential) {
                        await linkWithCredential(auth.currentUser, googleCredential);
                        toast({ title: "Account Linked!", description: "Your Google account has been successfully linked." });
                    }
                } catch (linkError) {
                    console.error("Error linking credential:", linkError);
                    toast({ variant: 'destructive', title: "Link Failed", description: "Could not link your Google account. Please try again later." });
                }
            }
        } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
            toast({
                variant: "destructive",
                title: "Google Sign-In Failed",
                description: error.message || "An unknown error occurred.",
            });
        }
    }
  };

  const logout = useCallback(async () => {
    await signOut(auth);
    router.push("/login");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [router, toast]);
  
  const sendPasswordReset = async (email: string) => {
    if (!email) {
      toast({ variant: 'destructive', title: 'Email Required', description: 'Please enter your email address.' });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Password Reset Email Sent', description: 'Please check your inbox for instructions to reset your password.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Reset Failed', description: error.message });
    }
  };

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
        case 'auth/requires-recent-login':
          description = "For your security, please log out and log back in before changing your password.";
          break;
        default:
          description = "Failed to re-authenticate. Please try logging out and in again.";
      }
      addLog("WARN", `Failed password change attempt for user ${firebaseUser.email}. Reason: ${error.code}`);
      toast({ variant: 'destructive', title: "Password Change Failed", description, duration: 6000 });
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
        handleUserCheck(updatedUser);
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
        handleUserCheck(updatedUser);
        addLog("INFO", `User ${user.email} accepted the Terms of Service.`);
    } else {
        toast({ variant: 'destructive', title: "Update Failed", description: "Could not save your preference. Please try again." });
    }
    setIsSaving(false);
  };
  
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, setUser, firebaseUser, isAdmin, login, signup, googleLogin, logout, sendPasswordReset, reauthenticateAndChangePassword, isLoading }}>
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

    