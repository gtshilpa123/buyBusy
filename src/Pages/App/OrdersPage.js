import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToOrdersAsync } from "../../redux/slices/ordersSlice";
import OrderTable from "../../Components/Order Table/OrderTable";
import { Loader } from "../../Components/Loader/Loader";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, orderLoading } = useSelector((state) => state.orders);
  const { signedUser } = useSelector((state) => state.auth);

  return (
    <>
      {orderLoading ? (
        <Loader />
      ) : (
        <>
          <h1
            style={{ margin: "2rem", textAlign: "center", color: " #7064E5" }}
          >
            {orders.length === 0 ? "No orders found" : "Your Orders"}
          </h1>
          {orders.length > 0 &&
            orders.map((order, i) => <OrderTable key={i} order={order} />)}
        </>
      )}
    </>
  );
}
