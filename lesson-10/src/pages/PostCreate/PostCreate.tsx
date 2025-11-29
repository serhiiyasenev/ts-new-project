import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './PostCreate.css';
import { createPost, fetchUsers } from "../../api";
import { postSchema, type PostFormFields } from "../../schema/postSchema";
import type { User } from "@shared/user.types";

const PostCreate = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { register, handleSubmit, formState: { isValid, errors } } = useForm<PostFormFields>({
    mode: "onTouched", 
    resolver: zodResolver(postSchema)
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
  }, []);
  
  const onSubmit = async (data: PostFormFields) => {
    try {
      await createPost(data);
      navigate("/posts");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error creating post");
    }
  }

  return (
    <div className="create-post">
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" {...register("title")} />
          <div className="error">{errors.title?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea id="content" {...register("content")} rows={10} />
          <div className="error">{errors.content?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="userId">Author (User):</label>
          <select id="userId" {...register("userId", { 
            setValueAs: (value) => value === "" ? undefined : Number(value)
          })}>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <div className="error">{errors.userId?.message}</div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/posts')} className="button-secondary">
            Cancel
          </button>
          <button type="submit" disabled={!isValid} className="button-primary">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostCreate;
