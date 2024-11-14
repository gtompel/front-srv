import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/">Users</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/teams">Teams</Link>
      </nav>
    </header>
  );
};

export default Header;
