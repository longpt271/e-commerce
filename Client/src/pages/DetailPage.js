import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import DetailProduct from 'Components/DetailPage/DetailProduct';

const DetailPage = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <DetailProduct />;
};

export default DetailPage;
