import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../Components/Loader/Loader";
import CartItem from "../../Components/Cart Item/CartItem";
import { placeOrderAsync } from "../../redux/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((state) => state.cart);
  const signedUser = useSelector((state) => state.auth.signedUser);
  const orderSuccess = useSelector((state) => state.cart.orderSuccess);

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return <h1>No items in the cart!</h1>;
  }

  if (orderSuccess) return <h2>Order placed successfully!</h2>;

  return (
    <>
      <div>
        <p>{`TotalPrice:- ₹ ${total}/-`}</p>
        <button onClick={() => dispatch(placeOrderAsync())} disabled={loading}>
          Purchase
        </button>
      </div>
      <div>
        {items.map((item) => (
          <CartItem
            key={item.id}
            cartItemId={item.id}
            title={item.product.title}
            price={item.product.price}
            image={item.product.image}
            qty={item.qty}
          />
        ))}
      </div>
    </>
  );
}
