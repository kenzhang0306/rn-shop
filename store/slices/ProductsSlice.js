import { createSlice } from "@reduxjs/toolkit";
import Product from "../../models/Product";

const initialState = {
  availableProducts: [],
  userProducts: [],
  favoriteProducts: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.availableProducts = action.payload.products;
      state.userProducts = action.payload.userProducts;
    },
    deleteProduct(state, action) {
      const pid = action.payload;
      state.userProducts = state.userProducts.filter(
        (product) => product.id !== pid
      );
      state.availableProducts = state.availableProducts.filter(
        (product) => product.id !== pid
      );
      state.favoriteProducts = state.favoriteProducts.filter(
        (product) => product.id !== pid
      );
    },
    createProduct(state, action) {
      const productData = action.payload;
      const newProduct = new Product(
        productData.id,
        productData.ownerId,
        productData.title,
        productData.imageUrl,
        productData.description,
        productData.price
      );
      state.availableProducts.push(newProduct);
      state.userProducts.push(newProduct);
    },
    updateProduct(state, action) {
      const { pid, productData } = action.payload;
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === pid
      );
      const updatedProduct = new Product(
        pid,
        state.userProducts[productIndex].ownerId,
        productData.title,
        productData.imageUrl,
        productData.description,
        state.userProducts[productIndex].price
      );
      state.userProducts[productIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === pid
      );
      state.availableProducts[availableProductIndex] = updatedProduct;

      const favoriteProductIndex = state.favoriteProducts.findIndex(
        (prod) => prod.id === pid
      );
      state.favoriteProducts[favoriteProductIndex] = updatedProduct;
    },
  },
});

export const getAvailableProducts = (state) => state.products.availableProducts;
export const getUserProducts = (state) => state.products.userProducts;
export const getFavoriteProducts = (state) => state.products.favoriteProducts;

export const { setProducts, deleteProduct, createProduct, updateProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
