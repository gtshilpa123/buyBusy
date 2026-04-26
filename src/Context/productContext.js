import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  onSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../Database/firebaseConfig";
import { toast } from "react-toastify";
import { useUserContext } from "./usersContext";

const productContext = createContext();

export function useProductContext() {
  return useContext(productContext);
}

export function CustomProductContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFiltered, setIsFiltered] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const { signedUser } = useUserContext();

  // Products
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        const productsWithPrice = data.map((product) => ({
          ...product,
          price: Math.round(product.price * 80),
        }));
        setProducts(productsWithPrice);
        setProductLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    }
    fetchData();
  }, []);

  // Filter
  useEffect(() => {
    setIsFiltered(true);
    let filteredProducts = products;
    if (selectedPrice && selectedCategories.length > 0) {
      filteredProducts = products.filter(
        (product) =>
          product.price <= selectedPrice &&
          selectedCategories.includes(product.category),
      );
    } else if (searchValue) {
      filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchValue),
      );
    } else if (selectedPrice) {
      filteredProducts = products.filter(
        (product) => product.price <= selectedPrice,
      );
    } else if (selectedCategories.length > 0) {
      filteredProducts = products.filter((product) =>
        selectedCategories.includes(product.category),
      );
    } else if (
      !selectedPrice &&
      !searchValue &&
      selectedCategories.length === 0
    ) {
      setIsFiltered(false);
    }
    setFilteredProducts(filteredProducts);
  }, [products, searchValue, selectedCategories, selectedPrice]);

  const handleSearchProductByName = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handlePriceChange = (event) => {
    setSelectedPrice(parseInt(event.target.value));
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategories.includes(selectedCategory)) {
      const updatedCategories = selectedCategories.filter(
        (category) => category !== selectedCategory,
      );
      setSelectedCategories(updatedCategories);
    } else {
      setSelectedCategories([...selectedCategories, selectedCategory]);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      if (!signedUser) return;
      // const cartQuery = query(
      const cartQuery = collection(db, "usersCarts", signedUser, "myCart");
      // where("user", "==", signedUser),
      // );
      const unsubscribe = onSnapshot(cartQuery, (snapShot) => {
        const cartData = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
        setCartLoading(false);
        const totalPrice = cartData.reduce(
          (acc, item) => acc + item.qty * item.product.price,
          0,
        );
        setTotal(totalPrice);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, [signedUser]);
  // }, [signedUser, cartItems]);

  // Cart Actions
  const handleAddToCart = async (product, user) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.product.title === product.title && item.user === user,
      );
      if (existingItemIndex !== -1) {
        const existingItem = cartItems[existingItemIndex];
        const updatedQty = existingItem.qty + 1;
        await updateDoc(
          doc(
            collection(db, "usersCarts", signedUser, "myCart"),
            existingItem.id,
          ),
          {
            qty: updatedQty,
          },
        );
        toast.success("Quantity increased for the item!");
      } else {
        await addDoc(collection(db, "usersCarts", signedUser, "myCart"), {
          user: user,
          product,
          qty: 1,
        });
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await deleteDoc(
        doc(collection(db, "usersCarts", signedUser, "myCart"), cartItemId),
      );
      toast.success("Item removed successfully from cart!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleIncreaseQty = async (cartItemId) => {
    try {
      const itemSnapshot = await getDoc(
        doc(collection(db, "usersCarts", signedUser, "myCart"), cartItemId),
      );
      const currentItem = itemSnapshot.data();
      const updatedQty = currentItem.qty + 1;
      await updateDoc(
        doc(collection(db, "usersCarts", signedUser, "myCart"), cartItemId),
        {
          qty: updatedQty,
        },
      );
      toast.success("Quantity increased for the item!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleDecreaseQty = async (cartItemId) => {
    try {
      const itemSnapshot = await getDoc(
        doc(collection(db, "usersCarts", signedUser, "myCart"), cartItemId),
      );
      const currentItem = itemSnapshot.data();
      const updatedQty = currentItem.qty - 1;
      if (updatedQty > 0) {
        await updateDoc(
          doc(collection(db, "usersCarts", signedUser, "myCart"), cartItemId),
          {
            qty: updatedQty,
          },
        );
        toast.success("Quantity decreased for the item!");
      } else {
        handleRemoveFromCart(cartItemId);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // Order
  const handleOrder = async () => {
    try {
      await addDoc(collection(db, "userOrders", signedUser, "orders"), {
        cartItems,
        total,
        user: signedUser,
        createdAt: new Date(),
      });
      // const cartQuery = query(
      const cartQuery = collection(db, "usersCarts", signedUser, "myCart");
      // where("user", "==", signedUser),
      // );
      const cartSnapshot = await getDocs(cartQuery);
      const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      //   cartSnapshot.docs.forEach(async (doc) => {
      //     await deleteDoc(doc.ref);
      //   });
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <productContext.Provider
      value={{
        products,
        productLoading,
        handlePriceChange,
        handleCategoryChange,
        selectedPrice,
        isFiltered,
        filteredProducts,
        handleSearchProductByName,
        handleAddToCart,
        cartItems,
        cartLoading,
        handleRemoveFromCart,
        total,
        handleDecreaseQty,
        handleIncreaseQty,
        handleOrder,
        orderLoading,
        setOrderLoading,
      }}
    >
      {children}
    </productContext.Provider>
  );
}
