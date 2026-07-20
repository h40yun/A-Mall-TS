// ==================== UI COMPONENTS ====================
import { getCurrentUser, getCartCount, isAdmin, logout, formatPrice, renderStars, getDiscount, getProductImage, getProductInitials, getProductColor, isInWishlist, toggleWishlist, updateCartBadge, getSearchHistory, addSearchHistory, searchProducts } from '../utils/helpers'
import { PRODUCTS, CATEGORIES } from '../utils/data'
import { navigate } from '../router'
import type { Product } from '../types'

// ---- Free Shipping Banner ----
export function renderFreeShippingBanner(): HTMLElement {
  const banner = document.createElement('div')
  banner.className = 'free-shipping-banner'
  banner.innerHTML = `<span>🚚 FREE SHIPPING on orders over $50</span><span> | </span><a href="/category">Shop Now</a>`
  return banner
}

// ---- Header ----
export function renderHeader(): HTMLElement {
  const user = getCurrentUser()
  const cartCount = getCartCount()

  const header = document.createElement('header')
  header.className = 'header'
  header.innerHTML = `
    <div class="header-top">
      <a href="/" class="logo">ALLIANCE MALL<span>TK</span></a>
      <div class="search-wrapper">
        <div class="search-bar">
          <select class="search-cat-select" id="searchCatSelect">
            <option value="">All Categories</option>
            ${CATEGORIES.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('')}
          </select>
          <input type="text" id="searchInput" placeholder="Search for products, brands, and more..." autocomplete="off">
          <button id="searchBtn">Search</button>
        </div>
        <div class="search-suggestions" id="searchSuggestions" style="display:none"></div>
      </div>
      <div class="header-actions">
        <a href="/track-order" title="Track Order">📦 <span class="text">Track</span></a>
        <a href="/messages" title="Messages">💬 <span class="text">Messages</span></a>
        <a href="/notifications" title="Notifications">🔔 <span class="text">Notifications</span></a>
        <a href="/cart" title="Cart">🛒 <span class="text">Cart</span><span class="cart-badge" style="display:${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span></a>
        <a href="/wishlist" title="Wishlist">♥ <span class="text">Wishlist</span></a>
        ${user ? `
          <div class="user-dropdown">
            <a href="/profile">👤 <span class="text">${user.name.split(' ')[0]}</span></a>
            <div class="dropdown-menu">
              <a href="/profile?tab=orders">📦 My Orders</a>
              <a href="/track-order">🚚 Track Order</a>
              <a href="/wishlist">♥ My Wishlist</a>
              <a href="/profile?tab=addresses">📍 My Addresses</a>
              <a href="/profile?tab=vouchers">🎟️ My Vouchers</a>
              <a href="/profile?tab=settings">⚙️ Account Settings</a>
              ${isAdmin() ? '<a href="/admin">🛡️ Admin Panel</a>' : ''}
              <a href="/seller">🏪 Seller Center</a>
              <hr style="margin:6px 0;border:none;border-top:1px solid #e0e0e0">
              <a href="#" id="logoutBtn">🚪 Logout</a>
            </div>
          </div>
        ` : `<a href="/auth">👤 <span class="text">Login</span></a>`}
        <a href="/sell" class="sell-link">🏷️ <span class="text">Sell</span></a>
      </div>
    </div>
  `

  // Search functionality
  const searchInput = header.querySelector('#searchInput') as HTMLInputElement
  const searchBtn = header.querySelector('#searchBtn') as HTMLButtonElement
  const searchCatSelect = header.querySelector('#searchCatSelect') as HTMLSelectElement
  const suggestionsEl = header.querySelector('#searchSuggestions') as HTMLElement

  const doSearch = () => {
    const q = searchInput.value.trim()
    if (q) {
      addSearchHistory(q)
      const cat = searchCatSelect.value
      navigate(`/search?q=${encodeURIComponent(q)}${cat ? `&cat=${encodeURIComponent(cat)}` : ''}`)
      suggestionsEl.style.display = 'none'
    }
  }

  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch() })
  searchBtn.addEventListener('click', doSearch)

  // Autocomplete suggestions
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase()
    if (q.length < 2) {
      // Show search history
      const history = getSearchHistory()
      if (history.length) {
        suggestionsEl.innerHTML = `
          <div class="suggestion-header"><span>Recent Searches</span><a href="#" id="clearHistory">Clear</a></div>
          ${history.map(h => `<div class="suggestion-item" data-query="${h}"><span class="suggestion-icon">🕐</span>${h}</div>`).join('')}
        `
        suggestionsEl.style.display = 'block'
        header.querySelector('#clearHistory')?.addEventListener('click', (e) => {
          e.preventDefault()
          localStorage.removeItem('am_search_history')
          suggestionsEl.style.display = 'none'
        })
      }
      return
    }

    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 8)

    if (matches.length) {
      suggestionsEl.innerHTML = matches.map(p => `
        <div class="suggestion-item" data-id="${p.id}">
          <img src="${getProductImage(p)}" class="suggestion-img" onerror="this.style.display='none'">
          <div class="suggestion-info">
            <div class="suggestion-name">${p.name}</div>
            <div class="suggestion-price">${formatPrice(p.price)}</div>
          </div>
        </div>
      `).join('')
      suggestionsEl.style.display = 'block'
    } else {
      suggestionsEl.style.display = 'none'
    }
  })

  // Click on suggestion
  suggestionsEl.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest('.suggestion-item') as HTMLElement
    if (!item) return
    const id = item.dataset.id
    const query = item.dataset.query
    if (id) navigate(`/product/${id}`)
    else if (query) { searchInput.value = query; doSearch() }
    suggestionsEl.style.display = 'none'
  })

  // Hide suggestions on blur
  searchInput.addEventListener('blur', () => {
    setTimeout(() => { suggestionsEl.style.display = 'none' }, 200)
  })
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2 || getSearchHistory().length) {
      searchInput.dispatchEvent(new Event('input'))
    }
  })

  const logoutBtn = header.querySelector('#logoutBtn')
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout() })

  return header
}

