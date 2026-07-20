// ==================== HELPERS ====================
import type { CartItem, Product, User, Order, Review, Address, Voucher, SavedItem, PaymentMethod, ReturnRequest } from '../types'
import { COUPONS } from './data'

// ---- DOM ----
export function el(tag: string, attrs?: Record<string, string>, ...children: (string | HTMLElement)[]): HTMLElement {
  const element = document.createElement(tag)
  if (attrs) for (const [k, v] of Object.entries(attrs)) { if (k === 'className') element.className = v; else if (k.startsWith('on')) element.addEventListener(k.slice(2).toLowerCase(), v as unknown as EventListener); else element.setAttribute(k, v) }
  for (const c of children) { if (typeof c === 'string') element.appendChild(document.createTextNode(c)); else if (c) element.appendChild(c) }
  return element
}
export function $(s: string): HTMLElement | null { return document.querySelector(s) }
export function $$(s: string): NodeListOf<HTMLElement> { return document.querySelectorAll(s) }

// ---- Format ----
export function formatPrice(p: number): string { return '$' + p.toFixed(2) }
export function renderStars(r: number): string { let s = ''; for (let i = 1; i <= 5; i++) s += i <= Math.floor(r) || (i - r < 1) ? '★' : '☆'; return s }
export function getDiscount(p: number, o: number): number { return Math.round((1 - p / o) * 100) }
export function getProductImage(p: Product): string { return p.images?.[0]?.startsWith('http') ? p.images[0] : `https://picsum.photos/seed/product${p.id}/300/300` }
export function getProductImages(p: Product): string[] { return p.images?.length ? p.images : [`https://picsum.photos/seed/product${p.id}/600/600`] }
export function getProductInitials(p: Product): string { return p.name.split(' ').slice(0, 2).map(w => w[0]).join('') }
export function getProductColor(p: Product): string { return ['#ee4d2d','#3498db','#27ae60','#e74c3c','#9b59b6','#f39c12','#1abc9c','#e67e22'][p.id % 8] }

// ---- Cart ----
export function getCart(): CartItem[] { return JSON.parse(localStorage.getItem('am_cart') || '[]') }
export function saveCart(c: CartItem[]): void { localStorage.setItem('am_cart', JSON.stringify(c)); updateCartBadge() }
export function addToCart(id: number, qty = 1, v: string | null = null): void { const c = getCart(); const e = c.find(i => i.id === id && i.variant === v); if (e) e.qty += qty; else c.push({ id, qty, variant: v, selected: true }); saveCart(c); showToast('Added to cart!') }
export function removeFromCart(id: number, v: string | null = null): void { saveCart(getCart().filter(i => !(i.id === id && i.variant === v))) }
export function getCartCount(): number { return getCart().reduce((s, i) => s + i.qty, 0) }
export function updateCartBadge(): void { document.querySelectorAll('.cart-badge').forEach(b => { const n = getCartCount(); b.textContent = String(n); (b as HTMLElement).style.display = n > 0 ? 'flex' : 'none' }) }

// ---- Wishlist ----
export function getWishlist(): number[] { return JSON.parse(localStorage.getItem('am_wishlist') || '[]') }
export function toggleWishlist(id: number): boolean { let l = getWishlist(); if (l.includes(id)) { l = l.filter(i => i !== id); showToast('Removed from wishlist') } else { l.push(id); showToast('Added to wishlist!') } localStorage.setItem('am_wishlist', JSON.stringify(l)); return l.includes(id) }
export function isInWishlist(id: number): boolean { return getWishlist().includes(id) }

// ---- Saved Items ----
export function getSavedItems(): SavedItem[] { return JSON.parse(localStorage.getItem('am_saved') || '[]') }
export function saveForLater(id: number): void { const s = getSavedItems(); if (!s.find(x => x.id === id)) { s.push({ id, addedAt: new Date().toISOString() }); localStorage.setItem('am_saved', JSON.stringify(s)); showToast('Saved for later!') } }
export function moveToCart(id: number): void { localStorage.setItem('am_saved', JSON.stringify(getSavedItems().filter(s => s.id !== id))); addToCart(id) }
export function removeSavedItem(id: number): void { localStorage.setItem('am_saved', JSON.stringify(getSavedItems().filter(s => s.id !== id))) }

