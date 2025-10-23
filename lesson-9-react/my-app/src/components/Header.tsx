import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <h1>User Management</h1>
      <nav>
        <Link to="/users">Users</Link>
        <Link to="/users/create">Create User</Link>
      </nav>    
    </header>
  );
};
export default Header;