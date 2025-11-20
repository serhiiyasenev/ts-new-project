export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
};

export type CreateUserData = Omit<User, 'id'>;