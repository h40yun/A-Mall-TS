// ==================== WISHLIST PAGE ====================
import { ALL_PRODUCTS as PRODUCTS } from '../utils/data'
import { getWishlist } from '../utils/helpers'
import { renderProductCard, renderPage, renderEmptyState } from '../components'

export function renderWishlistPage(): void {
  const wishlist = getWishlist()
  const container = document.createElement('div')

  if (wishlist.length === 0) {
    container.appendChild(renderEmptyState('♥', 'Your wishlist is empty', 'Save items you love to your wishlist', 'Start Shopping'))
    renderPage(container)
    return
  }

  const products = PRODUCTS.filter(p => wishlist.includes(p.id))
  const grid = document.createElement('div')
  grid.className = 'product-grid'
  grid.style.maxWidth = '1200px'
  grid.style.margin = '0 auto'
  grid.style.padding = '20px'
  products.forEach(p => grid.appendChild(renderProductCard(p)))

  const section = document.createElement('div')
  section.className = 'section'
  section.innerHTML = `<div class="section-header"><h2 class="section-title">My Wishlist (${products.length})</h2></div>`
  section.appendChild(grid)
  container.appendChild(section)

  renderPage(container)
}
