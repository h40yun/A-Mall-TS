// ==================== DATABASE SERVICE ====================
// Replaces all localStorage operations with Supabase
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'
import type { Product, CartItem, Order, Review, Address, Notification, Message } from '../types'

// ============================================================
// PRODUCTS
// ============================================================
export async function fetchProducts(options?: {
  category?: string
  subcategory?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  freeShipping?: boolean
  sort?: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating'
  page?: number
  perPage?: number
}): Promise<{ products: Product[]; total: number }> {
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (options?.category) query = query.eq('category', options.category)
  if (options?.subcategory) query = query.eq('subcategory', options.subcategory)
  if (options?.search) query = query.or(`name.ilike.%${options.search}%,brand.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  if (options?.minPrice) query = query.gte('price', options.minPrice)
  if (options?.maxPrice) query = query.lte('price', options.maxPrice)
  if (options?.minRating) query = query.gte('rating', options.minRating)
  if (options?.freeShipping) query = query.eq('free_shipping', true)

  // Sorting
  switch (options?.sort) {
    case 'price-asc': query = query.order('price', { ascending: true }); break
    case 'price-desc': query = query.order('price', { ascending: false }); break
    case 'rating': query = query.order('rating', { ascending: false }); break
    case 'newest': query = query.order('created_at', { ascending: false }); break
    default: query = query.order('sold', { ascending: false }); break
  }

  // Pagination
  const page = options?.page || 1
  const perPage = options?.perPage || 24
  const from = (page - 1) * perPage
  query = query.range(from, from + perPage - 1)

  const { data, error, count } = await query
  if (error) {
    console.error('[DB] fetchProducts error:', error)
    return { products: [], total: 0 }
  }
  return { products: (data || []) as Product[], total: count || 0 }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Product
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return []
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)

  if (error) return []
  return (data || []) as Product[]
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(50)

  if (error) return []
  return (data || []) as Product[]
}

// ============================================================
// CATEGORIES
// ============================================================
export async function fetchCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*, subcategories(*)')
    .order('sort_order')
  return data || []
}

// ============================================================
// CART
// ============================================================
export async function fetchCart(): Promise<(CartItem & { product: Product })[]> {
  const profile = getCurrentProfile()
  if (!profile) {
    // Guest: use localStorage fallback
    const local = JSON.parse(localStorage.getItem('am_cart') || '[]')
    if (!local.length) return []
    const products = await fetchProductsByIds(local.map((i: any) => i.id))
    return local.map((item: any) => ({
      ...item,
      product: products.find(p => p.id === item.id),
    })).filter((i: any) => i.product)
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data || []).map((item: any) => ({
    id: item.product_id,
    qty: item.quantity,
    variant: item.variant,
    selected: item.selected,
    product: item.product,
  }))
}

export async function addToCart(productId: string, quantity = 1, variant?: string): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) {
    // Guest: localStorage
    const cart = JSON.parse(localStorage.getItem('am_cart') || '[]')
    const existing = cart.find((i: any) => i.id === productId && i.variant === (variant || null))
    if (existing) existing.qty += quantity
    else cart.push({ id: productId, qty: quantity, variant: variant || null, selected: true })
    localStorage.setItem('am_cart', JSON.stringify(cart))
    return true
  }

  // Upsert: if exists, increment quantity
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', profile.id)
    .eq('product_id', productId)
    .eq('variant', variant || null)
    .single()

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('cart_items')
      .insert({
        user_id: profile.id,
        product_id: productId,
        quantity,
        variant: variant || null,
        selected: true,
      })
  }
  return true
}

export async function updateCartQuantity(productId: string, quantity: number, variant?: string): Promise<void> {
  const profile = getCurrentProfile()
  if (!profile) {
    const cart = JSON.parse(localStorage.getItem('am_cart') || '[]')
    const item = cart.find((i: any) => i.id === productId && i.variant === (variant || null))
    if (item) item.qty = quantity
    localStorage.setItem('am_cart', JSON.stringify(cart))
    return
  }

  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', profile.id)
    .eq('product_id', productId)
    .eq('variant', variant || null)
}

export async function removeFromCart(productId: string, variant?: string): Promise<void> {
  const profile = getCurrentProfile()
  if (!profile) {
    const cart = JSON.parse(localStorage.getItem('am_cart') || '[]')
    const filtered = cart.filter((i: any) => !(i.id === productId && i.variant === (variant || null)))
    localStorage.setItem('am_cart', JSON.stringify(filtered))
    return
  }

  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', profile.id)
    .eq('product_id', productId)
    .eq('variant', variant || null)
}

export async function clearCart(): Promise<void> {
  const profile = getCurrentProfile()
  if (!profile) {
    localStorage.setItem('am_cart', '[]')
    return
  }

  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', profile.id)
}

export async function getCartCount(): Promise<number> {
  const profile = getCurrentProfile()
  if (!profile) {
    const cart = JSON.parse(localStorage.getItem('am_cart') || '[]')
    return cart.reduce((s: number, i: any) => s + i.qty, 0)
  }

  const { count } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)

  return count || 0
}

// ============================================================
// WISHLIST
// ============================================================
export async function fetchWishlist(): Promise<string[]> {
  const profile = getCurrentProfile()
  if (!profile) return JSON.parse(localStorage.getItem('am_wishlist') || '[]')

  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', profile.id)

  return (data || []).map((d: any) => d.product_id)
}

export async function toggleWishlist(productId: string): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) {
    let list = JSON.parse(localStorage.getItem('am_wishlist') || '[]')
    if (list.includes(productId)) {
      list = list.filter((id: string) => id !== productId)
    } else {
      list.push(productId)
    }
    localStorage.setItem('am_wishlist', JSON.stringify(list))
    return list.includes(productId)
  }

  // Check if exists
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', profile.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('wishlists').insert({
      user_id: profile.id,
      product_id: productId,
    })
    return true
  }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) {
    const list = JSON.parse(localStorage.getItem('am_wishlist') || '[]')
    return list.includes(productId)
  }

  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', profile.id)
    .eq('product_id', productId)
    .single()

  return !!data
}

// ============================================================
// ADDRESSES
// ============================================================
export async function fetchAddresses(): Promise<Address[]> {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', profile.id)
    .order('is_default', { ascending: false })

  return (data || []) as Address[]
}

export async function saveAddress(address: Partial<Address>): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  if ((address as any).is_default || address.isDefault) {
    // Unset other defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', profile.id)
  }

  if (address.id) {
    // Update
    const { error } = await supabase
      .from('addresses')
      .update(address)
      .eq('id', address.id)
      .eq('user_id', profile.id)
    return !error
  } else {
    // Insert
    const { error } = await supabase
      .from('addresses')
      .insert({ ...address, user_id: profile.id })
    return !error
  }
}

export async function deleteAddress(id: string): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', profile.id)

  return !error
}

// ============================================================
// ORDERS
// ============================================================
export async function createOrder(
  items: CartItem[],
  address: string,
  shippingMethod: string,
  paymentMethod: string,
  subtotal: number,
  shippingCost: number,
  discount: number,
  notes?: string,
  voucherCode?: string,
  giftWrap?: boolean,
  giftMessage?: string
): Promise<Order | null> {
  const profile = getCurrentProfile()
  const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase()

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: profile?.id || null,
      order_number: orderNumber,
      user_name: profile?.name || 'Guest',
      user_email: profile?.email || '',
      address,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total: subtotal + shippingCost - discount,
      status: 'pending',
      tracking_number: 'TRK' + Date.now().toString(36).toUpperCase(),
      notes,
      voucher_code: voucherCode,
      gift_wrap: giftWrap || false,
      gift_message: giftMessage,
    })
    .select()
    .single()

  if (error || !order) {
    console.error('[DB] createOrder error:', error)
    return null
  }

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: (item as any).name || 'Product',
    product_price: (item as any).price || 0,
    quantity: item.qty,
    variant: item.variant,
    image: (item as any).image,
  }))

  await supabase.from('order_items').insert(orderItems)

  // Add initial tracking event
  await supabase.from('order_tracking').insert({
    order_id: order.id,
    status: 'Order Placed',
    location: 'Processing Center',
    description: 'Your order has been placed.',
  })

  // Add coins to user
  if (profile) {
    const coinsEarned = Math.floor(subtotal + shippingCost - discount)
    await supabase
      .from('profiles')
      .update({ coins: profile.coins + coinsEarned })
      .eq('id', profile.id)
  }

  return order as Order
}

export async function fetchOrders(): Promise<Order[]> {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*), order_tracking(*)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  return (data || []) as Order[]
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), order_tracking(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Order
}

// ============================================================
// REVIEWS
// ============================================================
export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  return (data || []) as Review[]
}

export async function submitReview(
  productId: string,
  rating: number,
  text: string,
  images?: string[]
): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: profile.id,
    user_name: profile.name,
    rating,
    text,
    images: images || [],
  })

  return !error
}

// ============================================================
// MESSAGES
// ============================================================
export async function fetchConversations() {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data: sent } = await supabase
    .from('messages')
    .select('*, product:products(name)')
    .eq('from_user_id', profile.id)
    .order('created_at', { ascending: false })

  const { data: received } = await supabase
    .from('messages')
    .select('*, product:products(name)')
    .eq('to_user_id', profile.id)
    .order('created_at', { ascending: false })

  // Group by product
  const convMap = new Map<string, any>()
  const allMsgs = [...(sent || []), ...(received || [])]

  allMsgs.forEach((msg: any) => {
    const key = msg.product_id
    if (!convMap.has(key)) {
      convMap.set(key, {
        productId: msg.product_id,
        productName: msg.product?.name || 'General',
        lastMessage: msg.text,
        lastDate: msg.created_at,
        unread: 0,
      })
    }
    if (!msg.is_read && msg.to_user_id === profile.id) {
      convMap.get(key).unread++
    }
  })

  return Array.from(convMap.values()).sort(
    (a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
  )
}

export async function sendMessage(
  toUserId: string,
  productId: string,
  text: string
): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  const { error } = await supabase.from('messages').insert({
    from_user_id: profile.id,
    to_user_id: toUserId,
    product_id: productId,
    text,
  })

  return !error
}

export async function fetchMessages(productId: string, otherUserId: string) {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(from_user_id.eq.${profile.id},to_user_id.eq.${otherUserId},product_id.eq.${productId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${profile.id},product_id.eq.${productId})`
    )
    .order('created_at', { ascending: true })

  // Mark received messages as read
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('to_user_id', profile.id)
    .eq('product_id', productId)
    .eq('is_read', false)

  return data || []
}