// ---- Recently Viewed ----
export function getRecentlyViewed(): number[] { return JSON.parse(localStorage.getItem('am_recently_viewed') || '[]') }
export function addToRecentlyViewed(id: number): void { let r = getRecentlyViewed().filter(x => x !== id); r.unshift(id); if (r.length > 30) r = r.slice(0, 30); localStorage.setItem('am_recently_viewed', JSON.stringify(r)) }

// ---- Browsing History ----
export function getBrowsingHistory(): number[] { return JSON.parse(localStorage.getItem('am_browsing_history') || '[]') }
export function addToBrowsingHistory(id: number): void { let h = getBrowsingHistory().filter(x => x !== id); h.unshift(id); if (h.length > 50) h = h.slice(0, 50); localStorage.setItem('am_browsing_history', JSON.stringify(h)) }

// ---- Comparison ----
export function getComparisonItems(): number[] { return JSON.parse(localStorage.getItem('am_comparison') || '[]') }
export function toggleComparison(id: number): boolean { let items = getComparisonItems(); if (items.includes(id)) { items = items.filter(i => i !== id) } else { if (items.length >= 4) { showToast('Max 4 items for comparison', 'error'); return false } items.push(id) } localStorage.setItem('am_comparison', JSON.stringify(items)); return items.includes(id) }
export function clearComparison(): void { localStorage.setItem('am_comparison', '[]') }

// ---- Auth ----
export function getUsers(): User[] { return JSON.parse(localStorage.getItem('am_users') || '[]') }
export function getCurrentUser(): User | null { return JSON.parse(localStorage.getItem('am_current_user') || 'null') }
export function login(email: string, password: string): { success: boolean; user?: User; message?: string } { const u = getUsers().find(u => u.email === email && (u as any).password === password); if (u) { localStorage.setItem('am_current_user', JSON.stringify(u)); return { success: true, user: u as User } } return { success: false, message: 'Invalid email or password' } }
export function register(name: string, email: string, password: string): { success: boolean; user?: User; message?: string } { const users = getUsers(); if (users.find(u => u.email === email)) return { success: false, message: 'Email already registered' }; const u = { id: String(Date.now()), name, email, role: 'user' as const, joinDate: new Date().toISOString(), password, addresses: [], coins: 100, membership: 'basic' as const, browsingHistory: [] } as any; users.push(u); localStorage.setItem('am_users', JSON.stringify(users)); localStorage.setItem('am_current_user', JSON.stringify(u)); return { success: true, user: u } }
export function logout(): void { localStorage.removeItem('am_current_user'); window.location.href = '/' }
export function isAdmin(): boolean { const u = getCurrentUser(); return !!u && (u.role === 'admin' || u.email === 'admin@alliancemall.com') }

// ---- Coins ----
export function getCoins(): number { return (getCurrentUser() as any)?.coins || 0 }
export function addCoins(amount: number): void { const u = getCurrentUser(); if (u) { (u as any).coins = ((u as any).coins || 0) + amount; localStorage.setItem('am_current_user', JSON.stringify(u)) } }
export function useCoins(amount: number): boolean { const u = getCurrentUser(); if (!u || ((u as any).coins || 0) < amount) return false; (u as any).coins -= amount; localStorage.setItem('am_current_user', JSON.stringify(u)); return true }

// ---- Membership ----
export function getMembership(): string { return (getCurrentUser() as any)?.membership || 'basic' }
export function upgradeMembership(tier: string): void { const u = getCurrentUser(); if (u) { (u as any).membership = tier; localStorage.setItem('am_current_user', JSON.stringify(u)); showToast(`Upgraded to ${tier}!`) } }

