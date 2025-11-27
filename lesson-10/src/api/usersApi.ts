import type { User, CreateUserData } from '../types';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch('/api/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const createUser = async (data: CreateUserData): Promise<User> => {
    const users = await fetchUsers();
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const newId = maxId + 1;
    // This was done specifically to generate incremental number IDs,
    //  because otherwise, json-server creates them as random strings.
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, id: String(newId) }),
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    return response.json();
};

export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  const user = await response.json();
  return user;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
};
