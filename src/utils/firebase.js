// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push, remove } from "firebase/database";

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhuOO-9ifGREkqMF6JNQcl5LPjHvVwRyc",
  authDomain: "online-shop-21f83.firebaseapp.com",
  databaseURL: "https://online-shop-21f83-default-rtdb.firebaseio.com",
  projectId: "online-shop-21f83",
  storageBucket: "online-shop-21f83.firebasestorage.app",
  messagingSenderId: "1043265038518",
  appId: "G-W3VLYQE06G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Orders
export const saveOrder = (order) => {
  const ordersRef = ref(database, 'orders');
  const newOrderRef = push(ordersRef);
  return set(newOrderRef, {
    ...order,
    id: newOrderRef.key,
    timestamp: Date.now()
  });
};

export const getOrdersOnce = async () => {
  const ordersRef = ref(database, 'orders');
  const snapshot = await get(ordersRef);
  
  if (snapshot.exists()) {
    const ordersData = snapshot.val();
    return Object.keys(ordersData).map(key => ({
      ...ordersData[key],
      id: key
    }));
  }
  
  return [];
};

export const listenToOrders = (callback) => {
  const ordersRef = ref(database, 'orders');
  return onValue(ordersRef, (snapshot) => {
    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      const ordersList = Object.keys(ordersData).map(key => ({
        ...ordersData[key],
        id: key
      }));
      callback(ordersList);
    } else {
      callback([]);
    }
  });
};

export const updateOrderStatus = (orderId, status) => {
  const orderRef = ref(database, `orders/${orderId}`);
  return set(orderRef, { status });
};

// Products
export const saveProducts = (products) => {
  const productsRef = ref(database, 'products');
  return set(productsRef, products);
};

export const getProductsOnce = async () => {
  const productsRef = ref(database, 'products');
  const snapshot = await get(productsRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return [];
};

export const listenToProducts = (callback) => {
  const productsRef = ref(database, 'products');
  return onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback([]);
    }
  });
};

// Categories
export const saveCategories = (categories) => {
  const categoriesRef = ref(database, 'categories');
  return set(categoriesRef, categories);
};

export const getCategoriesOnce = async () => {
  const categoriesRef = ref(database, 'categories');
  const snapshot = await get(categoriesRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return [];
};

export const listenToCategories = (callback) => {
  const categoriesRef = ref(database, 'categories');
  return onValue(categoriesRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback([]);
    }
  });
};

export default database; 