// ---- Payment Methods ----
export function getPaymentMethods(): PaymentMethod[] { return JSON.parse(localStorage.getItem('am_payment_methods') || '[]') }
export function savePaymentMethod(pm: PaymentMethod): void { const pms = getPaymentMethods(); const idx = pms.findIndex(p => p.id === pm.id); if (idx >= 0) pms[idx] = pm; else pms.push(pm); if (pm.isDefault) pms.forEach(p => { if (p.id !== pm.id) p.isDefault = false }); localStorage.setItem('am_payment_methods', JSON.stringify(pms)) }
export function deletePaymentMethod(id: string): void { localStorage.setItem('am_payment_methods', JSON.stringify(getPaymentMethods().filter(p => p.id !== id))) }

// ---- Addresses ----
export function getAddresses(): Address[] { return (getCurrentUser() as any)?.addresses || [] }
export function saveAddress(addr: Address): void { const u = getCurrentUser(); if (!u) return; if (!(u as any).addresses) (u as any).addresses = []; const addrs = (u as any).addresses as Address[]; const idx = addrs.findIndex(a => a.id === addr.id); if (idx >= 0) addrs[idx] = addr; else addrs.push(addr); if (addr.isDefault) addrs.forEach(a => { if (a.id !== addr.id) a.isDefault = false }); localStorage.setItem('am_current_user', JSON.stringify(u)); const users = getUsers(); const user = users.find(u => u.id === u.id); if (user) { (user as any).addresses = addrs; localStorage.setItem('am_users', JSON.stringify(users)) } }
export function deleteAddress(id: string): void { const u = getCurrentUser(); if (!u) return; (u as any).addresses = ((u as any).addresses || []).filter((a: Address) => a.id !== id); localStorage.setItem('am_current_user', JSON.stringify(u)) }

// ---- Vouchers ----
export function getClaimedVouchers(): string[] { return JSON.parse(localStorage.getItem('am_claimed_vouchers') || '[]') }
export function claimVoucher(id: string): void { const c = getClaimedVouchers(); if (!c.includes(id)) { c.push(id); localStorage.setItem('am_claimed_vouchers', JSON.stringify(c)); showToast('Voucher claimed!') } }
export function applyVoucher(code: string, subtotal: number, shippingCost: number): { discount: number; newShipping: number; message: string } {
  const coupon = COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase() && c.status === 'active')
  if (!coupon) return { discount: 0, newShipping: shippingCost, message: 'Invalid voucher code' }
  if (subtotal < coupon.minSpend) return { discount: 0, newShipping: shippingCost, message: `Minimum spend ${formatPrice(coupon.minSpend)}` }
  if (coupon.usageLimit <= coupon.usedCount) return { discount: 0, newShipping: shippingCost, message: 'Voucher fully redeemed' }
  let discount = 0; let newShipping = shippingCost
  if (coupon.type === 'percentage') { discount = subtotal * coupon.value / 100; if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount) }
  else if (coupon.type === 'fixed') discount = coupon.value
  else if (coupon.type === 'free_shipping') newShipping = 0
  return { discount, newShipping, message: `Voucher applied! ${coupon.type === 'free_shipping' ? 'Free shipping' : formatPrice(discount) + ' off'}` }
}

