import { useEffect } from 'react';

import Register from 'Components/Auth/Register';

const RegisterPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <Register />;
};

export default RegisterPage;
