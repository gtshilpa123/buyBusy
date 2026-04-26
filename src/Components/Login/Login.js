import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import styles from "./Login.module.css";
import { loginAsync } from "../../redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSignIn, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync({ email, password }));
  };

  useEffect(() => {
    if (isSignIn) {
      navigate("/");
    }
  }, [isSignIn, navigate]);

  return (
    <div className={styles.signInContainer}>
      <form className={styles.signinForm} onSubmit={handleSubmit}>
        <h1 className={styles.heading}>Sign In</h1>
        <input
          value={email}
          type="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          value={password}
          type="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <button className={styles.signinBtn} type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {error && <p className="styles.error">{error}</p>}

        <Link to="/signUp" className={styles.signUpLink}>
          <p>Or SignUp instead</p>
        </Link>
      </form>
    </div>
  );
}
