import React, { useState, useEffect } from 'react'
import { getProducts, setProducts, getCategories, setCategories, getOrders, setOrders } from '../utils/storage'
import { listenToOrders, updateOrderStatus, getOrdersOnce, deleteOrder } from '../utils/firebase'
import { openUploadWidget, getPublicIdFromUrl } from '../utils/cloudinary'
// Import icons for category selection
import { 
  // Food & Beverage icons
  FaUtensils, FaBreadSlice, FaCarrot, FaWineGlass, FaCoffee,
  FaAppleAlt, FaFish, FaIceCream, FaEgg, FaCheese, FaPizzaSlice,
  FaHamburger, FaCandyCane, FaCookie, FaWineBottle, FaGlassMartini,
  FaLemon, FaPepperHot, FaDrumstickBite, FaBacon, FaHotdog, FaMugHot,
  FaGlassWhiskey, FaWater, FaLeaf, FaSeedling, 
  
  // Shopping & Store icons
  FaShoppingBasket, FaStore, FaShoppingCart, FaShoppingBag, FaTag, 
  FaPercent, FaMoneyBillWave, FaCreditCard, FaTruck, FaBox, FaBoxOpen, 
  FaGift, FaStar, FaHeart,
  
  // Hardware & Tools (Tambour)
  FaTools, FaHammer, FaPaintRoller, FaPaintBrush, FaWrench, FaScrewdriver,
  FaRuler, FaRulerCombined, FaHardHat, FaLightbulb, FaPlug, FaBolt,
  FaFaucet, FaToilet, FaShower, FaBath, FaCouch, FaChair, FaBed, FaDoorOpen,
  
  // Games & Toys
  FaDice, FaGamepad, FaChess, FaChessKnight, FaPuzzlePiece, FaFootballBall,
  FaBasketballBall, FaVolleyballBall, FaTableTennis, FaBiking, FaRunning,
  
  // Office & School
  FaPen, FaPencilAlt, FaBook, FaBookOpen, FaGraduationCap, FaClipboard,
  FaCalculator, FaPaperclip, FaStamp, FaPrint,
  
  // Electronics
  FaMobile, FaLaptop, FaDesktop, FaHeadphones, FaCamera, FaVideo,
  FaTv, FaKeyboard, FaMouse, FaMicrophone, FaVolumeUp, FaBatteryFull,
  
  // Clothing & Accessories
  FaTshirt, FaSocks, FaGem, FaGlasses, FaHatWizard, FaMitten, FaUmbrella,
  FaRing,
  
  // Home & Garden
  FaHome, FaTree, FaSprayCan, FaBroom, FaTrash, FaRecycle, FaWind, FaFan,
  FaTemperatureLow, FaTemperatureHigh,
  
  // Beauty & Personal Care
  FaCut, FaHandSparkles, FaHandsWash, FaPumpSoap, 
  FaSpa, FaHospital, FaMedkit, FaPills, FaFirstAid, FaBaby
} from 'react-icons/fa'

