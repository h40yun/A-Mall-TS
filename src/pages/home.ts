// ==================== HOME PAGE ====================
import { PRODUCTS, CATEGORIES, BRAND_STORIES, TOP_SEARCHES, VOUCHERS } from '../utils/data'
import { formatPrice, getDiscount, startCountdown, getRecentlyViewed, getClaimedVouchers, claimVoucher } from '../utils/helpers'
import { renderProductCard, renderPage, renderSection } from '../components'
import { navigate } from '../router'

export function renderHomePage(): void {
  const container = document.createElement('div')

  // Free Shipping Voucher Claim
  const voucherBanner = document.createElement('div')
  voucherBanner.className = 'section'
  voucherBanner.innerHTML = `
    <div class="voucher-banner">
      <div class="voucher-banner-left">
        <span class="voucher-icon">🎟️</span>
        <div>
          <strong>Free Shipping Voucher</strong>
          <p>Claim now and enjoy free shipping on your next order!</p>
        </div>
      </div>
      <button class="btn btn-sm btn-primary claim-free-ship" id="claimFreeShip">Claim</button>
    </div>
  `
  container.appendChild(voucherBanner)

  // Hero Slider
  container.innerHTML += `
    <div class="hero">
      <div class="slider" id="heroSlider">
        <div class="slide active" style="background:linear-gradient(135deg,#ee4d2d,#f97316,#fbbf24)">
          <div class="slide-content">
            <h1>🔥 MEGA SUMMER SALE</h1>
            <p>Up to 70% off on thousands of items. Limited time only!</p>
            <a href="/category" class="btn btn-lg" style="background:#fff;color:#ee4d2d">Shop Now</a>
          </div>
        </div>
        <div class="slide" style="background:linear-gradient(135deg,#667eea,#764ba2)">
          <div class="slide-content">
            <h1>📱 Tech Deals</h1>
            <p>Latest gadgets at unbeatable prices. Free shipping on orders $50+</p>
            <a href="/category?cat=Electronics" class="btn btn-lg" style="background:#fff;color:#667eea">Explore</a>
          </div>
        </div>
        <div class="slide" style="background:linear-gradient(135deg,#f093fb,#f5576c)">
          <div class="slide-content">
            <h1>👗 Fashion Forward</h1>
            <p>New arrivals for every style. Refresh your wardrobe today!</p>
            <a href="/category?cat=Fashion" class="btn btn-lg" style="background:#fff;color:#f5576c">Discover</a>
          </div>
        </div>
        <div class="slider-dots"><button class="active" data-slide="0"></button><button data-slide="1"></button><button data-slide="2"></button></div>
      </div>
    </div>
  `

  // Top Searches
  const topSearches = document.createElement('div')
  topSearches.className = 'section'
  topSearches.innerHTML = `
    <div class="top-searches">
      <h3>🔥 Top Searches</h3>
      <div class="top-search-tags">
        ${TOP_SEARCHES.map(s => `<a href="/search?q=${encodeURIComponent(s)}" class="search-tag">${s}</a>`).join('')}
      </div>
    </div>
  `
  container.appendChild(topSearches)

  // Promo Banners
  const promoSection = document.createElement('div')
  promoSection.className = 'section'
  promoSection.innerHTML = `
    <div class="promo-banners">
      <div class="promo-banner" style="background:linear-gradient(135deg,#ff6b6b,#ee5a24)"><span class="promo-tag">NEW</span><h3>Free Shipping</h3><p>On all orders over $50</p></div>
      <div class="promo-banner" style="background:linear-gradient(135deg,#a29bfe,#6c5ce7)"><span class="promo-tag">HOT</span><h3>Daily Vouchers</h3><p>Collect up to $10 off daily</p></div>
    </div>
  `
  container.appendChild(promoSection)

  // Category Showcase with Icons
  const catGrid = document.createElement('div')
  catGrid.className = 'category-showcase'
  CATEGORIES.forEach(cat => {
    const card = document.createElement('a')
    card.href = `/category?cat=${encodeURIComponent(cat.name)}`
    card.className = 'cat-card'
    card.innerHTML = `<div class="cat-icon">${cat.icon}</div><div class="cat-name">${cat.name}</div>`
    catGrid.appendChild(card)
  })
  container.appendChild(renderSection('Categories', '', '', catGrid))

  // Flash Sale
  const flashSection = document.createElement('div')
  flashSection.className = 'section'
  const flashProducts = PRODUCTS.filter(p => getDiscount(p.price, p.originalPrice) >= 50).slice(0, 6)
  const flashGrid = document.createElement('div')
  flashGrid.className = 'product-grid'
  flashProducts.forEach(p => flashGrid.appendChild(renderProductCard(p)))
  flashSection.innerHTML = `<div class="flash-sale"><div class="flash-sale-header"><h2>⚡ Flash Sale</h2><div class="countdown" id="countdown"></div><a href="/deals" class="section-link" style="margin-left:auto">See All &gt;</a></div></div>`
  flashSection.querySelector('.flash-sale')!.appendChild(flashGrid)
  container.appendChild(flashSection)

  // Brand Stories
  const brandSection = document.createElement('div')
  brandSection.className = 'section'
  brandSection.innerHTML = `
    <div class="section-header"><h2 class="section-title">Brand Stories</h2></div>
    <div class="brand-stories-scroll">
      ${BRAND_STORIES.map(bs => `
        <a href="${bs.link}" class="brand-story-card">
          <div class="brand-story-bg" style="background-image:url(${bs.image})">
            <div class="brand-story-overlay">
              <span class="brand-story-logo">${bs.logo}</span>
              <strong>${bs.brand}</strong>
              <p>${bs.tagline}</p>
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  `
  container.appendChild(brandSection)

  // Daily Discover
  const discoverSection = document.createElement('div')
  discoverSection.className = 'section'
  const discoverGrid = document.createElement('div')
  discoverGrid.className = 'product-grid'
  const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 12)
  shuffled.forEach(p => discoverGrid.appendChild(renderProductCard(p)))
  discoverSection.appendChild(renderSection('Daily Discover', 'See All', '/category', discoverGrid))
  container.appendChild(discoverSection)

  // Trending Now
  const trendingSection = document.createElement('div')
  trendingSection.className = 'section'
  const trendingGrid = document.createElement('div')
  trendingGrid.className = 'product-grid'
  const trending = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 6)
  trending.forEach(p => trendingGrid.appendChild(renderProductCard(p)))
  trendingSection.appendChild(renderSection('Trending Now', 'See All', '/category', trendingGrid))
  container.appendChild(trendingSection)

  // Recently Viewed
  const recentIds = getRecentlyViewed().slice(0, 6)
  if (recentIds.length) {
    const recentProducts = PRODUCTS.filter(p => recentIds.includes(p.id))
    const recentGrid = document.createElement('div')
    recentGrid.className = 'product-grid'
    recentProducts.forEach(p => recentGrid.appendChild(renderProductCard(p)))
    container.appendChild(renderSection('Recently Viewed', '', '', recentGrid))
  }

  // Just For You
  const jfyGrid = document.createElement('div')
  jfyGrid.className = 'product-grid'
  const jfy = [...PRODUCTS].sort(() => Math.random() - 0.5)
  jfy.forEach(p => jfyGrid.appendChild(renderProductCard(p)))
  container.appendChild(renderSection('Just For You', 'See All', '/category', jfyGrid))

  // Voucher Section
  const voucherSection = document.createElement('div')
  voucherSection.className = 'section'
  voucherSection.innerHTML = `
    <div class="section-header"><h2 class="section-title">🎟️ Vouchers & Coupons</h2><a href="/deals" class="section-link">See All &gt;</a></div>
    <div class="voucher-grid">
      ${VOUCHERS.map(v => {
        const claimed = getClaimedVouchers().includes(v.id)
        return `
          <div class="voucher-card ${v.type}">
            <div class="voucher-left">
              <div class="voucher-value">${v.type === 'percentage' ? v.value + '%' : v.type === 'fixed' ? formatPrice(v.value) : 'FREE'}</div>
              <div class="voucher-type">${v.type === 'free_shipping' ? 'SHIPPING' : 'OFF'}</div>
            </div>
            <div class="voucher-right">
              <div class="voucher-desc">${v.description}</div>
              <div class="voucher-min">Min. spend ${formatPrice(v.minSpend)}</div>
              <button class="btn btn-sm ${claimed ? 'btn-outline' : 'btn-primary'} claim-voucher-btn" data-id="${v.id}" ${claimed ? 'disabled' : ''}>${claimed ? 'Claimed ✓' : 'Claim'}</button>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
  container.appendChild(voucherSection)

  // Newsletter
  const newsletter = document.createElement('div')
  newsletter.className = 'section'
  newsletter.innerHTML = `<div class="newsletter"><h3>📧 Stay Updated</h3><p>Subscribe for exclusive deals and new arrivals</p><div class="search-bar" style="max-width:400px;margin:0 auto"><input type="email" placeholder="Enter your email address"><button onclick="alert('Subscribed!')">Subscribe</button></div></div>`
  container.appendChild(newsletter)

  renderPage(container)

  // Slider logic
  let currentSlide = 0
  const slides = container.querySelectorAll('.slide')
  const dots = container.querySelectorAll('.slider-dots button')
  function goToSlide(n: number) { slides[currentSlide]?.classList.remove('active'); dots[currentSlide]?.classList.remove('active'); currentSlide = n; slides[currentSlide]?.classList.add('active'); dots[currentSlide]?.classList.add('active') }
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)))
  setInterval(() => goToSlide((currentSlide + 1) % slides.length), 4000)
  startCountdown(8)

  // Free shipping voucher claim
  container.querySelector('#claimFreeShip')?.addEventListener('click', function(this: HTMLElement) { claimVoucher('v3'); this.textContent = 'Claimed ✓'; (this as HTMLButtonElement).disabled = true })

  // Voucher claims
  container.querySelectorAll('.claim-voucher-btn').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      claimVoucher(this.dataset.id!)
      this.textContent = 'Claimed ✓'; (this as HTMLButtonElement).disabled = true; this.classList.remove('btn-primary'); this.classList.add('btn-outline')
    })
  })
}
