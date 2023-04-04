import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StoreIcon from '@mui/icons-material/Store';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ChatIcon from '@mui/icons-material/Chat';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// Import confirm modal
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import './sidebar.scss';
import { authActions } from 'store/auth';
import { toastActions } from 'store/toast';

const Sidebar = () => {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const isChatStaff = useSelector(state => state.auth.isChatStaff);

  // Dùng useDispatch() cập nhật state redux
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handlerLogout = () => {
    confirmAlert({
      message: 'Confirm to logout',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            dispatch(authActions.ON_LOGOUT());
            dispatch(toastActions.SHOW_SUCCESS('Logout success!'));
            navigate('/auth');
          },
        },
        {
          label: 'No',
          onClick: () => dispatch(toastActions.SHOW_WARN('cancelled!')),
        },
      ],
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link to="/">
          <span className="logo">Admin Page</span>
        </Link>
      </div>
      <hr />
      <div className="sidebar-center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/">
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          {isAuth && isAdmin && (
            <>
              <p className="title">LISTS</p>
              <Link to="/users">
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>
              <Link to="/products">
                <li>
                  <StoreIcon className="icon" />
                  <span>Products</span>
                </li>
              </Link>
              <Link to="/orders">
                <li>
                  <CreditCardIcon className="icon" />
                  <span>Orders</span>
                </li>
              </Link>

              <p className="title">NEW</p>
              <Link to="/products/new">
                <li>
                  <AddBusinessIcon className="icon" />
                  <span>New Product</span>
                </li>
              </Link>
            </>
          )}

          {((isAuth && isAdmin) || (isAuth && isChatStaff)) && (
            <>
              <p className="title">CHAT</p>
              <Link to="/chat">
                <li>
                  <ChatIcon className="icon" />
                  <span>Chat</span>
                </li>
              </Link>
            </>
          )}

          <p className="title">USER</p>
          <li onClick={handlerLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
