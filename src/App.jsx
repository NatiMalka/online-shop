import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Admin from './pages/Admin'
import { ToastProvider } from './context/ToastContext'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/admin" element={isAdmin ? <Admin /> : <Home />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  )
}

export default App 