// ---- Category Nav (with subcategories) ----
export function renderCategoryNav(): HTMLElement {
  const nav = document.createElement('nav')
  nav.className = 'cat-nav'
  nav.innerHTML = `
    <ul>
      <li><a href="/">🏠 Home</a></li>
      <li class="has-mega">
        <a href="/category">📂 Categories ▾</a>
        <div class="mega-menu">
          ${CATEGORIES.map(cat => `
            <div class="mega-col">
              <h4>${cat.icon} ${cat.name}</h4>
              <a href="/category?cat=${encodeURIComponent(cat.name)}">All ${cat.name}</a>
              ${(cat.subcategories || []).map(sub => `<a href="/category?cat=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}">${sub}</a>`).join('')}
            </div>
          `).join('')}
        </div>
      </li>
      <li><a href="/deals">🔥 Deals</a></li>
      ${CATEGORIES.slice(0, 5).map(cat => `<li><a href="/category?cat=${encodeURIComponent(cat.name)}">${cat.icon} ${cat.name}</a></li>`).join('')}
      <li><a href="/stores">🏪 Stores</a></li>
    </ul>
  `
  return nav
}

// ---- Footer ----
export function renderFooter(): HTMLElement {
  const footer = document.createElement('footer')
  footer.className = 'footer'
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-col">
        <h3>ALLIANCE MALL TK</h3>
        <p style="font-size:13px;color:#999;line-height:1.6">Your one-stop online marketplace for everything you need. Quality products at the best prices.</p>
        <div style="display:flex;gap:10px;margin-top:12px">
          <a href="#">📘</a><a href="#">🐦</a><a href="#">📸</a><a href="#">🎬</a>
        </div>
      </div>
      <div class="footer-col">
        <h3>Customer Service</h3>
        <a href="/help">Help Center</a>
        <a href="/how-to-buy">How to Buy</a>
        <a href="/shipping">Shipping & Delivery</a>
        <a href="/return-policy">Return & Refund Policy</a>
        <a href="/payment-methods">Payment Methods</a>
        <a href="/track-order">Track Your Order</a>
        <a href="/contact">Contact Us</a>
      </div>
      <div class="footer-col">
        <h3>About Alliance Mall</h3>
        <a href="/about">About Us</a>
        <a href="/blog">Blog</a>
        <a href="/stores">All Stores</a>
        <a href="/sell">Become a Seller</a>
        <a href="/deals">Deals & Promotions</a>
        <a href="#">Careers</a>
        <a href="#">Affiliate Program</a>
      </div>
      <div class="footer-col">
        <h3>Legal</h3>
        <a href="/terms">Terms & Conditions</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="#">Cookie Policy</a>
        <a href="#">Seller Agreement</a>
      </div>
      <div class="footer-col">
        <h3>Payment Methods</h3>
        <div class="payment-icons">
          <span>💳 Visa</span><span>💳 Mastercard</span><span>💳 Amex</span>
        </div>
        <div class="payment-icons" style="margin-top:8px">
          <span>🅿️ PayPal</span><span>📱 Apple Pay</span><span>🟢 Google Pay</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">© 2026 Alliance Mall TK. All rights reserved. | Built with ♥ | <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/contact">Contact</a></div>
  `
  return footer
}

// ---- Product Card ----
export function renderProductCard(product: Product): HTMLElement {
  const discount = getDiscount(product.price, product.originalPrice)
  const wishlisted = isInWishlist(product.id)

  const card = document.createElement('div')
  card.className = 'card product-card'
  card.innerHTML = `
    <div class="product-img-wrap">
      <img class="product-img" src="${getProductImage(product)}" alt="${product.name}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" style="display:block">
      <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
      ${discount >= 40 ? `<span class="discount-badge">-${discount}%</span>` : ''}
      ${product.freeShipping ? '<span class="free-ship-badge">Free Ship</span>' : ''}
      <button class="wishlist-btn ${wishlisted ? 'active' : ''}">${wishlisted ? '♥' : '♡'}</button>
    </div>
    <div class="product-info">
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)} <span class="original">${formatPrice(product.originalPrice)}</span></div>
      <div class="product-meta">
        <span class="stars">${renderStars(product.rating)}</span>
        <span>${product.sold > 1000 ? (product.sold / 1000).toFixed(1) + 'k' : product.sold} sold</span>
      </div>
    </div>
  `

  card.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.wishlist-btn')) {
      e.stopPropagation()
      const btn = card.querySelector('.wishlist-btn')!
      const isNow = toggleWishlist(product.id)
      btn.textContent = isNow ? '♥' : '♡'
      btn.classList.toggle('active', isNow)
      return
    }
    navigate(`/product/${product.id}`)
  })

  return card
}

// ---- Toast Container ----
export function ensureToastContainer(): void {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div')
    container.className = 'toast-container'
    document.body.appendChild(container)
  }
}

// ---- Page Wrapper ----
export function renderPage(content: HTMLElement | HTMLElement[]): void {
  const app = document.getElementById('app')!
  app.innerHTML = ''
  app.appendChild(renderFreeShippingBanner())
  app.appendChild(renderHeader())
  app.appendChild(renderCategoryNav())
  const main = document.createElement('div')
  main.className = 'main-content'
  if (Array.isArray(content)) content.forEach(c => main.appendChild(c))
  else main.appendChild(content)
  app.appendChild(main)
  app.appendChild(renderFooter())
  updateCartBadge()
}

// ---- Empty State ----
export function renderEmptyState(icon: string, title: string, text: string, btnText?: string, btnHref?: string): HTMLElement {
  const div = document.createElement('div')
  div.className = 'empty-state'
  div.innerHTML = `
    <div class="icon">${icon}</div>
    <h3>${title}</h3>
    <p>${text}</p>
    ${btnText ? `<a href="${btnHref || '/'}" class="btn btn-primary">${btnText}</a>` : ''}
  `
  return div
}

// ---- Section ----
export function renderSection(title: string, linkText: string, linkHref: string, content: HTMLElement): HTMLElement {
  const section = document.createElement('div')
  section.className = 'section'
  section.innerHTML = `<div class="section-header"><h2 class="section-title">${title}</h2>${linkText ? `<a href="${linkHref}" class="section-link">${linkText} &gt;</a>` : ''}</div>`
  section.appendChild(content)
  return section
}
