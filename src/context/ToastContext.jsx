import React, { createContext, useState, useContext } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    message: '',
    isVisible: false,
    type: 'success'
  })

  const showToast = (message, type = 'success') => {
    setToast({
      message,
      isVisible: true,
      type
    })
  }

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
    </ToastContext.Provider>
  )
} 