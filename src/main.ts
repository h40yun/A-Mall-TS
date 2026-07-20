// ==================== MAIN ENTRY POINT ====================
import { route, handleRoute, initRouter } from './router'
import { initAdminData } from './utils/helpers'
import { renderHomePage } from './pages/home'
import { renderProductPage } from './pages/product'
import { renderCartPage } from './pages/cart'
import { renderCheckoutPage } from './pages/checkout'
import { renderAuthPage } from './pages/auth'
import { renderCategoryPage } from './pages/category'
import { renderProfilePage } from './pages/profile'
import { renderWishlistPage } from './pages/wishlist'
import { renderTrackOrderPage } from './pages/track-order'
import {
  renderAboutPage, renderContactPage, renderHelpPage, renderHowToBuyPage,
  renderShippingPage, renderReturnPolicyPage, renderPaymentMethodsPage,
  renderTermsPage, renderPrivacyPage, renderDealsPage, renderBlogPage,
  renderStoresPage, renderNotificationsPage, renderMessagesPage, renderStoreDetailPage,
  renderSellerDashboardPage, renderAdminPage, renderSellPage
} from './pages/static'
import { ensureToastContainer } from './components'

// Init
initAdminData()
ensureToastContainer()

// Define Routes
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
route('/messages', renderMessagesPage)
route('/sell', renderSellPage)
route('/store/:id', renderStoreDetailPage)
route('/admin', renderAdminPage)
route('/seller', renderSellerDashboardPage)

// Start Router
initRouter()
handleRoute()
