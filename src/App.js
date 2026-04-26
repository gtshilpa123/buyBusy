import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Products from "./Pages/App/Products";
import SignUp from "./Components/Signup Component/Signup";
import Login from "./Components/Login/Login";
import Page404 from "./ErrorPage/Page404";
import { ToastContainer } from "react-toastify";
import CartPage from "./Pages/App/CartPage";
import OrdersPage from "./Pages/App/OrdersPage";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authListener } from "./firebase/authListener";
import { listenToCart } from "./redux/slices/cartSlice";
import { listenToOrdersAsync } from "./redux/slices/ordersSlice";

export default function App() {
  const dispatch = useDispatch();
  const { signedUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = authListener(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    let unsubscribe;
    if (signedUser) {
      unsubscribe = dispatch(listenToCart(signedUser));
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [signedUser, dispatch]);

  useEffect(() => {
    let unsubscribe;
    if (signedUser) {
      unsubscribe = dispatch(listenToOrdersAsync(signedUser));
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, signedUser]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <Page404 />,
      children: [
        { index: true, element: <Products /> },
        { path: "signIn", element: <Login /> },
        { path: "signUp", element: <SignUp /> },
        { path: "cart", element: <CartPage /> },
        { path: "orders", element: <OrdersPage /> },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

// Hosted Link
// https://tangerine-gingersnap-3c8b63.netlify.app/
