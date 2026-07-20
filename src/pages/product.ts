// ==================== PRODUCT PAGE ====================
import { PRODUCTS, COUPONS } from '../utils/data'
import { formatPrice, renderStars, getDiscount, getProductImages, getProductInitials, getProductColor, isInWishlist, toggleWishlist, addToCart, getCurrentUser, getUrlParam, getReviews, getProductReviews, showToast, updateCartBadge, addToRecentlyViewed, getRecentlyViewed } from '../utils/helpers'
import { renderProductCard, renderPage } from '../components'
import { navigate, getParam } from '../router'
import type { Product, Review } from '../types'

export function renderProductPage(): void {
  const productId = Number(getParam('id') || getUrlParam('id')) || 1
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0]
  const discount = getDiscount(product.price, product.originalPrice)
  const wishlisted = isInWishlist(product.id)
  const reviews = getProductReviews(product.id)
  const images = getProductImages(product)
  const sellerCoupons = COUPONS.filter(c => c.storeId === product.sellerId && c.status === 'active')

  // Add to recently viewed
  addToRecentlyViewed(product.id)

  document.title = `${product.name} - ALLIANCE MALL TK`

  const container = document.createElement('div')

  container.innerHTML = `
    <div class="product-detail">
      <div class="gallery">
        <div class="main-img" id="mainImage">
          <img src="${images[0]}" alt="${product.name}" id="mainImg" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
          ${discount >= 40 ? `<span class="discount-badge" style="position:absolute;top:12px;right:12px;font-size:14px;padding:4px 12px">-${discount}%</span>` : ''}
          ${images.length > 1 ? '<button class="gallery-zoom" id="zoomBtn">🔍</button>' : ''}
        </div>
        <div class="thumbs" id="thumbGallery">
          ${images.map((img, i) => `<img src="${img}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" onerror="this.style.display='none'">`).join('')}
        </div>
      </div>
      <div class="product-info-section">
        <h1>${product.name}</h1>
        <div class="meta-row">
          <span><span class="stars">${renderStars(product.rating)}</span> ${product.rating}</span>
          <span>${reviews.length} Reviews</span>
          <span>${product.sold.toLocaleString()} sold</span>
          ${product.sku ? `<span style="color:#999;font-size:12px">SKU: ${product.sku}</span>` : ''}
        </div>
        <div class="price-box">
          <span class="current">${formatPrice(product.price)}</span>
          <span class="original">${formatPrice(product.originalPrice)}</span>
          <span class="discount">-${discount}%</span>
        </div>

        ${sellerCoupons.length ? `
          <div class="seller-coupons">
            ${sellerCoupons.map(c => `
              <div class="coupon-tag">
                <span class="coupon-label">${c.type === 'percentage' ? c.value + '% OFF' : c.type === 'fixed' ? formatPrice(c.value) + ' OFF' : 'Free Shipping'}</span>
                <span class="coupon-min">Min. ${formatPrice(c.minSpend)}</span>
                <button class="coupon-claim" data-code="${c.code}">Claim</button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <hr class="divider">

        ${product.colors.length ? `
          <div class="variant-section">
            <h3>Color</h3>
            <div class="variant-options">
              ${product.colors.map((c, i) => `<button class="color-btn ${i === 0 ? 'active' : ''}" style="background:${c}" data-color></button>`).join('')}
            </div>
          </div>
        ` : ''}

        ${product.sizes?.length ? `
          <div class="variant-section">
            <h3>Size</h3>
            <div class="variant-options">
              ${product.sizes.map((s, i) => `<button class="variant-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
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
            <input type="number" id="qtyInput" value="1" min="${product.minOrder || 1}" max="${product.stock}">
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

        <div style="display:flex;gap:12px;margin-bottom:16px">
          <button class="btn btn-outline btn-sm" id="wishlistBtn">${wishlisted ? '♥ In Wishlist' : '♡ Wishlist'}</button>
          <button class="btn btn-outline btn-sm" id="shareBtn">🔗 Share</button>
          <a href="/messages" class="btn btn-outline btn-sm">💬 Chat Seller</a>
        </div>

        <!-- Shipping Calculator -->
        <div class="shipping-calculator">
          <h3>🚚 Shipping</h3>
          <div class="ship-calc-row">
            <input type="text" class="form-control" id="shipCalcInput" placeholder="Enter your ZIP code" style="max-width:200px">
            <button class="btn btn-sm btn-outline" id="shipCalcBtn">Calculate</button>
          </div>
          <div id="shipCalcResult" style="display:none;margin-top:8px"></div>
          ${product.freeShipping ? '<div style="color:#28a745;font-size:13px;margin-top:8px">✅ Free Shipping on this item</div>' : ''}
        </div>

        <!-- Return Policy -->
        ${product.returnPolicy ? `
          <div class="return-policy-info">
            <h3>↩️ Return Policy</h3>
            <p>${product.returnPolicy}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `

  // Tabs
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
        <tr><td>Category</td><td>${product.category}${product.subcategory ? ' > ' + product.subcategory : ''}</td></tr>
        ${product.sku ? `<tr><td>SKU</td><td>${product.sku}</td></tr>` : ''}
        ${product.weight ? `<tr><td>Weight</td><td>${product.weight}</td></tr>` : ''}
        ${product.specs.split(' | ').map(s => { const parts = s.split(': '); return parts.length === 2 ? `<tr><td>${parts[0]}</td><td>${parts[1]}</td></tr>` : '' }).join('')}
        <tr><td>Stock</td><td>${product.stock} units</td></tr>
      </table>
    </div>
    <div class="tab-content tab-panel" id="tab-reviews">
      ${renderReviewHTML(product, reviews)}
    </div>
  `
  container.appendChild(tabsSection)

  // Recently Viewed
  const recentIds = getRecentlyViewed().filter(id => id !== product.id).slice(0, 6)
  const recentProducts = PRODUCTS.filter(p => recentIds.includes(p.id))
  if (recentProducts.length) {
    const recentSection = document.createElement('div')
    recentSection.className = 'related-section'
    recentSection.innerHTML = '<div class="section-header"><h2 class="section-title">Recently Viewed</h2></div>'
    const recentGrid = document.createElement('div')
    recentGrid.className = 'product-grid'
    recentProducts.forEach(p => recentGrid.appendChild(renderProductCard(p)))
    recentSection.appendChild(recentGrid)
    container.appendChild(recentSection)
  }

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

  // === IMAGE GALLERY ===
  let currentImageIndex = 0
  const mainImg = container.querySelector('#mainImg') as HTMLImageElement
  const thumbs = container.querySelectorAll('.thumb')

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'))
      thumb.classList.add('active')
      mainImg.src = images[i]
      currentImageIndex = i
    })
  })

  // Zoom
  container.querySelector('#zoomBtn')?.addEventListener('click', () => {
    const overlay = document.createElement('div')
    overlay.className = 'zoom-overlay'
    overlay.innerHTML = `
      <div class="zoom-container">
        <button class="zoom-close">&times;</button>
        <button class="zoom-prev">‹</button>
        <img src="${images[currentImageIndex]}" class="zoom-image" id="zoomImage">
        <button class="zoom-next">›</button>
        <div class="zoom-thumbs">${images.map((img, i) => `<img src="${img}" class="zoom-thumb ${i === currentImageIndex ? 'active' : ''}" data-index="${i}">`).join('')}</div>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('.zoom-close')?.addEventListener('click', () => overlay.remove())
    overlay.querySelector('.zoom-prev')?.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length
      ;(overlay.querySelector('#zoomImage') as HTMLImageElement).src = images[currentImageIndex]
      overlay.querySelectorAll('.zoom-thumb').forEach((t, i) => t.classList.toggle('active', i === currentImageIndex))
    })
    overlay.querySelector('.zoom-next')?.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % images.length
      ;(overlay.querySelector('#zoomImage') as HTMLImageElement).src = images[currentImageIndex]
      overlay.querySelectorAll('.zoom-thumb').forEach((t, i) => t.classList.toggle('active', i === currentImageIndex))
    })
    overlay.querySelectorAll('.zoom-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        currentImageIndex = Number((thumb as HTMLElement).dataset.index)
        ;(overlay.querySelector('#zoomImage') as HTMLImageElement).src = images[currentImageIndex]
        overlay.querySelectorAll('.zoom-thumb').forEach((t, i) => t.classList.toggle('active', i === currentImageIndex))
      })
    })
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
  })

  // === QUANTITY ===
  const qtyInput = document.getElementById('qtyInput') as HTMLInputElement
  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    qtyInput.value = String(Math.max(product.minOrder || 1, Number(qtyInput.value) - 1))
  })
  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    qtyInput.value = String(Math.min(product.stock, Number(qtyInput.value) + 1))
  })

  // === CART ===
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    addToCart(product.id, Number(qtyInput.value))
    updateCartBadge()
  })
  document.getElementById('buyNowBtn')?.addEventListener('click', () => {
    addToCart(product.id, Number(qtyInput.value))
    navigate('/checkout')
  })

  // === WISHLIST ===
  document.getElementById('wishlistBtn')?.addEventListener('click', function(this: HTMLElement) {
    const isNow = toggleWishlist(product.id)
    this.textContent = isNow ? '♥ In Wishlist' : '♡ Wishlist'
  })

  // === SHARE ===
  document.getElementById('shareBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Link copied!')
  })

  // === TABS ===
  tabsSection.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      tabsSection.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      tabsSection.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'))
      this.classList.add('active')
      document.getElementById(this.dataset.tab!)?.classList.add('active')
    })
  })

  // === COLOR BUTTONS ===
  container.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      this.parentElement?.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'))
      this.classList.add('active')
    })
  })

  // === SIZE BUTTONS ===
  container.querySelectorAll('[data-size]').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      this.parentElement?.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'))
      this.classList.add('active')
    })
  })

  // === SELLER COUPONS ===
  container.querySelectorAll('.coupon-claim').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      const code = this.dataset.code!
      const coupon = COUPONS.find(c => c.code === code)
      if (coupon) {
        coupon.usedCount++
        this.textContent = 'Claimed ✓'
        this.classList.add('claimed')
        ;(this as HTMLButtonElement).disabled = true
        showToast(`Coupon ${code} claimed!`)
      }
    })
  })

  // === SHIPPING CALCULATOR ===
  container.querySelector('#shipCalcBtn')?.addEventListener('click', () => {
    const zip = (container.querySelector('#shipCalcInput') as HTMLInputElement).value.trim()
    if (!zip) { showToast('Please enter ZIP code', 'error'); return }
    const resultEl = container.querySelector('#shipCalcResult')! as HTMLElement
    const freeShip = product.freeShipping
    const standardPrice = freeShip ? 'FREE' : formatPrice(4.99)
    const expressPrice = freeShip ? formatPrice(4.99) : formatPrice(9.99)
    const standardColor = freeShip ? '#28a745' : '#333'
    resultEl.innerHTML = `<div style="font-size:13px;padding:8px 12px;background:#f8f8f8;border-radius:6px"><div>📍 Deliver to <strong>${zip}</strong></div><div style="margin-top:4px">Standard: <span style="color:${standardColor}">${standardPrice}</span> · 5-7 days</div><div>Express: ${expressPrice} · 2-3 days</div></div>`
    resultEl.style.display = 'block'
  })

  // === REVIEW FORM ===
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
