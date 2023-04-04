import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Image from 'img/Image';
import { toastActions } from 'store/toast';
import useHttp from 'hooks/use-http';
import { authActions } from 'store/auth';

const Profile = () => {
  const dispatch = useDispatch();

  // State lưu input
  const [enteredFullName, setEnteredFullName] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredAddress, setEnteredAddress] = useState('');

  // hàm handler State change
  const fullNameChangeHandler = e => setEnteredFullName(e.target.value);
  const phoneChangeHandler = e => setEnteredPhone(e.target.value);
  const addressChangeHandler = e => setEnteredAddress(e.target.value);

  const urlFetch = useSelector(state => state.api.urlUserInfo);
  //--- dùng custom hooks: useHttp()
  const { sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      setEnteredEmail(data.email);
      setEnteredFullName(data.fullName);
      setEnteredPhone(data.phone);
      setEnteredAddress(data.address);
    };

    fetchData({ url: urlFetch }, transformData);
  }, [fetchData, urlFetch]);

  const submitHandler = event => {
    event.preventDefault();
    fetch(urlFetch, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: enteredFullName,
        phone: enteredPhone,
        address: enteredAddress,
      }),
      credentials: 'include',
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        if (res.ok) {
          dispatch(toastActions.SHOW_SUCCESS('Update success!'));
          dispatch(
            authActions.ON_CHANGE_FULL_NAME({ fullName: enteredFullName })
          );
        } else {
          throw new Error('Fetch fail!');
        }
      })
      .catch(err => {
        dispatch(toastActions.SHOW_WARN(err));
      });
  };

  return (
    <div className="rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-2 py-md-5">
            <img
              className="rounded-circle mt-md-5"
              width="150px"
              src={Image.profileUser}
              alt="avt"
            />
            <span className="font-weight-bold">
              {enteredFullName || 'Long Phạm'}
            </span>
            <span className="text-black-50">{enteredEmail || 'longpt27'}</span>
            <span> </span>
          </div>
        </div>

        <div className="col-md-9 border-right">
          <form onSubmit={submitHandler} className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Settings</h4>
            </div>

            <div className="row mt-2">
              <div className="col-12 col-md-6 pb-3">
                <label htmlFor="full-name" className="labels">
                  Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  className="form-control"
                  placeholder="Your full name"
                  value={enteredFullName}
                  onChange={fullNameChangeHandler}
                />
              </div>
              <div className="col-12 col-md-6 pb-3">
                <label htmlFor="phone" className="labels">
                  Mobile Number
                </label>
                <input
                  id="phone"
                  type="text"
                  className="form-control"
                  value={enteredPhone}
                  onChange={phoneChangeHandler}
                  placeholder="Your phone number"
                />
              </div>
              <div className="col-12 pb-4">
                <label htmlFor="address" className="labels">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  className="form-control"
                  placeholder="Your address"
                  value={enteredAddress}
                  onChange={addressChangeHandler}
                />
              </div>
            </div>

            {/* <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="currentPassword" className="labels">
                  Enter current Password
                </label>
                <input
                  id="Password"
                  type="text"
                  className="form-control"
                  placeholder="Enter current Password"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="newPassword" className="labels">
                  Enter new Password
                </label>
                <input
                  id="Password"
                  type="text"
                  className="form-control"
                  placeholder="Enter new Password"
                />
              </div>
            </div> */}
            <div className="text-center">
              <button className="btn btn-primary profile-button">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
