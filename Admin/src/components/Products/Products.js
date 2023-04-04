import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { Button, Table } from 'react-bootstrap';

import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';
import Pagination from 'components/UI/Pagination/Pagination';
import ProductSearch from './ProductSearch';

const Products = props => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { requests, mainApi } = useContext(ApiContext); // Sử dụng useContext để lấy data api

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
  const [enteredSearch, setEnteredSearch] = useState(locationSearch.name || '');

  // Lấy ra url cần Fetch từ state redux
  const urlSearchFetch = requests.urlSearchProducts;

  const queryPage = pageNumber ? '?page=' + pageNumber : '';
  const queryName = enteredSearch ? '&&name=' + enteredSearch : '';
  const searchQuery = queryPage + queryName;

  const urlFetch = urlSearchFetch + searchQuery;

  location.search = searchQuery; // lưu lại giá trị vào location.search khi query

  // Cập nhật lại url khi location thay đổi value
  const newUrl = location.pathname + searchQuery;
  window.history.replaceState(null, null, newUrl);

  // func get data Api
  const getData = useCallback(() => {
    fetch(urlFetch, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setTotalResult(data.totalItems);
        setDataFetch(data.products);
      })
      .catch(err => console.log(err));
  }, [urlFetch]);

  useEffect(() => {
    getData();
  }, [getData]);

  const urlDelete = requests.deleteProduct;

  // Xử lý xóa
  const handleDelete = useCallback(
    id => {
      confirmAlert({
        title: 'Confirm to delete',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              // fetch delete hotel/Room
              try {
                const res = await fetch(urlDelete + '/' + id, {
                  method: 'DELETE',
                  credentials: 'include',
                });

                if (res.ok) {
                  getData(); // fetch load lại data sau khi xóa
                  dispatch(toastActions.SHOW_SUCCESS('Deleted Product!')); // toast
                } else {
                  const data = await res.json();
                  dispatch(
                    toastActions.SHOW_WARN(
                      data.message ? data.message : 'Something error!'
                    )
                  );
                }
              } catch (error) {
                console.log(error);
              }
            },
          },
          {
            label: 'No',
          },
        ],
      });
    },
    [urlDelete, getData, dispatch]
  );
  return (
    <div className="dataTable text-gray">
      <div className="pb-2 fw-bold">Products</div>
      <ProductSearch
        enteredSearch={enteredSearch}
        onSetEnteredSearch={setEnteredSearch}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Category</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {dataFetch?.length !== 0 &&
            dataFetch.map(product => {
              // Set lại url của img kèm domain
              const urlImg = product.img1.startsWith('public/images')
                ? mainApi + '/' + product.img1
                : product.img1;

              return (
                <tr key={product._id}>
                  <td className="small">{product._id}</td>
                  <td className="small">{product.name}</td>
                  <td className="small">
                    {product.price.toLocaleString('vi-VN')}
                  </td>
                  <td>
                    <img src={urlImg} alt={product.name} height="50" />
                  </td>
                  <td className="small">{product.category}</td>
                  <td className="small">
                    <div className="cellAction">
                      <Link to={`/products/edit/${product._id}`}>
                        <Button variant="success" size="sm">
                          Update
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDelete.bind(this, product._id)}
                      >
                        Delete
                      </Button>
                    </div>
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

export default Products;
