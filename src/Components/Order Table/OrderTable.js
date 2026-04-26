import styles from "./OrderTable.module.css";

export default function OrderTable({ order }) {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  console.log(formattedDate);
  // returning JSX
  return (
    <div className={styles.orderTableContainer}>
      <h1
        className={styles.orderCreatedHeading}
      >{`Order created On:- ${formattedDate}`}</h1>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.product.title}</td>
              <td>{`₹ ${item.product.price}`}</td>
              <td>{item.qty}</td>
              <td>{`₹ ${item.product.price * item.qty}`}</td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td className={styles.totalRow}>{`₹ ${order.total}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
