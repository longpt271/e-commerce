import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import toastReducer from './toast';

// Tạo Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
  },
});

export default store;
