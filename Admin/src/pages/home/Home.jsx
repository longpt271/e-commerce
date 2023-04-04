import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import './home.scss';
import Layout from 'components/layout/Layout';
import Widget from 'components/Widget/Widget';
import Orders from 'components/Orders/Orders';
import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';

const Home = () => {
  const dispatch = useDispatch();
  const { requests } = useContext(ApiContext); // Sử dụng useContext để lấy data api
  const urlDash = requests.getDashboard; // url Users or Transactions

  const [dataDash, setDataDash] = useState([]);
  const [earning, setEarning] = useState(0);
  // func get data Api
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(urlDash, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setDataDash(data);
        data.totalRevenue && setEarning(data.totalRevenue);
      } else {
        if (data.message) {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Login failed!'));
    }
  }, [urlDash, dispatch]);
  useEffect(() => {
    // fetch data dashboard
    fetchDashboard();
  }, [fetchDashboard]);

  // Hàm change earning khi thay đổi trạng thái của order
  const changeEarning = amount => {
    setEarning(prevState => prevState + amount);
  };

  return (
    <Layout className="home bg-light">
      <div className="dash-title fw-bold">Dashboard</div>
      <div className="widgets">
        <Widget type="user" num={dataDash.totalUser} />
        <Widget type="earning" num={earning} dataSub={dataDash.avgMonths} />
        <Widget type="order" num={dataDash.totalOrder} />
      </div>
      <div className="listContainer">
        <Orders onChangeEarning={changeEarning} />
      </div>
    </Layout>
  );
};

export default Home;
