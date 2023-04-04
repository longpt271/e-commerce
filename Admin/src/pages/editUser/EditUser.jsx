import { useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './editUser.scss';
import Layout from 'components/layout/Layout';
import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';

const EditUser = () => {
  const dispatch = useDispatch();
  // Sử dụng useContext để lấy data api
  const ctx = useContext(ApiContext);

  const location = useLocation();
  const user = location.state || {};

  // navigate điều hướng
  const navigate = useNavigate();

  // lưu value input vào state
  const [enteredEmail] = useState(user.email);
  const [enteredFullName, setEnteredFullName] = useState(user.fullName);
  const [enteredPhone, setEnteredPhone] = useState(user.phone);
  const [enteredAddress, setEnteredAddress] = useState(user.address);

  // handlers
  const fullNameChangeHandler = e => setEnteredFullName(e.target.value);
  const phoneChangeHandler = e => setEnteredPhone(e.target.value);
  const addressChangeHandler = e => setEnteredAddress(e.target.value);

  // dùng useRef() để lấy value input dùng focus()
  const fullNameInputRef = useRef();
  const phoneInputRef = useRef();
  const addressInputRef = useRef();

  // Xử lý submit
  const submitHandler = e => {
    e.preventDefault();

    // Validate dữ liệu
    if (enteredFullName === '') {
      fullNameInputRef.current.focus();
      return;
    } else if (enteredPhone === '') {
      phoneInputRef.current.focus();
      return;
    } else if (enteredAddress === '') {
      addressInputRef.current.focus();
      return;
    }

    const editUser = {
      fullName: enteredFullName,
      phone: enteredPhone,
      address: enteredAddress,
    };

    // console.log(editUser);

    // post update User
    fetch(ctx.requests.urlUserInfo, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(editUser),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        dispatch(
          toastActions.SHOW_SUCCESS(data.message || 'Edit user success!')
        );
      })
      .catch(err => console.log(err));

    // move page
    navigate('/user-info');
  };

  return (
    <Layout className="new">
      <div className="top">
        <h1>Update Your Info</h1>
      </div>
      <div className="bottom">
        <form onSubmit={submitHandler}>
          <div className="formInput">
            <label>Email</label>
            <input
              id="email"
              type="email"
              placeholder="your email address"
              value={enteredEmail}
              disabled
            />
          </div>
          <div className="formInput">
            <label>Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={enteredFullName}
              onChange={fullNameChangeHandler}
              ref={fullNameInputRef}
            />
          </div>
          <div className="formInput">
            <label>Phone</label>
            <input
              id="phone"
              type="text"
              placeholder="Your phone number"
              value={enteredPhone}
              onChange={phoneChangeHandler}
              ref={phoneInputRef}
            />
          </div>
          <div className="formInput">
            <label>Address</label>
            <input
              id="address"
              type="text"
              placeholder="Your Address"
              value={enteredAddress}
              onChange={addressChangeHandler}
              ref={addressInputRef}
            />
          </div>
          <Link to="#" className="formInput">
            Change password?
          </Link>
          <button>Update</button>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;
