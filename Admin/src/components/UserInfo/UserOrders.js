import React, { useContext, useEffect, useState } from 'react';

import { Table } from 'react-bootstrap';

import ApiContext from 'context/ApiContext';

const UserOrders = () => {
  const apiCtx = useContext(ApiContext);
  const urlFetch = apiCtx.requests.postOrdersByUserId;
  // console.log(username, urlFetch);

  const [dataFetch, setDataFetch] = useState([]);

  // fetch data trans
  useEffect(() => {
    // get data
    const fetchData = async () => {
      try {
        const res = await fetch(urlFetch, { credentials: 'include' });
        if (res.status === 401) {
          throw new Error('Please login!');
        }
        if (res.ok) {
          const data = await res.json();
          setDataFetch(data.orders);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [urlFetch]);
  return (
    <>
      {dataFetch?.length !== 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Total Quantity</th>
              <th>Total Money</th>
              <th>Delivery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataFetch.map((order, i) => {
              const delivery =
                order.delivery === 'waiting'
                  ? 'Chưa vận chuyển'
                  : order.delivery === 'done'
                  ? 'Đã vận chuyển'
                  : '';
              const status =
                order.status === 'waiting'
                  ? 'Chưa thanh toán'
                  : order.status === 'done'
                  ? 'Đã thanh toán'
                  : '';
              return (
                <tr key={order._id}>
                  <td>{i + 1}</td>
                  <td>{order.totalQuantity}</td>
                  <td>{order.totalMoney}</td>
                  <td>{delivery}</td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      {dataFetch?.length === 0 && <p>Bạn chưa đặt đơn hàng nào</p>}
    </>
  );
};

export default UserOrders;
