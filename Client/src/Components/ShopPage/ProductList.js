import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import useHttp from 'hooks/use-http';
import HeaderPage from 'Components/UI/HeaderPage/HeaderPage';
import ProductListSearch from './ProductListSearch';
import ShopSideBar from './ShopSideBar';
import classes from './ProductList.module.css';
import LoadingSpinner from 'Components/UI/LoadingSpinner/LoadingSpinner';
import ProductListSort from './ProductListSort';
import Pagination from 'Components/UI/Pagination/Pagination';

const ProductList = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate() để điều hướng trang

  // Hàm set lại url của img kèm domain
  const domain = useSelector(state => state.api.domain);
  const setUrlImg = url => {
    const newUrl = url.startsWith('public/images') ? domain + '/' + url : url;
    return newUrl;
  };

  // lấy giá trị từ params để gán làm giá trị tìm kiếm mặc định
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationSearch = {};
  for (const [key, value] of params) {
    locationSearch[key] = value;
  }

  // State lưu kết quả lọc sau khi fetch
  const [productsData, setProductsData] = useState([]);
  const [totalResult, setTotalResult] = useState(null);

  // State lưu giá trị cần lọc
  const [pageNumber, setPageNumber] = useState(+locationSearch.page || 1);
  const [enteredSearch, setEnteredSearch] = useState(locationSearch.name || '');
  const [category, setCategory] = useState(locationSearch.category || '');
  const [priceOrder, setPriceOrder] = useState(locationSearch.priceOrder || '');
  const [nameOrder, setNameOrder] = useState(locationSearch.nameOrder || '');

  // Lấy ra url cần Fetch từ state redux
  const urlSearchProducts = useSelector(state => state.api.urlSearchProducts);

  const queryPage = pageNumber ? '?page=' + pageNumber : '';
  const queryCategory = category ? '&&category=' + category : '';
  const queryName = enteredSearch ? '&&name=' + enteredSearch : '';
  const queryPriceOrder = priceOrder ? '&&priceOrder=' + priceOrder : '';
  const queryNameOrder = nameOrder ? '&&nameOrder=' + nameOrder : '';
  const searchQuery =
    queryPage + queryCategory + queryName + queryPriceOrder + queryNameOrder;

  const urlFetch = urlSearchProducts + searchQuery;

  location.search = searchQuery; // lưu lại giá trị vào location.search khi query

  // Cập nhật lại url khi location thay đổi value
  const newUrl = location.pathname + searchQuery;
  window.history.replaceState(null, null, newUrl);

  //--- dùng custom hooks: useHttp()
  const { isLoading, error, sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      // Lưu tổng số kết quả trả về
      setTotalResult(data.totalItems);

      // set data trả về vào local state
      setProductsData(data.products);
      window.scrollTo(0, 0);
    };

    fetchData({ url: urlFetch }, transformData);
  }, [fetchData, urlFetch]);

  return (
    <section>
      <HeaderPage title="Shop" />

      <div className="row py-5">
        <div className="col-lg-3 order-2 order-lg-1">
          <ShopSideBar
            onSetCategory={setCategory}
            onSetPageNumber={setPageNumber}
          />
        </div>

        <div className="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">
          <div className="row mb-3 align-items-center">
            <div className="col-md-4">
              <ProductListSearch
                enteredSearch={enteredSearch}
                setEnteredSearch={setEnteredSearch}
              />
            </div>
            <div className="col-md-8">
              <div className="list-inline d-flex align-items-center justify-content-md-end mb-0">
                <ProductListSort
                  onSetPriceOrder={setPriceOrder}
                  onSetNameOrder={setNameOrder}
                />
              </div>
            </div>
          </div>

          <div className="row">
            {isLoading && (
              <div className="centered">
                <LoadingSpinner />
              </div>
            )}
            {!isLoading && error && <p>{error}</p>}

            {!isLoading &&
              !error &&
              productsData?.length !== 0 &&
              productsData.map(product => {
                return (
                  <div
                    key={product._id}
                    className={`${classes['zoom-in']} col-6 col-md-4 mb-4 mb-lg-3 text-center`}
                  >
                    <img
                      src={setUrlImg(product.img1)}
                      alt={product.category}
                      className="w-100 mb-3 main-animation"
                      onClick={() => navigate(`/detail/${product._id}`)}
                    />
                    <h6
                      className="fw-bold small mb-1 main-animation"
                      onClick={() => navigate(`/detail/${product._id}`)}
                    >
                      {product.name}
                    </h6>
                    <span className="small text-secondary">
                      {product.price.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                );
              })}
            {!isLoading && !error && productsData?.length === 0 && (
              <p className="centered">Chưa có sản phẩm nào!</p>
            )}
          </div>

          <Pagination
            page={pageNumber}
            totalPage={Math.ceil(parseInt(totalResult) / 8)}
            handlerChangePage={setPageNumber}
            currentProduct={productsData.length}
            totalProduct={totalResult}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductList;