function Admin() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProductsState] = useState([])
  const [categories, setCategoriesState] = useState([])
  const [orders, setOrdersState] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    imagePublicId: '', // Store Cloudinary public ID for deletion
    iconName: 'FaUtensils', // Default icon
    showIcon: true // Default to showing icon
  })
  const [imagePreview, setImagePreview] = useState('')
  const [orderSort, setOrderSort] = useState({ field: 'id', direction: 'desc' })
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [firebaseError, setFirebaseError] = useState(null)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [iconSearchQuery, setIconSearchQuery] = useState('')
  
  // Available icons for categories - simplified list with reliable icons
  const availableIcons = [
    // Food & Beverage
    { name: 'FaUtensils', component: <FaUtensils /> },
    { name: 'FaBreadSlice', component: <FaBreadSlice /> },
    { name: 'FaCarrot', component: <FaCarrot /> },
    { name: 'FaWineGlass', component: <FaWineGlass /> },
    { name: 'FaCoffee', component: <FaCoffee /> },
    { name: 'FaAppleAlt', component: <FaAppleAlt /> },
    { name: 'FaFish', component: <FaFish /> },
    { name: 'FaIceCream', component: <FaIceCream /> },
    { name: 'FaEgg', component: <FaEgg /> },
    { name: 'FaCheese', component: <FaCheese /> },
    { name: 'FaPizzaSlice', component: <FaPizzaSlice /> },
    { name: 'FaHamburger', component: <FaHamburger /> },
    { name: 'FaCandyCane', component: <FaCandyCane /> },
    { name: 'FaCookie', component: <FaCookie /> },
    { name: 'FaWineBottle', component: <FaWineBottle /> },
    { name: 'FaGlassMartini', component: <FaGlassMartini /> },
    { name: 'FaLemon', component: <FaLemon /> },
    { name: 'FaPepperHot', component: <FaPepperHot /> },
    { name: 'FaDrumstickBite', component: <FaDrumstickBite /> },
    { name: 'FaBacon', component: <FaBacon /> },
    { name: 'FaHotdog', component: <FaHotdog /> },
    { name: 'FaMugHot', component: <FaMugHot /> },
    { name: 'FaGlassWhiskey', component: <FaGlassWhiskey /> },
    { name: 'FaWater', component: <FaWater /> },
    
    // Hardware & Tools (Tambour)
    { name: 'FaTools', component: <FaTools /> },
    { name: 'FaHammer', component: <FaHammer /> },
    { name: 'FaPaintRoller', component: <FaPaintRoller /> },
    { name: 'FaPaintBrush', component: <FaPaintBrush /> },
    { name: 'FaWrench', component: <FaWrench /> },
    { name: 'FaScrewdriver', component: <FaScrewdriver /> },
    { name: 'FaRuler', component: <FaRuler /> },
    { name: 'FaRulerCombined', component: <FaRulerCombined /> },
    { name: 'FaHardHat', component: <FaHardHat /> },
    { name: 'FaLightbulb', component: <FaLightbulb /> },
    { name: 'FaPlug', component: <FaPlug /> },
    { name: 'FaBolt', component: <FaBolt /> },
    { name: 'FaFaucet', component: <FaFaucet /> },
    { name: 'FaToilet', component: <FaToilet /> },
    { name: 'FaShower', component: <FaShower /> },
    { name: 'FaBath', component: <FaBath /> },
    
    // Home & Furniture
    { name: 'FaCouch', component: <FaCouch /> },
    { name: 'FaChair', component: <FaChair /> },
    { name: 'FaBed', component: <FaBed /> },
    { name: 'FaDoorOpen', component: <FaDoorOpen /> },
    { name: 'FaHome', component: <FaHome /> },
    { name: 'FaToilet', component: <FaToilet /> },
    { name: 'FaBath', component: <FaBath /> },
    { name: 'FaShower', component: <FaShower /> },
    
    // Games & Toys
    { name: 'FaDice', component: <FaDice /> },
    { name: 'FaGamepad', component: <FaGamepad /> },
    { name: 'FaChess', component: <FaChess /> },
    { name: 'FaChessKnight', component: <FaChessKnight /> },
    { name: 'FaPuzzlePiece', component: <FaPuzzlePiece /> },
    { name: 'FaFootballBall', component: <FaFootballBall /> },
    { name: 'FaBasketballBall', component: <FaBasketballBall /> },
    { name: 'FaVolleyballBall', component: <FaVolleyballBall /> },
    { name: 'FaTableTennis', component: <FaTableTennis /> },
    { name: 'FaBiking', component: <FaBiking /> },
    { name: 'FaRunning', component: <FaRunning /> },
    
    // Office & School
    { name: 'FaPen', component: <FaPen /> },
    { name: 'FaPencilAlt', component: <FaPencilAlt /> },
    { name: 'FaBook', component: <FaBook /> },
    { name: 'FaBookOpen', component: <FaBookOpen /> },
    { name: 'FaGraduationCap', component: <FaGraduationCap /> },
    { name: 'FaClipboard', component: <FaClipboard /> },
    { name: 'FaCalculator', component: <FaCalculator /> },
    { name: 'FaPaperclip', component: <FaPaperclip /> },
    { name: 'FaStamp', component: <FaStamp /> },
    { name: 'FaPrint', component: <FaPrint /> },
    
    // Electronics
    { name: 'FaMobile', component: <FaMobile /> },
    { name: 'FaLaptop', component: <FaLaptop /> },
    { name: 'FaDesktop', component: <FaDesktop /> },
    { name: 'FaHeadphones', component: <FaHeadphones /> },
    { name: 'FaCamera', component: <FaCamera /> },
    { name: 'FaVideo', component: <FaVideo /> },
    { name: 'FaTv', component: <FaTv /> },
    { name: 'FaKeyboard', component: <FaKeyboard /> },
    { name: 'FaMouse', component: <FaMouse /> },
    { name: 'FaMicrophone', component: <FaMicrophone /> },
    { name: 'FaVolumeUp', component: <FaVolumeUp /> },
    { name: 'FaBatteryFull', component: <FaBatteryFull /> },
    
    // Clothing & Accessories
    { name: 'FaTshirt', component: <FaTshirt /> },
    { name: 'FaSocks', component: <FaSocks /> },
    { name: 'FaGem', component: <FaGem /> },
    { name: 'FaGlasses', component: <FaGlasses /> },
    { name: 'FaHatWizard', component: <FaHatWizard /> },
    { name: 'FaMitten', component: <FaMitten /> },
    { name: 'FaUmbrella', component: <FaUmbrella /> },
    { name: 'FaRing', component: <FaRing /> },
    
    // Beauty & Personal Care
    { name: 'FaCut', component: <FaCut /> },
    { name: 'FaSprayCan', component: <FaSprayCan /> },
    { name: 'FaHandSparkles', component: <FaHandSparkles /> },
    { name: 'FaHandsWash', component: <FaHandsWash /> },
    { name: 'FaPumpSoap', component: <FaPumpSoap /> },
    { name: 'FaSpa', component: <FaSpa /> },
    
    // Health & Medicine
    { name: 'FaHospital', component: <FaHospital /> },
    { name: 'FaMedkit', component: <FaMedkit /> },
    { name: 'FaPills', component: <FaPills /> },
    { name: 'FaFirstAid', component: <FaFirstAid /> },
    { name: 'FaBaby', component: <FaBaby /> },
    
    // Garden & Outdoor
    { name: 'FaHome', component: <FaHome /> },
    { name: 'FaTree', component: <FaTree /> },
    { name: 'FaLeaf', component: <FaLeaf /> },
    { name: 'FaSeedling', component: <FaSeedling /> },
    { name: 'FaSprayCan', component: <FaSprayCan /> },
    { name: 'FaBroom', component: <FaBroom /> },
    { name: 'FaTrash', component: <FaTrash /> },
    { name: 'FaRecycle', component: <FaRecycle /> },
    { name: 'FaWind', component: <FaWind /> },
    { name: 'FaFan', component: <FaFan /> },
    { name: 'FaTemperatureLow', component: <FaTemperatureLow /> },
    { name: 'FaTemperatureHigh', component: <FaTemperatureHigh /> },
    
    // Shopping & Store
    { name: 'FaShoppingBasket', component: <FaShoppingBasket /> },
    { name: 'FaStore', component: <FaStore /> },
    { name: 'FaShoppingCart', component: <FaShoppingCart /> },
    { name: 'FaShoppingBag', component: <FaShoppingBag /> },
    { name: 'FaTag', component: <FaTag /> },
    { name: 'FaPercent', component: <FaPercent /> },
    { name: 'FaMoneyBillWave', component: <FaMoneyBillWave /> },
    { name: 'FaCreditCard', component: <FaCreditCard /> },
    { name: 'FaTruck', component: <FaTruck /> },
    { name: 'FaBox', component: <FaBox /> },
    { name: 'FaBoxOpen', component: <FaBoxOpen /> },
    { name: 'FaGift', component: <FaGift /> },
    { name: 'FaStar', component: <FaStar /> },
    { name: 'FaHeart', component: <FaHeart /> }
  ]

  useEffect(() => {
    loadData()
    
    // Set up real-time listener for orders
    console.log("Setting up Firebase listener in Admin component");
    let unsubscribe = null;
    
    try {
      unsubscribe = listenToOrders((updatedOrders) => {
        console.log("Received orders update in Admin component:", updatedOrders);
        if (updatedOrders && updatedOrders.length > 0) {
          setOrdersState(updatedOrders);
          // Also update localStorage for compatibility
          setOrders(updatedOrders);
          // Clear any previous Firebase error
          setFirebaseError(null);
        }
      });
    } catch (error) {
      console.error("Error setting up Firebase listener:", error);
      setFirebaseError("Failed to connect to the orders database. Please check your internet connection and Firebase configuration.");
    }
    
    // Clean up listener on component unmount
    return () => {
      console.log("Cleaning up Firebase listener");
      if (unsubscribe) unsubscribe();
    }
  }, []);

  const loadData = async () => {
    setProductsState(getProducts());
    setCategoriesState(getCategories());
    
    // Try to get orders from Firebase first
    try {
      console.log("Attempting to load orders from Firebase");
      const firebaseOrders = await getOrdersOnce();
      console.log("Orders from Firebase:", firebaseOrders);
      
      if (firebaseOrders && firebaseOrders.length > 0) {
        setOrdersState(firebaseOrders);
        // Also update localStorage for compatibility
        setOrders(firebaseOrders);
        // Clear any previous Firebase error
        setFirebaseError(null);
      } else {
        // Fall back to localStorage if no orders in Firebase
        console.log("No orders in Firebase, falling back to localStorage");
        const localOrders = getOrders();
        setOrdersState(localOrders);
      }
    } catch (error) {
      console.error("Error loading orders from Firebase:", error);
      setFirebaseError("Failed to load orders from the database. Please check your internet connection and Firebase configuration.");
      // Fall back to localStorage on error
      const localOrders = getOrders();
      setOrdersState(localOrders);
    }
  }

  // Order status management
  const handleOrderStatusChange = (orderId, newStatus, firebaseKey) => {
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    
    // Update in Firebase (real-time)
    updateOrderStatus(orderId, newStatus, firebaseKey)
      .then(() => {
        console.log(`Order ${orderId} status updated to ${newStatus} in Firebase`);
        // Clear any previous Firebase error
        setFirebaseError(null);
      })
      .catch(error => {
        console.error("Error updating order status in Firebase:", error);
        setFirebaseError("Failed to update order status in the database. The change was applied locally only.");
      });
    
    // Also update local state for immediate UI feedback
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrdersState(updatedOrders);
    setOrders(updatedOrders); // Update localStorage for compatibility
  }

  // Sorting functionality
  const handleOrderSort = (field) => {
    const newDirection = orderSort.field === field && orderSort.direction === 'asc' ? 'desc' : 'asc'
    setOrderSort({ field, direction: newDirection })
  }

  // Handle order deletion
  const handleDeleteOrder = async (orderId, firebaseKey) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
      try {
        await deleteOrder(firebaseKey);
        // Update local state for immediate UI feedback
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrdersState(updatedOrders);
        setOrders(updatedOrders); // Update localStorage for compatibility
        setFirebaseError(null);
      } catch (error) {
        console.error("Error deleting order:", error);
        setFirebaseError("שגיאה במחיקת ההזמנה. ההזמנה נמחקה מהתצוגה המקומית בלבד.");
        // Still update local state even if Firebase fails
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrdersState(updatedOrders);
        setOrders(updatedOrders);
      }
    }
  };

  const getSortedOrders = () => {
    // First filter by search query if it exists
    let filteredOrders = orders;
    
    if (orderSearchQuery.trim()) {
      filteredOrders = orders.filter(order => 
        order.id.toString().includes(orderSearchQuery.trim())
      );
    }
    
    // Then filter by status
    if (orderStatusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === orderStatusFilter);
    }
    
    // Then sort
    return [...filteredOrders].sort((a, b) => {
      let comparison = 0
      
      if (orderSort.field === 'id') {
        comparison = parseInt(a.id) - parseInt(b.id)
      } else if (orderSort.field === 'date') {
        comparison = new Date(a.deliveryDate) - new Date(b.deliveryDate)
      } else if (orderSort.field === 'total') {
        comparison = parseFloat(a.total) - parseFloat(b.total)
      } else if (orderSort.field === 'name') {
        comparison = a.name.localeCompare(b.name)
      }
      
      return orderSort.direction === 'asc' ? comparison : -comparison
    })
  }

  // Calculate summary statistics
  const calculateSummary = () => {
    // Check if orders is undefined or null
    if (!orders || !Array.isArray(orders)) {
      return {
        totalOrders: 0,
        totalIncome: 0,
        completedOrders: 0,
        inProcessOrders: 0,
        newOrders: 0,
        topProducts: []
      }
    }
    
    const totalOrders = orders.length
    
    // Safely calculate total income
    const totalIncome = orders.reduce((sum, order) => {
      if (!order || !order.total) return sum;
      const orderTotal = parseFloat(order.total) || 0;
      return sum + orderTotal;
    }, 0)
    
    // Safely count orders by status
    const completedOrders = orders.filter(order => order && order.status === 'הושלם').length
    const inProcessOrders = orders.filter(order => order && order.status === 'בתהליך').length
    const newOrders = orders.filter(order => order && order.status === 'חדש').length
    
    const productSales = {}
    
    // Safely process order items
    orders.forEach(order => {
      // Skip if order is undefined or null
      if (!order) return;
      
      // Check if order.items exists and is an array before using forEach
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          // Skip if item is undefined or null
          if (!item) return;
          
          const itemId = item.id || 'unknown';
          if (!productSales[itemId]) {
            productSales[itemId] = { 
              name: item.name || 'Unknown Product', 
              quantity: 0, 
              total: 0 
            }
          }
          productSales[itemId].quantity += item.quantity || 0;
          productSales[itemId].total += Math.round((item.price || 0) * (item.quantity || 0));
        });
      }
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
    
    return {
      totalOrders,
      totalIncome,
      completedOrders,
      inProcessOrders,
      newOrders,
      topProducts
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create a new product object
      let newProduct = {
        id: editingProduct?.id || Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price)
      }
      
      const updatedProducts = editingProduct
        ? products.map(p => p.id === editingProduct.id ? newProduct : p)
        : [...products, newProduct]

      setProducts(updatedProducts)
      setProductsState(updatedProducts)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        categoryId: '',
        imagePublicId: ''
      })
      setImagePreview('')
    } catch (error) {
      console.error("Error submitting product:", error)
      alert("שגיאה בשמירת המוצר. אנא נסה שנית.")
    }
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    const newCategory = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      iconName: formData.iconName || 'FaUtensils', // Add icon name to category
      showIcon: formData.showIcon // Add showIcon field
    }

    const updatedCategories = editingCategory
      ? categories.map(c => c.id === editingCategory.id ? newCategory : c)
      : [...categories, newCategory]

    setCategories(updatedCategories)
    setCategoriesState(updatedCategories)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
      imagePublicId: '',
      iconName: 'FaUtensils', // Reset to default icon
      showIcon: true // Reset to showing icon
    })
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      setProductsState(updatedProducts)
    }
  }

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
      const updatedCategories = categories.filter(c => c.id !== categoryId)
      setCategories(updatedCategories)
      setCategoriesState(updatedCategories)
    }
  }

  const handleEditProduct = (product) => {
    // Extract public ID from Cloudinary URL if it exists
    const imagePublicId = product.image && product.image.includes('cloudinary.com') 
      ? getPublicIdFromUrl(product.image)
      : '';
      
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId,
      imagePublicId: imagePublicId,
      showIcon: true
    })
    setImagePreview(product.image)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setActiveTab('categories')
    setFormData({
      name: category.name,
      description: category.description,
      price: '',
      image: '',
      categoryId: '',
      imagePublicId: '',
      iconName: category.iconName || 'FaUtensils', // Set icon name from category
      showIcon: category.showIcon !== undefined ? category.showIcon : true // Set showIcon from category or default to true
    })
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData({ ...formData, image: url, imagePublicId: '' })
    setImagePreview(url)
  }

  const handleCloudinaryUpload = () => {
    openUploadWidget((imageInfo) => {
      const imageUrl = imageInfo.secure_url;
      const publicId = imageInfo.public_id;
      
      setFormData({
        ...formData,
        image: imageUrl,
        imagePublicId: publicId
      });
      setImagePreview(imageUrl);
    });
  }

  // Filter icons based on search query
  const filteredIcons = iconSearchQuery
    ? availableIcons.filter(icon => 
        icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()))
    : availableIcons

  // Get summary data only when needed
  const summary = activeTab === 'orders' ? calculateSummary() : null

  const resetForm = () => {
    setEditingProduct(null)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
      imagePublicId: '',
      iconName: 'FaUtensils', // Reset to default icon
      showIcon: true // Reset to showing icon
    })
    setImagePreview('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">לוח בקרה</h2>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white">
            <div className="text-sm opacity-80">היום</div>
            <div className="font-medium">{new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Firebase Error Message */}
      {firebaseError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">שגיאת התחברות: </strong>
          <span className="block sm:inline">{firebaseError}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setFirebaseError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            מוצרים
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            קטגוריות
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            הזמנות
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-5 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
              activeTab === 'summary'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            סיכום
          </button>
        </nav>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם המוצר
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מחיר
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תמונה
                </label>
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      type="button"
                      onClick={handleCloudinaryUpload}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      העלה תמונה
                    </button>
                    <span className="text-sm text-gray-500 my-auto">או</span>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={handleImageUrlChange}
                      className="input-field flex-1"
                      placeholder="הזן URL של תמונה"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="תצוגה מקדימה" 
                        className="h-24 w-24 object-cover rounded-md border border-gray-300" 
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קטגוריה
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  className="input-field"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4 space-x-reverse">
              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  ביטול
                </button>
              )}
              <button 
                type="submit" 
                className="btn-primary"
              >
                {editingProduct ? 'עדכן מוצר' : 'הוסף מוצר'}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שם
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    מחיר
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    קטגוריה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₪{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categories.find(c => c.id === product.categoryId)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 ml-4"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-8">
          <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם הקטגוריה
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
            </div>
            
            {/* Icon Selector Button */}
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  אייקון לקטגוריה
                </label>
                <div className="mr-4 flex items-center">
                  <input
                    type="checkbox"
                    id="showIcon"
                    checked={formData.showIcon}
                    onChange={(e) => setFormData({ ...formData, showIcon: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="showIcon" className="mr-2 block text-sm text-gray-700">
                    הצג אייקון
                  </label>
                </div>
              </div>
              
              {formData.showIcon && (
                <div className="flex items-center">
                  <div className="text-2xl mr-3 p-3 bg-gray-100 rounded-lg flex items-center justify-center min-w-[48px] min-h-[48px]">
                    {availableIcons.find(icon => icon.name === formData.iconName)?.component}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIconSelector(true)}
                    className="bg-blue-50 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    בחר אייקון
                  </button>
                </div>
              )}
            </div>
            
            {/* Icon Selector Popup */}
            {showIconSelector && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">בחר אייקון לקטגוריה</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowIconSelector(false);
                        setIconSearchQuery('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Search input */}
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="חפש אייקון..."
                        value={iconSearchQuery}
                        onChange={(e) => setIconSearchQuery(e.target.value)}
                        className="input-field pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {filteredIcons.map((icon) => (
                      <div
                        key={icon.name}
                        onClick={() => {
                          setFormData({ ...formData, iconName: icon.name });
                          setShowIconSelector(false);
                          setIconSearchQuery('');
                        }}
                        className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                          formData.iconName === icon.name
                            ? 'bg-blue-100 text-blue-600 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        } min-w-[48px] min-h-[48px]`}
                      >
                        <div className="text-2xl flex items-center justify-center">
                          {icon.component}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredIcons.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      לא נמצאו אייקונים התואמים לחיפוש
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end space-x-4 space-x-reverse">
              {editingCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  ביטול
                </button>
              )}
              <button type="submit" className="btn-primary">
                {editingCategory ? 'עדכן קטגוריה' : 'הוסף קטגוריה'}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שם
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תיאור
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    אייקון
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    הצגת אייקון
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xl text-gray-700 flex justify-center">
                        {availableIcons.find(icon => icon.name === (category.iconName || 'FaUtensils'))?.component || 
                         availableIcons.find(icon => icon.name === 'FaUtensils')?.component}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500">
                        {category.showIcon === false ? 'לא' : 'כן'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900 ml-4"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="חיפוש לפי מספר הזמנה"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="border rounded-md px-4 py-2 text-sm w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {orderSearchQuery && (
                  <button 
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <select 
                value={orderStatusFilter} 
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="חדש">חדש</option>
                <option value="בתהליך">בתהליך</option>
                <option value="הושלם">הושלם</option>
              </select>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={() => loadData()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              רענן נתונים
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrderSort('id')}
                  >
                    מספר הזמנה
                    {orderSort.field === 'id' && (
                      <span className="mr-1">{orderSort.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrderSort('name')}
                  >
                    לקוח
                    {orderSort.field === 'name' && (
                      <span className="mr-1">{orderSort.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrderSort('date')}
                  >
                    תאריך משלוח
                    {orderSort.field === 'date' && (
                      <span className="mr-1">{orderSort.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleOrderSort('total')}
                  >
                    סכום
                    {orderSort.field === 'total' && (
                      <span className="mr-1">{orderSort.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedOrders().length > 0 ? (
                  getSortedOrders().map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.name}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.deliveryDate).toLocaleDateString('he-IL')}
                        <br />
                        {order.deliveryTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₪{Math.round(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value, order.firebaseKey)}
                          className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'חדש' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.status === 'בתהליך' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="חדש">חדש</option>
                          <option value="בתהליך">בתהליך</option>
                          <option value="הושלם">הושלם</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.firebaseKey)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="מחק הזמנה"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      {orderSearchQuery ? 'לא נמצאו הזמנות התואמות את החיפוש' : 'אין הזמנות להצגה'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Orders Summary Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-blue-100 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-indigo-800">סיכום הזמנות</h3>
                <div className="p-2 bg-white bg-opacity-80 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">סה"כ הזמנות:</span>
                  <span className="text-xl font-bold text-indigo-800">{summary?.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">הזמנות חדשות:</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-green-600">{summary?.newOrders || 0}</span>
                    {summary?.newOrders > 0 && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">חדש</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">הזמנות בתהליך:</span>
                  <span className="text-lg font-bold text-yellow-600">{summary?.inProcessOrders || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">הזמנות שהושלמו:</span>
                  <span className="text-lg font-bold text-blue-600">{summary?.completedOrders || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Financial Summary Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-xl shadow-lg border border-emerald-100 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-teal-800">סיכום כספי</h3>
                <div className="p-2 bg-white bg-opacity-80 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">סה"כ הכנסות:</span>
                  <span className="text-xl font-bold text-teal-800">₪{Math.round(summary?.totalIncome || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">ממוצע להזמנה:</span>
                  <span className="text-lg font-bold text-teal-700">
                    ₪{summary?.totalOrders > 0 
                      ? Math.round(summary?.totalIncome / summary?.totalOrders) 
                      : '0'}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-teal-200">
                  <div className="text-center">
                    <span className="text-sm text-teal-700">הכנסה חודשית משוערת</span>
                    <div className="text-2xl font-bold text-teal-800 mt-1">
                      ₪{Math.round(summary?.totalIncome / (summary?.totalOrders ? summary?.totalOrders : 1) * 30)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics Card */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-100 p-6 rounded-xl shadow-lg border border-purple-100 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-800">סטטיסטיקה</h3>
                <div className="p-2 bg-white bg-opacity-80 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">מספר מוצרים:</span>
                  <span className="text-xl font-bold text-purple-800">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">מספר קטגוריות:</span>
                  <span className="text-xl font-bold text-purple-800">{categories.length}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">יחס מוצרים לקטגוריה:</span>
                    <span className="text-lg font-bold text-purple-700">
                      {categories.length > 0 
                        ? (products.length / categories.length).toFixed(1) 
                        : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Products Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">מוצרים מובילים</h3>
              <div className="text-sm text-gray-500">5 המוצרים הנמכרים ביותר</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                      שם המוצר
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      כמות שנמכרה
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                      סה"כ הכנסות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(summary?.topProducts || []).map((product, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">{index + 1}</span>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{product?.name || 'Unknown Product'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{product?.quantity || 0}</div>
                        <div className="text-xs text-gray-500">יחידות</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-emerald-600">₪{product?.total || 0}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin 