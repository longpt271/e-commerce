import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Input from 'Components/UI/Input/Input';
import { toastActions } from 'store/toast';
import classes from './Login.module.css';

const Register = () => {
  const navigate = useNavigate(); // Dùng useNavigate() để điều hướng trang
  const dispatch = useDispatch(); // Dùng useDispatch() cập nhật state redux

  const urlRegister = useSelector(state => state.api.urlRegister);

  // lấy value input
  const [authLoading, setAuthLoading] = useState(false);
  const [enteredFullName, setEnteredFullName] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');

  // Value input change handlers
  const fullNameChangeHandler = e => setEnteredFullName(e.target.value);
  const emailChangeHandler = e => setEnteredEmail(e.target.value);
  const passwordChangeHandler = e => setEnteredPassword(e.target.value);
  const phoneChangeHandler = e => setEnteredPhone(e.target.value);

  // dùng useRef() để lấy value input
  const fullNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const phoneInputRef = useRef();

  // Xử lý ấn submit form
  const submitHandler = async event => {
    event.preventDefault();

    // optional: Add validation
    const enteredData = {
      fullName: enteredFullName,
      email: enteredEmail,
      password: enteredPassword,
      phone: enteredPhone,
    };

    // Validate dữ liệu
    if (enteredData.fullName === '') {
      fullNameInputRef.current.focus();
      return;
    } else if (enteredData.email === '') {
      emailInputRef.current.focus();
      return;
    } else if (enteredData.password === '') {
      passwordInputRef.current.focus();
      return;
    } else if (enteredData.phone === '') {
      phoneInputRef.current.focus();
      return;
    } else if (enteredData.password.length < 8) {
      dispatch(toastActions.SHOW_WARN('Password nên nhiều hơn 8 ký tự!'));
      passwordInputRef.current.focus();
      return;
    } else if (enteredData.phone.length < 10 || enteredData.phone.length > 11) {
      dispatch(toastActions.SHOW_WARN('Phone needs 10 or 11 numbers!'));
      phoneInputRef.current.focus();
      return;
    }

    // fetch create user
    setAuthLoading(true);
    try {
      const res = await fetch(urlRegister, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enteredData),
      });

      if (res.status === 422) {
        throw new Error("Make sure the email address isn't used yet!");
      }
      if (res.status !== 200 && res.status !== 201) {
        console.log('Error!');
        throw new Error('Creating a user failed!');
      }

      if (res.ok) {
        setAuthLoading(false);

        const resData = await res.json();

        // toast thông báo Login thành công
        dispatch(
          toastActions.SHOW_SUCCESS(
            resData.message.toString() || 'Register success!'
          )
        );

        // Chuyển trang
        navigate('/login');
      } else {
        throw new Error('Fetch failed!');
      }
    } catch (error) {
      // console.log(error);
      setAuthLoading(false);
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Register failed!'));
    }
  };

  return (
    <section className={classes.auth}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h3>Sign Up</h3>

        <div className={classes.control}>
          <Input
            ref={fullNameInputRef}
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={enteredFullName}
            onChange={fullNameChangeHandler}
          />
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
          <Input
            ref={phoneInputRef}
            type="number"
            id="phone"
            placeholder="Phone"
            value={enteredPhone}
            onChange={phoneChangeHandler}
          />
        </div>

        <div className={classes.actions}>
          <button>{authLoading ? 'Loading...' : 'SIGN UP'}</button>
        </div>

        <div className={classes.toggle}>
          <span>Login?</span>
          <button type="button" onClick={() => navigate('/login')}>
            Click
          </button>
        </div>
      </form>
    </section>
  );
};

export default Register;
