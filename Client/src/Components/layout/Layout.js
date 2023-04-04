import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// import react-toastify để tạo thông báo
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import css confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css';

import classes from './Layout.module.css';
import NavBar from './NavBar';
import Footer from './Footer';
import ChatApp from './ChatApp/ChatApp';
import { authActions } from 'store/auth';
import { chatAppActions } from 'store/chatApp';

const Layout = props => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Xử lý auto logout dựa vào expireTime
  const expireTime = useSelector(state => state.auth.expireTime);
  useEffect(() => {
    const isTimeout = new Date().getTime() > parseInt(expireTime);
    // console.log(new Date().getTime(), parseInt(expireTime));
    if (expireTime && isTimeout) {
      dispatch(authActions.ON_LOGOUT());
      dispatch(chatAppActions.REMOVE_ROOM());
    }
  }, [dispatch, expireTime]);

  const isLoginPage =
    location.pathname !== '/login' && location.pathname !== '/register'
      ? 'container'
      : '';

  return (
    <>
      <NavBar />
      <main className={classes.main + ' ' + isLoginPage}>{props.children}</main>
      <Footer />
      <ChatApp />
      <ToastContainer />
    </>
  );
};

export default Layout;
