import React, { useState, useEffect } from 'react'
import { getProducts, setProducts, getCategories, setCategories, getOrders, setOrders } from '../utils/storage'
import { listenToOrders, updateOrderStatus, getOrdersOnce } from '../utils/firebase'

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
    categoryId: ''
  })
  const [orderSort, setOrderSort] = useState({ field: 'id', direction: 'desc' })
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')

  useEffect(() => {
    loadData()
    
    // Set up real-time listener for orders
    console.log("Setting up Firebase listener in Admin component");
    const unsubscribe = listenToOrders((updatedOrders) => {
      console.log("Received orders update in Admin component:", updatedOrders);
      if (updatedOrders && updatedOrders.length > 0) {
        setOrdersState(updatedOrders);
        // Also update localStorage for compatibility
        setOrders(updatedOrders);
      }
    });
    
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
      } else {
        // Fall back to localStorage if no orders in Firebase
        console.log("No orders in Firebase, falling back to localStorage");
        const localOrders = getOrders();
        setOrdersState(localOrders);
      }
    } catch (error) {
      console.error("Error loading orders from Firebase:", error);
      // Fall back to localStorage on error
      const localOrders = getOrders();
      setOrdersState(localOrders);
    }
  }

  // Order status management
  const handleOrderStatusChange = (orderId, newStatus) => {
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    
    // Update in Firebase (real-time)
    updateOrderStatus(orderId, newStatus)
      .then(() => {
        console.log(`Order ${orderId} status updated to ${newStatus} in Firebase`);
      })
      .catch(error => {
        console.error("Error updating order status in Firebase:", error);
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

  const getSortedOrders = () => {
    const filteredOrders = orderStatusFilter === 'all' 
      ? orders 
      : orders.filter(order => order.status === orderStatusFilter)
    
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
    const totalOrders = orders.length
    const totalIncome = orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
    const completedOrders = orders.filter(order => order.status === 'הושלם').length
    const inProcessOrders = orders.filter(order => order.status === 'בתהליך').length
    const newOrders = orders.filter(order => order.status === 'חדש').length
    
    const productSales = {}
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { 
            name: item.name, 
            quantity: 0, 
            total: 0 
          }
        }
        productSales[item.id].quantity += item.quantity
        productSales[item.id].total += item.price * item.quantity
      })
    })
    
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

  const handleProductSubmit = (e) => {
    e.preventDefault()
    const newProduct = {
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
      categoryId: ''
    })
  }

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    const newCategory = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description
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
      categoryId: ''
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
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId
    })
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      price: '',
      image: '',
      categoryId: ''
    })
  }

  // Get summary data
  const summary = calculateSummary()

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">לוח בקרה</h2>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4 space-x-reverse">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 ${
              activeTab === 'products'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            מוצרים
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 ${
              activeTab === 'categories'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            קטגוריות
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            הזמנות
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 ${
              activeTab === 'summary'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
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
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="input-field"
                />
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
                  onClick={() => {
                    setEditingProduct(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      categoryId: ''
                    })
                  }}
                  className="btn-secondary"
                >
                  ביטול
                </button>
              )}
              <button type="submit" className="btn-primary">
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
            <div className="mt-4 flex justify-end space-x-4 space-x-reverse">
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      categoryId: ''
                    })
                  }}
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
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 space-x-reverse">
              <select 
                value={orderStatusFilter} 
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="חדש">חדש</option>
                <option value="בתהליך">בתהליך</option>
                <option value="הושלם">הושלם</option>
              </select>
            </div>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedOrders().map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order.id}
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
                      ₪{order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">סיכום הזמנות</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">סה"כ הזמנות:</span>
                  <span className="font-medium">{summary.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">הזמנות חדשות:</span>
                  <span className="font-medium">{summary.newOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">הזמנות בתהליך:</span>
                  <span className="font-medium">{summary.inProcessOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">הזמנות שהושלמו:</span>
                  <span className="font-medium">{summary.completedOrders}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">סיכום כספי</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">סה"כ הכנסות:</span>
                  <span className="font-medium">₪{summary.totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ממוצע להזמנה:</span>
                  <span className="font-medium">
                    ₪{summary.totalOrders > 0 
                      ? (summary.totalIncome / summary.totalOrders).toFixed(2) 
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">סטטיסטיקה</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">מספר מוצרים:</span>
                  <span className="font-medium">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">מספר קטגוריות:</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">מוצרים מובילים</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    שם המוצר
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    כמות שנמכרה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סה"כ הכנסות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₪{product.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {summary.topProducts.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      אין נתונים זמינים
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin 