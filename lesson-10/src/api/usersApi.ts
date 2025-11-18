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
        body: JSON.stringify({ ...data, id: newId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    return response.json();
};

export const fetchUserById = async (id: number): Promise<User> => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid user ID: must be a positive integer');
    }
    const response = await fetch(`/api/users?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    const users = await response.json();
    if (!users || users.length === 0) {
        throw new Error('User not found');
    }
    return users[0];
};