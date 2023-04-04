import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import './userInfo.scss';
import Layout from 'components/layout/Layout';
import ApiContext from 'context/ApiContext';
import UserOrders from './UserOrders';

const UserInfo = () => {
  const ctx = useContext(ApiContext);

  const navigate = useNavigate();

  const [info, setInfo] = useState({});
  // console.log(info);

  // Fetch data input khi editing
  const urlFetch = ctx.requests.urlUserInfo;
  useEffect(() => {
    // get data
    const fetchData = async () => {
      try {
        const res = await fetch(urlFetch, { credentials: 'include' });
        if (res.status === 401) {
          throw new Error('Please login!');
        }
        if (res.ok) {
          const data = await res.json();
          setInfo(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [urlFetch]);
  return (
    <Layout className="userInfo">
      <div className="top">
        <div className="left">
          <div
            className="editButton"
            onClick={() => {
              navigate(`/user-info/edit`, { state: info });
            }}
          >
            Edit
          </div>

          <h1 className="title">Information</h1>
          <div className="item">
            <AccountCircleOutlinedIcon className="itemImg" />

            <div className="details">
              <h1 className="itemTitle">{info.fullName || 'User'}</h1>
              <div className="detailItem">
                <span className="itemKey">Email:</span>
                <span className="itemValue">{info.email}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Phone:</span>
                <span className="itemValue">{info.phone || 'None'}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Address:</span>
                <span className="itemValue">{info.address}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Role:</span>
                <span className="itemValue">{info.role}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="right"></div> */}
      </div>
      <div className="bottom">
        <h1 className="title">Your Orders</h1>
        <div className="dataTable">
          <UserOrders />
        </div>
      </div>
    </Layout>
  );
};

export default UserInfo;
