// ==================== HELPERS ====================
import type { CartItem, Product, User, Order, Review } from '../types'

// ---- DOM Helpers ----
export function el(tag: string, attrs?: Record<string, string>, ...children: (string | HTMLElement)[]): HTMLElement {
  const element = document.createElement(tag)
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'className') element.className = val
      else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), val as unknown as EventListener)
      else element.setAttribute(key, val)
    }
  }
  for (const child of children) {
    if (typeof child === 'string') element.appendChild(document.createTextNode(child))
    else if (child) element.appendChild(child)
  }
  return element
}

export function html(htmlString: string): HTMLElement {
  const template = document.createElement('template')
  template.innerHTML = htmlString.trim()
  return template.content.firstElementChild as HTMLElement
}

export function $(selector: string): HTMLElement | null {
  return document.querySelector(selector)
}

export function $$(selector: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(selector)
}

// ---- Format ----
export function formatPrice(price: number): string {
  return '$' + price.toFixed(2)
}

export function renderStars(rating: number): string {
  let stars = ''
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.floor(rating) || (i - rating < 1) ? '★' : '☆'
  }
  return stars
}

export function getDiscount(price: number, original: number): number {
  return Math.round((1 - price / original) * 100)
}

export function getProductImage(product: Product): string {
  if (product.images?.length && product.images[0].startsWith('http')) return product.images[0]
  return `https://picsum.photos/seed/product${product.id}/300/300`
}

export function getProductInitials(product: Product): string {
  return product.name.split(' ').slice(0, 2).map(w => w[0]).join('')
}

export function getProductColor(product: Product): string {
  const colors = ['#ee4d2d','#3498db','#27ae60','#e74c3c','#9b59b6','#f39c12','#1abc9c','#e67e22']
  return colors[product.id % colors.length]
}

// ---- Storage ----
export function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem('am_cart') || '[]')
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem('am_cart', JSON.stringify(cart))
  updateCartBadge()
}

export function addToCart(productId: number, qty: number = 1, variant: string | null = null): void {
  const cart = getCart()
  const existing = cart.find(item => item.id === productId && item.variant === variant)
  if (existing) existing.qty += qty
  else cart.push({ id: productId, qty, variant })
  saveCart(cart)
  showToast('Added to cart!')
}

export function removeFromCart(productId: number, variant: string | null = null): void {
  saveCart(getCart().filter(item => !(item.id === productId && item.variant === variant)))
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.qty, 0)
}

export function getCartTotal(products: Product[]): number {
  return getCart().reduce((sum, item) => {
    const product = products.find(p => p.id === item.id)
    return sum + (product ? product.price * item.qty : 0)
  }, 0)
}

export function updateCartBadge(): void {
  document.querySelectorAll('.cart-badge').forEach(badge => {
    const count = getCartCount()
    badge.textContent = String(count)
    ;(badge as HTMLElement).style.display = count > 0 ? 'flex' : 'none'
  })
}

// ---- Wishlist ----
export function getWishlist(): number[] {
  return JSON.parse(localStorage.getItem('am_wishlist') || '[]')
}

export function toggleWishlist(productId: number): boolean {
  let list = getWishlist()
  if (list.includes(productId)) {
    list = list.filter(id => id !== productId)
    showToast('Removed from wishlist')
  } else {
    list.push(productId)
    showToast('Added to wishlist!')
  }
  localStorage.setItem('am_wishlist', JSON.stringify(list))
  return list.includes(productId)
}

export function isInWishlist(productId: number): boolean {
  return getWishlist().includes(productId)
}

// ---- Auth ----
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('am_users') || '[]')
}

export function getCurrentUser(): User | null {
  return JSON.parse(localStorage.getItem('am_current_user') || 'null')
}

export function login(email: string, password: string): { success: boolean; user?: User; message?: string } {
  const users = getUsers()
  const user = users.find(u => u.email === email && (u as any).password === password)
  if (user) {
    localStorage.setItem('am_current_user', JSON.stringify(user))
    return { success: true, user }
  }
  return { success: false, message: 'Invalid email or password' }
}

export function register(name: string, email: string, password: string): { success: boolean; user?: User; message?: string } {
  const users = getUsers()
  if (users.find(u => u.email === email)) return { success: false, message: 'Email already registered' }
  const user = { id: String(Date.now()), name, email, role: 'user' as const, joinDate: new Date().toISOString(), password } as any
  users.push(user)
  localStorage.setItem('am_users', JSON.stringify(users))
  localStorage.setItem('am_current_user', JSON.stringify(user))
  return { success: true, user }
}

export function logout(): void {
  localStorage.removeItem('am_current_user')
  window.location.href = '/'
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return !!user && (user.role === 'admin' || user.email === 'admin@alliancemall.com')
}

// ---- Orders ----
export function getOrders(): Order[] {
  return JSON.parse(localStorage.getItem('am_orders') || '[]')
}

export function saveOrder(order: Order): void {
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem('am_orders', JSON.stringify(orders))
}

