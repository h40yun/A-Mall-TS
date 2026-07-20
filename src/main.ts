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
import {
  renderAboutPage, renderContactPage, renderHelpPage, renderHowToBuyPage,
  renderShippingPage, renderReturnPolicyPage, renderPaymentMethodsPage,
  renderTermsPage, renderPrivacyPage, renderDealsPage, renderBlogPage,
  renderStoresPage, renderNotificationsPage, renderMessagesPage
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
route('/sell', renderAboutPage)
route('/store/:id', renderAboutPage)
route('/admin', renderAboutPage)
route('/seller', renderAboutPage)
route('/admin-orders', renderAboutPage)
route('/admin-scraper', renderAboutPage)

// Start Router
initRouter()
handleRoute()
