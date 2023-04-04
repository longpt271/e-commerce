import classes from './CheckoutOrder.module.css';

const CheckoutOrder = ({ listCart, totalMoney, totalQuantity }) => {
  return (
    <div className={`${classes.CheckoutOrder} bg-light p-5`}>
      <h4 className="mb-3">YOUR ORDER</h4>

      {listCart.map(cart => {
        return (
          <div className={`${classes.orderItem} row`} key={cart.productId._id}>
            <b className="col-xxl-6">{cart.productId.name}</b>
            <span className="col-xxl-6 text-end text-secondary">
              {cart.productId.price.toLocaleString('vi-VN')} VNDx
              {cart.quantity}
            </span>
          </div>
        );
      })}

      <div className={`pt-3 d-flex justify-content-between`}>
        <b>TOTAL</b>
        <p className="fs-5 fw-bold">{totalMoney.toLocaleString('vi-VN')} VND</p>
      </div>
      <div className="d-flex justify-content-between">
        <b>Total products:</b>
        <span className="text-secondary">{totalQuantity} products</span>
      </div>
    </div>
  );
};

export default CheckoutOrder;
