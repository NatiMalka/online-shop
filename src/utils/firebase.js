// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push, remove, update } from "firebase/database";

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhuOO-9ifGREkqMF6JNQcl5LPjHvVwRyc",
  authDomain: "online-shop-21f83.firebaseapp.com",
  databaseURL: "https://online-shop-21f83-default-rtdb.firebaseio.com",
  projectId: "online-shop-21f83",
  storageBucket: "online-shop-21f83.appspot.com",
  messagingSenderId: "1043265038518",
  appId: "1:1043265038518:web:ee3ef45664e4e4c5895e17" // You should replace this with your actual Firebase App ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Orders
export const saveOrder = (order) => {
  console.log("Saving order to Firebase:", order); // Add logging
  const ordersRef = ref(database, 'orders');
  const newOrderRef = push(ordersRef);
  return set(newOrderRef, {
    ...order,
    id: newOrderRef.key,
    timestamp: Date.now()
  });
};

export const getOrdersOnce = async () => {
  console.log("Getting orders from Firebase"); // Add logging
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
  console.log("Setting up real-time listener for orders"); // Add logging
  const ordersRef = ref(database, 'orders');
  return onValue(ordersRef, (snapshot) => {
    console.log("Received order update from Firebase"); // Add logging
    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      const ordersList = Object.keys(ordersData).map(key => ({
        ...ordersData[key],
        id: key
      }));
      console.log("Orders from Firebase:", ordersList); // Add logging
      callback(ordersList);
    } else {
      console.log("No orders found in Firebase"); // Add logging
      callback([]);
    }
  });
};

export const updateOrderStatus = (orderId, status) => {
  console.log(`Updating order ${orderId} status to ${status}`); // Add logging
  const orderRef = ref(database, `orders/${orderId}`);
  return update(orderRef, { status }); // Use update instead of set to only update the status field
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