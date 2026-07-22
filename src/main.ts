// ==================== MAIN ENTRY POINT ====================
import { route, handleRoute, initRouter } from './router'
import { initAuth, isLoggedIn, isAdmin, isSeller, getCurrentProfile, onAuthChange } from './utils/auth'
import { fetchProducts, fetchCategories, getCartCount, fetchNotifications, getUnreadNotificationCount } from './utils/db'
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

// ============================================================
// INIT: Auth first, then routes
// ============================================================
async function bootstrap() {
  // Initialize auth (waits for Supabase session)
  await initAuth()

  ensureToastContainer()

  // Register routes
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

  console.log('[A-Mall] Production mode initialized')
  console.log('[A-Mall] Auth:', isLoggedIn() ? `Logged in as ${getCurrentProfile()?.name}` : 'Guest')
}

// Start the app
bootstrap().catch(err => {
  console.error('[A-Mall] Bootstrap failed:', err)
  // Fallback: still render the page
  ensureToastContainer()
  route('/', renderHomePage)
  route('/404', renderNotFoundPage)
  initRouter()
  handleRoute()
})
