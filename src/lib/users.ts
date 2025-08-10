
'use client';

import { useState, useEffect } from 'react';
import { User, MedicalProfile } from './types';
import type { SignUpCredentials } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Custom hook to manage users state. It fetches from Firestore on mount.
export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const userList = await getAllUsersFromFirestore();
            setUsers(userList);
            setIsLoading(false);
        };
        fetchUsers();
    }, []); // Empty dependency array ensures this runs only once on mount

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
            age: details.age,
            phone: details.phone,
            location: details.location
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

// --- Medical Profile Functions ---

// Gets the medical profile for a specific user
export const getMedicalProfile = async (userId: string): Promise<MedicalProfile | null> => {
    try {
        const profileDocRef = doc(db, 'users', userId, 'medicalProfile', 'details');
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as MedicalProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching medical profile:", error);
        return null;
    }
}

// Creates or updates the medical profile for a specific user
export const updateUserMedicalProfile = async (userId: string, data: Partial<MedicalProfile>): Promise<boolean> => {
    try {
        const profileDocRef = doc(db, 'users', userId, 'medicalProfile', 'details');
        // `setDoc` with `merge: true` will create the document if it doesn't exist, or update it if it does.
        await setDoc(profileDocRef, data, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating medical profile:", error);
        return false;
    }
};
