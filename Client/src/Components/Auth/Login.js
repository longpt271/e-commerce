import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Input from 'Components/UI/Input/Input';
import { authActions } from 'store/auth';
import { toastActions } from 'store/toast';
import classes from './Login.module.css';

const Login = () => {
  const navigate = useNavigate(); // Dùng useNavigate() để điều hướng trang
  const dispatch = useDispatch(); // Dùng useDispatch() cập nhật state redux

  const urlLogin = useSelector(state => state.api.urlLogin);

  // lấy value input
  const [authLoading, setAuthLoading] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const emailChangeHandler = e => setEnteredEmail(e.target.value);
  const passwordChangeHandler = e => setEnteredPassword(e.target.value);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = async event => {
    event.preventDefault();
    // console.log(userArr);

    const enteredData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    // Xử lý nếu chưa nhập => focus vào input đó
    if (enteredData.email === '') {
      emailInputRef.current.focus();
      return;
    } else if (enteredData.password === '') {
      passwordInputRef.current.focus();
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch(urlLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enteredData),
        credentials: 'include',
      });

      if (res.status === 422) {
        throw new Error('Validation failed.');
      }
      if (res.status === 401) {
        throw new Error('Wrong email or password');
      }
      if (res.status !== 200 && res.status !== 201) {
        // console.log('Error!');
        throw new Error('Could not authenticate you!');
      }

      const data = await res.json();
      if (res.ok) {
        setAuthLoading(false);

        // Lấy data từ kq fetch
        const dataLogin = {
          userId: data.user.userId,
          fullName: data.user.fullName,

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
        throw new Error('Fetch failed!');
      }
    } catch (error) {
      setAuthLoading(false);
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Register failed!'));
    }
  };

  return (
    <section className={classes.auth}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h3>Sign In</h3>
        <div className="d-flex justify-content-center pb-5"></div>

        <div className={classes.control}>
          <Input
            ref={emailInputRef}
            type="email"
            id="email"
            placeholder="Email"
            value={enteredEmail}
            onChange={emailChangeHandler}
          />

          <Input
            ref={passwordInputRef}
            type="password"
            id="password"
            placeholder="Password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
          />
        </div>

        <div className={classes.actions}>
          <button>{authLoading ? 'Loading...' : 'SIGN IN'}</button>
        </div>

        <div className={classes.toggle}>
          <span>Create an account?</span>
          <button type="button" onClick={() => navigate('/register')}>
            Sign up
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;
