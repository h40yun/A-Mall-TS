// ==================== STATIC PAGES ====================
import { getComparisonItems, clearComparison, formatPrice, renderStars, toggleComparison, showToast, getCurrentUser, getOrders, getAddresses, saveAddress, isAdmin, getNotifications, markNotificationRead, isLoggedIn, getProductImage, isInWishlist, toggleWishlist, isSeller, registerSeller, getSellerApplication } from '../utils/helpers'
import { PRODUCTS, CATEGORIES, COUPONS, VOUCHERS } from '../utils/data'
import { renderPage, renderProductCard } from '../components'
import { navigate, getParam } from '../router'
import type { Address } from '../types'

function renderStaticPage(title: string, content: string): void {
  const container = document.createElement('div')
  container.className = 'section'
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>${title}</span></div>
    <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:40px;max-width:800px;margin:0 auto">
      <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">${title}</h1>
      <div style="font-size:14px;color:#666;line-height:1.8">${content}</div>
    </div>
  `
  renderPage(container)
}

export function renderAboutPage(): void {
  renderStaticPage('About Us', `
    <p>Welcome to <strong>ALLIANCE MALL TK</strong>, your one-stop online marketplace for everything you need.</p>
    <p>We connect buyers with quality sellers worldwide, offering a vast selection of products across Electronics, Fashion, Home, Beauty, Sports, Toys, Books, and Food categories.</p>
    <h3>Our Mission</h3>
    <p>To provide a seamless, secure, and enjoyable shopping experience for customers worldwide, while empowering sellers to grow their businesses.</p>
    <h3>Why Choose Us?</h3>
    <ul>
      <li>🌍 Global shipping to 180+ countries</li>
      <li>🔒 Secure payments with buyer protection</li>
      <li>💰 Competitive prices with daily deals</li>
      <li>📞 24/7 customer support</li>
      <li>↩️ Easy returns and refunds</li>
    </ul>
  `)
}

export function renderContactPage(): void {
  renderStaticPage('Contact Us', `
    <p>We'd love to hear from you! Here's how you can reach us:</p>
    <h3>📧 Email</h3><p>support@alliancemall.com</p>
    <h3>📱 Phone</h3><p>+1 (555) 123-4567</p>
    <h3>📍 Address</h3><p>123 Commerce Street, Tech City, TC 10001</p>
    <h3>⏰ Business Hours</h3><p>Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
  `)
}

export function renderHelpPage(): void {
  renderStaticPage('Help Center', `
    <h3>🛒 How to Order</h3><p>Browse products, add to cart, and checkout.</p>
    <h3>💳 Payment Methods</h3><p>Credit/Debit Cards, PayPal, Bank Transfers.</p>
    <h3>🚚 Shipping</h3><p>Free shipping on orders over $50.</p>
    <h3>↩️ Returns</h3><p>30-day return policy.</p>
    <h3>📞 Need More Help?</h3><p>Contact us at support@alliancemall.com</p>
  `)
}

export function renderHowToBuyPage(): void {
  renderStaticPage('How to Buy', `
    <h3>Step 1: Browse Products</h3><p>Explore categories or use search.</p>
    <h3>Step 2: Add to Cart</h3><p>Select product, choose options, click "Add to Cart".</p>
    <h3>Step 3: Checkout</h3><p>Review cart, enter shipping, choose payment.</p>
    <h3>Step 4: Place Order</h3><p>Confirm and track your order.</p>
  `)
}

export function renderShippingPage(): void {
  renderStaticPage('Shipping & Delivery', `
    <h3>Shipping Options</h3>
    <ul>
      <li><strong>Free Shipping:</strong> Orders over $50 (7-14 business days)</li>
      <li><strong>Standard:</strong> $4.99 (5-7 business days)</li>
      <li><strong>Express:</strong> $9.99 (2-3 business days)</li>
    </ul>
    <h3>International Shipping</h3><p>We ship to 180+ countries worldwide.</p>
    <h3>Order Tracking</h3><p>Track your order from your profile or the <a href="/track-order" style="color:#ee4d2d">tracking page</a>.</p>
  `)
}

export function renderReturnPolicyPage(): void {
  renderStaticPage('Return & Refund Policy', `
    <h3>30-Day Return Policy</h3><p>Items can be returned within 30 days of delivery.</p>
    <h3>Conditions</h3>
    <ul>
      <li>Items must be unused and in original packaging</li>
      <li>Proof of purchase required</li>
      <li>Return shipping costs are buyer's responsibility</li>
    </ul>
    <h3>Refund Process</h3><p>Refunds processed within 5-7 business days.</p>
  `)
}

export function renderPaymentMethodsPage(): void {
  renderStaticPage('Payment Methods', `
    <ul>
      <li>💳 Credit / Debit Cards (Visa, Mastercard, Amex)</li>
      <li>🅿️ PayPal</li>
      <li>🏦 Bank Transfer</li>
      <li>📱 Apple Pay</li>
      <li>🟢 Google Pay</li>
    </ul>
    <p>All payments secured with 256-bit SSL encryption.</p>
  `)
}

export function renderTermsPage(): void {
  renderStaticPage('Terms & Conditions', `
    <h3>1. Account</h3><p>You are responsible for maintaining account security.</p>
    <h3>2. Purchases</h3><p>All purchases subject to our return policy.</p>
    <h3>3. Content</h3><p>You retain ownership but grant us a license to use submitted content.</p>
    <h3>4. Limitation of Liability</h3><p>We are not liable for indirect, incidental, or consequential damages.</p>
  `)
}

export function renderPrivacyPage(): void {
  renderStaticPage('Privacy Policy', `
    <h3>Data Collection</h3><p>We collect information you provide directly.</p>
    <h3>Data Usage</h3><p>We use your data to process orders and improve services.</p>
    <h3>Data Protection</h3><p>Industry-standard security measures protect your information.</p>
    <h3>Cookies</h3><p>We use cookies to enhance your shopping experience.</p>
  `)
}

export function renderDealsPage(): void {
  const container = document.createElement('div')
  container.className = 'section'
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>Deals & Promotions</span></div>
    <h2 style="font-size:22px;font-weight:700;margin-bottom:24px">🔥 Deals & Promotions</h2>
    <h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Available Vouchers</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:32px">
      ${VOUCHERS.map(v => `
        <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:16px;border-left:4px solid #ee4d2d">
          <div style="font-size:18px;font-weight:700;color:#ee4d2d">${v.type === 'percentage' ? v.value + '% OFF' : v.type === 'fixed' ? formatPrice(v.value) + ' OFF' : 'FREE SHIPPING'}</div>
          <div style="font-size:13px;color:#666;margin-top:4px">${v.description}</div>
          <div style="font-size:11px;color:#999;margin-top:4px">Min. ${formatPrice(v.minSpend)} · Code: <strong>${v.code}</strong></div>
        </div>
      `).join('')}
    </div>
    <h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Flash Sale Products</h3>
    <div class="product-grid">
      ${PRODUCTS.filter(p => Math.round((1 - p.price / p.originalPrice) * 100) >= 40).map(p => {
        const card = document.createElement('div')
        return `<div class="card product-card" onclick="window.location.href='/product/${p.id}'">
          <div class="product-img-wrap"><img class="product-img" src="${p.images?.[0] || `https://picsum.photos/seed/product${p.id}/300/300`}" alt="${p.name}" onerror="this.style.display='none'"><span class="discount-badge">-${Math.round((1 - p.price / p.originalPrice) * 100)}%</span></div>
          <div class="product-info"><div class="product-name">${p.name}</div><div class="product-price">${formatPrice(p.price)} <span class="original">${formatPrice(p.originalPrice)}</span></div></div>
        </div>`
      }).join('')}
    </div>
  `
  renderPage(container)
}

