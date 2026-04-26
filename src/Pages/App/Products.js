import Search from "../../Components/Search/Search";
import ProductsList from "../../Components/Products List/ProductsList";
import styles from "./Products.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../redux/slices/filterSlice";
import { useEffect } from "react";
import { fetchProducts } from "../../redux/slices/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const searchValue = useSelector((state) => state.filter.searchValue);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearchProductByName = (e) => {
    dispatch(setSearchValue(e.target.value.toLowerCase()));
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading products...</h2>;
  }

  return (
    <>
      <div className={styles.searchBarContainer}>
        <input
          type="search"
          placeholder="Search By Name"
          value={searchValue}
          onChange={(e) => handleSearchProductByName(e)}
          className={styles.searchBar}
        />
      </div>
      <div className={styles.searchFilterContainer}>
        <Search />
      </div>
      <div className={styles.productsContainer}>
        <ProductsList />
      </div>
    </>
  );
}
