
'use client';

import { User } from './types';
import initialUsers from './data/users.json';
import type { SignUpCredentials } from './types';

// IMPORTANT: This is a temporary localStorage-based database for prototyping.
// In a production environment, use a proper database like Firebase Firestore.

const USERS_STORAGE_KEY = 'app-users';

// Function to get all users from localStorage, seeded with initial data if empty.
export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return initialUsers as User[];
  }
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      // If no users in storage, seed it with the initial data.
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers as User[];
    }
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return initialUsers as User[]; // Fallback to initial data
  }
};

// Function to save the entire list of users to localStorage.
export const saveAllUsers = (users: User[]) => {
  if (typeof window === 'undefined') {
    console.error("Cannot save users on the server side.");
    return;
  }
  try {
    const jsonData = JSON.stringify(users, null, 2);
    localStorage.setItem(USERS_STORAGE_KEY, jsonData);
  } catch (error) {
    console.error('Error writing users to localStorage:', error);
  }
};


export const findUserByEmail = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find((user) => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
    const users = getAllUsers();
    return users.find((user) => user.id === id);
}

export const createUser = (details: SignUpCredentials): User => {
  const users = getAllUsers();
  const newUser: User = {
    id: (users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1).toString(),
    name: details.name,
    email: details.email,
    password: details.password,
    role: details.email === 'rootaccessdenied4312@gmail.com' ? 'admin' : 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  const updatedUsers = [...users, newUser];
  saveAllUsers(updatedUsers);
  return newUser;
};
