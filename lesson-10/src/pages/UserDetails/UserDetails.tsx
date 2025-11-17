import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../api/usersApi";
import type { User } from "../../types/user.types";

const UserDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchUserById(Number(id))
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>User not found</div>;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

  return (
    <>
      <h1>User Details</h1>
      <div>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Date of Birth:</strong> {formatDate(user.dateOfBirth)}</p>
      </div>
      <div>
        <Link to="/users">Back to Users</Link>
      </div>
    </>
  );
}

export default UserDetails; 