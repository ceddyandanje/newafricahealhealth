
'use client';

import { User } from './types';
import initialUsers from './data/users.json';
import type { SignUpCredentials } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';

// This is now a hook that provides live-synced users
export const useUsers = () => {
    return useLocalStorage<User[]>('app-users', initialUsers as User[]);
}

// The functions below are for components that cannot use hooks (e.g., non-component files)
// They will write to localStorage, and the hook will pick up the changes.

// Function to get a snapshot of all users.
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

// Function to save the entire list of users and notify other tabs.
export const saveAllUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('app-users', JSON.stringify(users));
    // Manually dispatch event for the current window to update UI
    window.dispatchEvent(new StorageEvent('storage', { key: 'app-users' }));
  } catch (error) {
    console.error('Error writing users to localStorage:', error);
  }
};

export const findUserByEmail = (email: string, users: User[]): User | undefined => {
  return users.find((user) => user.email === email);
};

export const findUserById = (id: string, users: User[]): User | undefined => {
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
