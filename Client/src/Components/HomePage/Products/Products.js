import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import useHttp from 'hooks/use-http';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import ProductModal from './ProductModal';

const Products = () => {
  // Hàm set lại url của img kèm domain
  const domain = useSelector(state => state.api.domain);
  const setUrlImg = url => {
    const newUrl = url.startsWith('public/images') ? domain + '/' + url : url;
    return newUrl;
  };

  // State lưu kết quả fetch
  const [productsData, setProductsData] = useState([]);

  // Lấy ra url cần Fetch từ state redux
  const urlFetch = useSelector(state => state.api.urlProducts);

  //--- dùng custom hooks: useHttp()
  const { isLoading, error, sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      // set data trả về với 8 phần tử đầu tiên
      setProductsData(data.products.slice(0, 8));
    };

    fetchData({ url: urlFetch }, transformData);
  }, [fetchData, urlFetch]);

  // state lưu data show modal
  const [modalShow, setModalShow] = useState(false);
  const [productModal, setProductModal] = useState({});
  return (
    <section className="py-5">
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={productModal}
      />

      <header>
        <p className="small text-muted small text-uppercase mb-1">
          Made the hard way
        </p>
        <h4
          className="h5 fw-bold text-uppercase mb-4"
          style={{ letterSpacing: '0.1em' }}
        >
          Top trending products
        </h4>
      </header>
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
                className="col-6 col-md-4 col-lg-3 mb-4 mb-lg-3 text-center"
              >
                <img
                  src={setUrlImg(product.img1)}
                  alt={product.category}
                  className="w-100 mb-3 main-animation"
                  onClick={() => {
                    setProductModal(product);
                    setModalShow(true);
                  }}
                />
                <Link
                  to={`/detail/${product._id}`}
                  className="text-decoration-none text-dark"
                >
                  <p className="fw-bold mb-1" style={{ fontSize: '14px' }}>
                    {product.name}
                  </p>
                </Link>
                <span className="small text-muted">
                  {product.price.toLocaleString('vi-VN')} VND
                </span>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Products;
