import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "../../Database/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      return { uid: user.uid, name: user.displayName, email: user.email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signUpAsync = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        createdAt: new Date(),
      });
      return { uid: user.uid, name, email: user.email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  loading: false,
  isSignIn: false,
  signedUser: null,
  name: "",
  email: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.isSignIn = true;
      state.signedUser = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.isSignIn = false;
      state.signedUser = null;
      state.name = "";
      state.email = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSignIn = true;
        state.signedUser = action.payload.uid;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signUpAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSignIn = true;
        state.signedUser = action.payload.uid;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSignIn = false;
        state.signedUser = null;
        state.name = "";
        state.email = "";
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
