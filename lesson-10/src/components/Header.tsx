import { Link } from "react-router-dom";

const Header = () => {
    return <header>
        <nav>
            <Link to="/users">Users</Link>
            <Link to="/users/create">Create User</Link>
        </nav>
    </header>;
}

export default Header;