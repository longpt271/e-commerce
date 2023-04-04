import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import classes from './Order.module.css';
import useHttp from 'hooks/use-http';
import HeaderPage from 'Components/UI/HeaderPage/HeaderPage';
import OrderItem from './OrderItem';
import Pagination from 'Components/UI/Pagination/Pagination';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalResult, setTotalResult] = useState(null);

  const urlFetch = useSelector(state => state.api.urlOrder);

  //--- dùng custom hooks: useHttp()
  const { sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      setOrders(data.orders);
      setTotalResult(data.totalItems);
      window.scrollTo(0, 0);
    };

    fetchData({ url: urlFetch + '?page=' + pageNumber }, transformData);
  }, [fetchData, urlFetch, pageNumber]);

  return (
    <section>
      <HeaderPage title="order" />

      <div className="row py-5 gx-0">
        <h4 className={`${classes.titleOrder} h5 fw-bold text-uppercase mb-4`}>
          History orders
        </h4>

        {orders?.length !== 0 && (
          <>
            <table className={classes.order}>
              <thead className="bg-light">
                <tr>
                  <th>ID ORDER</th>
                  <th>ID USER</th>
                  <th>NAME</th>
                  <th>PHONE</th>
                  <th>ADDRESS</th>
                  <th>TOTAL</th>
                  <th>DELIVERY</th>
                  <th>STATUS</th>
                  <th>DETAIL</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  return <OrderItem key={Math.random()} order={order} />;
                })}
              </tbody>
            </table>
            <Pagination
              page={pageNumber}
              totalPage={Math.ceil(parseInt(totalResult) / 8)}
              handlerChangePage={setPageNumber}
              currentProduct={orders.length}
              totalProduct={totalResult}
            />
          </>
        )}
        {orders.length === 0 && (
          <p className="centered">Bạn chưa đặt đơn hàng nào!</p>
        )}
      </div>
    </section>
  );
};

export default Order;
