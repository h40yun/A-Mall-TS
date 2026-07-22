// ==================== HELPERS (DOM + Formatting + UI) ====================
// Data operations moved to auth.ts and db.ts
import type { Product } from '../types'
import { getCartCount as _getCartCount } from './db'

// ---- DOM ----
export function el(tag: string, attrs?: Record<string, string>, ...children: (string | HTMLElement)[]): HTMLElement {
  const e = document.createElement(tag)
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') e.className = v
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v as unknown as EventListener)
    else e.setAttribute(k, v)
  }
  for (const c of children) {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c))
    else if (c) e.appendChild(c)
  }
  return e
}
export function $(s: string): HTMLElement | null { return document.querySelector(s) }
export function $$(s: string): NodeListOf<HTMLElement> { return document.querySelectorAll(s) }

// ---- Format ----
export function formatPrice(p: number): string { return '$' + p.toFixed(2) }
export function renderStars(r: number): string {
  let s = ''
  for (let i = 1; i <= 5; i++) s += i <= Math.floor(r) || (i - r < 1) ? '★' : '☆'
  return s
}
export function getDiscount(p: number, o: number): number { return Math.round((1 - p / o) * 100) }
export function getProductImage(p: Product): string {
  return p.images?.[0]?.startsWith('http') ? p.images[0] : `https://picsum.photos/seed/product${p.id}/300/300`
}
export function getProductImages(p: Product): string[] {
  return p.images?.length ? p.images : [`https://picsum.photos/seed/product${p.id}/600/600`]
}
export function getProductInitials(p: Product): string {
  return p.name.split(' ').slice(0, 2).map(w => w[0]).join('')
}
export function getProductColor(p: Product): string {
  return ['#ee4d2d','#3498db','#27ae60','#e74c3c','#9b59b6','#f39c12','#1abc9c','#e67e22'][Number(p.id) % 8]
}

// ---- URL ----
export function getUrlParam(k: string): string | null {
  return new URLSearchParams(window.location.search).get(k)
}

// ---- Toast ----
export function showToast(msg: string, type = 'success'): void {
  let c = document.querySelector('.toast-container') as HTMLElement
  if (!c) { c = el('div', { className: 'toast-container' }); document.body.appendChild(c) }
  const icons: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }
  const t = el('div', { className: `toast ${type}` }, icons[type] || '', ' ', msg)
  c.appendChild(t)
  setTimeout(() => {
    t.style.opacity = '0'
    t.style.transform = 'translateX(100%)'
    setTimeout(() => t.remove(), 300)
  }, 3000)
}

// ---- Countdown ----
export function startCountdown(h: number): void {
  let t = h * 3600
  function tick() {
    if (t <= 0) return
    t--
    const el = document.getElementById('countdown')
    if (el) el.innerHTML = `<span>${String(Math.floor(t / 3600)).padStart(2, '0')}</span><span class="sep">:</span><span>${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}</span><span class="sep">:</span><span>${String(t % 60).padStart(2, '0')}</span>`
  }
  tick()
  setInterval(tick, 1000)
}

// ---- Pagination ----
export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; total: number; totalPages: number; page: number } {
  const start = (page - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    totalPages: Math.ceil(items.length / perPage),
    page,
  }
}

// ---- Re-exports from new services (backward compatibility) ----
export { isLoggedIn, isAdmin, isSeller, getCurrentProfile, logout, login, register, updateProfile } from './auth'
export type { Profile } from './auth'
export {
  addToCart, removeFromCart, clearCart, updateCartQuantity, getCartCount,
  toggleWishlist, isInWishlist, fetchWishlist,
  fetchOrders, fetchOrderById, createOrder,
  fetchAddresses, saveAddress, deleteAddress,
  fetchProductReviews, submitReview,
  fetchNotifications, markNotificationRead, getUnreadNotificationCount,
  sendMessage, fetchConversations, fetchMessages,
  claimVoucher, applyVoucher,
  addToBrowsingHistory, useCoins, upgradeMembership,
  fetchSellerStore, createSellerStore,
  fetchProducts, fetchProductById, searchProducts,
} from './db'

