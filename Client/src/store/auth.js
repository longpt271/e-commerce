import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Lấy data user từ localStorage
const dataGetStorage = localStorage.getItem('user');
// Xử lý data nhận về
let userIdLocal = dataGetStorage && JSON.parse(dataGetStorage).userId;
let fullNameLocal = dataGetStorage && JSON.parse(dataGetStorage).fullName;
let expireTimeLocal = dataGetStorage && JSON.parse(dataGetStorage).expireTime;

// Giá trị mặc định của auth state
const initialAuthState = {
  userId: userIdLocal,
  fullName: fullNameLocal,
  expireTime: expireTimeLocal,
  isAuthenticated: !!userIdLocal,
};

// console.log(initialAuthState);

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    ON_LOGIN(state, action) {
      // Lưu lại state để cập nhật UI
      state.userId = action.payload.userId;
      state.fullName = action.payload.fullName;
      state.expireTime = action.payload.expireTime;
      state.isAuthenticated = true;

      // lưu lại localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: action.payload.userId,
          fullName: action.payload.fullName,
          expireTime: action.payload.expireTime,
        })
      );
    },
    ON_LOGOUT(state) {
      // Lưu lại state
      state.userId = undefined;
      state.fullName = undefined;
      state.expireTime = undefined;
      state.isAuthenticated = false;

      localStorage.removeItem('cart'); // Xóa current cart khỏi localStorage
      localStorage.removeItem('user'); // Xóa current user khỏi localStorage
      Cookies.remove('userId'); // Xóa current user khỏi cookie
    },
    ON_CHANGE_FULL_NAME(state, action) {
      // Lưu lại state để cập nhật UI
      state.fullName = action.payload.fullName;

      // Lưu lại fullName khi update info
      localStorage.setItem('fullName', action.payload.fullName);
    },
  },
});

// Phương thức tạo actions
export const authActions = authSlice.actions;

export default authSlice.reducer;
