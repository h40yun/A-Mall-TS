// ==================== STATIC PAGES ====================
import { renderPage } from '../components'

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
    <h3>📧 Email</h3>
    <p>support@alliancemall.com</p>
    <h3>📱 Phone</h3>
    <p>+1 (555) 123-4567</p>
    <h3>📍 Address</h3>
    <p>123 Commerce Street, Tech City, TC 10001</p>
    <h3>⏰ Business Hours</h3>
    <p>Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
    <p>Saturday - Sunday: 10:00 AM - 4:00 PM (EST)</p>
  `)
}

export function renderHelpPage(): void {
  renderStaticPage('Help Center', `
    <h3>🛒 How to Order</h3>
    <p>Browse products, add to cart, and checkout. It's that simple!</p>
    <h3>💳 Payment Methods</h3>
    <p>We accept Credit/Debit Cards, PayPal, and Bank Transfers.</p>
    <h3>🚚 Shipping</h3>
    <p>Free shipping on orders over $50. Standard delivery takes 5-7 business days.</p>
    <h3>↩️ Returns</h3>
    <p>30-day return policy. Items must be unused and in original packaging.</p>
    <h3>📞 Need More Help?</h3>
    <p>Contact us at support@alliancemall.com</p>
  `)
}

export function renderHowToBuyPage(): void {
  renderStaticPage('How to Buy', `
    <h3>Step 1: Browse Products</h3>
    <p>Explore our categories or use the search bar to find what you need.</p>
    <h3>Step 2: Add to Cart</h3>
    <p>Select your desired product, choose options, and click "Add to Cart".</p>
    <h3>Step 3: Checkout</h3>
    <p>Review your cart, enter shipping details, and choose a payment method.</p>
    <h3>Step 4: Place Order</h3>
    <p>Confirm your order and wait for delivery. Track your order in your profile.</p>
  `)
}

export function renderShippingPage(): void {
  renderStaticPage('Shipping & Delivery', `
    <h3>Shipping Options</h3>
    <ul>
      <li><strong>Free Shipping:</strong> Orders over $50 (7-14 business days)</li>
      <li><strong>Standard Shipping:</strong> $4.99 (5-7 business days)</li>
      <li><strong>Express Shipping:</strong> $9.99 (2-3 business days)</li>
    </ul>
    <h3>International Shipping</h3>
    <p>We ship to 180+ countries worldwide. International shipping rates vary by location.</p>
    <h3>Order Tracking</h3>
    <p>Track your order anytime from your profile page or the tracking page.</p>
  `)
}

export function renderReturnPolicyPage(): void {
  renderStaticPage('Return & Refund Policy', `
    <h3>30-Day Return Policy</h3>
    <p>Items can be returned within 30 days of delivery for a full refund.</p>
    <h3>Conditions</h3>
    <ul>
      <li>Items must be unused and in original packaging</li>
      <li>Proof of purchase required</li>
      <li>Return shipping costs are the buyer's responsibility</li>
    </ul>
    <h3>Refund Process</h3>
    <p>Refunds are processed within 5-7 business days after we receive the returned item.</p>
  `)
}

export function renderPaymentMethodsPage(): void {
  renderStaticPage('Payment Methods', `
    <p>We accept the following payment methods:</p>
    <ul>
      <li>💳 Credit / Debit Cards (Visa, Mastercard, Amex)</li>
      <li>🅿️ PayPal</li>
      <li>🏦 Bank Transfer</li>
      <li>📱 Apple Pay</li>
      <li>🟢 Google Pay</li>
    </ul>
    <p>All payments are secured with 256-bit SSL encryption.</p>
  `)
}

export function renderTermsPage(): void {
  renderStaticPage('Terms & Conditions', `
    <p>By using Alliance Mall TK, you agree to the following terms:</p>
    <h3>1. Account</h3>
    <p>You are responsible for maintaining the security of your account.</p>
    <h3>2. Purchases</h3>
    <p>All purchases are subject to our return and refund policy.</p>
    <h3>3. Content</h3>
    <p>You retain ownership of content you submit but grant us a license to use it.</p>
    <h3>4. Limitation of Liability</h3>
    <p>We are not liable for indirect, incidental, or consequential damages.</p>
  `)
}

export function renderPrivacyPage(): void {
  renderStaticPage('Privacy Policy', `
    <h3>Data Collection</h3>
    <p>We collect information you provide directly, such as name, email, and shipping address.</p>
    <h3>Data Usage</h3>
    <p>We use your data to process orders, improve our services, and communicate with you.</p>
    <h3>Data Protection</h3>
    <p>We implement industry-standard security measures to protect your personal information.</p>
    <h3>Cookies</h3>
    <p>We use cookies to enhance your shopping experience and analyze site traffic.</p>
  `)
}

export function renderDealsPage(): void {
  renderStaticPage('Deals & Promotions', `
    <p>🔥 Check out our latest deals!</p>
    <p>Visit the <a href="/category" style="color:#ee4d2d">category page</a> to see all products with discounts.</p>
    <p>Subscribe to our newsletter for exclusive deals and early access to sales.</p>
  `)
}

export function renderBlogPage(): void {
  renderStaticPage('Blog', `
    <p>Welcome to the Alliance Mall blog! Stay tuned for:</p>
    <ul>
      <li>🆕 New product announcements</li>
      <li>💡 Shopping tips and guides</li>
      <li>🎉 Sale events and promotions</li>
      <li>📊 Industry trends and insights</li>
    </ul>
  `)
}

export function renderStoresPage(): void {
  renderStaticPage('All Stores', `
    <p>Browse all our verified sellers and find the perfect store for your needs.</p>
    <p>Visit the <a href="/category" style="color:#ee4d2d">category page</a> to explore products by store.</p>
  `)
}

export function renderNotificationsPage(): void {
  renderStaticPage('Notifications', `
    <p>No new notifications.</p>
    <p>You'll receive notifications about order updates, new deals, and more.</p>
  `)
}

export function renderMessagesPage(): void {
  renderStaticPage('Messages', `
    <p>No messages yet.</p>
    <p>Start a conversation with a seller by visiting their store page.</p>
  `)
}
