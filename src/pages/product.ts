// ==================== PRODUCT PAGE ====================
import { PRODUCTS } from '../utils/data'
import { formatPrice, renderStars, getDiscount, getProductImage, getProductInitials, getProductColor, isInWishlist, toggleWishlist, addToCart, getCurrentUser, getUrlParam, getReviews, getProductReviews, showToast, updateCartBadge } from '../utils/helpers'
import { renderProductCard, renderPage } from '../components'
import { navigate, getParam } from '../router'
import type { Product, Review } from '../types'

export function renderProductPage(): void {
  const productId = Number(getParam('id') || getUrlParam('id')) || 1
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0]
  const discount = getDiscount(product.price, product.originalPrice)
  const wishlisted = isInWishlist(product.id)
  const reviews = getProductReviews(product.id)

  document.title = `${product.name} - ALLIANCE MALL TK`

  const container = document.createElement('div')

  // Product Detail
  container.innerHTML = `
    <div class="product-detail">
      <div class="gallery">
        <div class="main-img">
          <img src="${getProductImage(product)}" alt="${product.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
          ${discount >= 40 ? `<span class="discount-badge" style="position:absolute;top:12px;right:12px;font-size:14px;padding:4px 12px">-${discount}%</span>` : ''}
        </div>
      </div>
      <div class="product-info-section">
        <h1>${product.name}</h1>
        <div class="meta-row">
          <span><span class="stars">${renderStars(product.rating)}</span> ${product.rating}</span>
          <span>${product.sold.toLocaleString()} sold</span>
          <span>⭐ ${reviews.length} Reviews</span>
        </div>
        <div class="price-box">
          <span class="current">${formatPrice(product.price)}</span>
          <span class="original">${formatPrice(product.originalPrice)}</span>
          <span class="discount">-${discount}%</span>
        </div>
        <hr class="divider">
        ${product.colors.length ? `
          <div class="variant-section">
            <h3>Color</h3>
            <div class="variant-options">
              ${product.colors.map((c, i) => `<button class="color-btn ${i === 0 ? 'active' : ''}" style="background:${c}" data-color></button>`).join('')}
            </div>
          </div>
        ` : ''}
        <div class="variant-section">
          <h3>Brand</h3>
          <div class="variant-options"><span class="variant-btn active">${product.brand}</span></div>
        </div>
        <div class="qty-section">
          <span>Quantity:</span>
          <div class="qty-selector">
            <button id="qtyMinus">−</button>
            <input type="number" id="qtyInput" value="1" min="1" max="${product.stock}">
            <button id="qtyPlus">+</button>
          </div>
          <span style="font-size:12px;color:#999">${product.stock} available</span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-secondary" id="addToCartBtn">🛒 Add to Cart</button>
          <button class="btn btn-primary" id="buyNowBtn">⚡ Buy Now</button>
        </div>
        <div class="seller-card">
          <div class="seller-avatar">${product.seller[0]}</div>
          <div class="seller-info">
            <h4>${product.seller}</h4>
            <p>Active 2 hours ago · ${Math.floor(Math.random() * 200 + 50)} products</p>
          </div>
          <a href="/store/${encodeURIComponent(product.seller)}" class="btn btn-outline btn-sm" style="margin-left:auto">Visit Shop</a>
        </div>
        <div style="display:flex;gap:12px">
          <button class="btn btn-outline btn-sm" id="wishlistBtn">${wishlisted ? '♥ In Wishlist' : '♡ Wishlist'}</button>
          <button class="btn btn-outline btn-sm" id="shareBtn">🔗 Share</button>
          <a href="/messages" class="btn btn-outline btn-sm">💬 Chat Seller</a>
        </div>
      </div>
    </div>
  `

  // Tabs (Description, Specs, Reviews)
  const tabsSection = document.createElement('div')
  tabsSection.className = 'detail-tabs'
  tabsSection.innerHTML = `
    <div class="tabs">
      <button class="tab-btn active" data-tab="tab-desc">Description</button>
      <button class="tab-btn" data-tab="tab-specs">Specifications</button>
      <button class="tab-btn" data-tab="tab-reviews">Reviews (${reviews.length})</button>
    </div>
    <div class="tab-content active tab-panel" id="tab-desc">
      <h3>Product Description</h3>
      <p>${product.description}</p>
    </div>
    <div class="tab-content tab-panel" id="tab-specs">
      <h3>Specifications</h3>
      <table class="specs-table">
        <tr><td>Brand</td><td>${product.brand}</td></tr>
        <tr><td>Category</td><td>${product.category}</td></tr>
        ${product.specs.split(' | ').map(s => { const [k, v] = s.split(': '); return `<tr><td>${k}</td><td>${v}</td></tr>` }).join('')}
        <tr><td>Stock</td><td>${product.stock} units</td></tr>
      </table>
    </div>
    <div class="tab-content tab-panel" id="tab-reviews">
      ${renderReviewHTML(product, reviews)}
    </div>
  `
  container.appendChild(tabsSection)

  // Related Products
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6)
  if (related.length) {
    const relatedSection = document.createElement('div')
    relatedSection.className = 'related-section'
    relatedSection.innerHTML = '<div class="section-header"><h2 class="section-title">You May Also Like</h2></div>'
    const grid = document.createElement('div')
    grid.className = 'product-grid'
    related.forEach(p => grid.appendChild(renderProductCard(p)))
    relatedSection.appendChild(grid)
    container.appendChild(relatedSection)
  }

  renderPage(container)

  // Event Listeners
  const qtyInput = document.getElementById('qtyInput') as HTMLInputElement
  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    qtyInput.value = String(Math.max(1, Number(qtyInput.value) - 1))
  })
  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    qtyInput.value = String(Math.min(product.stock, Number(qtyInput.value) + 1))
  })
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    addToCart(product.id, Number(qtyInput.value))
    updateCartBadge()
  })
  document.getElementById('buyNowBtn')?.addEventListener('click', () => {
    addToCart(product.id, Number(qtyInput.value))
    navigate('/checkout')
  })
  document.getElementById('wishlistBtn')?.addEventListener('click', function(this: HTMLElement) {
    const isNow = toggleWishlist(product.id)
    this.textContent = isNow ? '♥ In Wishlist' : '♡ Wishlist'
  })
  document.getElementById('shareBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Link copied!')
  })

  // Tab switching
  tabsSection.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      tabsSection.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      tabsSection.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'))
      this.classList.add('active')
      document.getElementById(this.dataset.tab!)?.classList.add('active')
    })
  })

  // Color buttons
  container.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      this.parentElement?.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'))
      this.classList.add('active')
    })
  })

  // Review form
  let selectedRating = 0
  container.querySelectorAll('#starInput .star').forEach(star => {
    star.addEventListener('click', function(this: HTMLElement) {
      selectedRating = Number(this.dataset.val)
      container.querySelectorAll('#starInput .star').forEach((s, i) => {
        s.textContent = i < selectedRating ? '★' : '☆'
        s.classList.toggle('active', i < selectedRating)
      })
    })
  })
  document.getElementById('submitReview')?.addEventListener('click', () => {
    const user = getCurrentUser()
    if (!user) { showToast('Please login to write a review', 'error'); navigate('/auth'); return }
    if (!selectedRating) { showToast('Please select a rating', 'error'); return }
    const text = (document.getElementById('reviewText') as HTMLTextAreaElement)?.value.trim()
    if (!text) { showToast('Please write your review', 'error'); return }
    const allReviews = getReviews()
    allReviews.push({ id: Date.now(), productId: product.id, userId: Number(user.id), userName: user.name, rating: selectedRating, text, date: new Date().toISOString(), helpful: 0, sellerReply: '' })
    localStorage.setItem('am_reviews', JSON.stringify(allReviews))
    showToast('Review submitted!')
    setTimeout(() => location.reload(), 500)
  })
}

