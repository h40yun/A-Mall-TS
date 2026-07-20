// ==================== HOME PAGE ====================
import { PRODUCTS, CATEGORIES } from '../utils/data'
import { formatPrice, getDiscount, startCountdown } from '../utils/helpers'
import { renderProductCard, renderPage, renderSection } from '../components'

export function renderHomePage(): void {
  const container = document.createElement('div')

  // Hero Slider
  container.innerHTML = `
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
        <div class="slider-dots">
          <button class="active" data-slide="0"></button>
          <button data-slide="1"></button>
          <button data-slide="2"></button>
        </div>
      </div>
    </div>
  `

  // Promo Banners
  const promoSection = document.createElement('div')
  promoSection.className = 'section'
  promoSection.innerHTML = `
    <div class="promo-banners">
      <div class="promo-banner" style="background:linear-gradient(135deg,#ff6b6b,#ee5a24)">
        <span class="promo-tag">NEW</span>
        <h3>Free Shipping</h3>
        <p>On all orders over $50</p>
      </div>
      <div class="promo-banner" style="background:linear-gradient(135deg,#a29bfe,#6c5ce7)">
        <span class="promo-tag">HOT</span>
        <h3>Daily Vouchers</h3>
        <p>Collect up to $10 off daily</p>
      </div>
    </div>
  `
  container.appendChild(promoSection)

  // Categories
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
  flashSection.innerHTML = `
    <div class="flash-sale">
      <div class="flash-sale-header">
        <h2>⚡ Flash Sale</h2>
        <div class="countdown" id="countdown"></div>
        <a href="/category" class="section-link" style="margin-left:auto">See All &gt;</a>
      </div>
    </div>
  `
  flashSection.querySelector('.flash-sale')!.appendChild(flashGrid)
  container.appendChild(flashSection)

  // Just For You
  const jfyGrid = document.createElement('div')
  jfyGrid.className = 'product-grid'
  const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5)
  shuffled.forEach(p => jfyGrid.appendChild(renderProductCard(p)))
  container.appendChild(renderSection('Just For You', 'See All', '/category', jfyGrid))

  // Newsletter
  const newsletter = document.createElement('div')
  newsletter.className = 'section'
  newsletter.innerHTML = `
    <div class="newsletter">
      <h3>📧 Stay Updated</h3>
      <p>Subscribe for exclusive deals and new arrivals</p>
      <div class="search-bar" style="max-width:400px;margin:0 auto">
        <input type="email" placeholder="Enter your email address">
        <button onclick="alert('Subscribed!')">Subscribe</button>
      </div>
    </div>
  `
  container.appendChild(newsletter)

  renderPage(container)

  // Slider logic
  let currentSlide = 0
  const slides = container.querySelectorAll('.slide')
  const dots = container.querySelectorAll('.slider-dots button')
  function goToSlide(n: number) {
    slides[currentSlide]?.classList.remove('active')
    dots[currentSlide]?.classList.remove('active')
    currentSlide = n
    slides[currentSlide]?.classList.add('active')
    dots[currentSlide]?.classList.add('active')
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)))
  setInterval(() => goToSlide((currentSlide + 1) % slides.length), 4000)

  startCountdown(8)
}