// ============================================================
// NOTIFICATIONS
// ============================================================
export async function fetchNotifications(): Promise<Notification[]> {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (data || []) as Notification[]
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
}

export async function getUnreadNotificationCount(): Promise<number> {
  const profile = getCurrentProfile()
  if (!profile) return 0

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .eq('is_read', false)

  return count || 0
}

// ============================================================
// VOUCHERS
// ============================================================
export async function fetchVouchers() {
  const { data } = await supabase
    .from('vouchers')
    .select('*, voucher_claims(user_id)')
    .order('end_date', { ascending: true })
  return data || []
}

export async function claimVoucher(voucherId: string): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  const { error } = await supabase
    .from('voucher_claims')
    .insert({ user_id: profile.id, voucher_id: voucherId })

  return !error
}

export async function applyVoucher(
  code: string,
  subtotal: number,
  shippingCost: number
): Promise<{ discount: number; newShipping: number; message: string }> {
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('status', 'active')
    .single()

  if (!coupon) return { discount: 0, newShipping: shippingCost, message: 'Invalid voucher code' }
  if (subtotal < coupon.min_spend)
    return { discount: 0, newShipping: shippingCost, message: `Minimum spend $${coupon.min_spend}` }

  let discount = 0
  let newShipping = shippingCost

  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount)
  } else if (coupon.type === 'fixed') {
    discount = coupon.value
  } else if (coupon.type === 'free_shipping') {
    newShipping = 0
  }

  return {
    discount,
    newShipping,
    message: `Applied! ${coupon.type === 'free_shipping' ? 'Free shipping' : '$' + discount.toFixed(2) + ' off'}`,
  }
}