function renderReviewHTML(product: Product, reviews: Review[]): string {
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
  const bars = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length
    const pct = reviews.length ? (count / reviews.length * 100) : 0
    return `<div class="bar-row"><span style="width:16px;text-align:right">${star}★</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span style="width:24px;color:#999">${count}</span></div>`
  }).join('')

  const reviewsHtml = reviews.length ? reviews.map(r => `
    <div class="review-item">
      <div class="review-header">
        <div class="review-avatar">${r.userName[0]}</div>
        <div>
          <div class="review-name">${r.userName}</div>
          <div class="review-date">${new Date(r.date).toLocaleDateString()} · <span class="stars">${renderStars(r.rating)}</span></div>
        </div>
      </div>
      <div class="review-text">${r.text}</div>
      ${r.sellerReply ? `<div class="review-seller-reply"><strong>🏪 Seller Reply:</strong> ${r.sellerReply}</div>` : ''}
    </div>
  `).join('') : '<p style="text-align:center;color:#999;padding:40px">No reviews yet. Be the first to review!</p>'

  return `
    <h3>Customer Reviews</h3>
    <div class="review-summary">
      <div class="big-rating">
        <div class="num">${avg}</div>
        <div class="stars">${renderStars(parseFloat(avg))}</div>
        <div class="count">${reviews.length} reviews</div>
      </div>
      <div class="review-bars">${bars}</div>
    </div>
    ${reviewsHtml}
    <div class="review-form-card">
      <h3>Write a Review</h3>
      <div class="star-rating-input" id="starInput">
        ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-val="${i}">☆</span>`).join('')}
      </div>
      <div class="form-group">
        <label>Your Review</label>
        <textarea class="form-control" id="reviewText" rows="4" placeholder="Share your experience..."></textarea>
      </div>
      <button class="btn btn-primary" id="submitReview">Submit Review</button>
    </div>
  `
}
