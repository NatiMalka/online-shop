import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, setOrders, clearCart } from '../utils/storage'
import { saveOrder, getOrdersOnce } from '../utils/firebase'
import emailjs from '@emailjs/browser'
import { useToast } from '../context/ToastContext'

// Function to get the next order number
const getNextOrderNumber = async () => {
  // Get the current highest order number from localStorage
  const localOrders = JSON.parse(localStorage.getItem('store_orders') || '[]')
  
  // Get orders from Firebase
  let firebaseOrders = []
  try {
    // Import the getOrdersOnce function if not already imported
    const { getOrdersOnce } = await import('../utils/firebase')
    firebaseOrders = await getOrdersOnce()
  } catch (error) {
    console.error("Error fetching orders from Firebase:", error)
  }
  
  // Combine orders from both sources
  const allOrders = [...localOrders, ...firebaseOrders]
  
  // Find the highest order number
  let highestNumber = 0
  allOrders.forEach(order => {
    // Extract the number from the order ID (format: "ORDER-123")
    const match = order.id && order.id.match(/ORDER-(\d+)/)
    if (match && match[1]) {
      const orderNum = parseInt(match[1], 10)
      if (orderNum > highestNumber) {
        highestNumber = orderNum
      }
    }
  })
  
  // Return the next order number
  return highestNumber + 1
}

function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    deliveryDate: '',
    deliveryTime: '',
    notes: ''
  })

  useEffect(() => {
    const items = getCart()
    if (items.length === 0) {
      navigate('/cart')
      return
    }
    setCartItems(items)
    setTotal(items.reduce((acc, item) => acc + item.price * item.quantity, 0))
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Get the next order number
      const orderNumber = await getNextOrderNumber()
      console.log("Generated order number:", orderNumber);
      
      // Create order object with readable ID
      const order = {
        id: `ORDER-${orderNumber}`,
        items: cartItems,
        total,
        ...formData,
        status: 'חדש', // Set initial status to 'חדש' (new)
        createdAt: new Date().toISOString()
      }
      console.log("Created order with ID:", order.id);

      console.log("Submitting order:", order);
      
      // Save order to Firebase (for real-time updates)
      console.log("Saving order to Firebase...");
      await saveOrder(order)
      console.log("Order saved to Firebase successfully");
      
      // Also save to localStorage for compatibility
      console.log("Saving order to localStorage...");
      const orders = JSON.parse(localStorage.getItem('store_orders') || '[]')
      orders.push(order)
      setOrders(orders)
      console.log("Order saved to localStorage successfully");

      // Format items for email
      const formattedItems = order.items.map(item => 
        `${item.name} x${item.quantity} - ₪${item.price * item.quantity}`
      ).join('\n')

      // Round the total amount to avoid decimal issues
      const roundedTotal = Math.round(order.total);

      // Common email data
      const emailData = {
        order_id: order.id,
        customer_name: order.name,
        customer_email: order.email,
        customer_phone: order.phone,
        delivery_address: `${order.address}, ${order.city}`,
        delivery_date: new Date(order.deliveryDate).toLocaleDateString('he-IL'),
        delivery_time: order.deliveryTime,
        items: formattedItems,
        total: `₪${roundedTotal}`, // Use the rounded total
        notes: order.notes || 'אין הערות'
      }

      // Send email to store owner
      console.log("Sending email to store owner...");
      await emailjs.send(
        'service_scvfp6q',
        'template_jqnqrmr',
        {
          to_email: 'netamal3134@gmail.com',
          subject: `הזמנה חדשה ${order.id}`,
          ...emailData
        },
        'wdkhxkDvY1CBqWjhm'
      )
      console.log("Email sent to store owner successfully");

      // Send confirmation email to customer
      console.log("Sending confirmation email to customer...");
      const customerTemplateParams = {
        to_name: formData.name,
        to_email: formData.email,
        reply_to: 'netamal3134@gmail.com',
        from_name: "החנות האונליין",
        customer_email: formData.email,
        customer_name: formData.name,
        subject: `אישור הזמנה ${order.id}`,
        order_id: order.id,
        delivery_date: new Date(order.deliveryDate).toLocaleDateString('he-IL'),
        delivery_time: order.deliveryTime,
        delivery_address: `${order.address}, ${order.city}`,
        items: formattedItems,
        total: `₪${roundedTotal}`, // Use the rounded total
        notes: order.notes || 'אין הערות'
      };
      
      await emailjs.send(
        'service_scvfp6q',
        'template_9gyc9gb',
        customerTemplateParams,
        'wdkhxkDvY1CBqWjhm'
      )
      console.log("Confirmation email sent to customer successfully");

      // Clear cart and redirect to success page
      console.log("Clearing cart and redirecting to success page...");
      clearCart()
      navigate('/order-success', { state: { orderId: order.id } })
    } catch (error) {
      console.error('Error processing order:', error)
      showToast('אירעה שגיאה בעיבוד ההזמנה. אנא נסה שוב מאוחר יותר.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">השלמת הזמנה</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">פרטים אישיים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם מלא
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                אימייל
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טלפון
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">פרטי משלוח</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כתובת מלאה
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                עיר
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך משלוח
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שעת משלוח
                </label>
                <select
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">בחר שעה</option>
                  <option value="09:00-12:00">09:00-12:00</option>
                  <option value="12:00-15:00">12:00-15:00</option>
                  <option value="15:00-18:00">15:00-18:00</option>
                  <option value="18:00-21:00">18:00-21:00</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">סיכום הזמנה</h3>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>₪{Math.round(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>סה"כ לתשלום</span>
                <span>₪{Math.round(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">הערות נוספות</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="input-field"
            placeholder="הוסף הערות או הנחיות מיוחדות למשלוח..."
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'מעבד הזמנה...' : 'אשר הזמנה'}
        </button>
      </form>
    </div>
  )
}

export default Checkout 