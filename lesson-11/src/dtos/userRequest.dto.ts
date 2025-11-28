export interface CreateUserDto {
  name: string;
  email: string;
  isActive?: boolean;
}

export type UpdateUserDto = Partial<CreateUserDto>;