// ---- Orders ----
export function getOrders(): Order[] { return JSON.parse(localStorage.getItem('am_orders') || '[]') }
export function saveOrder(o: Order): void { const orders = getOrders(); orders.unshift(o); localStorage.setItem('am_orders', JSON.stringify(orders)) }
export function createOrder(items: CartItem[], addr: string, ship: string, pay: string, products: Product[], notes?: string, voucher?: string, disc = 0, gift = false, giftMsg = ''): Order {
  const u = getCurrentUser(); const shipCost = ship === 'express' ? 9.99 : ship === 'standard' ? 4.99 : 0
  const subtotal = items.reduce((s, i) => { const p = products.find(pr => pr.id === i.id); return s + (p ? p.price * i.qty : 0) }, 0)
  const o: Order = { id: 'ORD-' + Date.now(), userId: u ? Number(u.id) : null, user: u ? u.name : 'Guest', userEmail: u ? u.email : '', items: items.map(i => { const p = products.find(pr => pr.id === i.id)!; return { id: i.id, qty: i.qty, name: p.name, price: p.price, variant: i.variant || undefined, image: p.images?.[0] } }), address: addr, shipping: ship, payment: pay, subtotal, shippingCost: shipCost, discount: disc, total: subtotal + shipCost - disc, status: 'pending', trackingNumber: 'TRK' + Date.now().toString(36).toUpperCase(), trackingHistory: [{ status: 'Order Placed', location: 'Processing Center', timestamp: new Date().toISOString(), description: 'Your order has been placed successfully.' }], notes, voucherCode: voucher, giftWrap: gift, giftMessage: giftMsg, date: new Date().toISOString() }
  saveOrder(o); addCoins(Math.floor(o.total)); return o
}
export function getOrderById(id: string): Order | undefined { return getOrders().find(o => o.id === id) }

// ---- Return Requests ----
export function getReturnRequests(): ReturnRequest[] { return JSON.parse(localStorage.getItem('am_returns') || '[]') }
export function createReturnRequest(orderId: string, reason: string, desc: string): void { const reqs = getReturnRequests(); reqs.push({ id: 'RET-' + Date.now(), orderId, reason, description: desc, status: 'pending', date: new Date().toISOString() }); localStorage.setItem('am_returns', JSON.stringify(reqs)); showToast('Return request submitted!') }

// ---- Reviews ----
export function getReviews(): Review[] { return JSON.parse(localStorage.getItem('am_reviews') || '[]') }
export function getProductReviews(id: number): Review[] { return getReviews().filter(r => r.productId === id) }
export function getUserReviews(): Review[] { const u = getCurrentUser(); if (!u) return []; return getReviews().filter(r => r.userId === Number(u.id)) }

// ---- Search ----
export function searchProducts(q: string, products: Product[]): Product[] { q = q.toLowerCase().trim(); if (!q) return products; return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.subcategory || '').toLowerCase().includes(q)) }
export function getSearchHistory(): string[] { return JSON.parse(localStorage.getItem('am_search_history') || '[]') }
export function addSearchHistory(q: string): void { let h = getSearchHistory().filter(x => x !== q); h.unshift(q); if (h.length > 10) h = h.slice(0, 10); localStorage.setItem('am_search_history', JSON.stringify(h)) }

// ---- Pagination ----
export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; total: number; totalPages: number; page: number } { const start = (page - 1) * perPage; return { items: items.slice(start, start + perPage), total: items.length, totalPages: Math.ceil(items.length / perPage), page } }

// ---- URL ----
export function getUrlParam(k: string): string | null { return new URLSearchParams(window.location.search).get(k) }

// ---- Toast ----
export function showToast(msg: string, type = 'success'): void {
  let c = document.querySelector('.toast-container') as HTMLElement
  if (!c) { c = el('div', { className: 'toast-container' }); document.body.appendChild(c) }
  const icons: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }
  const t = el('div', { className: `toast ${type}` }, icons[type] || '', ' ', msg); c.appendChild(t)
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100%)'; setTimeout(() => t.remove(), 300) }, 3000)
}

// ---- Countdown ----
export function startCountdown(h: number): void { let t = h * 3600; function tick() { if (t <= 0) return; t--; const el = document.getElementById('countdown'); if (el) el.innerHTML = `<span>${String(Math.floor(t / 3600)).padStart(2, '0')}</span><span class="sep">:</span><span>${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}</span><span class="sep">:</span><span>${String(t % 60).padStart(2, '0')}</span>` } tick(); setInterval(tick, 1000) }