// ---- Backward compatibility aliases ----
// These map old localStorage function names to new Supabase equivalents
export { getCurrentProfile as getCurrentUser } from './auth'
export { fetchOrders as getOrders } from './db'
export { fetchProductReviews as getProductReviews, fetchProductReviews as getReviews } from './db'
export { fetchNotifications as getNotifications } from './db'
export { fetchSellerStore as getSellerStore } from './db'
export { fetchAddresses as getAddresses } from './db'
export { fetchWishlist as getWishlist } from './db'
export { fetchConversations as getConversations } from './db'
export { fetchMessages as getConversation, fetchMessages as getMessages } from './db'
export { fetchOrderById as getOrderById } from './db'

// Placeholder stubs for functions not yet migrated
export async function getUsers(): Promise<any[]> { return [] }
export async function getSellerProducts(): Promise<any[]> { return [] }
export async function getReturnRequests(): Promise<any[]> { return [] }
export async function addNotification(_type: string, _title: string, _message: string, _link: string): Promise<void> {}
export async function adminConfirmDelivery(_orderId: string): Promise<boolean> { return false }
export async function adminUpdateOrderStatus(_orderId: string, _status: string, _note?: string): Promise<boolean> { return false }
export async function autoUpdateOrderStatus(_orderId: string): Promise<void> {}
export async function initAdminData(): Promise<void> {}
export async function initDemoAccounts(): Promise<void> {}
export function setProductsCache(_p: any[]): void {}
// Cart local helpers (for guest mode)
export function getCart(): any[] { return JSON.parse(localStorage.getItem('am_cart') || '[]') }
export function saveCart(c: any[]): void { localStorage.setItem('am_cart', JSON.stringify(c)); updateCartBadge() }

export function updateCartBadge(): void {
  _getCartCount().then(count => {
    document.querySelectorAll('.cart-badge').forEach(b => {
      const el = b as HTMLElement
      el.textContent = String(count)
      el.style.display = count > 0 ? 'flex' : 'none'
    })
  })
}
export function getCoins(): number { return 0 }
export function getMembership(): string { return 'basic' }
export function getPaymentMethods(): any[] { return [] }
export function savePaymentMethod(_pm: any): void {}
export function deletePaymentMethod(_id: string): void {}
export function getUserReviews(): any[] { return [] }
export function getBrowsingHistory(): any[] { return [] }
export function saveSellerStore(_store: any): void {}
export function saveSellerProduct(_product: any): void {}
export function deleteSellerProduct(_id: number): void {}
export function getUnreadMessageCount(): number { return 0 }
export function getRecentlyViewed(): any[] { return [] }
export function addToRecentlyViewed(_id: any): void {}
export function getComparisonItems(): any[] { return [] }
export function toggleComparison(_id: any): boolean { return false }
export function clearComparison(): void {}
export function getSavedItems(): any[] { return [] }
export function saveForLater(_id: any): void {}
export function moveToCart(_id: any): void {}
export function removeSavedItem(_id: any): void {}
export function getClaimedVouchers(): string[] { return [] }
export function getSellerOrders(_sellerId: string): any[] { return [] }
export function getSearchHistory(): string[] { return [] }
export function addSearchHistory(_q: string): void {}
export function createReturnRequest(_orderId: string, _reason: string, _desc: string): void {}
export function getOrderTrackingTimeline(_orderDate: string, _shipping: string): any[] { return [] }
export function registerSeller(..._args: any[]): any { return { success: false, message: 'Not implemented' } }
export function getSellerApplication(): any { return null }
export function saveSellerApplication(_app: any): void {}
export function markMessagesRead(_buyerId: number, _productId: number): void {}
export function scrapeProducts(..._args: any[]): any { return [] }
export function saveScrapedProducts(_products: any[]): void {}
export function getScrapedProducts(): any[] { return [] }
export function deleteScrapedProduct(_id: any): void {}
export function clearScrapedProducts(): void {}
export function importToMarketplace(_products: any[]): void {}
export function detectPlatform(_url: string): string { return 'unknown' }
export function isDemoAccount(_email: string): boolean { return false }
export function getDemoAccounts(): any[] { return [] }
export { fetchProducts as getAllProducts } from './db'
