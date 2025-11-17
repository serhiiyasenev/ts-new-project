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