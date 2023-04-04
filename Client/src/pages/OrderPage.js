import { useEffect } from 'react';

import Order from 'Components/OrderPage/Order';

const OrderPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <Order />;
};

export default OrderPage;
