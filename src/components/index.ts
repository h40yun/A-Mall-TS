// ==================== UI COMPONENTS ====================
import { getCurrentProfile, isLoggedIn, isAdmin, isSeller, logout } from '../utils/auth'
import { getCartCount, getUnreadNotificationCount, fetchWishlist } from '../utils/db'
import { formatPrice, renderStars, getDiscount, getProductImage, getProductInitials, getProductColor } from '../utils/helpers'
import { CATEGORIES } from '../utils/data'
import { navigate } from '../router'
import { LANGUAGES, getCurrentLanguage, setLanguage } from '../utils/i18n'
import type { Product } from '../types'

export function renderFreeShippingBanner(): HTMLElement {
  const banner = document.createElement('div')
  banner.className = 'free-shipping-banner'
  banner.innerHTML = `<span>🚚 FREE SHIPPING on orders over $50</span><span> | </span><a href="/deals">Vouchers</a><span> | </span><a href="/sell">Sell on Alliance Mall</a>`
  return banner
}

export function renderHeader(): HTMLElement {
  const profile = getCurrentProfile()
  const header = document.createElement('header')
  header.className = 'header'

  // Cart count & notifications (async, update after render)
  let cartCount = 0
  let unreadNotifs = 0

  header.innerHTML = `
    <div class="header-top">
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">☰</button>
      <a href="/" class="logo">ALLIANCE MALL<span>TK</span></a>
      <div class="search-wrapper">
        <div class="search-bar">
          <select class="search-cat-select" id="searchCatSelect">
            <option value="">All</option>
            ${CATEGORIES.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('')}
          </select>
          <input type="text" id="searchInput" placeholder="Search for products, brands..." autocomplete="off">
          <button id="searchBtn">Search</button>
        </div>
        <div class="search-suggestions" id="searchSuggestions" style="display:none"></div>
      </div>
      <div class="header-actions">
        <a href="/track-order" title="Track Order">📦 <span class="text">Track</span></a>
        ${isLoggedIn() ? `
          <a href="/messages" title="Messages">💬 <span class="text">Messages</span></a>
          <a href="/notifications" title="Notifications">🔔 <span class="text">Notifications</span><span class="notif-badge" id="notifBadge" style="display:none"></span></a>
        ` : `
          <a href="/auth" title="Messages">💬 <span class="text">Messages</span></a>
          <a href="/auth" title="Notifications">🔔 <span class="text">Notifications</span></a>
        `}
        <a href="/cart" title="Cart">🛒 <span class="text">Cart</span><span class="cart-badge" id="cartBadge" style="display:none">0</span></a>
        <a href="/wishlist" title="Wishlist">♥ <span class="text">Wishlist</span></a>
        ${profile ? `
          <div class="user-dropdown">
            <a href="/profile">👤 <span class="text">${profile.name.split(' ')[0]}</span></a>
            <div class="dropdown-menu">
              <div style="padding:12px 16px;border-bottom:1px solid #e0e0e0">
                <strong>${profile.name}</strong>
                <div style="font-size:11px;color:#999">${profile.email}</div>
                <div style="font-size:12px;color:#f39c12;margin-top:4px">🪙 ${profile.coins || 0} coins</div>
              </div>
              <a href="/profile?tab=orders">📦 My Orders</a>
              <a href="/track-order">🚚 Track Order</a>
              <a href="/wishlist">♥ My Wishlist</a>
              <a href="/profile?tab=addresses">📍 My Addresses</a>
              <a href="/profile?tab=vouchers">🎟️ My Vouchers</a>
              <a href="/profile?tab=coins">🪙 Coins & Membership</a>
              <a href="/profile?tab=settings">⚙️ Account Settings</a>
              <hr style="margin:6px 0;border:none;border-top:1px solid #e0e0e0">
              ${isAdmin() ? '<a href="/admin">🛡️ Admin Panel</a>' : ''}
              ${isSeller() ? '<a href="/seller">🏪 Seller Dashboard</a>' : '<a href="/sell">🏪 Become a Seller</a>'}
              <hr style="margin:6px 0;border:none;border-top:1px solid #e0e0e0">
              <a href="#" id="logoutBtn">🚪 Logout</a>
            </div>
          </div>
        ` : `
          <a href="/auth">👤 <span class="text">Login</span></a>
          <a href="/auth?tab=register" class="sell-link" style="background:rgba(255,255,255,0.2)">Register</a>
        `}
        <a href="/seller/login" class="sell-link">🏷️ <span class="text">Sell</span></a>
        <button class="dark-mode-toggle" id="darkModeToggle" title="Toggle Dark Mode">${document.body.classList.contains('dark-mode') ? '☀️' : '🌙'}</button>
        <div class="lang-selector" style="position:relative">
          <button class="dark-mode-toggle" id="langToggle" title="Language" style="font-size:14px">${LANGUAGES.find(l => l.code === getCurrentLanguage())?.flag || '🌐'}</button>
          <div class="lang-dropdown" id="langDropdown" style="display:none;position:absolute;right:0;top:100%;background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);min-width:200px;max-height:400px;overflow-y:auto;z-index:9999;padding:8px 0">
            ${LANGUAGES.map(l => `<button class="lang-option" data-code="${l.code}" style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 16px;border:none;background:${l.code === getCurrentLanguage() ? '#fff5f3' : 'transparent'};cursor:pointer;font-size:13px;text-align:left;transition:background 0.2s"><span style="font-size:18px">${l.flag}</span><span style="flex:1">${l.nativeName}</span>${l.code === getCurrentLanguage() ? '<span style="color:#ee4d2d;font-weight:700">✓</span>' : ''}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `

  // Async: update cart count & notifications
  setTimeout(async () => {
    const [count, notifs] = await Promise.all([getCartCount(), getUnreadNotificationCount()])
    const badge = header.querySelector('#cartBadge') as HTMLElement
    if (badge) { badge.textContent = String(count); badge.style.display = count > 0 ? 'flex' : 'none' }
    const notifBadge = header.querySelector('#notifBadge') as HTMLElement
    if (notifBadge) { notifBadge.textContent = String(notifs); notifBadge.style.display = notifs > 0 ? 'flex' : 'none' }
  }, 0)

  // Search
  const searchInput = header.querySelector('#searchInput') as HTMLInputElement
  const searchBtn = header.querySelector('#searchBtn') as HTMLButtonElement
  const searchCatSelect = header.querySelector('#searchCatSelect') as HTMLSelectElement
  const suggestionsEl = header.querySelector('#searchSuggestions') as HTMLElement

  const doSearch = () => {
    const q = searchInput.value.trim()
    if (q) {
      const cat = searchCatSelect.value
      navigate(`/search?q=${encodeURIComponent(q)}${cat ? `&cat=${encodeURIComponent(cat)}` : ''}`)
      suggestionsEl.style.display = 'none'
    }
  }
  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch() })
  searchBtn.addEventListener('click', doSearch)

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase()
    if (q.length < 2) { suggestionsEl.style.display = 'none'; return }
    // Use local category data for suggestions
    const matches = CATEGORIES.flatMap(c => c.subcategories || [])
      .filter(s => s.name.toLowerCase().includes(q))
      .slice(0, 5)
    if (matches.length) {
      suggestionsEl.innerHTML = matches.map(s => `<div class="suggestion-item" data-query="${s.name}"><span class="suggestion-icon">📂</span>${s.name}</div>`).join('')
      suggestionsEl.style.display = 'block'
    } else suggestionsEl.style.display = 'none'
  })

  suggestionsEl.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest('.suggestion-item') as HTMLElement
    if (item?.dataset.query) { searchInput.value = item.dataset.query; doSearch() }
    suggestionsEl.style.display = 'none'
  })
  searchInput.addEventListener('blur', () => { setTimeout(() => { suggestionsEl.style.display = 'none' }, 200) })

  const logoutBtn = header.querySelector('#logoutBtn')
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout() })

  // Language selector
  const langToggle = header.querySelector('#langToggle')
  const langDropdown = header.querySelector('#langDropdown') as HTMLElement
  if (langToggle && langDropdown) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation()
      langDropdown.style.display = langDropdown.style.display === 'none' ? 'block' : 'none'
    })
    langDropdown.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const code = this.dataset.code
        if (code) { setLanguage(code); langDropdown.style.display = 'none'; location.reload() }
      })
    })
    document.addEventListener('click', () => { langDropdown.style.display = 'none' })
  }

  return header
}

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
              ${(cat.subcategories || []).map(sub => `<a href="/category?cat=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name)}">${sub.name}</a>`).join('')}
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

