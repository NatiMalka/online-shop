import React, { useState, useEffect } from 'react'
import { getProducts, setProducts, getCategories, setCategories, getOrders } from '../utils/storage'

function Admin() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProductsState] = useState([])
  const [categories, setCategoriesState] = useState([])
  const [orders, setOrders] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setProductsState(getProducts())
    setCategoriesState(getCategories())
    setOrders(getOrders())
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  מספר הזמנה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  לקוח
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך משלוח
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סכום
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
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
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Admin 