import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import classes from './OrderDetail.module.css';
import useHttp from 'hooks/use-http';
import HeaderPage from 'Components/UI/HeaderPage/HeaderPage';

const OrderDetail = () => {
  // Hàm set lại url của img kèm domain
  const domain = useSelector(state => state.api.domain);
  const setUrlImg = url => {
    const newUrl = url.startsWith('public/images') ? domain + '/' + url : url;
    return newUrl;
  };

  const { orderId } = useParams();
  const [order, setOrder] = useState([]);

  const urlFetch = useSelector(state => state.api.urlOrder);

  //--- dùng custom hooks: useHttp()
  const { sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      setOrder(data.order);
      window.scrollTo(0, 0);
    };

    fetchData({ url: urlFetch + '/' + orderId }, transformData);
  }, [fetchData, urlFetch, orderId]);

  return (
    <section>
      <HeaderPage title="Order Detail" />

      <div className="row py-5 gx-0">
        <h4 className={`${classes.titleOrder} h5 fw-bold text-uppercase mb-4`}>
          Information order
        </h4>

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
                  return (
                    <tr key={p._id}>
                      <td data-label="ID PRODUCT: " className="small fw-bold">
                        {p.product._id}
                      </td>
                      <td className="small fw-bold">
                        <Link to={'/detail/' + p.product._id}>
                          <img
                            src={setUrlImg(p.product.img1)}
                            alt={p.product.name}
                            width="200"
                            height="200"
                          />
                        </Link>
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
    </section>
  );
};

export default OrderDetail;
