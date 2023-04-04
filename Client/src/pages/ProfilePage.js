import { useEffect } from 'react';

import Profile from 'Components/ProfilePage/Profile';

const ProfilePage = () => {
  useEffect(() => {
    // tự động scroll về đầu trang
    window.scrollTo(0, 0);
  }, []);

  return <Profile />;
};

export default ProfilePage;
