/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { fetchUsers, type User } from "../api/usersApi";
import { Link } from "react-router-dom";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const fetchUserData = async () => {
    const result = await fetchUsers();
    setUsers(result);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchUserData()
  }, []);
  return (
    <>
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
              <td>{formatDate(user.dateOfBirth)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )

}

export default Users;