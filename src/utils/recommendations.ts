// ==================== RECOMMENDATION ENGINE ====================
// ML-based product recommendations
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'
import type { Product } from '../types'

// ============================================================
// PERSONALIZED RECOMMENDATIONS
// ============================================================
export async function getPersonalizedRecommendations(limit = 12): Promise<Product[]> {
  const profile = getCurrentProfile()

  if (profile) {
    // Get user's browsing history and purchase history
    const [browsing, orders] = await Promise.all([
      supabase
        .from('browsing_history')
        .select('product_id, products(*)')
        .eq('user_id', profile.id)
        .order('viewed_at', { ascending: false })
        .limit(20),
      supabase
        .from('orders')
        .select('order_items(product_id, products(*))')
        .eq('user_id', profile.id)
        .limit(10),
    ])

    // Extract categories and brands from history
    const viewedProducts = (browsing.data || [])
      .map((b: any) => b.products)
      .filter(Boolean)

    const boughtProducts = (orders.data || [])
      .flatMap((o: any) => o.order_items || [])
      .map((i: any) => i.products)
      .filter(Boolean)

    const allInteracted = [...viewedProducts, ...boughtProducts]

    if (allInteracted.length > 0) {
      // Find most interacted categories
      const categoryCount = new Map<string, number>()
      const brandCount = new Map<string, number>()

      allInteracted.forEach((p: any) => {
        categoryCount.set(p.category, (categoryCount.get(p.category) || 0) + 1)
        brandCount.set(p.brand, (brandCount.get(p.brand) || 0) + 1)
      })

      const topCategories = [...categoryCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat)

      const interactedIds = new Set(allInteracted.map((p: any) => p.id))

      // Get recommendations from top categories, excluding already viewed
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .in('category', topCategories)
        .not('id', 'in', `(${[...interactedIds].join(',')})`)
        .order('sold', { ascending: false })
        .limit(limit)

      if (data?.length) return data as Product[]
    }
  }

  // Fallback: trending products
  return getTrendingProducts(limit)
}

// ============================================================
// TRENDING PRODUCTS
// ============================================================
export async function getTrendingProducts(limit = 12): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sold', { ascending: false })
    .limit(limit)

  return (data || []) as Product[]
}

// ============================================================
// SIMILAR PRODUCTS
// ============================================================
export async function getSimilarProducts(productId: string, limit = 6): Promise<Product[]> {
  const { data: product } = await supabase
    .from('products')
    .select('category, subcategory, brand')
    .eq('id', productId)
    .single()

  if (!product) return []

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', productId)
    .or(`category.eq.${product.category},brand.eq.${product.brand}`)
    .order('sold', { ascending: false })
    .limit(limit)

  return (data || []) as Product[]
}

// ============================================================
// FREQUENTLY BOUGHT TOGETHER
// ============================================================
export async function getFrequentlyBoughtTogether(
  productId: string,
  limit = 3
): Promise<Product[]> {
  // Find orders containing this product
  const { data: orders } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('product_id', productId)
    .limit(100)

  if (!orders?.length) return []

  const orderIds = orders.map((o: any) => o.order_id)

  // Find other products in those orders
  const { data: coProducts } = await supabase
    .from('order_items')
    .select('product_id, products(*)')
    .in('order_id', orderIds)
    .neq('product_id', productId)
    .limit(50)

  if (!coProducts?.length) return []

  // Count frequency
  const freq = new Map<string, { product: any; count: number }>()
  coProducts.forEach((item: any) => {
    if (!item.products) return
    const existing = freq.get(item.product_id)
    if (existing) existing.count++
    else freq.set(item.product_id, { product: item.products, count: 1 })
  })

  return [...freq.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(item => item.product as Product)
}

// ============================================================
// NEW ARRIVALS
// ============================================================
export async function getNewArrivals(limit = 12): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data || []) as Product[]
}

// ============================================================
// TOP RATED
// ============================================================
export async function getTopRated(limit = 12): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .gte('rating', 4.5)
    .order('rating', { ascending: false })
    .limit(limit)

  return (data || []) as Product[]
}
