import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories, addToCart } from '../utils/storage'
import { useToast } from '../context/ToastContext'

function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories] = useState(getCategories())
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    let filteredProducts = getProducts()

    // Filter by category
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        product => product.categoryId === selectedCategory
      )
    }

    // Filter by search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        product =>
          product.name.includes(searchQuery) ||
          product.description.includes(searchQuery)
      )
    }

    setProducts(filteredProducts)
  }, [selectedCategory, searchQuery])

  const handleAddToCart = (product) => {
    addToCart(product)
    showToast(`${product.name} נוסף לסל הקניות`, 'success')
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קטגוריה
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">הכל</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חיפוש
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש מוצרים..."
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">₪{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-primary"
                >
                  הוסף לסל
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">לא נמצאו מוצרים</p>
        </div>
      )}
    </div>
  )
}

export default Products 