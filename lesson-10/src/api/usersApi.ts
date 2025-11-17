import type { CreateUserData } from "../pages/CreateUser";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
};

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
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return response.json();
};