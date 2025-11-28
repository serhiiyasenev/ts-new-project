export type Post = {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostData = {
  title: string;
  content: string;
  userId: number;
};

export type UpdatePostData = {
  title?: string;
  content?: string;
};
