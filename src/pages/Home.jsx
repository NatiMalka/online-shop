import React from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories, addToCart } from '../utils/storage'
import { useToast } from '../context/ToastContext'

function Home() {
  const products = getProducts()
  const categories = getCategories()
  const featuredProducts = products.slice(0, 4)
  const { showToast } = useToast()

  const handleAddToCart = (product) => {
    addToCart(product)
    showToast(`${product.name} נוסף לסל הקניות`, 'success')
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ברוכים הבאים לחנות האונליין שלנו
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          מצאו את המוצרים הטובים ביותר במחירים הטובים ביותר
        </p>
        <Link to="/products" className="btn-primary">
          צפה במוצרים
        </Link>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">קטגוריות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">מוצרים מומלצים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
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
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary"
                    >
                      הוסף לסל
                    </button>
                    <Link
                      to={`/products?category=${product.categoryId}`}
                      className="btn-secondary"
                    >
                      צפה בפרטים
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home 