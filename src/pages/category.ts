// ==================== CATEGORY PAGE ====================
import { PRODUCTS, CATEGORIES } from '../utils/data'
import { formatPrice, paginate, getUrlParam, searchProducts } from '../utils/helpers'
import { renderProductCard, renderPage } from '../components'
import type { Product } from '../types'

export function renderCategoryPage(): void {
  let currentSort = 'popular'
  let currentPage = 1
  const perPage = 18
  let filteredProducts: Product[] = [...PRODUCTS]

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="page-layout">
      <aside class="sidebar" id="filterSidebar">
        <div class="sidebar-title">Filters</div>
        <div class="sidebar-section">
          <h4>Category</h4>
          <div id="catFilters"></div>
        </div>
        <div class="sidebar-section">
          <h4>Price Range</h4>
          <div class="price-inputs">
            <input type="number" id="priceMin" placeholder="Min" min="0">
            <span>-</span>
            <input type="number" id="priceMax" placeholder="Max" min="0">
          </div>
          <button class="btn btn-sm btn-primary" style="margin-top:8px;width:100%" id="applyPriceBtn">Apply</button>
        </div>
        <div class="sidebar-section">
          <h4>Rating</h4>
          <label><input type="radio" name="rating" value="" checked> All</label>
          <label><input type="radio" name="rating" value="4"> ★★★★ & Up</label>
          <label><input type="radio" name="rating" value="3"> ★★★ & Up</label>
          <label><input type="radio" name="rating" value="2"> ★★ & Up</label>
        </div>
        <div class="sidebar-section">
          <h4>Brand</h4>
          <div id="brandFilters"></div>
        </div>
      </aside>
      <div class="content-area">
        <div class="breadcrumb"><a href="/">Home</a> / <span id="breadcrumbCat">All Products</span></div>
        <button class="mobile-filter-btn" id="mobileFilterBtn">☰ Filters</button>
        <div class="filter-chips" id="activeFilters"></div>
        <div class="sort-bar">
          <span>Sort by:</span>
          <button class="sort-btn active" data-sort="popular">Popular</button>
          <button class="sort-btn" data-sort="newest">Newest</button>
          <button class="sort-btn" data-sort="price-asc">Price: Low to High</button>
          <button class="sort-btn" data-sort="price-desc">Price: High to Low</button>
          <button class="sort-btn" data-sort="rating">Top Rated</button>
        </div>
        <div class="results-info" id="resultsInfo"></div>
        <div class="product-grid" id="productGrid"></div>
        <div class="pagination" id="pagination"></div>
      </div>
    </div>
  `

  renderPage(container)

  // Init category filters
  const catFiltersEl = container.querySelector('#catFilters')!
  catFiltersEl.innerHTML = `<label><input type="radio" name="cat" value="" checked> All Categories</label>`
  CATEGORIES.forEach(cat => {
    catFiltersEl.innerHTML += `<label><input type="radio" name="cat" value="${cat.name}"> ${cat.icon} ${cat.name}</label>`
  })

  // Init brand filters
  const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort()
  const brandFiltersEl = container.querySelector('#brandFilters')!
  brands.forEach(brand => {
    brandFiltersEl.innerHTML += `<label><input type="checkbox" value="${brand}"> ${brand}</label>`
  })

  // Sort buttons
  container.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'))
      this.classList.add('active')
      currentSort = this.dataset.sort!
      applyFilters()
    })
  })

  // Filter change listeners
  container.querySelectorAll('input[name="cat"], input[name="rating"]').forEach(input => {
    input.addEventListener('change', () => applyFilters())
  })
  container.querySelectorAll('#brandFilters input').forEach(input => {
    input.addEventListener('change', () => applyFilters())
  })
  container.querySelector('#applyPriceBtn')?.addEventListener('click', () => applyFilters())

  // Mobile filter
  container.querySelector('#mobileFilterBtn')?.addEventListener('click', () => {
    container.querySelector('#filterSidebar')?.classList.toggle('show')
  })

  function applyFilters() {
    const cat = (container.querySelector('input[name="cat"]:checked') as HTMLInputElement)?.value || ''
    const minPrice = parseFloat((container.querySelector('#priceMin') as HTMLInputElement).value) || 0
    const maxPrice = parseFloat((container.querySelector('#priceMax') as HTMLInputElement).value) || Infinity
    const minRating = parseFloat((container.querySelector('input[name="rating"]:checked') as HTMLInputElement)?.value) || 0
    const selectedBrands = [...container.querySelectorAll('#brandFilters input:checked')].map(i => (i as HTMLInputElement).value)

    filteredProducts = PRODUCTS.filter(p => {
      if (cat && p.category !== cat) return false
      if (p.price < minPrice || p.price > maxPrice) return false
      if (p.rating < minRating) return false
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false
      return true
    })

    switch (currentSort) {
      case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break
      case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break
      case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating); break
      case 'newest': filteredProducts.sort((a, b) => b.id - a.id); break
      default: filteredProducts.sort((a, b) => b.sold - a.sold); break
    }

    currentPage = 1
    renderProducts()
  }

  function renderProducts() {
    const result = paginate(filteredProducts, currentPage, perPage)
    const grid = container.querySelector('#productGrid')!
    const info = container.querySelector('#resultsInfo')!
    const pag = container.querySelector('#pagination')!

    if (result.items.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters</p></div>'
      info.textContent = ''
      pag.innerHTML = ''
      return
    }

    info.textContent = `Showing ${(currentPage - 1) * perPage + 1}-${Math.min(currentPage * perPage, result.total)} of ${result.total} products`
    grid.innerHTML = ''
    result.items.forEach(p => grid.appendChild(renderProductCard(p)))

    pag.innerHTML = ''
    if (currentPage > 1) pag.innerHTML += `<button data-page="${currentPage - 1}">‹</button>`
    for (let i = 1; i <= result.totalPages; i++) {
      pag.innerHTML += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`
    }
    if (currentPage < result.totalPages) pag.innerHTML += `<button data-page="${currentPage + 1}">›</button>`

    pag.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = Number((btn as HTMLElement).dataset.page)
        renderProducts()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }

  // Init from URL
  const urlCat = getUrlParam('cat')
  if (urlCat) {
    const radio = container.querySelector(`input[name="cat"][value="${urlCat}"]`) as HTMLInputElement
    if (radio) radio.checked = true
    container.querySelector('#breadcrumbCat')!.textContent = urlCat
  }
  const urlQ = getUrlParam('q')
  if (urlQ) {
    filteredProducts = searchProducts(urlQ, PRODUCTS)
    container.querySelector('#breadcrumbCat')!.textContent = `Search: "${urlQ}"`
  }

  applyFilters()
}
