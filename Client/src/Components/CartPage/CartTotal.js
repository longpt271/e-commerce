import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';

import classes from './CartTotal.module.css';
import Button from 'Components/UI/Button/Button';
import { toastActions } from 'store/toast';

// Convert VND to USD
function vndToUsd(amountInVnd) {
  const amountInUsd = amountInVnd / 23675;
  return amountInUsd.toFixed(2); // round to 2 decimal places
}

const CartTotal = () => {
  const dispatch = useDispatch();

  // Hàm cộng tổng giá tiền tất cả quantity có trong listCart
  const totalMoney = useSelector(state => state.cart.totalMoney);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <div className={`${classes.cartTotal} bg-light p-5`}>
      <h4 className="mb-3">CART TOTAL</h4>
      <div className="d-flex justify-content-between">
        <b>Total products:</b>
        <p className="text-secondary">
          {totalQuantity} {totalQuantity !== 1 ? 'products' : 'product'}
        </p>
      </div>
      <div className="d-flex justify-content-between">
        <b>SUBTOTAL</b>
        <p className="text-secondary">{vndToUsd(totalMoney)} USD</p>
      </div>
      <div
        className={`${classes.totalPrice} pt-3 d-flex justify-content-between`}
      >
        <b>TOTAL</b>
        <p className="fs-5">{totalMoney.toLocaleString('vi-VN')} VND</p>
      </div>
      <div className={classes.coupon}>
        <input type="text" placeholder="Enter your coupon" />
        <Button
          onClick={() => {
            dispatch(toastActions.SHOW_WARN('Tính năng này chưa khả dụng!'));
          }}
        >
          <FontAwesomeIcon icon={faGift} className="me-2" />
          Apply coupon
        </Button>
      </div>
    </div>
  );
};

export default CartTotal;
