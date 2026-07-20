// ==================== STATIC PAGES ====================
import { renderPage, renderProductCard } from '../components'
import { PRODUCTS, CATEGORIES, COUPONS, VOUCHERS } from '../utils/data'
import { getCurrentUser, formatPrice, getOrders, showToast, getAddresses, saveAddress, isAdmin } from '../utils/helpers'
import { navigate } from '../router'
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
  renderStaticPage('Blog', `
    <p>Welcome to the Alliance Mall blog!</p>
    <ul><li>🆕 New product announcements</li><li>💡 Shopping tips</li><li>🎉 Sale events</li><li>📊 Industry trends</li></ul>
  `)
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
  renderStaticPage('Notifications', `<p>No new notifications.</p>`)
}

export function renderMessagesPage(): void {
  renderStaticPage('Messages', `<p>No messages yet. Start a conversation with a seller.</p>`)
}

export function renderStoreDetailPage(): void {
  renderStaticPage('Store', `<p>Store page coming soon.</p>`)
}

export function renderSellerDashboardPage(): void {
  const user = getCurrentUser()
  if (!user) { navigate('/auth'); return }
  renderStaticPage('Seller Center', `<p>Seller dashboard coming soon. Apply to sell <a href="/sell" style="color:#ee4d2d">here</a>.</p>`)
}

export function renderAdminPage(): void {
  if (!isAdmin()) { navigate('/'); return }
  renderStaticPage('Admin Panel', `<p>Admin panel coming soon.</p>`)
}

export function renderSellPage(): void {
  const container = document.createElement('div')
  container.className = 'section'
  container.innerHTML = `
    <div class="breadcrumb"><a href="/">Home</a> / <span>Become a Seller</span></div>
    <div style="background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;padding:60px 20px;text-align:center;border-radius:12px;margin-bottom:32px">
      <h1 style="font-size:36px;font-weight:800;margin-bottom:12px">🏪 Start Selling on Alliance Mall</h1>
      <p style="font-size:16px;opacity:0.9;max-width:600px;margin:0 auto">Join thousands of sellers and reach millions of customers worldwide.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1000px;margin:0 auto 40px">
      ${[
        { icon: '🌍', title: 'Global Reach', desc: '180+ countries' },
        { icon: '💰', title: 'Low Fees', desc: '5% commission' },
        { icon: '📊', title: 'Powerful Tools', desc: 'Analytics dashboard' },
        { icon: '🛡️', title: 'Secure Payments', desc: 'Weekly payouts' }
      ].map(b => `
        <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:28px;text-align:center">
          <div style="font-size:40px;margin-bottom:12px">${b.icon}</div>
          <h3 style="font-size:15px;font-weight:700;margin-bottom:6px">${b.title}</h3>
          <p style="font-size:13px;color:#666">${b.desc}</p>
        </div>
      `).join('')}
    </div>
    <div style="max-width:600px;margin:0 auto;text-align:center">
      <a href="/auth" class="btn btn-primary btn-lg">Get Started</a>
      <p style="font-size:13px;color:#999;margin-top:12px">Already a seller? <a href="/seller" style="color:#ee4d2d">Go to Dashboard</a></p>
    </div>
  `
  renderPage(container)
}
