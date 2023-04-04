import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import useHttp from 'hooks/use-http';
import LoadingSpinner from 'Components/UI/LoadingSpinner/LoadingSpinner';
import DetailProductImages from './DetailProductImages';
import ProductDescription from './ProductDescription';
import RelatedProduct from './RelatedProduct';
import DetailProductForm from './DetailProductForm';

const DetailProduct = () => {
  // Lấy thông tin url bằng useParams()
  const params = useParams();

  // Hàm set lại url của img kèm domain
  const domain = useSelector(state => state.api.domain);
  const setUrlImg = url => {
    const newUrl = url.startsWith('public/images') ? domain + '/' + url : url;
    return newUrl;
  };

  // State lưu kết quả lọc sau khi fetch
  const [productData, setProductData] = useState({});

  // Lấy ra url cần Fetch từ state redux
  const urlFetchProduct = useSelector(state => state.api.urlProduct);
  const urlFetch = urlFetchProduct + '/' + params.productId;

  //--- dùng custom hooks: useHttp()
  const { isLoading, error, sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      // Lưu kết quả vào state
      setProductData(data.product);
    };

    fetchData({ url: urlFetch }, transformData);
  }, [fetchData, urlFetch, params.id]);

  // tự động scroll về đầu trang nếu id thay đổi khi click related product
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  return (
    <>
      {isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && error && <p>{error}</p>}

      {!isLoading && !error && Object.keys(productData)?.length !== 0 && (
        <section className="mb-5 mt-4">
          <div className="row mb-lg-5">
            <div className="col-lg-6 col-md-12">
              <DetailProductImages
                img1={setUrlImg(productData.img1)}
                img2={setUrlImg(productData.img2)}
                img3={setUrlImg(productData.img3)}
                img4={setUrlImg(productData.img4)}
              />
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="pt-lg-2 pb-2">
                <h2 className="fw-bold pt-4 mb-4">{productData.name}</h2>
                <p className="text-muted lead mb-4 fs-5">
                  {productData.price.toLocaleString('vi-VN')}
                  VND{' '}
                  {productData.count === 0 && (
                    <span className="fw-bold text-danger border border-danger rounded px-2 py-1">
                      SOLD OUT
                    </span>
                  )}
                </p>
                <span className="small">{productData.short_desc}</span>
                <br />
                <p className="small mt-3">
                  <span className="fw-bold small mt-3">CATEGORY:</span>
                  <span className="text-muted ms-2">
                    {productData.category}s
                  </span>
                </p>
                <DetailProductForm productData={productData} />
                <span className="small">
                  {productData.count} sản phẩm có sẵn
                </span>
              </div>
            </div>
          </div>

          <br />
          <ProductDescription desc={productData.long_desc} />

          <RelatedProduct
            currentProduct={productData._id}
            category={productData.category}
          />
        </section>
      )}
    </>
  );
};

export default DetailProduct;
