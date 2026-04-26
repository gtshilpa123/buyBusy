import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";
import { logoutAsync } from "../../redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const isSignIn = useSelector((state) => state.auth.isSignIn);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.left}>
          <NavLink to="/" className={styles.navLink}>
            <h3>Busy Buy</h3>
          </NavLink>
        </div>
        <ul className={styles.right}>
          <li>
            <NavLink to="/" className={styles.navLink}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/609/609803.png"
                alt="Home"
              />
              <h3>Home</h3>
            </NavLink>
          </li>
          {isSignIn && (
            <>
              <li>
                <NavLink to="/orders" className={styles.navLink}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/6815/6815043.png"
                    alt="My Orders"
                  />
                  <h3>My Orders</h3>
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className={styles.navLink}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/891/891407.png"
                    alt="Cart"
                  />
                  <h3>Cart</h3>
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              to={isSignIn ? "/" : "/signIn"}
              className={styles.navLink}
              onClick={isSignIn ? handleLogout : null}
            >
              <img
                src={
                  isSignIn
                    ? "https://cdn-icons-png.flaticon.com/128/1828/1828490.png"
                    : "https://cdn-icons-png.flaticon.com/128/2574/2574000.png"
                }
                alt="SignIn"
              />
              <h3>{isSignIn ? "Logout" : "SignIn"}</h3>
            </NavLink>
          </li>
        </ul>
      </div>
      {/* Showing childrens */}
      <Outlet />
    </>
  );
}
