import { User } from "../types/users";
import crypto from "crypto";

const users: User[] = [
  { id: crypto.randomUUID(), name: "John Doe", createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: "Jane Smith", createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: "Alice Johnson", createdAt: new Date().toISOString() }
];

export const getAllUsers = (filters?: { createdAt?: string; name?: string }): User[] => {
  let result = users.slice();
  if (!filters) return result;
  if (filters.createdAt) {
    const prefix = filters.createdAt;
    result = result.filter(u => u.createdAt.startsWith(prefix));
  }
  if (filters.name) {
    const s = filters.name.toLowerCase();
    result = result.filter(u => u.name.toLowerCase().includes(s));
  }
  return result;
};

export const createUser = (userName: string): User => {
  const newUser: User = { id: crypto.randomUUID(), name: userName, createdAt: new Date().toISOString() };
  users.push(newUser);
  return newUser;
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const updateUser = (id: string, updatedData: Partial<User>): User | null => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    // ensure result is recognized as a full User by TypeScript
    users[userIndex] = { ...users[userIndex], ...updatedData } as User;
    return users[userIndex];
  }
  return null;
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    return true;
  }
  return false;
};