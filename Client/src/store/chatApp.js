import { createSlice } from '@reduxjs/toolkit';

const roomIdStorage = localStorage.getItem('roomId');

// Tạo state mặc định
const initialChatAppState = {
  dataMess: [],
  roomId: roomIdStorage,
};

// console.log(initialChatAppState);

// Tạo Slice chatApp
const chatAppSlice = createSlice({
  name: 'chatApp',
  initialState: initialChatAppState,
  reducers: {
    SET_ROOM(state, action) {
      state.roomId = action.payload;
      // console.log('SET_ROOM');

      // lưu lại vào localStorage
      localStorage.setItem('roomId', action.payload);
    },
    REMOVE_ROOM(state) {
      state.roomId = '';
      // console.log('REMOVE_ROOM');

      localStorage.removeItem('roomId');
    },
  },
});

// Phương thức tạo actions
export const chatAppActions = chatAppSlice.actions;

export default chatAppSlice.reducer;
