import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './auth.scss';
import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';
import { authActions } from 'store/auth';

const Auth = () => {
  // Sử dụng context lấy dữ liệu
  const ctx = useContext(ApiContext);

  // điều hướng
  const navigate = useNavigate();

  // Dùng useDispatch() cập nhật state redux
  const dispatch = useDispatch();

  // states
  const [authLoading, setAuthLoading] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const emailChangeHandler = e => setEnteredEmail(e.target.value);
  const passwordChangeHandler = e => setEnteredPassword(e.target.value);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // Xử lý login
  const loginHandler = async e => {
    e.preventDefault();

    // Validate dữ liệu
    if (enteredEmail === '') {
      emailInputRef.current.focus();
      return;
    } else if (enteredPassword === '') {
      passwordInputRef.current.focus();
      return;
    }

    const userData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    setAuthLoading(true);
    try {
      const res = await fetch(ctx.requests.postLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (res.status === 422) {
        throw new Error('Validation failed.');
      }
      if (res.status === 401) {
        throw new Error('Wrong email or password');
      }
      if (res.status === 403) {
        throw new Error('Access denied');
      }

      const data = await res.json();
      if (res.ok) {
        setAuthLoading(false);

        // Lấy data từ kq fetch
        const dataLogin = {
          userId: data.user.userId,
          role: data.user.role,

          // tính lại thời gian hết hạn
          // = thời gian hiện tại login + số tgian tối đa có thể truy cập
          expireTime: new Date().getTime() + data.user.maxAge,
        };

        // cập nhật dữ liệu state Redux bằng action login
        dispatch(authActions.ON_LOGIN(dataLogin));

        // toast thông báo Login thành công (lấy từ store redux)
        dispatch(toastActions.SHOW_SUCCESS(data.message || 'Login success!'));

        navigate('/');
      } else {
        if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Fetch failed');
        }
      }
    } catch (error) {
      setAuthLoading(false);
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Login failed!'));
    }
  };

  return (
    <main>
      <div className="navbarAuth">
        <div className="logo" onClick={() => navigate('#')}>
          Admin Page
        </div>
      </div>
      <div className="login">
        <form className="lContainer">
          <h1>Login</h1>
          <input
            type="email"
            placeholder="email"
            id="email"
            className="lInput"
            value={enteredEmail}
            onChange={emailChangeHandler}
            ref={emailInputRef}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="lInput"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            ref={passwordInputRef}
          />

          <button className="lButton" onClick={loginHandler}>
            {authLoading ? '...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Auth;
