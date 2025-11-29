import { UserFilters } from "../../types/filters";

export const buildUserFilter = (params: {
  name?: string;
  email?: string;
  isActive?: boolean;
}): UserFilters => {
  return {
    name: params.name,
    email: params.email,
    isActive: params.isActive,
  };
};
