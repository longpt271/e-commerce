import { createSlice } from '@reduxjs/toolkit';

const domain = 'http://localhost:5000';
const domainApi = domain + '/api';
// Tạo state mặc định
const initialApiState = {
  domain,
  // auth
  urlLogin: `${domainApi}/auth/login`,
  urlRegister: `${domainApi}/auth/signup`,

  // users
  urlUserInfo: `${domainApi}/users/info`,
  urlAddCart: `${domainApi}/users/cart/add`,
  urlCart: `${domainApi}/users/cart`,
  urlCreateOrder: `${domainApi}/users/create-order`,
  urlOrder: `${domainApi}/users/orders`,

  // products
  urlSearchProducts: `${domainApi}/products/search`,
  urlProducts: `${domainApi}/products`,
  urlProduct: `${domainApi}/products/find`,
  urlRelated: `${domainApi}/products/related`,

  // chat
  urlChat: `${domainApi}/sessions/chat`,
  urlChatNew: `${domainApi}/sessions/chat/new`,
  urlChatAddMess: `${domainApi}/sessions/chat/add-mess`,
};

// Tạo Slice api
const apiSlice = createSlice({
  name: 'api',
  initialState: initialApiState,
});

// Phương thức tạo actions
export const apiActions = apiSlice.actions;

export default apiSlice.reducer;
