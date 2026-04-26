import { useDispatch, useSelector } from "react-redux";
import styles from "./Search.module.css";
import { setPrice, toggleCategory } from "../../redux/slices/filterSlice";

export default function Search() {
  const dispatch = useDispatch();
  const price = useSelector((state) => state.filter.selectedPrice);
  const selectedCategories = useSelector(
    (state) => state.filter.selectedCategories,
  );
  const products = useSelector((state) => state.product.products);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className={styles.searchFilterContainer}>
      <form>
        <div className={styles.filterSection}>
          <p className={styles.heading}>Filter</p>
          <div className={styles.priceRange}>
            <span>Price: {price ?? 0}</span>
            <input
              type="range"
              min="0"
              max="100000"
              value={price ?? 0}
              onChange={(e) => dispatch(setPrice(Number(e.target.value)))}
            />
          </div>
        </div>
        <div className={styles.categorySection}>
          <p className={styles.heading}>Category</p>
          {categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => dispatch(toggleCategory(category))}
              />
              {category}
            </label>
          ))}
        </div>
      </form>
    </div>
  );
}
