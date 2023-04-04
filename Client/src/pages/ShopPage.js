import { useEffect } from 'react';

import ProductList from 'Components/ShopPage/ProductList';

const ShopPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <ProductList />;
};

export default ShopPage;
