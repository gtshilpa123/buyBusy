import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { cartReducer } from "./slices/cartSlice";
import { filterReducer } from "./slices/filterSlice";
import { ordersReducer } from "./slices/ordersSlice";
import { productReducer } from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    filter: filterReducer,
    orders: ordersReducer,
    product: productReducer,
  },
});
