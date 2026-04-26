import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Database/firebaseConfig";
import { toast } from "react-toastify";

// Listen to orders in real-time

export const listenToOrdersAsync = (signedUser) => (dispatch) => {
  try {
    if (!signedUser) return;
    dispatch(setOrderLoading(true));
    const orderQuery = collection(db, "userOrders", signedUser, "orders");
    const unsubscribe = onSnapshot(
      orderQuery,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toMillis(),
          };
        });

        dispatch(setOrders(orders));
        dispatch(setOrderLoading(false));
      },
      (error) => {
        toast.error("Something went wrong while fetching orders.");
        dispatch(setOrderLoading(false));
      },
    );
    return unsubscribe; // important for cleanup
  } catch (error) {
    toast.error("Something went wrong while fetching orders.");
  }
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderLoading: true,
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setOrderLoading: (state, action) => {
      state.orderLoading = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { setOrders, setOrderLoading, clearOrders } = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
