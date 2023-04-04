import React from 'react';

// Tạo biến với định dạng tương ứng
const ApiContext = React.createContext({
  TOKEN: '',
  requests: {},
  mainApi: '',
});

export const ApiContextProvider = props => {
  // data API
  const TOKEN = 'RYoOcWM4JW'; // Token API
  const mainApi = 'http://localhost:5000';
  const urlApi = mainApi + '/api';
  const urlAdmin = mainApi + '/admin';
  const requestsUrl = {
    // postRegister: `${urlAdmin}/auth/signup`,
    postLogin: `${urlAdmin}/auth/login`,
    getDashboard: `${urlAdmin}/dashboard`,
    getUsers: `${urlAdmin}/users`,
    urlUserInfo: `${urlApi}/users/info`, // GET, PATCH
    patchChangeRole: `${urlAdmin}/users/info`,
    postOrdersByUserId: `${urlApi}/users/orders`,
    getOrders: `${urlAdmin}/orders`,
    getOrder: `${urlApi}/users/orders`,
    patchOrderDelivery: `${urlAdmin}/orders/delivery`,
    patchOrderStatus: `${urlAdmin}/orders/status`,
    urlSearchProducts: `${urlApi}/products/search`,
    getProduct: `${urlApi}/products/find`,
    deleteProduct: `${urlAdmin}/products/delete`,
    postEditProduct: `${urlAdmin}/products/edit`,
    postNewProduct: `${urlAdmin}/products/new`,
    getSessions: `${urlApi}/sessions`,
    getSessionChat: `${urlApi}/sessions/chat`,
    postChatAddMess: `${urlApi}/sessions/chat/add-mess`,

    // getLast8Transactions: `${urlApi}/transactions/last8trans`,
  };

  return (
    <ApiContext.Provider
      // Value trả về khi ở child dùng useContext()
      value={{
        TOKEN: TOKEN,
        requests: requestsUrl,
        mainApi,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
