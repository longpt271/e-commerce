import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoadingSpinner from 'components/UI/LoadingSpinner/LoadingSpinner';

// import react-toastify để tạo thông báo
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Thêm Lazy Loading
const Auth = React.lazy(() => import('pages/auth/Auth'));
const Home = React.lazy(() => import('pages/home/Home'));
const Users = React.lazy(() => import('pages/users/UsersPage'));
const UserInfo = React.lazy(() => import('components/UserInfo/UserInfo'));
const EditUser = React.lazy(() => import('pages/editUser/EditUser'));
const Products = React.lazy(() => import('pages/products/ProductsPage'));
const Orders = React.lazy(() => import('pages/orders/OrdersPage'));
const OrderDetail = React.lazy(() =>
  import('pages/orderDetail/OrderDetailPage')
);
const NewUser = React.lazy(() => import('pages/newUser/NewUser'));
const NewProduct = React.lazy(() => import('pages/newProduct/NewProduct'));
const EditProduct = React.lazy(() => import('pages/newProduct/EditProduct'));
const Chat = React.lazy(() => import('pages/chat/Chat'));

function App() {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const isChatStaff = useSelector(state => state.auth.isChatStaff);
  // console.log(isAuth);

  return (
    <div className="app">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="centered">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            {/* các route mà 'admin' có thể truy cập */}
            {isAuth && isAdmin && (
              <Route path="/">
                <Route index element={<Home />} />

                <Route path="user-info">
                  <Route index element={<UserInfo />} />
                  <Route path="edit" element={<EditUser />} />
                </Route>
                <Route path="chat">
                  <Route index element={<Chat />} />
                </Route>

                <Route path="users">
                  <Route index element={<Users />} />
                  <Route path="new" element={<NewUser />} />
                </Route>
                <Route path="products">
                  <Route index element={<Products />} />
                  <Route path="new" element={<NewProduct />} />
                  <Route path="edit/:productId" element={<EditProduct />} />
                </Route>
                <Route path="orders">
                  <Route index element={<Orders />} />
                  <Route path="find/:orderId" element={<OrderDetail />} />
                </Route>

                <Route path="*" element={<Navigate replace to="/" />} />
              </Route>
            )}

            {/* các route mà 'chat-staff' có thể truy cập */}
            {isAuth && isChatStaff && (
              <Route path="/">
                <Route index element={<Home />} />

                <Route path="orders/find/:orderId" element={<OrderDetail />} />

                <Route path="user-info">
                  <Route index element={<UserInfo />} />
                  <Route path="edit" element={<EditUser />} />
                </Route>

                <Route path="chat">
                  <Route index element={<Chat />} />
                </Route>

                <Route path="*" element={<Navigate replace to="/" />} />
              </Route>
            )}

            {!isAuth && (
              <>
                <Route path="auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
