import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert

import classes from './CheckoutForm.module.css';
import useHttp from 'hooks/use-http';
import { cartActions } from 'store/cart';
import { toastActions } from 'store/toast';

const CheckoutForm = props => {
  const dispatch = useDispatch();

  // dùng useRef() để lấy value input
  const fullNameInputRef = useRef();
  const phoneInputRef = useRef();
  const addressInputRef = useRef();

  // States lưu entered input
  const [enteredFullName, setEnteredFullName] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');
  const [enteredAddress, setEnteredAddress] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');

  const fullNameChangeHandler = e => setEnteredFullName(e.target.value);
  const phoneChangeHandler = e => setEnteredPhone(e.target.value);
  const addressChangeHandler = e => setEnteredAddress(e.target.value);

  const urlUserInfoFetch = useSelector(state => state.api.urlUserInfo);
  const urlCreateOrderFetch = useSelector(state => state.api.urlCreateOrder);
  //--- dùng custom hooks: useHttp()
  const { sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      setEnteredEmail(data.email);
      setEnteredFullName(data.fullName);
      setEnteredPhone(data.phone);
      setEnteredAddress(data.address);
    };

    fetchData({ url: urlUserInfoFetch }, transformData);
  }, [fetchData, urlUserInfoFetch]);

  // Xử lý ấn submit form
  const submitHandler = event => {
    event.preventDefault();

    const enteredData = {
      fullName: fullNameInputRef.current.value,
      phone: phoneInputRef.current.value,
      address: addressInputRef.current.value,
      totalMoney: props.totalMoney,
      totalQuantity: props.totalQuantity,
    };

    confirmAlert({
      message: 'Confirm to order',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            // cập nhật dữ liệu order
            try {
              const res = await fetch(urlCreateOrderFetch, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enteredData),
                credentials: 'include',
              });

              if (res.status === 401) {
                throw new Error('Please login!');
              }

              if (res.status === 403) {
                const data = await res.json();

                throw new Error(data.message ? data.message : 'Out of stock!');
              }

              if (res.ok) {
                // SET_DEFAULT lại state cart
                dispatch(cartActions.SET_DEFAULT());

                dispatch(toastActions.SHOW_SUCCESS('Order success!'));

                // set lại state cart checkout page để load thankyou page
                props.onSetHasCart(false);
              } else {
                throw new Error('Something error!');
              }
            } catch (error) {
              dispatch(
                toastActions.SHOW_WARN(error.toString() || 'Order failed!')
              );
            }
          },
        },
        {
          label: 'No',
          onClick: () => {
            // thông báo hủy
            dispatch(toastActions.SHOW_WARN('Canceled!'));
          },
        },
      ],
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="email">EMAIL:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter Your Email Here!"
          required
          value={enteredEmail}
          disabled
        />
        <label htmlFor="fullName">FULL NAME:</label>
        <input
          type="text"
          id="fullName"
          placeholder="Enter Your Full Name Here!"
          required
          ref={fullNameInputRef}
          value={enteredFullName}
          onChange={fullNameChangeHandler}
        />
        <label htmlFor="phone">PHONE NUMBER:</label>
        <input
          type="number"
          id="phone"
          placeholder="Enter Your Phone Here!"
          required
          ref={phoneInputRef}
          value={enteredPhone}
          onChange={phoneChangeHandler}
        />
        <label htmlFor="address">ADDRESS:</label>
        <input
          type="text"
          id="address"
          placeholder="Enter Your Address Here!"
          required
          ref={addressInputRef}
          value={enteredAddress}
          onChange={addressChangeHandler}
        />
      </div>

      <div className={classes.actions}>
        <button>Place order</button>
      </div>
    </form>
  );
};

export default CheckoutForm;
