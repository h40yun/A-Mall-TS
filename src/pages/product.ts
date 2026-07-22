// @ts-nocheck - Migrating to Supabase
// ==================== PRODUCT PAGE ====================
import { ALL_PRODUCTS as PRODUCTS, COUPONS } from '../utils/data'
import { formatPrice, renderStars, getDiscount, getProductImages, getProductInitials, getProductImage, getProductColor, isInWishlist, toggleWishlist, addToCart, getCurrentUser, getUrlParam, getReviews, getProductReviews, showToast, updateCartBadge, addToRecentlyViewed, getRecentlyViewed, toggleComparison, getComparisonItems, addToBrowsingHistory } from '../utils/helpers'
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
  const inComparison = getComparisonItems().includes(product.id)

  addToRecentlyViewed(product.id)
  addToBrowsingHistory(product.id)
  document.title = `${product.name} - ALLIANCE MALL TK`

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="product-detail">
      <div class="gallery">
        <div class="main-img" id="mainImage">
          <img src="${images[0]}" alt="${product.name}" id="mainImg">
          <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
          ${discount >= 40 ? `<span class="discount-badge" style="position:absolute;top:12px;right:12px;font-size:14px;padding:4px 12px">-${discount}%</span>` : ''}
          ${images.length > 1 ? '<button class="gallery-zoom" id="zoomBtn">🔍</button>' : ''}
          ${product.video ? '<button class="video-play-btn" id="videoBtn">▶</button>' : ''}
        </div>
        <div class="thumbs" id="thumbGallery">
          ${images.map((img, i) => `<img src="${img}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}">`).join('')}
          ${product.video ? `<div class="thumb video-thumb" data-video="true">▶ Video</div>` : ''}
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
        ${sellerCoupons.length ? `<div class="seller-coupons">${sellerCoupons.map(c => `<div class="coupon-tag"><span class="coupon-label">${c.type === 'percentage' ? c.value + '% OFF' : c.type === 'fixed' ? formatPrice(c.value) + ' OFF' : 'Free Shipping'}</span><span class="coupon-min">Min. ${formatPrice(c.minSpend)}</span><button class="coupon-claim" data-code="${c.code}">Claim</button></div>`).join('')}</div>` : ''}
        <hr class="divider">
        ${product.colors.length ? `<div class="variant-section"><h3>Color</h3><div class="variant-options">${product.colors.map((c, i) => `<button class="color-btn ${i === 0 ? 'active' : ''}" style="background:${c}" data-color></button>`).join('')}</div></div>` : ''}
        ${product.sizes?.length ? `<div class="variant-section"><h3>Size</h3><div class="variant-options">${product.sizes.map((s, i) => `<button class="variant-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}</div></div>` : ''}
        <div class="variant-section"><h3>Brand</h3><div class="variant-options"><span class="variant-btn active">${product.brand}</span></div></div>
        <div class="qty-section"><span>Quantity:</span><div class="qty-selector"><button id="qtyMinus">−</button><input type="number" id="qtyInput" value="1" min="${product.minOrder || 1}" max="${product.stock}"><button id="qtyPlus">+</button></div><span style="font-size:12px;color:#999">${product.stock} available</span></div>
        <div class="action-buttons">
          <button class="btn btn-secondary" id="addToCartBtn">🛒 Add to Cart</button>
          <button class="btn btn-primary" id="buyNowBtn">⚡ Buy Now</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button class="btn btn-outline btn-sm" id="wishlistBtn">${wishlisted ? '♥ In Wishlist' : '♡ Wishlist'}</button>
          <button class="btn btn-outline btn-sm" id="compareBtn">${inComparison ? '✓ Comparing' : '⚖ Compare'}</button>
          <button class="btn btn-outline btn-sm" id="shareBtn">🔗 Share</button>
          <button class="btn btn-outline btn-sm" id="chatSellerBtn">💬 Chat</button>
        </div>
        <div class="seller-card">
          <div class="seller-avatar">${product.seller[0]}</div>
          <div class="seller-info"><h4>${product.seller}</h4><p>Active 2h ago · ${Math.floor(Math.random() * 200 + 50)} products</p></div>
          <a href="/store/${encodeURIComponent(product.seller)}" class="btn btn-outline btn-sm" style="margin-left:auto">Visit Shop</a>
        </div>
        <div class="shipping-calculator"><h3>🚚 Shipping</h3><div class="ship-calc-row"><input type="text" class="form-control" id="shipCalcInput" placeholder="Enter ZIP code" style="max-width:200px"><button class="btn btn-sm btn-outline" id="shipCalcBtn">Calculate</button></div><div id="shipCalcResult" style="display:none;margin-top:8px"></div>${product.freeShipping ? '<div style="color:#28a745;font-size:13px;margin-top:8px">✅ Free Shipping</div>' : ''}</div>
        ${product.returnPolicy ? `<div class="return-policy-info"><h3>↩️ Return Policy</h3><p>${product.returnPolicy}</p></div>` : ''}
        ${product.location ? `<div style="font-size:12px;color:#999;margin-top:8px">📍 Ships from ${product.location}</div>` : ''}
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
    <div class="tab-content active tab-panel" id="tab-desc"><h3>Product Description</h3><p>${product.description}</p></div>
    <div class="tab-content tab-panel" id="tab-specs">
      <h3>Specifications</h3>
      <table class="specs-table">
        <tr><td>Brand</td><td>${product.brand}</td></tr>
        <tr><td>Category</td><td>${product.category}${product.subcategory ? ' > ' + product.subcategory : ''}</td></tr>
        ${product.sku ? `<tr><td>SKU</td><td>${product.sku}</td></tr>` : ''}
        ${product.weight ? `<tr><td>Weight</td><td>${product.weight}</td></tr>` : ''}
        ${product.location ? `<tr><td>Ships From</td><td>${product.location}</td></tr>` : ''}
        ${product.specs.split(' | ').map(s => { const p = s.split(': '); return p.length === 2 ? `<tr><td>${p[0]}</td><td>${p[1]}</td></tr>` : '' }).join('')}
        <tr><td>Stock</td><td>${product.stock} units</td></tr>
      </table>
    </div>
    <div class="tab-content tab-panel" id="tab-reviews">${renderReviewHTML(product, reviews)}</div>
  `
  container.appendChild(tabsSection)

  // People Also Bought
  const alsoBought = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).sort((a, b) => b.sold - a.sold).slice(0, 6)
  if (alsoBought.length) {
    const section = document.createElement('div')
    section.className = 'related-section'
    section.innerHTML = '<div class="section-header"><h2 class="section-title">People Also Bought</h2></div>'
    const grid = document.createElement('div'); grid.className = 'product-grid'
    alsoBought.forEach(p => grid.appendChild(renderProductCard(p)))
    section.appendChild(grid); container.appendChild(section)
  }

  // Frequently Bought Together
  const freqBought = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.seller === product.seller)).slice(0, 3)
  if (freqBought.length) {
    const section = document.createElement('div')
    section.className = 'related-section'
    const totalPrice = product.price + freqBought.reduce((s, p) => s + p.price, 0)
    const totalOriginal = product.originalPrice + freqBought.reduce((s, p) => s + p.originalPrice, 0)
    section.innerHTML = `
      <div class="section-header"><h2 class="section-title">Frequently Bought Together</h2></div>
      <div class="freq-bought-card">
        <div class="freq-bought-items">
          <div class="freq-bought-item"><img src="${getProductImage(product)}" alt=""><div class="freq-bought-info"><div class="freq-bought-name">${product.name}</div><div class="freq-bought-price">${formatPrice(product.price)}</div></div></div>
          ${freqBought.map(p => `<div class="freq-bought-plus">+</div><div class="freq-bought-item"><img src="${getProductImage(p)}" alt=""><div class="freq-bought-info"><div class="freq-bought-name">${p.name}</div><div class="freq-bought-price">${formatPrice(p.price)}</div></div></div>`).join('')}
        </div>
        <div class="freq-bought-summary">
          <div class="freq-bought-total">Total: <strong>${formatPrice(totalPrice)}</strong> <span style="text-decoration:line-through;color:#999;font-size:14px">${formatPrice(totalOriginal)}</span></div>
          <button class="btn btn-primary" id="addAllBtn">Add All to Cart</button>
        </div>
      </div>
    `
    container.appendChild(section)
  }

  // Recently Viewed
  const recentIds = getRecentlyViewed().filter(id => id !== product.id).slice(0, 6)
  if (recentIds.length) {
    const recentProducts = PRODUCTS.filter(p => recentIds.includes(p.id))
    const section = document.createElement('div'); section.className = 'related-section'
    section.innerHTML = '<div class="section-header"><h2 class="section-title">Recently Viewed</h2></div>'
    const grid = document.createElement('div'); grid.className = 'product-grid'
    recentProducts.forEach(p => grid.appendChild(renderProductCard(p)))
    section.appendChild(grid); container.appendChild(section)
  }

  renderPage(container)

  // === IMAGE GALLERY ===
  let currentImageIndex = 0
  const mainImg = container.querySelector('#mainImg') as HTMLImageElement
  const thumbs = container.querySelectorAll('.thumb')
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active')); thumb.classList.add('active')
      if ((thumb as HTMLElement).dataset.video) { mainImg.style.display = 'none'; (container.querySelector('.img-placeholder') as HTMLElement).style.display = 'flex' }
      else { mainImg.style.display = 'block'; mainImg.src = images[i]; currentImageIndex = i }
    })
  })

  // Zoom
  container.querySelector('#zoomBtn')?.addEventListener('click', () => {
    const overlay = document.createElement('div'); overlay.className = 'zoom-overlay'
    overlay.innerHTML = `<div class="zoom-container"><button class="zoom-close">&times;</button><button class="zoom-prev">‹</button><img src="${images[currentImageIndex]}" class="zoom-image"><button class="zoom-next">›</button><div class="zoom-thumbs">${images.map((img, i) => `<img src="${img}" class="zoom-thumb ${i === currentImageIndex ? 'active' : ''}" data-index="${i}">`).join('')}</div></div>`
    document.body.appendChild(overlay)
    overlay.querySelector('.zoom-close')?.addEventListener('click', () => overlay.remove())
    overlay.querySelector('.zoom-prev')?.addEventListener('click', () => { currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; (overlay.querySelector('.zoom-image') as HTMLImageElement).src = images[currentImageIndex]; overlay.querySelectorAll('.zoom-thumb').forEach((t, i) => t.classList.toggle('active', i === currentImageIndex)) })
    overlay.querySelector('.zoom-next')?.addEventListener('click', () => { currentImageIndex = (currentImageIndex + 1) % images.length; (overlay.querySelector('.zoom-image') as HTMLImageElement).src = images[currentImageIndex]; overlay.querySelectorAll('.zoom-thumb').forEach((t, i) => t.classList.toggle('active', i === currentImageIndex)) })
    overlay.querySelectorAll('.zoom-thumb').forEach(t => t.addEventListener('click', () => { currentImageIndex = Number((t as HTMLElement).dataset.index); (overlay.querySelector('.zoom-image') as HTMLImageElement).src = images[currentImageIndex]; overlay.querySelectorAll('.zoom-thumb').forEach((x, i) => x.classList.toggle('active', i === currentImageIndex)) }))
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove() })
  })

  // Video
  container.querySelector('#videoBtn')?.addEventListener('click', () => {
    if (!product.video) return
    const overlay = document.createElement('div'); overlay.className = 'zoom-overlay'
    overlay.innerHTML = `<div class="zoom-container"><button class="zoom-close">&times;</button><video src="${product.video}" controls autoplay style="max-width:90vw;max-height:80vh;border-radius:8px"></video></div>`
    document.body.appendChild(overlay)
    overlay.querySelector('.zoom-close')?.addEventListener('click', () => overlay.remove())
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove() })
  })

  // Qty
  const qtyInput = document.getElementById('qtyInput') as HTMLInputElement
  document.getElementById('qtyMinus')?.addEventListener('click', () => { qtyInput.value = String(Math.max(1, Number(qtyInput.value) - 1)) })
  document.getElementById('qtyPlus')?.addEventListener('click', () => { qtyInput.value = String(Math.min(product.stock, Number(qtyInput.value) + 1)) })

  // Cart
  document.getElementById('addToCartBtn')?.addEventListener('click', () => { addToCart(product.id, Number(qtyInput.value)); updateCartBadge() })
  document.getElementById('buyNowBtn')?.addEventListener('click', () => { addToCart(product.id, Number(qtyInput.value)); navigate('/checkout') })

  // Wishlist
  document.getElementById('wishlistBtn')?.addEventListener('click', function(this: HTMLElement) { const n = toggleWishlist(product.id); this.textContent = n ? '♥ In Wishlist' : '♡ Wishlist' })

  // Compare
  document.getElementById('compareBtn')?.addEventListener('click', function(this: HTMLElement) { const added = toggleComparison(product.id); this.textContent = added ? '✓ Comparing' : '⚖ Compare'; if (added) showToast('Added to comparison') })

  // Share
  document.getElementById('shareBtn')?.addEventListener('click', () => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!') })

  // Tabs
  tabsSection.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { tabsSection.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); tabsSection.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); this.classList.add('active'); document.getElementById(this.dataset.tab!)?.classList.add('active') }))

  // Color/Size
  container.querySelectorAll('[data-color]').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { this.parentElement?.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active') }))
  container.querySelectorAll('[data-size]').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { this.parentElement?.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active')); this.classList.add('active') }))

  // Seller coupons
  container.querySelectorAll('.coupon-claim').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { this.textContent = 'Claimed ✓'; (this as HTMLButtonElement).disabled = true; showToast(`Coupon ${this.dataset.code} claimed!`) }))

  // Shipping calculator
  container.querySelector('#shipCalcBtn')?.addEventListener('click', () => {
    const zip = (container.querySelector('#shipCalcInput') as HTMLInputElement).value.trim()
    if (!zip) { showToast('Enter ZIP code', 'error'); return }
    const resultEl = container.querySelector('#shipCalcResult')! as HTMLElement
    const fs = product.freeShipping
    const sp = fs ? 'FREE' : formatPrice(4.99)
    const ep = fs ? formatPrice(4.99) : formatPrice(9.99)
    resultEl.innerHTML = `<div style="font-size:13px;padding:8px 12px;background:#f8f8f8;border-radius:6px"><div>📍 Deliver to <strong>${zip}</strong></div><div style="margin-top:4px">Standard: <span style="color:${fs ? '#28a745' : '#333'}">${sp}</span> · 5-7 days</div><div>Express: ${ep} · 2-3 days</div></div>`
    resultEl.style.display = 'block'
  })

  // Add All to Cart
  document.getElementById('addAllBtn')?.addEventListener('click', () => { addToCart(product.id, 1); freqBought.forEach(p => addToCart(p.id, 1)); updateCartBadge(); showToast('All items added to cart!') })

  // Chat button
  document.getElementById('chatSellerBtn')?.addEventListener('click', () => {
    const u = getCurrentUser()
    if (!u) { showToast('Login to chat with seller', 'info'); navigate('/auth'); return }
    navigate('/messages?product=' + product.id)
  })

  // Review form
  let selectedRating = 0
  const user = getCurrentUser()
  container.querySelectorAll('#starInput .star').forEach(star => star.addEventListener('click', function(this: HTMLElement) {
    if (!user) { showToast('Login to write a review', 'info'); navigate('/auth'); return }
    selectedRating = Number(this.dataset.val)
    container.querySelectorAll('#starInput .star').forEach((s, i) => { s.textContent = i < selectedRating ? '★' : '☆'; s.classList.toggle('active', i < selectedRating) })
  }))
  document.getElementById('submitReview')?.addEventListener('click', () => {
    if (!user) { showToast('Login to write a review', 'info'); navigate('/auth'); return }
    if (!selectedRating) { showToast('Select rating', 'error'); return }
    const text = (document.getElementById('reviewText') as HTMLTextAreaElement)?.value.trim(); if (!text) { showToast('Write review', 'error'); return }
    const all = getReviews(); all.push({ id: Date.now(), productId: product.id, userId: Number(user.id), userName: user.name, rating: selectedRating, text, date: new Date().toISOString(), helpful: 0, sellerReply: '' }); localStorage.setItem('am_reviews', JSON.stringify(all)); showToast('Review submitted!'); setTimeout(() => location.reload(), 500)
  })
}

function renderReviewHTML(product: Product, reviews: Review[]): string {
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
  const bars = [5, 4, 3, 2, 1].map(star => { const c = reviews.filter(r => r.rating === star).length; const p = reviews.length ? (c / reviews.length * 100) : 0; return `<div class="bar-row"><span style="width:16px;text-align:right">${star}★</span><div class="track"><div class="fill" style="width:${p}%"></div></div><span style="width:24px;color:#999">${c}</span></div>` }).join('')
  const html = reviews.length ? reviews.map(r => `<div class="review-item"><div class="review-header"><div class="review-avatar">${r.userName[0]}</div><div><div class="review-name">${r.userName}</div><div class="review-date">${new Date(r.date).toLocaleDateString()} · <span class="stars">${renderStars(r.rating)}</span></div></div></div><div class="review-text">${r.text}</div>${r.sellerReply ? `<div class="review-seller-reply"><strong>🏪 Seller:</strong> ${r.sellerReply}</div>` : ''}</div>`).join('') : '<p style="text-align:center;color:#999;padding:40px">No reviews yet.</p>'
  return `<h3>Customer Reviews</h3><div class="review-summary"><div class="big-rating"><div class="num">${avg}</div><div class="stars">${renderStars(parseFloat(avg))}</div><div class="count">${reviews.length} reviews</div></div><div class="review-bars">${bars}</div></div>${html}<div class="review-form-card"><h3>Write a Review</h3><div class="star-rating-input" id="starInput">${[1, 2, 3, 4, 5].map(i => `<span class="star" data-val="${i}">☆</span>`).join('')}</div><div class="form-group"><label>Your Review</label><textarea class="form-control" id="reviewText" rows="4" placeholder="Share your experience..."></textarea></div><button class="btn btn-primary" id="submitReview">Submit Review</button></div>`
}
