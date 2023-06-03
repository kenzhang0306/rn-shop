import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../store/slices/ProductsSlice";
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([logger]),
});

export default store;
