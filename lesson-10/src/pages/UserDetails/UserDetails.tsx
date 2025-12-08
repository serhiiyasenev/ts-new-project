import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import './UserDetails.css'
import type { User } from '@shared/user.types'
import { fetchUserById, updateUser, deleteUser } from '../../api'
import { userSchema, type UserFormFields } from '../../schema/userSchema'
import { useToast } from '../../hooks/useToast'

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<UserFormFields>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    if (id) {
      fetchUserById(Number(id))
        .then((data) => {
          setUser(data)
          if (data) {
            reset({ name: data.name, email: data.email, isActive: data.isActive })
          }
        })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id, reset])

  const handleUpdate = async (data: UserFormFields) => {
    try {
      const updated = await updateUser(Number(id!), data)
      setUser(updated)
      setIsEditing(false)
      showToast('User updated successfully', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update user', 'error')
    }
  }

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser(Number(id))
      showToast('User deleted successfully', 'success')
      navigate('/users')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete user', 'error')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-message">Error: {error}</div>
  if (!user) return <div className="error-message">User not found</div>

  if (isEditing) {
    return (
      <div className="user-details">
        <h1>Edit User</h1>
        <form onSubmit={handleSubmit(handleUpdate)} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" {...register('name')} />
            <div className="error">{errors.name?.message}</div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" {...register('email')} />
            <div className="error">{errors.email?.message}</div>
          </div>

          <div className="form-group">
            <label htmlFor="isActive">
              <input id="isActive" type="checkbox" {...register('isActive')} />
              Active
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)} className="button-secondary">
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={!isDirty || !isValid}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="user-details">
      <h1>User Details</h1>
      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{user.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{user.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="detail-value">{user.isActive ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Last Login:</span>
          <span className="detail-value">
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Created:</span>
          <span className="detail-value">{new Date(user.createdAt).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Updated:</span>
          <span className="detail-value">{new Date(user.updatedAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="form-actions">
        <Link to="/users" className="button-secondary">
          Back to Users
        </Link>
        <button onClick={() => setIsEditing(true)} className="button-primary">
          Edit
        </button>
        <button onClick={handleDelete} className="button-danger">
          Delete
        </button>
      </div>
    </div>
  )
}

export default UserDetails
