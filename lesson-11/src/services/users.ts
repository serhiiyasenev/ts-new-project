import { User } from "../types/users";
import crypto from "crypto";

const users: User[] = [
  { id: crypto.randomUUID(), name: "John Doe" },
  { id: crypto.randomUUID(), name: "Jane Smith" },
  { id: crypto.randomUUID(), name: "Alice Johnson" }
];  

export const getAllUsers = (): User[] => {
  return users;
};

export const createUser = (userName: string): User => {
  const newUser: User = { id: crypto.randomUUID(), name: userName };
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