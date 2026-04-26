import { useDispatch, useSelector } from "react-redux";
import styles from "./Signup.module.css";
import { signUpAsync } from "../../redux/slices/authSlice";
import { useState } from "react";

export default function SignUp() {
  const dispatch = useDispatch();
  const { loading, error, isSignIn } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpAsync({ name, email, password }));
  };

  return (
    <div className={styles.signUpContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h1 className={styles.heading}>Sign Up</h1>
        <input
          value={name}
          type="text"
          required={true}
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          value={email}
          type="email"
          required={true}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          type="password"
          required
          minLength={6}
          placeholder="Enter Password (min 6 chars)"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.signupBtn} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {isSignIn && (
          <p className={styles.success}>Account created successfully</p>
        )}
      </form>
    </div>
  );
}
