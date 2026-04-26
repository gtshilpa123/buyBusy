import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "react-toastify";
import { db, auth } from "../Database/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const userContext = createContext();

export function useUserContext() {
  return useContext(userContext);
}

export function CustomUserContextProvider({ children }) {
  const [signedUser, setSignedUser] = useState("");
  let [isSignIn, setIsSignIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedUser(user.uid);
        setIsSignIn(true);
      } else {
        setSignedUser("");
        setIsSignIn(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: name,
      });
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        createdAt: new Date(),
      });
      setEmail("");
      setName("");
      setPassword("");
      toast.success("User signed up successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      toast.success("User signed in successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("User signed out successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <userContext.Provider
      value={{
        isSignIn,
        signedUser,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        handleLogout,
        handleSignIn,
        handleSignUp,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