// ============================================================
// SELLER STORE
// ============================================================
export async function fetchSellerStore() {
  const profile = getCurrentProfile()
  if (!profile) return null

  const { data } = await supabase
    .from('seller_stores')
    .select('*')
    .eq('owner_id', profile.id)
    .single()

  return data
}

export async function createSellerStore(store: {
  name: string
  description?: string
  category?: string
  location?: string
  phone?: string
  business_type?: string
}): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  const slug = store.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

  const { error } = await supabase.from('seller_stores').insert({
    owner_id: profile.id,
    name: store.name,
    slug,
    description: store.description,
    category: store.category,
    location: store.location,
    phone: store.phone,
    business_type: store.business_type,
    logo_initial: store.name[0],
  })

  if (!error) {
    // Update user role to seller
    await supabase
      .from('profiles')
      .update({ role: 'seller' })
      .eq('id', profile.id)
  }

  return !error
}

// ============================================================
// BROWSING HISTORY
// ============================================================
export async function addToBrowsingHistory(productId: string): Promise<void> {
  const profile = getCurrentProfile()
  if (!profile) return

  // Remove existing entry for this product
  await supabase
    .from('browsing_history')
    .delete()
    .eq('user_id', profile.id)
    .eq('product_id', productId)

  // Insert fresh entry
  await supabase.from('browsing_history').insert({
    user_id: profile.id,
    product_id: productId,
  })

  // Keep only last 50
  const { data: old } = await supabase
    .from('browsing_history')
    .select('id')
    .eq('user_id', profile.id)
    .order('viewed_at', { ascending: false })
    .range(50, 999)

  if (old?.length) {
    await supabase
      .from('browsing_history')
      .delete()
      .in('id', old.map((o: any) => o.id))
  }
}

// ============================================================
// COINS & MEMBERSHIP
// ============================================================
export async function useCoins(amount: number): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile || profile.coins < amount) return false

  const { error } = await supabase
    .from('profiles')
    .update({ coins: profile.coins - amount })
    .eq('id', profile.id)

  return !error
}

export async function upgradeMembership(tier: string): Promise<boolean> {
  const profile = getCurrentProfile()
  if (!profile) return false

  const { error } = await supabase
    .from('profiles')
    .update({ membership: tier })
    .eq('id', profile.id)

  return !error
}
