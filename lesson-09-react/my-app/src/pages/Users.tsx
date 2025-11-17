import { useEffect, useState } from "react";
import { getUsers, type User } from "../api/usersApi";

const Users = () => {
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };
  fetchUsers();
}, []);

  return (
    <div>
      <h1>Users Page</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
