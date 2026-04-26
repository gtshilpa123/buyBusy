import { useNavigate } from "react-router-dom";
import styles from "./Page404.module.css";

// Component to show errors here.
export default function Page404() {
  const navigate = useNavigate();
  const back = () => {
    navigate(-1);
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorHeading}>404</h1>
        <p className={styles.errorMessage}>Oops! Page not found</p>
        <p className={styles.errorDescription}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button className={styles.errorButton} onClick={back}>
          Go Back
        </button>
      </div>
    </div>
  );
}
