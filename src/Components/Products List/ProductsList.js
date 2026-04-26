import { useSelector } from "react-redux";
import ProductsCard from "../Product Card/ProductCard";
import styles from "./ProductsList.module.css";
import { selectFilteredProducts } from "../../redux/selectors/productsSelector";

export default function ProductsList() {
  const products = useSelector((state) => state.product.products);
  const filteredProducts = useSelector(selectFilteredProducts);

  const { searchValue, selectedCategories, selectedPrice } = useSelector(
    (state) => state.filter,
  );

  const isFiltered =
    Boolean(searchValue) ||
    selectedCategories.length > 0 ||
    Boolean(selectedPrice);

  const listToRender = isFiltered ? filteredProducts : products;

  return (
    <div className={styles.productListConatiner}>
      {listToRender.map((product) => (
        <ProductsCard
          key={product.id}
          id={product.id}
          title={product.title}
          description={product.description}
          price={product.price}
          category={product.category}
          image={product.image}
        />
      ))}
    </div>
  );
}
