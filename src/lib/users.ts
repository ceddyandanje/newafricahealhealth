
'use client';

import { User } from './types';
import initialUsers from './data/users.json';
import type { SignUpCredentials } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Custom hook to manage users state with persistence and cross-tab syncing.
export const useUsers = () => {
    const [users, setUsers] = useLocalStorage<User[]>('app-users-cache', []);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const userList = await getAllUsersFromFirestore();
            setUsers(userList);
            setIsLoading(false);
        };
        fetchUsers();
    }, [setUsers]);

    return { users, setUsers, isLoading };
};

// --- Firestore Interaction Functions ---

const usersCollection = collection(db, 'users');

// Fetches all users directly from Firestore.
export const getAllUsersFromFirestore = async (): Promise<User[]> => {
    try {
        const querySnapshot = await getDocs(usersCollection);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        return users;
    } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        return [];
    }
};

// Creates a user in Firestore (typically after successful Firebase Auth creation).
export const createUserInFirestore = async (details: SignUpCredentials, uid?: string): Promise<User | null> => {
    if (!uid) return null; // UID from Firebase Auth is required.
    try {
        const newUser: User = {
            id: uid,
            name: details.name,
            email: details.email,
            role: details.email === 'rootaccessdenied4312@gmail.com' ? 'admin' : 'user',
            status: 'active',
            createdAt: new Date().toISOString(),
            avatarUrl: '',
            ...details
        };
        await setDoc(doc(db, "users", uid), newUser);
        return newUser;
    } catch (error) {
        console.error("Error creating user document in Firestore:", error);
        return null;
    }
}

// Updates a user document in Firestore.
export const updateUserInFirestore = async (id: string, updates: Partial<User>): Promise<boolean> => {
    try {
        const userDocRef = doc(db, "users", id);
        await updateDoc(userDocRef, updates);
        return true;
    } catch (error) {
        console.error("Error updating user document:", error);
        return false;
    }
};

// Deletes a user document from Firestore.
export const deleteUserInFirestore = async (id: string): Promise<boolean> => {
     try {
        await deleteDoc(doc(db, "users", id));
        return true;
    } catch (error) {
        console.error("Error deleting user document:", error);
        return false;
    }
};

// Legacy functions using localStorage (can be phased out or used for caching)

export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return initialUsers as User[];
  }
  try {
    const storedUsers = localStorage.getItem('app-users');
    return storedUsers ? JSON.parse(storedUsers) : (initialUsers as User[]);
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return initialUsers as User[];
  }
};

export const saveAllUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('app-users', JSON.stringify(users));
    window.dispatchEvent(new StorageEvent('storage', { key: 'app-users' }));
  } catch (error) {
    console.error('Error writing users to localStorage:', error);
  }
};
