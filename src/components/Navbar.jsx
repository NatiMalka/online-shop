import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { getCart } from '../utils/storage'

function Navbar({ isAdmin, setIsAdmin }) {
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6 space-x-reverse">
            <Link to="/" className="text-2xl font-bold text-white transition-transform hover:scale-105">
              חנות אונליין
            </Link>
            <div className="h-6 w-px bg-blue-300 mx-2"></div>
            <Link to="/products" className="text-white hover:text-blue-100 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10">
              מוצרים
            </Link>
            <Link to="/cart" className="text-white hover:text-blue-100 relative group">
              <div className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200">
                <ShoppingCartIcon className="h-6 w-6" />
              </div>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={handleAdminClick}
              className="text-sm text-white hover:text-blue-100 font-medium px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
            >
              {isAdmin ? 'יציאה ממצב מנהל' : 'מצב מנהל'}
            </button>
            {isAdmin && (
              <Link to="/admin" className="text-sm bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors duration-200 font-medium">
                לוח בקרה
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-md text-right border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">כניסה למצב מנהל</h2>
            <div className="mb-4">
              <label htmlFor="adminPassword" className="block text-gray-700 mb-2 font-medium">
                סיסמת מנהל:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full p-2 border rounded-md ${passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 pr-10`}
                  placeholder="הזן סיסמת מנהל"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">סיסמה שגויה, נסה שוב</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowAdminModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                ביטול
              </button>
              <button
                onClick={handleAdminLogin}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-colors font-medium"
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