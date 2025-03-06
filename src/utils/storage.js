const STORAGE_KEYS = {
  PRODUCTS: 'store_products',
  CATEGORIES: 'store_categories',
  CART: 'store_cart',
  ORDERS: 'store_orders'
}

export const getProducts = () => {
  const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  return products ? JSON.parse(products) : []
}

export const setProducts = (products) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
}

export const getCategories = () => {
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  return categories ? JSON.parse(categories) : []
}

export const setCategories = (categories) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
}

export const getCart = () => {
  const cart = localStorage.getItem(STORAGE_KEYS.CART)
  return cart ? JSON.parse(cart) : []
}

export const setCart = (cart) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

export const getOrders = () => {
  const orders = localStorage.getItem(STORAGE_KEYS.ORDERS)
  return orders ? JSON.parse(orders) : []
}

export const setOrders = (orders) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

export const addToCart = (product) => {
  const cart = getCart()
  const existingItem = cart.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  
  setCart(cart)
}

export const removeFromCart = (productId) => {
  const cart = getCart()
  const updatedCart = cart.filter(item => item.id !== productId)
  setCart(updatedCart)
}

export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCart()
  const updatedCart = cart.map(item => 
    item.id === productId ? { ...item, quantity } : item
  )
  setCart(updatedCart)
}

export const clearCart = () => {
  localStorage.removeItem(STORAGE_KEYS.CART)
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated'))
} 