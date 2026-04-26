import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { addToCartAsync } from "../../redux/slices/cartSlice";

export default function ProductsCard({ id, title, price, description, image }) {
  const dispatch = useDispatch();
  const signedUser = useSelector((state) => state.auth.signedUser);
  const navigate = useNavigate();
  const handleAddToCart = () => {
    if (!signedUser) {
      navigate("/signIn");
      return;
    }
    dispatch(
      addToCartAsync({
        id,
        title,
        price,
        description,
        image,
      }),
    );
  };

  return (
    <div className={styles.productCardContainer}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.productImage} />
      </div>
      <div className={styles.productTitleContainer}>
        <p className={styles.productTitle}>{title}</p>
      </div>
      <p className={styles.productPrice}>{`₹ ${price}`}</p>
      <button className={styles.addToCartBtn} onClick={handleAddToCart}>
        Add To Cart
      </button>
    </div>
  );
}
