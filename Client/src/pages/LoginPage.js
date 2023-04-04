import { useEffect } from 'react';

import Login from 'Components/Auth/Login';

const LoginPage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <Login />;
};

export default LoginPage;