export function renderFooter(): HTMLElement {
  const footer = document.createElement('footer')
  footer.className = 'footer'
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-col">
        <h3>ALLIANCE MALL TK</h3>
        <p style="font-size:13px;color:#999;line-height:1.6">Your one-stop online marketplace.</p>
        <div style="display:flex;gap:10px;margin-top:12px"><a href="#">📘</a><a href="#">🐦</a><a href="#">📸</a><a href="#">🎬</a></div>
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
        <h3>About</h3>
        <a href="/about">About Us</a>
        <a href="/blog">Blog</a>
        <a href="/stores">All Stores</a>
        <a href="/seller/login">Become a Seller</a>
        <a href="/deals">Deals & Promotions</a>
      </div>
      <div class="footer-col">
        <h3>Legal</h3>
        <a href="/terms">Terms & Conditions</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
      <div class="footer-col">
        <h3>Payment</h3>
        <div class="payment-icons"><span>💳 Visa</span><span>💳 Mastercard</span><span>💳 Amex</span></div>
        <div class="payment-icons" style="margin-top:8px"><span>🅿️ PayPal</span><span>📱 Apple Pay</span><span>🟢 Google Pay</span></div>
      </div>
    </div>
    <div class="footer-bottom">© 2026 Alliance Mall TK. All rights reserved. | <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/contact">Contact</a></div>
  `
  return footer
}

export function renderProductCard(product: Product): HTMLElement {
  const discount = getDiscount(product.price, product.originalPrice || product.price)
  const card = document.createElement('div')
  card.className = 'card product-card'
  card.innerHTML = `
    <div class="product-img-wrap">
      <img class="product-img" src="${getProductImage(product)}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" style="display:block">
      <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
      ${discount >= 40 ? `<span class="discount-badge">-${discount}%</span>` : ''}
      ${product.freeShipping ? '<span class="free-ship-badge">Free Ship</span>' : ''}
      <button class="wishlist-btn">♡</button>
    </div>
    <div class="product-info">
      <div class="product-name">${product.name}</div>
      <div class="product-price">${formatPrice(product.price)} <span class="original">${formatPrice(product.originalPrice || product.price)}</span></div>
      <div class="product-meta">
        <span class="stars">${renderStars(product.rating)}</span>
        <span>${product.sold > 1000 ? (product.sold / 1000).toFixed(1) + 'k' : product.sold} sold</span>
      </div>
    </div>
  `
  card.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.wishlist-btn')) {
      e.stopPropagation()
      // Toggle wishlist async
      import('../utils/db').then(({ toggleWishlist }) => {
        toggleWishlist(String(product.id)).then(isNow => {
          const btn = card.querySelector('.wishlist-btn')!
          btn.textContent = isNow ? '♥' : '♡'
        })
      })
      return
    }
    navigate(`/product/${product.id}`)
  })
  return card
}

export function ensureToastContainer(): void {
  if (!document.querySelector('.toast-container')) {
    const c = document.createElement('div')
    c.className = 'toast-container'
    document.body.appendChild(c)
  }
}

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
}

export function renderEmptyState(icon: string, title: string, text: string, btnText?: string, btnHref?: string): HTMLElement {
  const div = document.createElement('div')
  div.className = 'empty-state'
  div.innerHTML = `<div class="icon">${icon}</div><h3>${title}</h3><p>${text}</p>${btnText ? `<a href="${btnHref || '/'}" class="btn btn-primary">${btnText}</a>` : ''}`
  return div
}

export function renderSection(title: string, linkText: string, linkHref: string, content: HTMLElement): HTMLElement {
  const section = document.createElement('div')
  section.className = 'section'
  section.innerHTML = `<div class="section-header"><h2 class="section-title">${title}</h2>${linkText ? `<a href="${linkHref}" class="section-link">${linkText} &gt;</a>` : ''}</div>`
  section.appendChild(content)
  return section
}

// Skeleton components
export function renderProductCardSkeleton(): HTMLElement {
  const card = document.createElement('div')
  card.className = 'card product-card skeleton-card'
  card.innerHTML = `
    <div class="skeleton" style="width:100%;aspect-ratio:1;border-radius:8px 8px 0 0"></div>
    <div style="padding:12px">
      <div class="skeleton" style="height:14px;width:80%;margin-bottom:8px;border-radius:4px"></div>
      <div class="skeleton" style="height:14px;width:60%;margin-bottom:8px;border-radius:4px"></div>
      <div class="skeleton" style="height:18px;width:40%;margin-bottom:6px;border-radius:4px"></div>
      <div class="skeleton" style="height:12px;width:50%;border-radius:4px"></div>
    </div>
  `
  return card
}

export function renderProductGridSkeleton(count = 6): HTMLElement {
  const grid = document.createElement('div')
  grid.className = 'product-grid'
  for (let i = 0; i < count; i++) grid.appendChild(renderProductCardSkeleton())
  return grid
}
