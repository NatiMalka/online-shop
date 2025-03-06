import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCart, removeFromCart, updateCartItemQuantity } from '../utils/storage'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const items = getCart()
    setCartItems(items)
    calculateTotal(items)
  }, [])

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setTotal(sum)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return
    updateCartItemQuantity(productId, newQuantity)
    const updatedItems = getCart()
    setCartItems(updatedItems)
    calculateTotal(updatedItems)
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
    const updatedItems = getCart()
    setCartItems(updatedItems)
    calculateTotal(updatedItems)
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">הסל שלך ריק</h2>
        <Link to="/products" className="btn-primary">
          המשך לקנייה
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">סל הקניות</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y">
          {cartItems.map(item => (
            <div key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₪{item.price}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="btn-secondary"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="btn-secondary"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  הסר
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">סה"כ:</span>
            <span className="text-xl font-bold">₪{total}</span>
          </div>
          
          <div className="flex justify-end space-x-4 space-x-reverse">
            <Link to="/products" className="btn-secondary">
              המשך לקנייה
            </Link>
            <Link
              to="/checkout"
              className="btn-primary"
            >
              המשך לתשלום
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart 