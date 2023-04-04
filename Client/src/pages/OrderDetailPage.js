import { useEffect } from 'react';

import OrderDetail from 'Components/OrderDetailPage/OrderDetail';

const OrderDetailPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <OrderDetail />;
};

export default OrderDetailPage;
