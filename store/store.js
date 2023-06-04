import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../store/slices/ProductsSlice";
import cartReducer from "../store/slices/CartSlice";
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([logger]),
});

export default store;
