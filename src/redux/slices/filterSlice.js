import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    products: [],
    selectedPrice: 0,
    selectedCategories: [],
    searchValue: "",
  },
  reducers: {
    setPrice: (state, action) => {
      state.selectedPrice = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    toggleCategory: (state, action) => {
      const cat = action.payload;
      const index = state.selectedCategories.indexOf(cat);
      if (index > -1) {
        state.selectedCategories.splice(index, 1);
      } else {
        state.selectedCategories.push(cat);
      }
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload.toLowerCase();
    },
    resetFilters: (state, action) => {
      state.searchValue = "";
      state.selectedCategories = [];
      state.selectedPrice = null;
    },
  },
});

export const {
  setPrice,
  setProducts,
  setCategories,
  setSearchValue,
  resetFilters,
  toggleCategory,
} = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
