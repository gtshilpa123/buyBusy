import { useDispatch, useSelector } from "react-redux";
import styles from "./CartItem.module.css";
import {
  increaseQtyAsync,
  decreaseQtyAsync,
  removeFromCartAsync,
} from "../../redux/slices/cartSlice";

export default function CartItem({ cartItemId, title, price, image, qty }) {
  const dispatch = useDispatch();

  return (
    <div className={styles.productCardContainer}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.productImage} />
      </div>
      <div className={styles.productTitleContainer}>
        <p className={styles.productTitle}>{title}</p>
      </div>
      <div className={styles.priceAndQtyContainer}>
        <p className={styles.productPrice}>{`₹ ${price}`}</p>
        <span className={styles.qtyContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/3388/3388913.png"
            alt="Remove"
            onClick={() => decreaseQtyAsync(cartItemId)}
          />
          <p>{qty}</p>
          <img
            src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png"
            alt="Add"
            onClick={() => increaseQtyAsync(cartItemId)}
          />
        </span>
      </div>
      <button
        className={styles.removeFromCartBtn}
        onClick={() => removeFromCartAsync(cartItemId)}
      >
        Remove From Cart
      </button>
    </div>
  );
}
