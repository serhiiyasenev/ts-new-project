import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import './PostDetails.css'
import type { Post } from '@shared/post.types'
import { fetchPostById, updatePost, deletePost, fetchUsers } from '../../api'
import { postSchema, type PostFormFields } from '../../schema/postSchema'
import type { User } from '@shared/user.types'
import { useToast } from '../../hooks/useToast'

const PostDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormFields>({
    resolver: zodResolver(postSchema),
  })

  useEffect(() => {
    if (id) {
      Promise.all([fetchPostById(Number(id)), fetchUsers()])
        .then(([postData, usersData]) => {
          setPost(postData)
          setUsers(usersData)
          reset({
            title: postData.title,
            content: postData.content,
            userId: postData.userId,
          })
        })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id, reset])

  const handleUpdate = async (data: PostFormFields) => {
    if (!id || !post) return
    try {
      const updateData = { title: data.title, content: data.content }
      const updated = await updatePost(Number(id), updateData)
      setPost(updated)
      setIsEditing(false)
      showToast('Post updated successfully', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update post', 'error')
    }
  }

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this post?')) return
    try {
      await deletePost(Number(id))
      showToast('Post deleted successfully', 'success')
      navigate('/posts')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete post', 'error')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-message">Error: {error}</div>
  if (!post) return <div className="error-message">Post not found</div>

  if (isEditing) {
    return (
      <div className="post-details">
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit(handleUpdate)} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input id="title" type="text" {...register('title')} />
            <div className="error">{errors.title?.message}</div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea id="content" {...register('content')} rows={10} />
            <div className="error">{errors.content?.message}</div>
          </div>

          <input type="hidden" {...register('userId', { valueAsNumber: true })} />

          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)} className="button-secondary">
              Cancel
            </button>
            <button type="submit" className="button-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    )
  }

  const author = users.find((u) => u.id === post.userId)

  return (
    <div className="post-details">
      <Link to="/posts" className="back-button">
        ← Back to Posts
      </Link>

      <article className="post-content">
        <h1>{post.title}</h1>

        <div className="post-meta">
          <div className="meta-item">
            <strong>Author:</strong>
            <span>{author ? author.name : `User #${post.userId}`}</span>
          </div>
          <div className="meta-item">
            <strong>Created:</strong>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <strong>Updated:</strong>
            <span>{new Date(post.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="post-body">
          <p>{post.content}</p>
        </div>

        <div className="form-actions">
          <button onClick={() => setIsEditing(true)} className="button-primary">
            Edit
          </button>
          <button onClick={handleDelete} className="button-danger">
            Delete
          </button>
        </div>
      </article>
    </div>
  )
}

export default PostDetails
