import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Posts.css";
import type { Post } from "@shared/post.types";
import type { User } from "@shared/user.types";
import { fetchPosts, deletePost, fetchUsers } from "../../api";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers()
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Posts</h1>
        <Link to="/posts/create" className="button-primary">Create Post</Link>
      </div>
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="post-excerpt">{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
              <div className="post-meta">
                <span>👤 {users.find(u => u.id === post.userId)?.name || `User #${post.userId}`}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="post-actions">
                <Link to={`/posts/${post.id}`} className="button-secondary">Edit</Link>
                <button onClick={() => handleDelete(post.id)} className="button-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
