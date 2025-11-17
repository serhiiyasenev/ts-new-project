export type User = {
  id: number;
  name: string;
  email: string;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