export function renderBlogPage(): void {
  const articles = [
    { id: 1, title: 'Top 10 Electronics Deals This Summer', excerpt: 'Discover the hottest tech deals on headphones, smartwatches, and more. Save up to 70% on premium brands.', category: 'Electronics', date: '2026-07-18', readTime: '5 min', image: 'https://picsum.photos/seed/blog1/600/300' },
    { id: 2, title: 'How to Choose the Perfect Running Shoes', excerpt: 'A comprehensive guide to finding running shoes that match your foot type, running style, and budget.', category: 'Fashion', date: '2026-07-15', readTime: '7 min', image: 'https://picsum.photos/seed/blog2/600/300' },
    { id: 3, title: 'Smart Home Essentials for Beginners', excerpt: 'Transform your living space with these must-have smart home gadgets. Easy setup, big impact.', category: 'Home', date: '2026-07-12', readTime: '6 min', image: 'https://picsum.photos/seed/blog3/600/300' },
    { id: 4, title: 'Summer Skincare Routine: Expert Tips', excerpt: 'Keep your skin glowing this summer with dermatologist-approved products and routines.', category: 'Beauty', date: '2026-07-10', readTime: '4 min', image: 'https://picsum.photos/seed/blog4/600/300' },
    { id: 5, title: 'Beginner Guide to Yoga & Meditation', excerpt: 'Start your wellness journey with the right gear and mindset. Everything you need to know.', category: 'Sports', date: '2026-07-08', readTime: '8 min', image: 'https://picsum.photos/seed/blog5/600/300' }
  ]
  const container = document.createElement('div')
  container.className = 'section'
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>Blog</span></div>
    <h2 style="font-size:24px;font-weight:700;margin-bottom:24px">📝 Alliance Mall Blog</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px">
      ${articles.map(a => `
        <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;transition:transform 0.2s;cursor:pointer">
          <img src="${a.image}" alt="${a.title}" style="width:100%;height:180px;object-fit:cover">
          <div style="padding:20px">
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
              <span style="background:#fff5f3;color:#ee4d2d;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600">${a.category}</span>
              <span style="font-size:12px;color:#999">${a.readTime} read</span>
            </div>
            <h3 style="font-size:16px;font-weight:700;margin-bottom:8px;line-height:1.4">${a.title}</h3>
            <p style="font-size:13px;color:#666;line-height:1.6">${a.excerpt}</p>
            <div style="margin-top:12px;font-size:12px;color:#999">${a.date}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `
  renderPage(container)
}

export function renderStoresPage(): void {
  const stores = [...new Set(PRODUCTS.map(p => p.seller))]
  const container = document.createElement('div')
  container.className = 'section'
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>All Stores</span></div>
    <h2 style="font-size:22px;font-weight:700;margin-bottom:24px">🏪 All Stores</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${stores.map(name => {
        const storeProducts = PRODUCTS.filter(p => p.seller === name)
        const totalSold = storeProducts.reduce((s, p) => s + p.sold, 0)
        const avgRating = storeProducts.length ? (storeProducts.reduce((s, p) => s + p.rating, 0) / storeProducts.length).toFixed(1) : '0.0'
        return `
          <a href="/store/${encodeURIComponent(name)}" style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;text-decoration:none;color:inherit;transition:transform 0.2s">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700">${name[0]}</div>
              <div><strong style="font-size:15px">${name}</strong><div style="font-size:12px;color:#999">${storeProducts.length} products · ${totalSold.toLocaleString()} sold</div></div>
            </div>
            <div style="font-size:13px;color:#ffc107">★ ${avgRating}</div>
          </a>
        `
      }).join('')}
    </div>
  `
  renderPage(container)
}

export function renderNotificationsPage(): void {
  if (!isLoggedIn()) { renderStaticPage('Notifications', `<p><a href="/auth" style="color:#ee4d2d">Login</a> to see notifications.</p>`); return }
  const notifs = getNotifications()
  const container = document.createElement('div')
  container.className = 'section'
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>Notifications</span></div>
    <h2 style="font-size:22px;font-weight:700;margin-bottom:24px">🔔 Notifications</h2>
    ${notifs.length ? notifs.map((n: any) => `
      <a href="${n.link || '#'}" style="display:flex;gap:12px;padding:16px;background:${n.isRead ? '#fff' : '#fff5f3'};border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:8px;text-decoration:none;color:inherit;${!n.isRead ? 'border-left:3px solid #ee4d2d' : ''}">
        <div style="font-size:24px">${n.type === 'order' ? '📦' : n.type === 'promo' ? '🎉' : n.type === 'chat' ? '💬' : '🔔'}</div>
        <div style="flex:1">
          <strong style="font-size:14px">${n.title}</strong>
          <p style="font-size:13px;color:#666;margin-top:4px">${n.message}</p>
          <div style="font-size:11px;color:#999;margin-top:4px">${new Date(n.createdAt).toLocaleString()}</div>
        </div>
        ${!n.isRead ? '<div style="width:8px;height:8px;border-radius:50%;background:#ee4d2d;flex-shrink:0"></div>' : ''}
      </a>
    `).join('') : '<div class="empty-state"><div class="icon">🔔</div><h3>No notifications</h3></div>'}
  `
  renderPage(container)
  // Mark all as read
  notifs.forEach((n: any) => { if (!n.isRead) markNotificationRead(n.id) })
}


export function renderSellPage(): void {
  const user = getCurrentUser()
  const container = document.createElement('div')
  container.className = 'section'

  if (!user) {
    container.innerHTML = `
      <div class="breadcrumb"><a href="/">Home</a> / <span>Become a Seller</span></div>
      <div style="background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;padding:60px 20px;text-align:center;border-radius:12px;margin-bottom:32px">
        <h1 style="font-size:36px;font-weight:800;margin-bottom:12px">🏪 Start Selling on Alliance Mall</h1>
        <p style="font-size:16px;opacity:0.9;max-width:600px;margin:0 auto">Join thousands of sellers and reach millions of customers worldwide.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1000px;margin:0 auto 40px">
        ${['🌍 Global Reach · 180+ countries', '💰 Low Fees · 5% commission', '📊 Powerful Tools · Analytics dashboard', '🛡️ Secure Payments · Weekly payouts'].map((t, i) => `<div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:28px;text-align:center"><div style="font-size:40px;margin-bottom:12px">${['🌍','💰','📊','🛡️'][i]}</div><h3 style="font-size:15px;font-weight:700">${t.split('·')[0]}</h3><p style="font-size:13px;color:#666">${t.split('·')[1]}</p></div>`).join('')}
      </div>
      <div style="max-width:600px;margin:0 auto;text-align:center">
        <a href="/seller/login" class="btn btn-primary btn-lg">Login to Register as Seller</a>
        <p style="font-size:13px;color:#999;margin-top:12px">Already a seller? <a href="/seller" style="color:#ee4d2d">Go to Dashboard</a></p>
      </div>
    `
    renderPage(container)
    return
  }

  if (isSeller()) {
    container.innerHTML = `
      <div class="breadcrumb"><a href="/">Home</a> / <span>Become a Seller</span></div>
      <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:40px;text-align:center;max-width:600px;margin:0 auto">
        <div style="font-size:64px;margin-bottom:16px">✅</div>
        <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">You're Already a Seller!</h2>
        <p style="font-size:14px;color:#666;margin-bottom:24px">Manage your store, products, and orders from your seller dashboard.</p>
        <a href="/seller" class="btn btn-primary btn-lg">Go to Seller Dashboard</a>
      </div>
    `
    renderPage(container)
    return
  }

  let step = 1
  const totalSteps = 3

  function render() {
    container.innerHTML = `
      <div class="breadcrumb"><a href="/">Home</a> / <span>Become a Seller</span></div>

      <!-- Hero -->
      <div style="background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;padding:40px 20px;text-align:center;border-radius:12px;margin-bottom:24px">
        <h1 style="font-size:28px;font-weight:800;margin-bottom:8px">🏪 Seller Registration</h1>
        <p style="font-size:14px;opacity:0.9">Step ${step} of ${totalSteps} — ${step === 1 ? 'Business Info' : step === 2 ? 'Store Details' : 'Policies & Confirm'}</p>
        <!-- Progress Bar -->
        <div style="max-width:400px;margin:16px auto 0;background:rgba(255,255,255,0.3);border-radius:10px;height:8px;overflow:hidden">
          <div style="width:${(step / totalSteps) * 100}%;height:100%;background:#fff;border-radius:10px;transition:width 0.3s"></div>
        </div>
      </div>

      <!-- User Info -->
      <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:24px;margin-bottom:20px;max-width:700px;margin-left:auto;margin-right:auto">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">${user!.name[0]}</div>
          <div><strong>${user!.name}</strong><div style="font-size:12px;color:#999">${user!.email} · Registering as seller</div></div>
        </div>
      </div>

      <!-- Form -->
      <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:32px;max-width:700px;margin:0 auto">
        ${step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}

        <!-- Buttons -->
        <div style="display:flex;gap:12px;margin-top:24px;padding-top:20px;border-top:1px solid #e0e0e0">
          ${step > 1 ? '<button class="btn btn-outline" id="prevBtn" style="flex:1">← Previous</button>' : ''}
          ${step < totalSteps ? '<button class="btn btn-primary" id="nextBtn" style="flex:1">Next Step →</button>' : '<button class="btn btn-primary" id="submitBtn" style="flex:1">🏪 Submit Registration</button>'}
        </div>
      </div>

      <!-- Benefits -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:700px;margin:24px auto 0">
        ${['🌍 180+ Countries', '💰 5% Commission', '📊 Analytics', '🛡️ Secure Pay'].map(t => `<div style="background:#fff;border-radius:8px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:13px;font-weight:600">${t}</div></div>`).join('')}
      </div>
    `

    // Event listeners
    container.querySelector('#prevBtn')?.addEventListener('click', () => { step--; render() })
    container.querySelector('#nextBtn')?.addEventListener('click', () => {
      if (step === 1) {
        const storeName = (container.querySelector('#storeName') as HTMLInputElement)?.value.trim()
        const category = (container.querySelector('#storeCategory') as HTMLSelectElement)?.value
        const businessType = (container.querySelector('#businessType') as HTMLSelectElement)?.value
        if (!storeName) { showToast('Store name is required', 'error'); return }
        if (!category) { showToast('Select a category', 'error'); return }
      }
      if (step === 2) {
        const desc = (container.querySelector('#storeDesc') as HTMLTextAreaElement)?.value.trim()
        const location = (container.querySelector('#storeLocation') as HTMLInputElement)?.value.trim()
        if (!desc) { showToast('Store description is required', 'error'); return }
        if (!location) { showToast('Location is required', 'error'); return }
      }
      step++
      render()
    })
    container.querySelector('#submitBtn')?.addEventListener('click', () => {
      const storeName = (container.querySelector('#storeName') as HTMLInputElement).value.trim()
      const category = (container.querySelector('#storeCategory') as HTMLSelectElement).value
      const description = (container.querySelector('#storeDesc') as HTMLTextAreaElement).value.trim()
      const location = (container.querySelector('#storeLocation') as HTMLInputElement).value.trim()
      const phone = (container.querySelector('#storePhone') as HTMLInputElement).value.trim()
      const businessType = (container.querySelector('#businessType') as HTMLSelectElement).value
      const returnPolicy = (container.querySelector('#returnPolicy') as HTMLTextAreaElement).value.trim() || '30-day return policy'
      const shippingPolicy = (container.querySelector('#shippingPolicy') as HTMLTextAreaElement).value.trim() || 'Free shipping on orders over $50'
      const agreeTerms = (container.querySelector('#agreeTerms') as HTMLInputElement).checked
      if (!agreeTerms) { showToast('You must agree to the terms', 'error'); return }
      const result = registerSeller(storeName, category, description, location, phone, businessType, returnPolicy, shippingPolicy)
      if (result.success) {
        showToast('🎉 Seller registration successful!')
        setTimeout(() => navigate('/seller'), 1000)
      } else {
        showToast(result.message!, 'error')
      }
    })

    // Load saved data if going back
    if (step >= 1) {
      const saved = getSellerApplication()
      if (saved) {
        const el = container.querySelector('#storeName') as HTMLInputElement
        if (el && saved.storeName) el.value = saved.storeName
      }
    }
  }

  function renderStep1(): string {
    return `
      <h3 style="font-size:18px;font-weight:700;margin-bottom:20px">📋 Business Information</h3>
      <div class="form-group">
        <label>Store Name * <span style="font-size:11px;color:#999">(This will be visible to buyers)</span></label>
        <input type="text" class="form-control" id="storeName" placeholder="e.g. My Awesome Store" maxlength="50">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label>Business Type *</label>
          <select class="form-control" id="businessType">
            <option value="individual">Individual / Sole Proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Store Category *</label>
          <select class="form-control" id="storeCategory">
            <option value="">Select category</option>
            ${CATEGORIES.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label>Phone Number *</label>
          <input type="tel" class="form-control" id="storePhone" placeholder="+1 234 567 8900">
        </div>
        <div class="form-group">
          <label>Location / City *</label>
          <input type="text" class="form-control" id="storeLocation" placeholder="e.g. Shenzhen, China">
        </div>
      </div>
      <div class="form-group">
        <label>Business Registration Number <span style="font-size:11px;color:#999">(Optional)</span></label>
        <input type="text" class="form-control" id="businessRegNo" placeholder="e.g. 123456789">
      </div>
    `
  }

  function renderStep2(): string {
    return `
      <h3 style="font-size:18px;font-weight:700;margin-bottom:20px">🏪 Store Details</h3>
      <div class="form-group">
        <label>Store Description *</label>
        <textarea class="form-control" id="storeDesc" rows="4" placeholder="Tell buyers about your store, what you sell, and why they should choose you..."></textarea>
      </div>
      <div class="form-group">
        <label>Store Logo <span style="font-size:11px;color:#999">(Enter image URL)</span></label>
        <input type="text" class="form-control" id="storeLogo" placeholder="https://example.com/logo.jpg">
      </div>
      <div class="form-group">
        <label>Banner Color</label>
        <input type="color" class="form-control" id="storeBannerColor" value="#667eea" style="height:44px;padding:4px">
      </div>
      <div class="form-group">
        <label>Website / Social Media <span style="font-size:11px;color:#999">(Optional)</span></label>
        <input type="text" class="form-control" id="storeWebsite" placeholder="https://yourstore.com">
      </div>
      <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-top:12px">
        <h4 style="font-size:13px;font-weight:600;margin-bottom:8px">💡 Tips for a great store:</h4>
        <ul style="font-size:12px;color:#666;padding-left:16px;list-style:disc">
          <li>Use a clear, memorable store name</li>
          <li>Write a detailed description of what you sell</li>
          <li>Choose a banner color that matches your brand</li>
          <li>Add your website or social media for credibility</li>
        </ul>
      </div>
    `
  }

  function renderStep3(): string {
    return `
      <h3 style="font-size:18px;font-weight:700;margin-bottom:20px">📜 Policies & Confirmation</h3>
      <div class="form-group">
        <label>Return Policy</label>
        <textarea class="form-control" id="returnPolicy" rows="3" placeholder="e.g. 30-day return policy. Items must be unused and in original packaging.">30-day return policy. Items must be unused and in original packaging.</textarea>
      </div>
      <div class="form-group">
        <label>Shipping Policy</label>
        <textarea class="form-control" id="shippingPolicy" rows="3" placeholder="e.g. Free shipping on orders over $50. Standard delivery 5-7 days.">Free shipping on orders over $50. Standard delivery 5-7 days.</textarea>
      </div>
      <div style="background:#f0f8ff;border-radius:8px;padding:16px;margin-bottom:16px">
        <h4 style="font-size:13px;font-weight:600;margin-bottom:8px">📊 Seller Fee Summary</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
          <div>Commission Rate:</div><div style="font-weight:600">5% per sale</div>
          <div>Listing Fee:</div><div style="font-weight:600">Free</div>
          <div>Payout Schedule:</div><div style="font-weight:600">Weekly (every Monday)</div>
          <div>Payment Methods:</div><div style="font-weight:600">Bank Transfer, PayPal</div>
        </div>
      </div>
      <div style="background:#fff5f3;border:1px solid #ee4d2d;border-radius:8px;padding:16px;margin-bottom:16px">
        <h4 style="font-size:13px;font-weight:600;margin-bottom:8px;color:#ee4d2d">📋 Seller Agreement</h4>
        <ul style="font-size:12px;color:#666;padding-left:16px;list-style:disc;line-height:1.8">
          <li>You are responsible for the accuracy of your product listings</li>
          <li>You must ship orders within the timeframe specified</li>
          <li>You must respond to customer inquiries within 24 hours</li>
          <li>Counterfeit or prohibited items are strictly forbidden</li>
          <li>Alliance Mall reserves the right to suspend accounts violating policies</li>
          <li>Commission is automatically deducted from each sale</li>
        </ul>
      </div>
      <label class="checkbox-wrap" style="margin-bottom:12px">
        <input type="checkbox" id="agreeTerms">
        <span style="font-size:13px">I agree to the <a href="/terms" style="color:#ee4d2d" target="_blank">Seller Terms & Conditions</a> and <a href="/privacy" style="color:#ee4d2d" target="_blank">Privacy Policy</a></span>
      </label>
      <label class="checkbox-wrap">
        <input type="checkbox" id="agreePolicies">
        <span style="font-size:13px">I understand the 5% commission rate and payout schedule</span>
      </label>
    `
  }

  render()
  renderPage(container)
}

export function renderComparisonPage(): void {
  const ids = getComparisonItems()
  const products = PRODUCTS.filter((p: any) => ids.includes(p.id))
  const container = document.createElement('div')
  container.className = 'section'
  if (!products.length) {
    container.innerHTML = '<div class="breadcrumb"><a href="/">Home</a> / <span>Comparison</span></div><div class="empty-state"><div class="icon">⚖️</div><h3>No items to compare</h3><p>Add products to compare from product pages</p><a href="/category" class="btn btn-primary">Browse Products</a></div>'
    renderPage(container)
    return
  }
  const attrs = ['price', 'originalPrice', 'rating', 'sold', 'brand', 'category', 'stock', 'weight', 'freeShipping', 'returnPolicy']
  const labels: Record<string, string> = { price: 'Price', originalPrice: 'Original Price', rating: 'Rating', sold: 'Sold', brand: 'Brand', category: 'Category', stock: 'Stock', weight: 'Weight', freeShipping: 'Free Shipping', returnPolicy: 'Return Policy' }
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>Product Comparison</span></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2 style="font-size:22px;font-weight:700">⚖️ Product Comparison (${products.length})</h2>
      <button class="btn btn-outline btn-sm" id="clearCompare">Clear All</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <tr><th style="padding:12px;text-align:left;background:#f8f8f8;font-size:13px;min-width:120px">Product</th>${products.map((p: any) => `<td style="padding:16px;text-align:center;min-width:180px"><img src="${p.images?.[0] || ''}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px"><div style="font-size:13px;font-weight:600"><a href="/product/${p.id}" style="color:#333">${p.name}</a></div><button class="btn btn-sm btn-outline remove-compare" data-id="${p.id}" style="margin-top:8px">Remove</button></td>`).join('')}</tr>
        ${attrs.map(attr => `<tr><td style="padding:10px 12px;font-size:13px;font-weight:600;background:#fafafa;border-top:1px solid #e0e0e0">${labels[attr]}</td>${products.map((p: any) => { let val = (p as any)[attr]; if (attr === 'price' || attr === 'originalPrice') val = formatPrice(val); else if (attr === 'rating') val = '★'.repeat(Math.floor(val)) + '☆'.repeat(5 - Math.floor(val)) + ' ' + val; else if (attr === 'sold') val = val.toLocaleString() + ' sold'; else if (attr === 'freeShipping') val = val ? '✅ Yes' : '❌ No'; else if (attr === 'returnPolicy') val = val || 'N/A'; return `<td style="padding:10px 12px;font-size:13px;border-top:1px solid #e0e0e0;text-align:center">${val}</td>` }).join('')}</tr>`).join('')}
      </table>
    </div>
  `
  renderPage(container)
  container.querySelector('#clearCompare')?.addEventListener('click', () => { clearComparison(); showToast('Comparison cleared'); setTimeout(() => location.reload(), 500) })
  container.querySelectorAll('.remove-compare').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { toggleComparison(Number(this.dataset.id)); setTimeout(() => location.reload(), 500) }))
}

export function renderStoreDetailPage(): void {
  const storeId = getParam('id') || ''
  const decodedId = decodeURIComponent(storeId)
  
  // Find products from this store
  const storeProducts = PRODUCTS.filter(p => p.seller === decodedId || p.sellerId === decodedId)
  const storeName = storeProducts.length ? storeProducts[0].seller : decodedId
  const totalSold = storeProducts.reduce((s, p) => s + p.sold, 0)
  const avgRating = storeProducts.length ? (storeProducts.reduce((s, p) => s + p.rating, 0) / storeProducts.length) : 0
  const categories = [...new Set(storeProducts.map(p => p.category))]

  if (!storeProducts.length) {
    renderStaticPage('Store Not Found', `<p>Store "${decodedId}" not found. <a href="/stores" style="color:#ee4d2d">Browse all stores</a></p>`)
    return
  }

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <a href="/stores">Stores</a> / <span>${storeName}</span></div>
    
    <!-- Store Banner -->
    <div style="background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;padding:40px;border-radius:12px;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700">${storeName[0]}</div>
        <div style="flex:1">
          <h1 style="font-size:28px;font-weight:800;margin-bottom:4px">${storeName} <span class="verified-badge">✓ Verified</span></h1>
          <p style="opacity:0.9;font-size:14px">${categories.join(', ')} · Member since 2024</p>
        </div>
        <div style="display:flex;gap:12px">
          <button class="follow-btn" id="followStoreBtn">+ Follow</button>
          <a href="/messages?product=${storeProducts[0]?.id || ''}" class="btn" style="background:rgba(255,255,255,0.2);color:#fff">💬 Chat</a>
        </div>
      </div>
    </div>

    <!-- Store Stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:24px">
      <div style="background:#fff;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:24px;font-weight:700;color:#ee4d2d">${storeProducts.length}</div>
        <div style="font-size:13px;color:#999">Products</div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:24px;font-weight:700;color:#3498db">${totalSold.toLocaleString()}</div>
        <div style="font-size:13px;color:#999">Total Sold</div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:24px;font-weight:700;color:#f39c12">${renderStars(avgRating)} ${avgRating.toFixed(1)}</div>
        <div style="font-size:13px;color:#999">Store Rating</div>
      </div>
      <div style="background:#fff;border-radius:8px;padding:20px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:24px;font-weight:700;color:#27ae60">95%</div>
        <div style="font-size:13px;color:#999">Response Rate</div>
      </div>
    </div>

    <!-- Store Rating -->
    <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:24px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:12px">⭐ Store Rating</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        <div style="text-align:center">
          <div style="font-size:48px;font-weight:800;color:#f39c12">${avgRating.toFixed(1)}</div>
          <div style="color:#ffc107;font-size:18px">${renderStars(avgRating)}</div>
          <div style="font-size:12px;color:#999;margin-top:4px">Store Rating</div>
        </div>
        <div style="flex:1">
          ${[5,4,3,2,1].map(star => {
            const count = storeProducts.filter(p => Math.floor(p.rating) === star).length
            const pct = storeProducts.length ? Math.round(count / storeProducts.length * 100) : 0
            return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="width:16px;font-size:12px">${star}★</span><div style="flex:1;height:8px;background:#eee;border-radius:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:#ffc107;border-radius:4px"></div></div><span style="width:24px;font-size:12px;color:#999">${count}</span></div>`
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Products by Category -->
    ${categories.map(cat => {
      const catProducts = storeProducts.filter(p => p.category === cat)
      return `
        <div style="margin-bottom:24px">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:12px">${cat} (${catProducts.length})</h3>
          <div class="product-grid">${catProducts.map(p => `
            <div class="card product-card" onclick="window.location.href='/product/${p.id}'">
              <div class="product-img-wrap">
                <img class="product-img" src="${getProductImage(p)}" alt="${p.name}" onerror="this.style.display='none'">
                ${Math.round((1-p.price/p.originalPrice)*100) >= 40 ? `<span class="discount-badge">-${Math.round((1-p.price/p.originalPrice)*100)}%</span>` : ''}
              </div>
              <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">${formatPrice(p.price)} <span class="original">${formatPrice(p.originalPrice)}</span></div>
                <div class="product-meta"><span class="stars">${renderStars(p.rating)}</span><span>${p.sold.toLocaleString()} sold</span></div>
              </div>
            </div>
          `).join('')}</div>
        </div>
      `
    }).join('')}
  `
  renderPage(container)

  // Follow button
  const followBtn = container.querySelector('#followStoreBtn') as HTMLButtonElement
  const followedStores: string[] = JSON.parse(localStorage.getItem('am_followed_stores') || '[]')
  let isFollowing = followedStores.includes(storeName)
  if (isFollowing) { followBtn.textContent = '✓ Following'; followBtn.classList.add('following') }
  followBtn?.addEventListener('click', () => {
    const stores: string[] = JSON.parse(localStorage.getItem('am_followed_stores') || '[]')
    if (isFollowing) {
      const idx = stores.indexOf(storeName)
      if (idx >= 0) stores.splice(idx, 1)
      followBtn.textContent = '+ Follow'; followBtn.classList.remove('following')
      isFollowing = false
      showToast('Unfollowed ' + storeName)
    } else {
      stores.push(storeName)
      followBtn.textContent = '✓ Following'; followBtn.classList.add('following')
      isFollowing = true
      showToast('Following ' + storeName + '!')
    }
    localStorage.setItem('am_followed_stores', JSON.stringify(stores))
  })
}
