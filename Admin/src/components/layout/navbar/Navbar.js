import { Link } from 'react-router-dom';

import './navbar.scss';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Navbar = () => {
  return (
    <div className="main-navbar">
      <div className="wrapper">
        <Link to="/user-info">
          <AccountCircleOutlinedIcon className="avatar" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
