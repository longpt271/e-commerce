import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import classes from './OrderItem.module.css';

const OrderItem = ({ order }) => {
  const delivery =
    order.delivery === 'waiting'
      ? 'Waiting for progressing'
      : order.delivery === 'done'
      ? 'Đã vận chuyển'
      : '';
  const status =
    order.status === 'waiting'
      ? 'Waiting for pay'
      : order.status === 'done'
      ? 'Đã thanh toán'
      : '';

  return (
    <tr>
      <td data-label="ID ORDER: " className="small overflow-hidden">
        {order._id}
      </td>
      <td data-label="ID USER: " className="small overflow-hidden">
        {order.user.userId}
      </td>
      <td data-label="NAME: " className="small">
        {order.user.fullName}
      </td>
      <td data-label="PHONE: " className="small">
        {order.user.phone}
      </td>
      <td data-label="ADDRESS: " className="small">
        {order.user.address}
      </td>
      <td data-label="TOTAL: " className="small">
        {order.totalMoney.toLocaleString('vi-VN')} VND
      </td>
      <td data-label="DELIVERY: " className="small">
        {delivery}
      </td>
      <td data-label="STATUS: " className="small">
        {status}
      </td>
      <td>
        <Link
          to={'/order/' + order._id}
          className={`${classes.DetailOrderBtn} small active-animation`}
        >
          View
          <FontAwesomeIcon icon={faLongArrowAltRight} className="ms-2" />
        </Link>
      </td>
    </tr>
  );
};

export default OrderItem;
