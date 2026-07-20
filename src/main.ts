// ==================== MAIN ENTRY POINT ====================
import { route, handleRoute, initRouter } from './router'
import { initAdminData, setProductsCache } from './utils/helpers'
import { PRODUCTS } from './utils/data'
import { initDemoAccounts } from './utils/demo-accounts'
import { renderHomePage } from './pages/home'
import { renderProductPage } from './pages/product'
import { renderCartPage } from './pages/cart'
import { renderCheckoutPage } from './pages/checkout'
import { renderAuthPage } from './pages/auth'
import { renderCategoryPage } from './pages/category'
import { renderProfilePage } from './pages/profile'
import { renderWishlistPage } from './pages/wishlist'
import { renderTrackOrderPage } from './pages/track-order'
import { renderMessagesPage } from './pages/messages'
import { renderSellerDashboardPage } from './pages/seller'
import { renderAdminPage } from './pages/admin'
import { renderNotFoundPage } from './pages/not-found'
import { renderSellerLoginPage } from './pages/seller-auth'
import {
  renderAboutPage, renderContactPage, renderHelpPage, renderHowToBuyPage,
  renderShippingPage, renderReturnPolicyPage, renderPaymentMethodsPage,
  renderTermsPage, renderPrivacyPage, renderDealsPage, renderBlogPage,
  renderStoresPage, renderNotificationsPage, renderStoreDetailPage,
  renderSellPage, renderComparisonPage
} from './pages/static'
import { ensureToastContainer } from './components'

// Init
initAdminData()
initDemoAccounts()

// Global catalog data
const CATALOG = { products: [...PRODUCTS] as any[], sellers: [] as any[], reviews: [] as any[] }
;(window as any).__CATALOG__ = CATALOG

// Set initial products immediately
setProductsCache(PRODUCTS)

// Load mega catalog, sellers, and reviews from JSON files
Promise.all([
  fetch('/products.json').then(r => r.json()).catch(() => []),
  fetch('/sellers.json').then(r => r.json()).catch(() => []),
  fetch('/reviews.json').then(r => r.json()).catch(() => []),
]).then(([catalog, sellers, reviews]) => {
  CATALOG.products = [...PRODUCTS, ...catalog]
  CATALOG.sellers = sellers
  CATALOG.reviews = reviews
  setProductsCache(CATALOG.products)
  console.log('Loaded ' + CATALOG.products.length + ' products, ' + sellers.length + ' sellers, ' + reviews.length + ' reviews')
}).catch(() => {
  console.log('Using original products only')
})

// Auto-replenish stock (check every 30 seconds)
setInterval(() => {
  const products = CATALOG.products
  let replenished = 0
  for (const p of products) {
    if (p.stock < 10) {
      p.stock = Math.floor(Math.random() * (999 - 24 + 1)) + 24
      replenished++
    }
  }
  if (replenished > 0) {
    setProductsCache(products)
  }
}, 30000)

ensureToastContainer()

// Routes
route('/', renderHomePage)
route('/product/:id', renderProductPage)
route('/cart', renderCartPage)
route('/checkout', renderCheckoutPage)
route('/auth', renderAuthPage)
route('/category', renderCategoryPage)
route('/search', renderCategoryPage)
route('/profile', renderProfilePage)
route('/wishlist', renderWishlistPage)
route('/track-order', renderTrackOrderPage)
route('/messages', renderMessagesPage)
route('/seller', renderSellerDashboardPage)
route('/seller/login', renderSellerLoginPage)
route('/comparison', renderComparisonPage)
route('/about', renderAboutPage)
route('/contact', renderContactPage)
route('/help', renderHelpPage)
route('/how-to-buy', renderHowToBuyPage)
route('/shipping', renderShippingPage)
route('/return-policy', renderReturnPolicyPage)
route('/payment-methods', renderPaymentMethodsPage)
route('/terms', renderTermsPage)
route('/privacy', renderPrivacyPage)
route('/deals', renderDealsPage)
route('/blog', renderBlogPage)
route('/stores', renderStoresPage)
route('/notifications', renderNotificationsPage)
route('/sell', renderSellPage)
route('/store/:id', renderStoreDetailPage)
route('/admin', renderAdminPage)
route('/404', renderNotFoundPage)

initRouter()
handleRoute()
