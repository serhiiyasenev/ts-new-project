import { Link, useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    console.log("User ID:", id);

  return (
    <>
      <div>User Details: {id}</div>
      <Link to="/users">Back to Users</Link>
      <button onClick={() => navigate("/users")}>Go Back</button>
    </>
  );
}

export default UserDetails; 