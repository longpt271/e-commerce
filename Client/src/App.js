import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from './Components/layout/Layout';
import LoadingSpinner from 'Components/UI/LoadingSpinner/LoadingSpinner';

// Thêm Lazy Loading
const Home = React.lazy(() => import('./pages/HomePage'));
const Shop = React.lazy(() => import('./pages/ShopPage'));
const Detail = React.lazy(() => import('./pages/DetailPage'));
const Cart = React.lazy(() => import('./pages/CartPage'));
const Order = React.lazy(() => import('./pages/OrderPage'));
const OrderDetail = React.lazy(() => import('./pages/OrderDetailPage'));
const Checkout = React.lazy(() => import('./pages/CheckoutPage'));
const Profile = React.lazy(() => import('./pages/ProfilePage'));
const Login = React.lazy(() => import('./pages/LoginPage'));
const Register = React.lazy(() => import('./pages/RegisterPage'));

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    // 2. Tạo Router cho ứng dụng bằng react-router-dom@6
    <Layout>
      <Suspense
        fallback={
          <div className="centered">
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/detail/:productId" element={<Detail />} />

          {isAuthenticated && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order/:orderId" element={<OrderDetail />} />
              <Route path="/checkout" element={<Checkout />} />
            </>
          )}
          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
