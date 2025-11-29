import { PostFilters } from "@shared/filters";

export const buildPostFilter = (params: {
  title?: string;
  content?: string;
  userId?: number;
}): PostFilters => {
  return {
    title: params.title,
    content: params.content,
    userId: params.userId,
  };
};
