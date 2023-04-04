import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';

import ApiContext from 'context/ApiContext';
import Pagination from 'components/UI/Pagination/Pagination';

const Orders = ({ onChangeEarning }) => {
  const location = useLocation();
  const { requests } = useContext(ApiContext); // Sử dụng useContext để lấy data api

  // lấy giá trị từ params để gán làm giá trị tìm kiếm mặc định
  const params = new URLSearchParams(location.search);
  const locationSearch = {};
  for (const [key, value] of params) {
    locationSearch[key] = value;
  }

  // State lưu kết quả lọc sau khi fetch
  const [dataFetch, setDataFetch] = useState([]);
  const [totalResult, setTotalResult] = useState(null);

  // State lưu giá trị cần lọc
  const [pageNumber, setPageNumber] = useState(+locationSearch.page || 1);

  // Lấy ra url cần Fetch từ state redux
  const urlSearchFetch = requests.getOrders;

  const queryPage = pageNumber ? '?page=' + pageNumber : '';

  const urlFetch = urlSearchFetch + queryPage;

  location.search = queryPage; // lưu lại giá trị vào location.search khi query

  // Cập nhật lại url khi location thay đổi value
  const newUrl = location.pathname + queryPage;
  window.history.replaceState(null, null, newUrl);

  // func get data Api
  const getData = useCallback(async () => {
    try {
      const res = await fetch(urlFetch, {
        credentials: 'include',
      });
      if (res.status === 401) {
        throw new Error('Please login!');
      }
      if (res.ok) {
        const data = await res.json();
        setTotalResult(data.totalItems);
        setDataFetch(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  }, [urlFetch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const urlOrderDelivery = requests.patchOrderDelivery;
  const urlOrderStatus = requests.patchOrderStatus;

  // hàm xử lý click edit delivery/status
  const handleChange = useCallback(
    (dataIn, url, type) => {
      // fetch update status tran
      const fetchChange = text => {
        const dataNew =
          type.toString() === 'delivery'
            ? { orderId: dataIn._id, delivery: text }
            : { orderId: dataIn._id, status: text };

        fetch(url, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(dataNew),
          credentials: 'include',
        })
          .then(res => {
            if (res.ok && type.toString() === 'status') {
              if (text === 'done') {
                onChangeEarning(dataIn.totalMoney); // Cập nhập cộng thêm earning ở home dashboard
              }
              if (text === 'waiting') {
                onChangeEarning(-dataIn.totalMoney); // Cập nhập trừ đi earning ở home dashboard
              }
            }
            return res.json();
          })
          .then(data => {
            getData();
          })
          .catch(err => console.log(err));
      };

      confirmAlert({
        message: 'Choose new ' + type,
        buttons: [
          {
            label: 'Waiting',
            onClick: () => {
              fetchChange('waiting');
            },
          },
          {
            label: 'Done',
            onClick: () => {
              fetchChange('done');
            },
          },
        ],
      });
    },
    [getData, onChangeEarning]
  );

  return (
    <div className="dataTable">
      {location.pathname === '/' ? (
        <div className="pb-3 fw-bold">History</div>
      ) : (
        <div className="pb-2 fw-bold">Orders</div>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID User</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {dataFetch?.length !== 0 &&
            dataFetch.map(order => {
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
                  <td className="small">{order.user.userId}</td>
                  <td className="small">{order.user.fullName}</td>
                  <td className="small">{order.user.phone}</td>
                  <td className="small">{order.user.address}</td>
                  <td className="small">
                    {order.totalMoney.toLocaleString('vi-VN')}
                  </td>
                  <td
                    className={`small cellWithStatus ${order.delivery}`}
                    onClick={handleChange.bind(
                      this,
                      order,
                      urlOrderDelivery,
                      'delivery'
                    )}
                  >
                    {delivery}
                  </td>
                  <td
                    className={`small cellWithStatus ${order.status}`}
                    onClick={handleChange.bind(
                      this,
                      order,
                      urlOrderStatus,
                      'status'
                    )}
                  >
                    {status}
                  </td>
                  <td>
                    <Link to={'/orders/find/' + order._id}>
                      <Button variant="success" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <Pagination
        page={pageNumber}
        totalPage={Math.ceil(parseInt(totalResult) / 8)}
        handlerChangePage={setPageNumber}
        currentProduct={dataFetch.length}
        totalProduct={totalResult}
      />
    </div>
  );
};

export default Orders;
