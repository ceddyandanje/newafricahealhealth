
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface AppUser {
    uid: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    ageRange?: string;
    role?: 'admin' | 'user';
    createdAt?: any;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const unsubSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = { uid: doc.id, ...doc.data() } as AppUser;
            setAppUser(userData);
            setIsAdmin(userData.role === 'admin');
          } else {
            // This case might happen if user exists in Auth but not Firestore
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
        setUser(null);
        setAppUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
      if (!loading && user && appUser) {
          if(isAdmin) {
            if(window.location.pathname !== '/admin') router.push('/admin');
          } else {
            if(window.location.pathname !== '/profile') router.push('/profile');
          }
      }
      
      if (!loading && !user) {
          if(window.location.pathname === '/profile' || window.location.pathname === '/admin'){
            router.push('/login');
          }
      }

  }, [user, appUser, isAdmin, loading, router])

  const value = { user, appUser, isAdmin, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
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
