export type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  isActive?: boolean;
};

export type UpdateUserData = Partial<CreateUserData>;
