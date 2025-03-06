import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { getCart } from '../utils/storage'

function Navbar({ isAdmin, setIsAdmin }) {
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

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

  const handleAdminClick = () => {
    if (isAdmin) {
      // If already in admin mode, just exit
      setIsAdmin(false)
    } else {
      // If not in admin mode, show the password modal
      setShowAdminModal(true)
      setAdminPassword('')
      setPasswordError(false)
    }
  }

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
      setShowAdminModal(false)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
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
              onClick={handleAdminClick}
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

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md text-right">
            <h2 className="text-xl font-bold mb-4">כניסה למצב מנהל</h2>
            <div className="mb-4">
              <label htmlFor="adminPassword" className="block text-gray-700 mb-2">
                סיסמת מנהל:
              </label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full p-2 border rounded ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="הזן סיסמת מנהל"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">סיסמה שגויה, נסה שוב</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowAdminModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                ביטול
              </button>
              <button
                onClick={handleAdminLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                כניסה
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 