import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import classes from './Cart.module.css';
import useHttp from 'hooks/use-http';
import HeaderPage from 'Components/UI/HeaderPage/HeaderPage';
import CartItem from './CartItem';
import CartTotal from './CartTotal';
import { cartActions } from 'store/cart';
import { checkoutActions } from 'store/checkout';
import { toastActions } from 'store/toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const urlFetch = useSelector(state => state.api.urlCart);
  const listCart = useSelector(state => state.cart.listCart);

  //--- dùng custom hooks: useHttp()
  const { sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      // Lưu tổng số kết quả trả về vào cart store
      dispatch(cartActions.SET_CART(data.products));
    };

    fetchData({ url: urlFetch }, transformData);
  }, [fetchData, urlFetch, dispatch]);

  // Biến xác định có cart nào k
  const hasCart = listCart.length > 0;

  const btnCheckoutHandler = () => {
    // ngăn hiển thị checkout page nếu chưa có cart nào
    if (listCart.length === 0) {
      dispatch(toastActions.SHOW_INFO('Continue shopping...'));
    } else {
      // cho phép hiển thị checkout page chỉ khi bấm nút checkout
      dispatch(checkoutActions.SHOW_checkout());

      // Chuyển hướng sang checkout page
      navigate('/checkout');
    }
  };

  return (
    <section>
      <HeaderPage title="cart" />

      <div className="row py-5 gx-0">
        <h4 className={`${classes.titleCart} h5 fw-bold text-uppercase mb-4`}>
          SHOPPING CART
        </h4>

        <div className="col-lg-8 text-center pe-lg-4">
          <ul className="p-0">
            <li className={`${classes.rowHeader} row gx-0 pt-3 pb-2`}>
              <h6 className="col-md-2">IMAGE</h6>
              <h6 className="col-md-2">PRODUCT</h6>
              <h6 className="col-md-2">PRICE</h6>
              <h6 className="col-md-2">QUANTITY</h6>
              <h6 className="col-md-2">TOTAL</h6>
              <h6 className="col-md-2">REMOVE</h6>
            </li>
            {hasCart &&
              listCart.map(cart => {
                return <CartItem key={cart._id} cart={cart} />;
              })}
            {!hasCart && (
              <p className="centered text-secondary">
                Chưa có sản phẩm nào trong giỏ hàng
              </p>
            )}
          </ul>
          <div className="d-flex flex-column flex-sm-row justify-content-between bg-light mt-5 p-4">
            <button
              onClick={() => navigate('/shop')}
              className={`${classes.shoppingBtn} small active-animation mb-2 mb-md-0`}
            >
              <FontAwesomeIcon icon={faLongArrowAltLeft} className="me-2" />
              Continue shopping
            </button>
            <button
              onClick={btnCheckoutHandler}
              className={`${classes.checkoutBtn} small align-self-end`}
            >
              Proceed to checkout
              <FontAwesomeIcon icon={faLongArrowAltRight} className="ms-2" />
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <CartTotal />
        </div>
      </div>
    </section>
  );
};

export default React.memo(Cart);
