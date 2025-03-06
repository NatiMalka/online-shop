import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { getCart } from '../utils/storage'

function Navbar({ isAdmin, setIsAdmin }) {
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    // Update cart count on initial load
    updateCartCount()

    // Set up event listener for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  const handleStorageChange = (e) => {
    if (e.key === 'store_cart') {
      updateCartCount()
    }
  }

  const updateCartCount = () => {
    const cartItems = getCart()
    const count = cartItems.reduce((total, item) => total + item.quantity, 0)
    setCartItemsCount(count)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/" className="text-xl font-bold text-gray-800">
              חנות אונליין
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              מוצרים
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isAdmin ? 'יציאה ממצב מנהל' : 'מצב מנהל'}
            </button>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                לוח בקרה
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 