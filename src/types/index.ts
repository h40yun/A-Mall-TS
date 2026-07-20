// ==================== TYPES ====================

export interface Product {
  id: number
  name: string
  slug?: string
  price: number
  originalPrice: number
  category: string
  subcategory?: string
  rating: number
  sold: number
  brand: string
  seller: string
  sellerId?: string
  description: string
  specs: string
  colors: string[]
  sizes?: string[]
  stock: number
  sku?: string
  images: string[]
  weight?: string
  returnPolicy?: string
  freeShipping?: boolean
  minOrder?: number
}

export interface CartItem {
  id: number
  qty: number
  variant?: string | null
  selected?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'seller' | 'admin'
  joinDate: string
  avatar?: string
  addresses?: Address[]
}

export interface Address {
  id: string
  label: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
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
  discount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'returning'
  trackingNumber?: string
  trackingHistory?: TrackingEvent[]
  notes?: string
  voucherCode?: string
  date: string
}

export interface OrderItem {
  id: number
  qty: number
  name: string
  price: number
  variant?: string
  image?: string
}

export interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  description: string
}

export interface Review {
  id: number
  productId: number
  userId: number
  userName: string
  userAvatar?: string
  rating: number
  text: string
  images?: string[]
  date: string
  helpful: number
  sellerReply: string
  sellerReplyDate?: string
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
  responseTime: string
  responseRate: string
  shipRate: string
  joinDate: string
  followers: number
  status: string
}

export interface Category {
  name: string
  icon: string
  color: string
  subcategories?: string[]
}

export interface Coupon {
  id: string
  code: string
  type: 'fixed' | 'percentage' | 'free_shipping'
  value: number
  minSpend: number
  maxDiscount?: number
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  storeId?: string
  status: 'active' | 'expired' | 'disabled'
}

export interface Voucher {
  id: string
  code: string
  type: 'fixed' | 'percentage' | 'free_shipping'
  value: number
  minSpend: number
  maxDiscount?: number
  description: string
  endDate: string
  claimed: boolean
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

export interface SavedItem {
  id: number
  addedAt: string
}
