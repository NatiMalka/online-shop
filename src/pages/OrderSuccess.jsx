import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCart } from '../utils/storage'

function OrderSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = location.state?.orderId

  useEffect(() => {
    // If someone tries to access this page directly without placing an order
    // redirect them to the home page
    const cart = getCart()
    if (cart.length > 0) {
      navigate('/cart')
    }
  }, [navigate])

  return (
    <div className="text-center py-16">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          תודה על ההזמנה!
        </h2>
        
        {orderId && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 font-medium">מספר הזמנה: {orderId}</p>
          </div>
        )}
        
        <p className="text-gray-600 mb-8">
          ההזמנה שלך התקבלה בהצלחה. נשלח לך אימייל עם פרטי ההזמנה.
          המשלוח יגיע בתאריך ובשעה שבחרת. התשלום יתבצע במזומן בעת המסירה.
        </p>
        
        <div className="space-y-4">
          <Link to="/products" className="btn-primary block">
            המשך לקנייה
          </Link>
          <Link to="/" className="btn-secondary block">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess 