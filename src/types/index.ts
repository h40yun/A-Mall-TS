// ==================== TYPES ====================

export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  category: string
  rating: number
  sold: number
  brand: string
  seller: string
  description: string
  specs: string
  colors: string[]
  stock: number
  images?: string[]
}

export interface CartItem {
  id: number
  qty: number
  variant?: string | null
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'seller' | 'admin'
  joinDate: string
}

export interface Order {
  id: string
  userId: number | null
  user: string
  userEmail: string
  items: OrderItem[]
  address: string
  shipping: string
  payment: string
  subtotal: number
  shippingCost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  date: string
}

export interface OrderItem {
  id: number
  qty: number
  name: string
  price: number
}

export interface Review {
  id: number
  productId: number
  userId: number
  userName: string
  rating: number
  text: string
  date: string
  helpful: number
  sellerReply: string
}

export interface Store {
  id: string
  name: string
  slug: string
  description: string
  category: string
  bannerColor: string
  logoInitial: string
  location: string
  rating: number
  totalSales: number
  status: string
}

export interface Category {
  name: string
  icon: string
  color: string
}

export interface Message {
  id: number
  from: 'buyer' | 'seller'
  buyerName: string
  buyerId: number
  productId: number
  productName?: string
  text: string
  date: string
  read: boolean
}

export interface SellerApplication {
  id: number
  name: string
  owner: string
  email: string
  phone: string
  country: string
  businessType: string
  category: string
  description: string
  plan: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface BuyerAccount {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  link: string
  isRead: boolean
  createdAt: string
}
