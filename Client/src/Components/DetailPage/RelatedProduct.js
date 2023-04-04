import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useHttp from 'hooks/use-http';

const RelatedProduct = props => {
  const navigate = useNavigate();

  // Hàm set lại url của img kèm domain
  const domain = useSelector(state => state.api.domain);
  const setUrlImg = url => {
    const newUrl = url.startsWith('public/images') ? domain + '/' + url : url;
    return newUrl;
  };

  // State lưu kết các product liên quan khác
  const [otherProducts, setOtherProducts] = useState([]);

  const urlFetch = useSelector(state => state.api.urlRelated);

  //--- dùng custom hooks: useHttp()
  const { sendRequest: fetchData } = useHttp();

  useEffect(() => {
    const transformData = data => {
      // Lưu tổng số kết quả trả về
      setOtherProducts(data.products);
    };

    fetchData(
      {
        url: urlFetch,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { _id: props.currentProduct, category: props.category },
      },
      transformData
    );
  }, [fetchData, urlFetch, props]);

  return (
    <div>
      <h2 className="h5 text-uppercase fw-bold mt-5 mb-4">RELATED PRODUCTS</h2>
      <div className="row">
        {otherProducts.length !== 0 &&
          otherProducts.map(product => {
            return (
              <div
                key={product._id}
                className="col-6 col-md-4 col-lg-2 mb-4 mb-lg-3 text-center"
              >
                <img
                  src={setUrlImg(product.img1)}
                  alt={product.category}
                  className="w-100 mb-3 main-animation border"
                  onClick={() => navigate(`/detail/${product._id}`)}
                />
                <p className="fw-bold small mb-1">{product.name}</p>
                <span className="text-secondary small">
                  {product.price.toLocaleString('vi-VN')} VND
                </span>
              </div>
            );
          })}
        {otherProducts.length === 0 && (
          <p className="text-secondary">- Chưa có sản phẩm liên quan</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
