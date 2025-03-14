// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push, remove, update } from "firebase/database";
// Remove Firebase Storage imports since we're not using it
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

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
// Remove Storage initialization
// const storage = getStorage(app);

// Helper function to handle Firebase errors
const handleFirebaseError = (error, fallbackValue, operation) => {
  console.error(`Firebase error during ${operation}:`, error);
  
  if (error.message && error.message.includes("Permission denied")) {
    console.warn(`Firebase permission denied during ${operation}. Please check your Firebase security rules.`);
    console.warn("You may need to update your Firebase security rules to allow read/write access.");
    console.warn("Example rules for development: { \"rules\": { \".read\": true, \".write\": true } }");
  }
  
  return fallbackValue;
};

// Image Upload Functions
// Note: Since Firebase Storage is not available on the free plan,
// we're using direct image URLs instead. Consider using services like:
// - Cloudinary (free tier with 25GB storage)
// - Imgur API
// - ImgBB
// - Or storing images directly in your GitHub repository for small projects
export const uploadProductImage = async (file, productId) => {
  console.log(`Image upload functionality is not available with current setup`);
  throw new Error("Image upload is not implemented. Please use direct image URLs instead.");
};

// Orders
export const saveOrder = async (order) => {
  console.log("Saving order to Firebase:", order);
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, {
      ...order,
      firebaseId: newOrderRef.key,
      timestamp: Date.now()
    });
    console.log("Order saved to Firebase successfully with ID:", order.id);
    return order.id;
  } catch (error) {
    handleFirebaseError(error, null, "saveOrder");
    throw error; // Re-throw to allow caller to handle
  }
};

export const getOrdersOnce = async () => {
  console.log("Getting orders from Firebase");
  try {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      const ordersData = snapshot.val();
      const ordersList = Object.keys(ordersData).map(key => ({
        ...ordersData[key],
        firebaseKey: key // Store Firebase key separately without overriding original id
      }));
      console.log(`Retrieved ${ordersList.length} orders from Firebase`);
      return ordersList;
    }
    
    console.log("No orders found in Firebase");
    return [];
  } catch (error) {
    return handleFirebaseError(error, [], "getOrdersOnce");
  }
};

export const listenToOrders = (callback) => {
  console.log("Setting up real-time listener for orders");
  try {
    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      console.log("Received order update from Firebase");
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersList = Object.keys(ordersData).map(key => ({
          ...ordersData[key],
          firebaseKey: key // Store Firebase key separately without overriding original id
        }));
        console.log(`Real-time update: ${ordersList.length} orders from Firebase`);
        callback(ordersList);
      } else {
        console.log("No orders found in Firebase (real-time update)");
        callback([]);
      }
    }, (error) => {
      console.error("Error in Firebase real-time listener:", error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    handleFirebaseError(error, null, "listenToOrders");
    return () => {}; // Return empty function as fallback
  }
};

export const updateOrderStatus = async (orderId, status, firebaseKey) => {
  console.log(`Updating order ${orderId} status to ${status}`);
  try {
    const orderRef = ref(database, `orders/${firebaseKey}`);
    await update(orderRef, { status });
    console.log(`Order ${orderId} status updated successfully`);
    return true;
  } catch (error) {
    handleFirebaseError(error, false, "updateOrderStatus");
    throw error;
  }
};

export const deleteOrder = async (firebaseKey) => {
  console.log(`Deleting order with Firebase key: ${firebaseKey}`);
  try {
    const orderRef = ref(database, `orders/${firebaseKey}`);
    await remove(orderRef);
    console.log(`Order deleted successfully`);
    return true;
  } catch (error) {
    handleFirebaseError(error, false, "deleteOrder");
    throw error;
  }
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