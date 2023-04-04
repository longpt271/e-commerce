import { createSlice } from '@reduxjs/toolkit';

// Tạo state mặc định
const initialCheckoutState = {
  isShow: false,
};

// Tạo Slice checkout
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialCheckoutState,
  reducers: {
    SHOW_checkout(state) {
      state.isShow = true;
    },
    HIDE_checkout(state) {
      state.isShow = false;
    },
  },
});

// Phương thức tạo actions
export const checkoutActions = checkoutSlice.actions;

export default checkoutSlice.reducer;
