import { useNavigate } from 'react-router-dom';

import Image from 'img/Image';

const Categories = () => {
  const navigate = useNavigate();

  // Hàm tạo img category
  const categoryImg = (src, category) => {
    return (
      <img
        src={src}
        className="w-100 main-animation"
        alt={category}
        onClick={() =>
          navigate({
            pathname: '/shop',
            search: '?page=1&&category=' + category,
          })
        }
      />
    );
  };

  return (
    <section className="pt-5">
      <header className="text-center">
        <p className="small text-muted small text-uppercase mb-1">
          Carefully created collections
        </p>
        <h4
          className="h5 fw-bold text-uppercase mb-4"
          style={{ letterSpacing: '0.1em' }}
        >
          Browse our categories
        </h4>
      </header>
      <div className="row mb-lg-4">
        <div className="col-6 mb-4 mb-lg-0">
          {categoryImg(Image.product1, 'iphone')}
        </div>

        <div className="col-6 mb-4 mb-lg-0">
          {categoryImg(Image.product2, 'macbook')}
        </div>
      </div>
      <div className="row">
        <div className="col-4 mb-4 mb-lg-0">
          {categoryImg(Image.product3, 'ipad')}
        </div>

        <div className="col-4 mb-4 mb-lg-0">
          {categoryImg(Image.product4, 'watch')}
        </div>

        <div className="col-4 mb-4 mb-lg-0">
          {categoryImg(Image.product5, 'airpod')}
        </div>
      </div>
    </section>
  );
};

export default Categories;