export function createOrder(cartItems: CartItem[], address: string, shipping: string, payment: string, products: Product[]): Order {
  const user = getCurrentUser()
  const order: Order = {
    id: 'ORD-' + Date.now(),
    userId: user ? Number(user.id) : null,
    user: user ? user.name : 'Guest',
    userEmail: user ? user.email : '',
    items: cartItems.map(item => {
      const product = products.find(p => p.id === item.id)!
      return { id: item.id, qty: item.qty, name: product.name, price: product.price }
    }),
    address,
    shipping,
    payment,
    subtotal: cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id)
      return sum + (product ? product.price * item.qty : 0)
    }, 0),
    shippingCost: shipping === 'express' ? 9.99 : shipping === 'standard' ? 4.99 : 0,
    total: 0,
    status: 'pending',
    date: new Date().toISOString()
  }
  order.total = order.subtotal + order.shippingCost
  saveOrder(order)
  return order
}

// ---- Reviews ----
export function getReviews(): Review[] {
  return JSON.parse(localStorage.getItem('am_reviews') || '[]')
}

export function getProductReviews(productId: number): Review[] {
  return getReviews().filter(r => r.productId === productId)
}

// ---- Search ----
export function searchProducts(query: string, products: Product[]): Product[] {
  query = query.toLowerCase().trim()
  if (!query) return products
  return products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.brand.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  )
}

// ---- Pagination ----
export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; total: number; totalPages: number; page: number } {
  const start = (page - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    totalPages: Math.ceil(items.length / perPage),
    page
  }
}

// ---- URL ----
export function getUrlParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key)
}

// ---- Toast ----
export function showToast(message: string, type: string = 'success'): void {
  let container = document.querySelector('.toast-container') as HTMLElement
  if (!container) {
    container = el('div', { className: 'toast-container' })
    document.body.appendChild(container)
  }
  const icons: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }
  const toast = el('div', { className: `toast ${type}` }, icons[type] || '', ' ', message)
  container.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// ---- Countdown ----
export function startCountdown(hours: number): void {
  let total = hours * 3600
  function tick() {
    if (total <= 0) return
    total--
    const h = String(Math.floor(total / 3600)).padStart(2, '0')
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    const s = String(total % 60).padStart(2, '0')
    const el = document.getElementById('countdown')
    if (el) el.innerHTML = `<span>${h}</span><span class="sep">:</span><span>${m}</span><span class="sep">:</span><span>${s}</span>`
  }
  tick()
  setInterval(tick, 1000)
}

// ---- Init Admin Data ----
export function initAdminData(): void {
  let users = getUsers()
  if (!users.find(u => u.email === 'admin@alliancemall.com')) {
    users.push({ id: '1', name: 'Admin', email: 'admin@alliancemall.com', role: 'admin', joinDate: '2026-01-01T00:00:00.000Z', password: 'admin123' } as any)
    localStorage.setItem('am_users', JSON.stringify(users))
  }
  if (getOrders().length === 0) {
    const sampleOrders: Order[] = [
      { id: 'ORD-1001', userId: 1, user: 'John Doe', userEmail: 'john@example.com', items: [{id:1,qty:2,name:'Wireless Bluetooth Headphones Pro',price:29.99}], address: '123 Main St, New York, NY 10001', shipping: 'standard', payment: 'credit-card', subtotal: 59.98, shippingCost: 4.99, total: 64.97, status: 'completed', date: '2026-07-15T10:30:00.000Z' },
      { id: 'ORD-1002', userId: 2, user: 'Jane Smith', userEmail: 'jane@example.com', items: [{id:5,qty:3,name:"Men's Casual Cotton T-Shirt",price:14.99},{id:9,qty:1,name:'Vitamin C Face Serum',price:18.99}], address: '456 Oak Ave, Los Angeles, CA 90001', shipping: 'express', payment: 'paypal', subtotal: 63.96, shippingCost: 9.99, total: 73.95, status: 'shipped', date: '2026-07-18T14:20:00.000Z' },
      { id: 'ORD-1003', userId: 3, user: 'Bob Wilson', userEmail: 'bob@example.com', items: [{id:19,qty:1,name:'Mechanical Gaming Keyboard RGB',price:44.99}], address: '789 Pine Rd, Chicago, IL 60601', shipping: 'standard', payment: 'bank-transfer', subtotal: 44.99, shippingCost: 4.99, total: 49.98, status: 'pending', date: '2026-07-19T09:15:00.000Z' }
    ]
    localStorage.setItem('am_orders', JSON.stringify(sampleOrders))
  }
  if (!localStorage.getItem('am_reviews')) {
    localStorage.setItem('am_reviews', JSON.stringify([
      {id:1,productId:1,userId:100,userName:"Alex J.",rating:5,text:"Amazing headphones! The noise cancellation is superb.",date:"2026-07-15T10:00:00.000Z",helpful:12,sellerReply:"Thank you!"},
      {id:2,productId:1,userId:101,userName:"Maria S.",rating:4,text:"Great sound quality for the price.",date:"2026-07-12T14:30:00.000Z",helpful:8,sellerReply:""},
      {id:3,productId:4,userId:102,userName:"David K.",rating:5,text:"Perfect portable speaker! Waterproof works great.",date:"2026-07-10T09:15:00.000Z",helpful:5,sellerReply:"Glad you enjoy it!"}
    ]))
  }
}
