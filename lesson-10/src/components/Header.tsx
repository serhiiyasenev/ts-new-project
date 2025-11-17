import { Link } from "react-router-dom";

const Header = () => {
    return <header>
        <nav>
            <Link to="/users">Users</Link>
            <Link to="/users/create">Create User</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/tasks/create">Create Task</Link>
        </nav>
    </header>;
}

export default Header;