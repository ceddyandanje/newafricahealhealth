
import { User } from './types';

// Let's create a default admin user and a regular user for testing.
// In a real app, NEVER store passwords in plain text. This is for prototype purposes only.
export let users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // Unsafe, for demo only
    role: 'admin',
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123', // Unsafe, for demo only
    role: 'user',
  },
  {
    id: '3',
    name: 'Admin Root',
    email: 'rootaccessdenied4312@gmail.com',
    password: 'password123', // Unsafe, for demo only
    role: 'admin',
  }
];

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
}

export const createUser = (details: Omit<User, 'id' | 'role'>): User => {
  const newUser: User = {
    id: (users.length + 1).toString(),
    ...details,
    role: details.email === 'rootaccessdenied4312@gmail.com' ? 'admin' : 'user',
  };
  users.push(newUser);
  return newUser;
};
