import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../Database/firebaseConfig";
import { toast } from "react-toastify";

// ADD TO CART

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const signedUser = state.auth.signedUser;
      const cartItems = state.cart.items;

      if (!signedUser) throw new Error("User not logged in");

      const existingItem = cartItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        await updateDoc(
          doc(db, "usersCarts", signedUser, "myCart", existingItem.id),
          { qty: existingItem.qty + 1 },
        );
        toast.success("Quantity updated");
      } else {
        await addDoc(collection(db, "usersCarts", signedUser, "myCart"), {
          product,
          qty: 1,
        });
        toast.success("Added to cart");
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  },
);

// REMOVE FROM CART

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, { getState, rejectWithValue }) => {
    try {
      const signedUser = getState().auth.signedUser;
      if (!signedUser) throw new Error("User not logged in");

      await deleteDoc(doc(db, "usersCarts", signedUser, "myCart", cartItemId));

      toast.success("Item removed from cart");
      return cartItemId;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  },
);

// INCREASE QTY

export const increaseQtyAsync = createAsyncThunk(
  "cart/increaseQty",
  async ({ cartItemId }, { getState, rejectWithValue }) => {
    try {
      const signedUser = getState().auth.signedUser;
      const itemRef = doc(
        collection(db, "usersCarts", signedUser, "myCart"),
        cartItemId,
      );
      const itemSnapshot = await getDoc(itemRef);
      const currentItem = itemSnapshot.data();
      const updatedQty = currentItem.qty + 1;
      await updateDoc(itemRef, {
        qty: updatedQty,
      });
      return { cartItemId, updatedQty };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// DECREASE QTY

export const decreaseQtyAsync = createAsyncThunk(
  "cart/increaseQty",
  async ({ cartItemId }, { getState, rejectWithValue }) => {
    try {
      const signedUser = getState().auth.signedUser;
      const itemRef = doc(
        collection(db, "usersCarts", signedUser, "myCart"),
        cartItemId,
      );
      const itemSnapshot = await getDoc(itemRef);
      const currentItem = itemSnapshot.data();
      const updatedQty = currentItem.qty - 1;
      if (updatedQty > 0) {
        await updateDoc(itemRef, {
          qty: updatedQty,
        });
        return { cartItemId, updatedQty, removed: false };
      } else {
        await deleteDoc(itemRef);
        return { cartItemId, removed: true };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// PLACE ORDER

export const placeOrderAsync = createAsyncThunk(
  "cart/placeOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const signedUser = state.auth.signedUser;
      const cartItems = state.cart.items;
      const total = state.cart.total;
      if (!signedUser || cartItems.length === 0) return;
      await addDoc(collection(db, "userOrders", signedUser, "orders"), {
        cartItems,
        total,
        user: signedUser,
        createdAt: new Date(),
      });
      const cartQuery = collection(db, "usersCarts", signedUser, "myCart");
      const cartSnapshot = await getDocs(cartQuery);
      const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      toast.success("Order placed successfully!");
      return true;
    } catch (error) {
      toast.error("Something went wrong!");
      return rejectWithValue(error.message);
    }
  },
);

// REAL-TIME CART LISTENER

export const listenToCart = (signedUser) => (dispatch) => {
  if (!signedUser) return;

  dispatch(setLoading(true));

  const cartRef = collection(db, "usersCarts", signedUser, "myCart");

  const unsubscribe = onSnapshot(cartRef, (snapshot) => {
    const cartItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch(setItems(cartItems));
    dispatch(setTotal());
    dispatch(setLoading(false));
  });

  return unsubscribe;
};

// ===============================
// SLICE
// ===============================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    orderSuccess: false,
    loading: false,
    error: null,
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    setTotal(state) {
      state.total = state.items.reduce(
        (acc, item) => acc + item.qty * item.product.price,
        0,
      );
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = state.items.reduce(
          (acc, item) => acc + item.qty * item.product.price,
          0,
        );
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeOrderAsync.pending, (state) => {
        state.loading = true;
        state.orderSuccess = false;
      })
      .addCase(placeOrderAsync.fulfilled, (state) => {
        state.loading = false;
        state.orderSuccess = true;
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderSuccess = false;
      });
  },
});

export const { setItems, setTotal, setLoading, clearCart } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

// .addCase(increaseQtyAsync.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(increaseQtyAsync.fulfilled, (state, action) => {
//         state.loading = false;
//         const { cartItemId, updatedQty } = action.payload;
//         const item = state.items.find((item) => item.id === cartItemId);
//         if (item) {
//           item.qty = updatedQty;
//         }
//       })
//       .addCase(increaseQtyAsync.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(decreaseQtyAsync.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(decreaseQtyAsync.fulfilled, (state, action) => {
//         state.loading = false;
//         const { cartItemId, updatedQty, removed } = action.payload;
//         if (removed) {
//           state.items = state.items.filter((item) => item.id !== cartItemId);
//         } else if (state.items[cartItemId]) {
//           const item = state.items.find((item) => item.id === cartItemId);
//           if (item) item.qty = updatedQty;
//         }
//       })
//       .addCase(decreaseQtyAsync.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
