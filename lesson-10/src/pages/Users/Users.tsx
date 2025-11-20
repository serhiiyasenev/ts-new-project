import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Users.css";
import type { User } from "../../types";
import { fetchUsers } from "../../api";
import { formatDateToYearMonthDay } from "../../utils/dateUtils";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await fetchUsers();
        setUsers(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  return (
    <div className="users-container">
      <h1>Users Page</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>
                <Link to={`/users/${user.id}`}>{user.email}</Link>
              </td>
              <td>{formatDateToYearMonthDay(user.dateOfBirth)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

}

export default Users;