import { createSlice } from '@reduxjs/toolkit';

// Lấy ra listCart từ localStorage
const dataGetStorage = localStorage.getItem('cart');
// Xử lý data nhận về
let listCartLocal = dataGetStorage && JSON.parse(dataGetStorage).listCart;
let totalMoneyLocal = dataGetStorage && JSON.parse(dataGetStorage).totalMoney;
let totalQuantityLocal =
  dataGetStorage && JSON.parse(dataGetStorage).totalQuantity;

// initial State cart
const initialCartState = {
  listCart: listCartLocal || [],
  totalMoney: totalMoneyLocal || 0,
  totalQuantity: totalQuantityLocal || 0,
};

// console.log(initialCartState);

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    SET_CART(state, action) {
      const listCartPayload = action.payload;
      const updatedTotalMoney = listCartPayload.reduce((curNumber, item) => {
        return curNumber + item.productId.price * item.quantity;
      }, 0);

      const updatedTotalQuantity = listCartPayload.reduce((curNumber, item) => {
        return curNumber + item.quantity;
      }, 0);

      // lưu lại state cart
      state.listCart = listCartPayload;
      state.totalMoney = updatedTotalMoney;
      state.totalQuantity = updatedTotalQuantity;
      // lưu lại vào localStorage
      localStorage.setItem(
        'cart',
        JSON.stringify({
          listCart: listCartPayload,
          totalMoney: state.totalMoney,
          totalQuantity: state.totalQuantity,
        })
      );
    },
    UPDATE_CART(state, action) {
      // Tìm id trùng với id payload
      const existingCartItemIndex = state.listCart.findIndex(
        item =>
          item.productId._id.toString() ===
          action.payload.productId._id.toString()
      );
      const existingCartItem = state.listCart[existingCartItemIndex];

      let updatedListCart;
      if (existingCartItem) {
        // số lượng sp sẽ update
        const updatedQuantity =
          +existingCartItem.quantity + +action.payload.quantity;

        // Gộp số lượng sản phẩm nếu tổng updatedQuantity > 0
        if (updatedQuantity > 0) {
          const updatedItem = {
            ...existingCartItem,
            quantity: updatedQuantity,
          };
          updatedListCart = [...state.listCart];
          updatedListCart[existingCartItemIndex] = updatedItem;
        } else {
          // Xóa sản phẩm nếu tổng updatedQuantity = 0
          updatedListCart = [...state.listCart];
          updatedListCart.splice(existingCartItemIndex, 1);
        }
      }

      const updatedTotalMoney = updatedListCart.reduce((curNumber, item) => {
        return curNumber + item.productId.price * item.quantity;
      }, 0);

      const updatedTotalQuantity = updatedListCart.reduce((curNumber, item) => {
        return curNumber + item.quantity;
      }, 0);

      // lưu lại state cart
      state.listCart = updatedListCart;
      state.totalMoney = updatedTotalMoney;
      state.totalQuantity = updatedTotalQuantity;

      // lưu lại vào localStorage
      localStorage.setItem(
        'cart',
        JSON.stringify({
          listCart: updatedListCart,
          totalMoney: updatedTotalMoney,
          totalQuantity: updatedTotalQuantity,
        })
      );
    },
    DELETE_CART(state, action = { id: '', shouldListen: false }) {
      // Nếu nhận vào payload.shouldListen = true thì mới thực hiện
      if (action.payload.shouldListen) {
        // Tìm id của item
        const existingCartItemIndex = state.listCart.findIndex(
          item =>
            item.productId._id.toString() === action.payload._id.toString()
        );
        const existingItem = state.listCart[existingCartItemIndex];

        // Tính lại giá trị ,money, total
        const updatedTotalMoney =
          state.totalMoney -
          existingItem.productId.price * existingItem.quantity;

        const updatedTotalQuantity =
          state.totalQuantity - existingItem.quantity;

        // lấy ra tất cả cart có giá trị khác id payload nhận vào
        let updatedListCart = state.listCart.filter(
          item =>
            item.productId._id.toString() !== action.payload._id.toString()
        );

        // Giá trị trả về sau khi delete
        state.listCart = updatedListCart;
        state.totalMoney = updatedTotalMoney;
        state.totalQuantity = updatedTotalQuantity;

        // Nếu k còn cart nào xóa khỏi storage
        if (updatedListCart.length === 0) {
          localStorage.removeItem('cart');
        } else {
          // lưu lại vào localStorage
          localStorage.setItem(
            'cart',
            JSON.stringify({
              listCart: updatedListCart,
              totalMoney: updatedTotalMoney,
              totalQuantity: updatedTotalQuantity,
            })
          );
        }
      }
    },
    SET_DEFAULT(state) {
      state.listCart = [];
      state.totalMoney = 0;
      state.totalQuantity = 0;

      localStorage.removeItem('cart');
    },
  },
});

// Phương thức tạo actions
export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
