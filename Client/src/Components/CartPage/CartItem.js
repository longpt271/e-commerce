import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import classes from './CartItem.module.css';
import { toastActions } from 'store/toast';
import { cartActions } from 'store/cart';

const CartItem = ({ cart }) => {
  const dispatch = useDispatch();

  // Hàm set lại url của img kèm domain
  const domain = useSelector(state => state.api.domain);
  const setUrlImg = url => {
    const newUrl = url.startsWith('public/images') ? domain + '/' + url : url;
    return newUrl;
  };

  const urlAddCart = useSelector(state => state.api.urlAddCart);

  // Hàm xử lý tăng giảm số lượng
  const clickAddHandler = async (productData, numAdd) => {
    try {
      const res = await fetch(urlAddCart, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productData._id,
          numAdd: +numAdd,
        }),
        credentials: 'include',
      });

      if (res.status === 401) {
        throw new Error('Please login!');
      }

      if (res.ok) {
        dispatch(
          cartActions.UPDATE_CART({
            productId: productData,
            quantity: +numAdd,
          })
        );
      } else {
        throw new Error('Something error!');
      }
    } catch (error) {
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Add failed!'));
    }
  };

  // Xử lý remove cart
  const urlRemoveCart = useSelector(state => state.api.urlCart);

  const clickRemoveHandler = id => {
    confirmAlert({
      message: 'Confirm to delete',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await fetch(urlRemoveCart + '/' + id, {
                method: 'DELETE',
                credentials: 'include',
              });
              if (res.status === 401) {
                throw new Error('Please login!');
              }
              if (res.ok) {
                dispatch(
                  cartActions.DELETE_CART({ _id: id, shouldListen: true })
                );
                // thông báo Xóa thành công
                dispatch(toastActions.SHOW_SUCCESS('Deleted!'));
              } else {
                throw new Error('Something error!');
              }
            } catch (error) {
              dispatch(
                toastActions.SHOW_WARN(error.toString() || 'Delete failed!')
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
    <li className={`${classes['cart-item']} no-copy-text row py-2`}>
      <div className="col-3 col-md-2 order-2 order-md-1">
        <Link to={`/detail/${cart.productId._id}`}>
          <img
            src={setUrlImg(cart.productId.img1)}
            alt={cart.productId.name}
            className="w-100"
          />
        </Link>
      </div>

      <h6 className="col-12 col-md-2 order-1 order-md-2">
        <Link
          to={`/detail/${cart.productId._id}`}
          className="text-decoration-none text-secondary pt-2 pt-md-0"
        >
          {cart.productId.name}
        </Link>
      </h6>

      <div className="col-md-2 order-md-3 d-none d-md-block text-secondary">
        <p className="mb-1">{cart.productId.price.toLocaleString('vi-VN')}</p>
        <span>VND</span>
      </div>

      <div className="col-2 col-md-2 order-3 order-md-4">
        <div className="d-flex justify-content-center align-items-center">
          <FontAwesomeIcon
            icon={faCaretLeft}
            onClick={clickAddHandler.bind(null, cart.productId, -1)}
            className="p-2 active-animation"
          />
          <b>{cart.quantity}</b>
          <FontAwesomeIcon
            icon={faCaretRight}
            onClick={clickAddHandler.bind(null, cart.productId, 1)}
            className="p-2 active-animation"
          />
        </div>
        <small className="text-danger fw-bold">
          {cart.quantity > cart.productId.count
            ? cart.productId.count + ' left'
            : ' '}
        </small>
      </div>

      <div className="col-3 col-md-2 order-4 order-md-5 text-secondary">
        <p className="mb-1">
          {(cart.productId.price * cart.quantity).toLocaleString('vi-VN')}
        </p>
        <span>VND</span>
      </div>

      <div className="col-2 col-md-2 order-5 order-md-6 text-secondary">
        <FontAwesomeIcon
          icon={faTrashCan}
          onClick={clickRemoveHandler.bind(null, cart.productId._id)}
          className="p-2 active-animation"
        />
      </div>
    </li>
  );
};

export default React.memo(CartItem);
