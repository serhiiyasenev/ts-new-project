import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Users.css";
import type { User } from "../../types";
import { fetchUsers, deleteUser } from "../../api";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await fetchUsers();
        setUsers(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users</h1>
        <Link to="/users/create" className="button-primary">Create User</Link>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.email}</td>
              <td>{user.isActive ? '✓ Active' : '✗ Inactive'}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="actions-cell">
                <Link to={`/users/${user.id}`} className="button-secondary">Edit</Link>
                <button onClick={() => handleDelete(user.id)} className="button-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

}

export default Users;