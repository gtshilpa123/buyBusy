import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, updateDoc, doc, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ product, user }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cartItems = state.cart.items;
      const signedUser = state.auth.signedUser;
      const existingItem = cartItems.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        const updatedQty = existingItem.qty + 1;
        await updateDoc(
          doc(
            collection(db, "usersCarts", signedUser, "myCart"),
            existingItem.id,
          ),
          { qty: updatedQty },
        );
        toast.success("Quantity increased for the item!");
      } else {
        await addDoc(collection(db, "usersCarts", signedUser, "myCart"), {
          user,
          product,
          qty: 1,
        });
        toast.success("Product added to cart successfully!");
      }
      return true;
    } catch (error) {
      toast.error("Something went wrong!");
      return rejectWithValue(error.message);
    }
  },
);

export const listenToCart = (signedUser) => (dispatch) => {
  if (!signedUser) return;
  dispatch(setCartLoading(true));
  const cartQuery = collection(db, "usersCarts", signedUser, "myCart");
  const unsubscribe = onSnapshot(cartQuery, (snapShot) => {
    const cartData = snapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch(setCartItems(cartData));
    const totalPrice = cartData.reduce(
      (acc, item) => acc + item.qty * item.product.price,
      0,
    );
    dispatch(setCartTotal(totalPrice));
    dispatch(setCartLoading(false));
  });
  return unsubscribe;
};

export const fetchCartAsync = createAsyncThunk("cart/fetchCart", async () => {
  const response = await fetch("/api/cart");
  if (!response.ok) throw new Error("Failed to fetch cart");
  return await response.json();
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
    },
    setCartTotal(state, action) {
      state.total = action.payload;
    },
    setCartLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCartAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addItem, removeItem, fetchCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

// addItem: (state, action) => {
//       const item = action.payload;
//       const existing = state.items.find(
//         (i) => i.product.id === item.product.id,
//       );
//       if (existing) {
//         existing.qty += item.qty;
//       } else {
//         state.items.push(item);
//       }
//       state.total = state.items.reduce(
//         (acc, current) => acc + current.qty * current.product.price,
//         0,
//       );
//     },
//     removeItem: (state, action) => {
//       state.items = state.items.filter(
//         (item) => item.product.id !== action.payload,
//       );
//       state.total = state.items.reduce(
//         (acc, current) => acc + current.qty * current.product.price,
//         0,
//       );
//     },
//     fetchCart: (state, action) => {
//       state.items = action.payload.items;
//       state.total = action.payload.total;
//     },
