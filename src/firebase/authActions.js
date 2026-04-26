import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { db, auth } from "../Database/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export const handleSignUp = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, "users", user.uid), {
      name,
      email: user.email,
      createdAt: new Date(),
    });
    toast.success("User signed up successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

export const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    toast.success("User signed in successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
    toast.success("User signed out successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

// import { useSelector } from "react-redux";

// const { isSignIn, name } = useSelector((state) => state.auth);
