import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Lấy data user từ localStorage
const dataGetStorage = localStorage.getItem('user');
// Xử lý data nhận về
let userIdLocal = dataGetStorage && JSON.parse(dataGetStorage).userId;
let roleLocal = dataGetStorage && JSON.parse(dataGetStorage).role;
let expireTimeLocal = dataGetStorage && JSON.parse(dataGetStorage).expireTime;

// Giá trị mặc định của auth state
const initialAuthState = {
  userId: userIdLocal,
  role: roleLocal,
  expireTime: expireTimeLocal,
  isAuthenticated: !!userIdLocal,
  isAdmin: !!(roleLocal === 'admin'),
  isChatStaff: !!(roleLocal === 'chat-staff'),
};

// console.log(initialAuthState);

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    ON_LOGIN(state, action) {
      // Lưu lại state để cập nhật UI
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.expireTime = action.payload.expireTime;
      state.isAuthenticated = true;

      if (action.payload.role === 'admin') {
        state.isAdmin = true;
        state.isChatStaff = false;
      }
      if (action.payload.role === 'chat-staff') {
        state.isAdmin = false;
        state.isChatStaff = true;
      }

      // lưu lại localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: action.payload.userId,
          role: action.payload.role,
          expireTime: action.payload.expireTime,
        })
      );
    },
    ON_CHANGE_ROLE_STAFF(state, action) {
      // Lưu lại state để cập nhật UI
      state.role = action.payload.role;

      if (action.payload.role === 'chat-staff') {
        state.isAuthenticated = true;
        state.isAdmin = false;
        state.isChatStaff = true;

        // Lưu lại role data localStorage
        localStorage.setItem('role', action.payload.role);
      }
    },
    ON_LOGOUT(state) {
      // Lưu lại state
      state.userId = undefined;
      state.role = undefined;
      state.expireTime = undefined;
      state.isAuthenticated = false;

      localStorage.removeItem('user'); // Xóa current user khỏi localStorage
      Cookies.remove('userIdAdmin'); // Xóa current user khỏi cookie
    },
  },
});

// Phương thức tạo actions
export const authActions = authSlice.actions;

export default authSlice.reducer;
