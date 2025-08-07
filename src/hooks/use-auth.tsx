
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export interface AppUser {
    uid: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    ageRange?: string;
    role?: 'admin' | 'user';
    createdAt?: any;
    id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  appUser: AppUser | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  appUser: null,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const unsubSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = { uid: doc.id, ...doc.data() } as AppUser;
            setAppUser(userData);
            const adminStatus = userData.role === 'admin';
            setIsAdmin(adminStatus);
            
            // Redirect after login if on the login page
            if (pathname === '/login') {
                if(adminStatus) {
                    router.replace('/admin');
                } else {
                    router.replace('/');
                }
            }
          } else {
            setAppUser(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }, (error) => {
            console.error("Failed to fetch user data:", error);
            setAppUser(null);
            setIsAdmin(false);
            setLoading(false);
        });
        return () => unsubSnapshot();
      } else {
        setAppUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);
  

  const value = { user, appUser, isAdmin, loading };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
