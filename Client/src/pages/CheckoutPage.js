import { useEffect } from 'react';

import Checkout from 'Components/CheckoutPage/Checkout';

const CheckoutPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <Checkout />;
};

export default CheckoutPage;
