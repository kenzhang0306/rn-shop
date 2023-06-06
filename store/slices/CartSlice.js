import { createSlice } from "@reduxjs/toolkit";
import CartItem from "../../models/CartItem";

const initialState = {
  items: {},
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);
      const addedProduct = action.payload;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;
      if (typeof state.items[addedProduct.id] != "undefined") {
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      state.items[addedProduct.id] = updatedOrNewCartItem;
      //console.log(state.items[addedProduct.id].productTitle);
      state.totalAmount += prodPrice;
    },
    removeFromCart: (state, action) => {
      const selectedCartItem = state.items[action.payload];
      const currentQty = selectedCartItem.quantity;

      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        state.items[action.payload] = updatedCartItem;
      } else {
        delete state.items[action.payload];
      }

      state.totalAmount -= selectedCartItem.productPrice;
    },
    addOrder: (state, action) => {
      state.items = {};
      state.totalAmount = 0;
    },
    deleteProduct: (state, action) => {
      if (!state.items[action.payload]) {
        return;
      }

      const itemTotal = state.items[action.payload].sum;
      delete state.items[action.payload];
      state.totalAmount -= itemTotal;
    },
  },
});

export const getItems = (state) => state.cart.items;
export const getTotalAmount = (state) => state.cart.totalAmount;
export const { addToCart, removeFromCart, addOrder, deleteProduct } =
  cartSlice.actions;

export default cartSlice.reducer;
