import { useEffect } from 'react';

import Cart from 'Components/CartPage/Cart';

const CartPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <Cart />;
};

export default CartPage;
