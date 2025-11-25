export interface CreateUserDto {
  name: string;
  email: string;
  isActive?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

