import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './UserDetails.css';
import type { User } from "../../types/user";
import { fetchUserById } from "../../api/usersApi";

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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!user) return <div className="error-message">User not found</div>;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

  return (
    <div className="user-details">
      <h1>User Details</h1>
      <div className="details-card">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{user.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">First Name:</span>
          <span className="detail-value">{user.firstName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Last Name:</span>
          <span className="detail-value">{user.lastName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date of Birth:</span>
          <span className="detail-value">{formatDate(user.dateOfBirth)}</span>
        </div>
      </div>
      <Link to="/users" className="button-secondary">Back to Users</Link>
    </div>
  );
}

export default UserDetails; 