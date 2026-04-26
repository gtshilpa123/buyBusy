import { createSelector } from "@reduxjs/toolkit";

export const selectFilteredProducts = createSelector(
  [
    (state) => state.product.products,
    (state) => state.filter.searchValue,
    (state) => state.filter.selectedCategories,
    (state) => state.filter.selectedPrice,
  ],
  (products = [], searchValue, selectedCategories, selectedPrice) => {
    let filtered = [...products];

    if (searchValue) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchValue),
      );
    }
    if (selectedPrice) {
      filtered = filtered.filter((p) => p.price <= selectedPrice);
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category),
      );
    }
    return filtered;
  },
);
