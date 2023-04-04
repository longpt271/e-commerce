import { useSelector } from 'react-redux';
import { useState } from 'react';

import classes from './Checkout.module.css';
import HeaderPage from 'Components/UI/HeaderPage/HeaderPage';
import CheckoutForm from './CheckoutForm';
import CheckoutOrder from './CheckoutOrder';
import CheckoutThankYou from './CheckoutThankYou';

const Checkout = () => {
  const isShowCheckout = useSelector(state => state.checkout.isShow);
  // console.log(isShowCheckout);

  // Lấy totalQuantity state redux
  const totalMoney = useSelector(state => state.cart.totalMoney);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  // Lấy state redux
  const listCart = useSelector(state => state.cart.listCart);

  const [hasCart, setHasCart] = useState(listCart.length > 0);

  return (
    <>
      {isShowCheckout && (
        <>
          {hasCart && (
            <section>
              <HeaderPage title="checkout" />

              <div className="row py-5 gx-0">
                <h4
                  className={`${classes.titleCheckout} h5 fw-bold text-uppercase mb-4`}
                >
                  BILLING DETAILS
                </h4>

                <div className="col-lg-8 order-2 order-lg-1 pe-lg-4">
                  <CheckoutForm
                    listCart={listCart}
                    totalMoney={totalMoney}
                    totalQuantity={totalQuantity}
                    onSetHasCart={setHasCart}
                  />
                </div>

                <div className="col-lg-4 order-1 order-lg-2 pb-4 pb-lg-0">
                  <CheckoutOrder
                    listCart={listCart}
                    totalMoney={totalMoney}
                    totalQuantity={totalQuantity}
                  />
                </div>
              </div>
            </section>
          )}
          {!hasCart && <CheckoutThankYou />}
        </>
      )}
      {!isShowCheckout && (
        <p className="centered pt-5">
          You should check your cart and then checkout!
        </p>
      )}
    </>
  );
};

export default Checkout;
