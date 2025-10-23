import { Link, useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    console.log("User ID:", id);

  return (
    <>
      <div>
        <h2>User Details Page</h2>
        <p>User ID: {id}</p>
      </div>
      <Link to="/users">Back to Users</Link>
      <button onClick={() => navigate("/users")}>Go Back</button>
    </>
  );
};

export default UserDetails;
