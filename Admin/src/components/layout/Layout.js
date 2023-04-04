import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './dataTable.scss';
import './Layout.scss';
import Sidebar from './sidebar/Sidebar';
import Navbar from './navbar/Navbar';
import { authActions } from 'store/auth';

const Layout = props => {
  const dispatch = useDispatch();

  // Xử lý auto logout dựa vào expireTime
  const expireTime = useSelector(state => state.auth.expireTime);
  useEffect(() => {
    const isTimeout = new Date().getTime() > parseInt(expireTime);
    // console.log(new Date().getTime(), parseInt(expireTime));
    if (expireTime && isTimeout) {
      dispatch(authActions.ON_LOGOUT());
    }
  }, [dispatch, expireTime]);

  return (
    <main className={`${props.className} main`}>
      <Sidebar />
      <div className="flexContainer">
        <Navbar />
        {props.children}
      </div>
    </main>
  );
};

export default Layout;
