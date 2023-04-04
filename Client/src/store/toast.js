import { createSlice } from '@reduxjs/toolkit';

// import react-toastify để tạo thông báo
import { toast } from 'react-toastify';

// Tạo state mặc định
const initialToastState = {};

// Tạo Slice Toast
const toastSlice = createSlice({
  name: 'toast',
  initialState: initialToastState,
  reducers: {
    SHOW_SUCCESS(state, action) {
      toast.success(`${action.payload}`, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    },
    SHOW_WARN(state, action) {
      toast.warn(`${action.payload}`, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    },
    SHOW_INFO(state, action) {
      toast.info(`${action.payload}`, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    },
  },
});

// Phương thức tạo actions
export const toastActions = toastSlice.actions;

export default toastSlice.reducer;
