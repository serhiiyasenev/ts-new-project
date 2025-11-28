import { Link } from "react-router-dom";

const Header = () => {
    return <header>
        <nav>
            <Link to="/board">📋 Board</Link>
            <Link to="/users">👥 Users</Link>
            <Link to="/posts">📰 Posts</Link>
        </nav>
    </header>;
}

export default Header;