// ---- Init ----
export function initAdminData(): void {
  let users = getUsers()
  if (!users.find(u => u.email === 'admin@alliancemall.com')) { users.push({ id: '1', name: 'Admin', email: 'admin@alliancemall.com', role: 'admin', joinDate: '2026-01-01T00:00:00.000Z', password: 'admin123', addresses: [], coins: 9999, membership: 'premium' } as any); localStorage.setItem('am_users', JSON.stringify(users)) }
  if (getOrders().length === 0) { localStorage.setItem('am_orders', JSON.stringify([{ id: 'ORD-1001', userId: 1, user: 'John Doe', userEmail: 'john@example.com', items: [{ id: 1, qty: 2, name: 'Wireless Bluetooth Headphones Pro', price: 29.99 }], address: '123 Main St, New York, NY 10001', shipping: 'standard', payment: 'credit-card', subtotal: 59.98, shippingCost: 4.99, discount: 0, total: 64.97, status: 'completed', trackingNumber: 'TRK1001ABC', trackingHistory: [{ status: 'Order Placed', location: 'Processing Center', timestamp: '2026-07-15T10:30:00.000Z', description: 'Order placed' }, { status: 'Shipped', location: 'New York Warehouse', timestamp: '2026-07-16T08:00:00.000Z', description: 'Package shipped' }, { status: 'Delivered', location: 'New York, NY', timestamp: '2026-07-18T14:00:00.000Z', description: 'Package delivered' }], date: '2026-07-15T10:30:00.000Z' }, { id: 'ORD-1002', userId: 2, user: 'Jane Smith', userEmail: 'jane@example.com', items: [{ id: 5, qty: 3, name: "Men's Casual Cotton T-Shirt", price: 14.99 }, { id: 9, qty: 1, name: 'Vitamin C Face Serum', price: 18.99 }], address: '456 Oak Ave, Los Angeles, CA 90001', shipping: 'express', payment: 'paypal', subtotal: 63.96, shippingCost: 9.99, discount: 5, total: 68.95, status: 'shipped', trackingNumber: 'TRK1002DEF', trackingHistory: [{ status: 'Order Placed', location: 'Processing Center', timestamp: '2026-07-18T14:20:00.000Z', description: 'Order placed' }, { status: 'Shipped', location: 'Los Angeles Warehouse', timestamp: '2026-07-19T09:00:00.000Z', description: 'Package shipped' }], date: '2026-07-18T14:20:00.000Z' }, { id: 'ORD-1003', userId: 3, user: 'Bob Wilson', userEmail: 'bob@example.com', items: [{ id: 19, qty: 1, name: 'Mechanical Gaming Keyboard RGB', price: 44.99 }], address: '789 Pine Rd, Chicago, IL 60601', shipping: 'standard', payment: 'bank-transfer', subtotal: 44.99, shippingCost: 4.99, discount: 0, total: 49.98, status: 'pending', trackingNumber: 'TRK1003GHI', trackingHistory: [{ status: 'Order Placed', location: 'Processing Center', timestamp: '2026-07-19T09:15:00.000Z', description: 'Order placed' }], date: '2026-07-19T09:15:00.000Z' }])) }
  if (!localStorage.getItem('am_reviews')) { localStorage.setItem('am_reviews', JSON.stringify([{ id: 1, productId: 1, userId: 100, userName: 'Alex J.', rating: 5, text: 'Amazing headphones! The noise cancellation is superb.', date: '2026-07-15T10:00:00.000Z', helpful: 12, sellerReply: 'Thank you!', sellerReplyDate: '2026-07-16' }, { id: 2, productId: 1, userId: 101, userName: 'Maria S.', rating: 4, text: 'Great sound quality for the price.', date: '2026-07-12T14:30:00.000Z', helpful: 8, sellerReply: '' }, { id: 3, productId: 4, userId: 102, userName: 'David K.', rating: 5, text: 'Perfect portable speaker!', date: '2026-07-10T09:15:00.000Z', helpful: 5, sellerReply: 'Glad you enjoy it!' }])) }
}
