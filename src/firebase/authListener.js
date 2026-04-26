import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../Database/firebaseConfig";
import { setUser, clearUser } from "../redux/slices/authSlice";

export const authListener = (dispatch) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        dispatch(
          setUser({
            uid: user.uid,
            name: snap.data().name,
            email: user.email,
          }),
        );
      } else {
        dispatch(
          setUser({
            uid: user.uid,
            name: user.displayName || "",
            email: user.email,
          }),
        );
      }
    } else {
      dispatch(clearUser());
    }
  });
  return unsubscribe;
};

// export const authListener = (dispatch) => {
//   onAuthStateChanged(auth, async (user) => {
//     try {
//       if (!user) {
//         dispatch(clearUser());
//         return;
//       }
//       const userRef = doc(db, "users", user.uid);
//       const snap = await getDoc(userRef);
//       if (!snap.exists()) {
//         dispatch(
//           setUser({
//             uid: user.uid,
//             name: user.displayName || "",
//             email: user.email,
//           }),
//         );
//         return;
//       }
//       dispatch(
//         setUser({
//           uid: user.uid,
//           name: snap.data().name,
//           email: user.email,
//         }),
//       );
//     } catch (error) {
//       console.error("Auth listener error:", error);
//       dispatch(clearUser());
//     }
//   });
// };
