/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { fetchUsers, type User } from "../api/usersApi";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const fetchUserData = async () => {
    const result = await fetchUsers();
    setUsers(result);
  }

  useEffect(() => {
    fetchUserData()
  }, []);
  return (
    <>
      <h1>Users Page</h1>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <h3>{user.firstName} {user.lastName}</h3>
          </div>
        ))}
      </div>
    </>
  )

}

export default Users;