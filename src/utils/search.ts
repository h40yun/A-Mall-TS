// ==================== SEARCH SERVICE ====================
// Full-text search using Supabase FTS
import { supabase } from './supabase'
import type { Product } from '../types'

// ============================================================
// FULL-TEXT SEARCH
// ============================================================
export async function fullTextSearch(
  query: string,
  options?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    freeShipping?: boolean
    sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
    page?: number
    perPage?: number
  }
): Promise<{ products: Product[]; total: number }> {
  const page = options?.page || 1
  const perPage = options?.perPage || 24
  const from = (page - 1) * perPage

  let dbQuery = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .textSearch('name', query, { type: 'websearch', config: 'english' })

  if (options?.category) dbQuery = dbQuery.eq('category', options.category)
  if (options?.minPrice) dbQuery = dbQuery.gte('price', options.minPrice)
  if (options?.maxPrice) dbQuery = dbQuery.lte('price', options.maxPrice)
  if (options?.minRating) dbQuery = dbQuery.gte('rating', options.minRating)
  if (options?.freeShipping) dbQuery = dbQuery.eq('free_shipping', true)

  switch (options?.sort) {
    case 'price-asc': dbQuery = dbQuery.order('price', { ascending: true }); break
    case 'price-desc': dbQuery = dbQuery.order('price', { ascending: false }); break
    case 'rating': dbQuery = dbQuery.order('rating', { ascending: false }); break
    case 'newest': dbQuery = dbQuery.order('created_at', { ascending: false }); break
    default: dbQuery = dbQuery.order('sold', { ascending: false }); break
  }

  dbQuery = dbQuery.range(from, from + perPage - 1)

  const { data, error, count } = await dbQuery
  if (error) {
    console.error('[Search] FTS error:', error)
    // Fallback to ILIKE search
    return ilikeSearch(query, options)
  }

  return { products: (data || []) as Product[], total: count || 0 }
}

// ============================================================
// FALLBACK: ILIKE SEARCH
// ============================================================
async function ilikeSearch(
  query: string,
  options?: any
): Promise<{ products: Product[]; total: number }> {
  const page = options?.page || 1
  const perPage = options?.perPage || 24
  const from = (page - 1) * perPage

  let dbQuery = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)

  if (options?.category) dbQuery = dbQuery.eq('category', options.category)
  dbQuery = dbQuery.range(from, from + perPage - 1)

  const { data, count } = await dbQuery
  return { products: (data || []) as Product[], total: count || 0 }
}

// ============================================================
// AUTOCOMPLETE SUGGESTIONS
// ============================================================
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (query.length < 2) return []

  const { data } = await supabase
    .from('products')
    .select('name')
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .limit(8)

  if (!data) return []

  // Deduplicate and return unique names
  const seen = new Set<string>()
  return data
    .map((p: any) => p.name)
    .filter(name => {
      if (seen.has(name)) return false
      seen.add(name)
      return true
    })
}

// ============================================================
// SEARCH HISTORY (per user)
// ============================================================
const SEARCH_HISTORY_KEY = 'am_search_history'

export function getSearchHistory(): string[] {
  return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
}

export function addSearchHistory(query: string): void {
  let history = getSearchHistory().filter(q => q !== query)
  history.unshift(query)
  if (history.length > 10) history = history.slice(0, 10)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
}

export function clearSearchHistory(): void {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}
