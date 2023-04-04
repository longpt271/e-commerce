import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { toastActions } from 'store/toast';
import classes from './DetailProductForm.module.css';

const DetailProductForm = props => {
  const navigate = useNavigate();

  // Dùng useDispatch() cập nhật state redux
  const dispatch = useDispatch();

  // Lấy dữ liệu login state redux
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const quantityInputRef = useRef();

  // Giá trị của input quantity
  const [quantityIsValid, setQuantityIsValid] = useState(true);
  const [soldOut, setSoldOut] = useState(false);

  //--- dùng custom hooks: useHttp()
  const urlFetch = useSelector(state => state.api.urlAddCart);

  const submitHandler = event => {
    event.preventDefault();

    // Nếu chưa đăng nhập: chuyển trang và return
    if (!isAuthenticated) {
      dispatch(toastActions.SHOW_WARN('Please login first!'));
      navigate('/login');
      // Nếu k return đoạn code ở dưới vẫn chạy bt
      return;
    }

    // lấy ra giá trị Quantity input
    const enteredQuantity = quantityInputRef.current.value;

    // kiểm tra đã bán hết chưa
    if (+enteredQuantity === 0 && +props.productData.count === 0) {
      setSoldOut(true);
      return;
    } else {
      setSoldOut(false);
      // Xử lý nhấp sai giá trị
      if (
        enteredQuantity.trim().length === 0 ||
        // Giới hạn từ (1-5)
        +enteredQuantity < 1 ||
        +enteredQuantity > +props.productData.count
      ) {
        setQuantityIsValid(false);
        return;
      } else {
        setQuantityIsValid(true);
      }
    }

    fetch(urlFetch, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: props.productData._id,
        numAdd: +enteredQuantity,
      }),
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) {
          navigate('/login');
          throw new Error('Please login!');
        }

        if (res.ok) {
          dispatch(toastActions.SHOW_SUCCESS('Add success!'));
        } else {
          throw new Error('Fetch fail!');
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(toastActions.SHOW_WARN(err.toString() || 'Register failed!'));
      });
  };

  // Xử lý ấn giảm
  const clickLeftHandler = () => {
    document.getElementById(`quantity_${props.id}`).stepDown();
  };

  // Xử lý ấn tăng
  const clickRightHandler = () => {
    document.getElementById(`quantity_${props.id}`).stepUp();
  };

  return (
    <>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={`${classes.inputForm} ps-3 pe-2 no-copy-text`}>
          <label htmlFor={`quantity_${props.id}`}>
            <span className="small text-uppercase pe-3">Quantity</span>
          </label>

          <FontAwesomeIcon
            icon={faCaretLeft}
            onClick={clickLeftHandler}
            className="p-2"
          />
          <input
            ref={quantityInputRef}
            id={`quantity_${props.id}`}
            type="number"
            min="0"
            max={props.productData.count}
            step="1"
            defaultValue="0"
          />
          <FontAwesomeIcon
            icon={faCaretRight}
            onClick={clickRightHandler}
            className="p-2 me-2"
          />
        </div>

        <button className="small">Add to cart</button>
      </form>

      {!quantityIsValid && (
        <p className="mb-1 text-danger">
          Please enter a valid quantity (1-{props.productData.count}).
        </p>
      )}
      {soldOut && <p className="mb-1 text-danger">Sold out</p>}
    </>
  );
};

export default DetailProductForm;
