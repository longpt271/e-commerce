import ApiContext from 'context/ApiContext';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import classes from './OrderDetail.module.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { requests, mainApi } = useContext(ApiContext); // Sử dụng useContext để lấy data api
  const [order, setOrder] = useState([]);

  const urlFetch = requests.getOrder;

  useEffect(() => {
    fetch(
      urlFetch + '/' + orderId,

      {
        credentials: 'include',
      }
    )
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        window.scrollTo(0, 0);
      })
      .catch(err => console.log(err));
  }, [urlFetch, orderId]);

  return (
    <div className="dataTable text-gray">
      <div className="dataTableTitle">Orders Detail</div>
      <div className="row pb-5 gx-0">
        {order?.length !== 0 && (
          <>
            <div className="pb-5">
              <p className="small mb-2">ID User: {order.user.userId}</p>
              <p className="small mb-2">Full Name: {order.user.fullName}</p>
              <p className="small mb-2">Phone: {order.user.phone}</p>
              <p className="small mb-2">Address: {order.user.address}</p>
              <p className="small mb-2">
                Total: {order.totalMoney.toLocaleString('vi-VN')} VND
              </p>
            </div>

            <table className={classes.order}>
              <thead className="bg-light">
                <tr>
                  <th>ID PRODUCT</th>
                  <th>IMAGE</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>COUNT</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map(p => {
                  // Set lại url của img kèm domain
                  const urlImg = p.product.img1.startsWith('public/images')
                    ? mainApi + '/' + p.product.img1
                    : p.product.img1;

                  return (
                    <tr key={p._id}>
                      <td data-label="ID PRODUCT: " className="small fw-bold">
                        {p.product._id}
                      </td>
                      <td className="small fw-bold">
                        <img src={urlImg} alt={p.product.name} height="200" />
                      </td>
                      <td data-label="NAME: " className="small fw-bold">
                        {p.product.name}
                      </td>
                      <td data-label="PRICE: " className="small fw-bold">
                        {p.product.price.toLocaleString('vi-VN')} VND
                      </td>
                      <td data-label="COUNT: " className="small fw-bold">
                        {p.quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
