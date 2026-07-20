// ==================== CART PAGE ====================
import { PRODUCTS } from '../utils/data'
import { getCart, saveCart, formatPrice, getProductImage, getProductInitials, getProductColor, getCartTotal, showToast } from '../utils/helpers'
import { renderPage, renderEmptyState } from '../components'
import { navigate } from '../router'

export function renderCartPage(): void {
  const cart = getCart()
  const container = document.createElement('div')

  if (cart.length === 0) {
    container.appendChild(renderEmptyState('🛒', 'Your cart is empty', 'Looks like you haven\'t added anything yet', 'Start Shopping'))
    renderPage(container)
    return
  }

  container.innerHTML = `
    <div class="breadcrumb" style="max-width:1200px;margin:0 auto;padding:16px 20px 0"><a href="/">Home</a> / <span>Shopping Cart</span></div>
    <div class="cart-page">
      <div id="cartItems"></div>
      <div class="cart-summary" id="cartSummary"></div>
    </div>
  `

  renderPage(container)
  renderCartItems()

  function renderCartItems() {
    const itemsEl = container.querySelector('#cartItems')!
    const summaryEl = container.querySelector('#cartSummary') as HTMLElement
    const currentCart = getCart()
    let subtotal = 0

    itemsEl.innerHTML = ''
    currentCart.forEach((item, index) => {
      const product = PRODUCTS.find(p => p.id === item.id)
      if (!product) return
      subtotal += product.price * item.qty

      const cartItem = document.createElement('div')
      cartItem.className = 'cart-item'
      cartItem.innerHTML = `
        <div class="cart-item-img">
          <img src="${getProductImage(product)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
        </div>
        <div class="cart-item-info">
          <h3><a href="/product/${product.id}">${product.name}</a></h3>
          <div>
            <span class="item-price">${formatPrice(product.price)}</span>
            <span class="item-original">${formatPrice(product.originalPrice)}</span>
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-selector">
            <button class="qty-btn" data-action="dec">−</button>
            <input type="number" value="${item.qty}" min="1" class="qty-val">
            <button class="qty-btn" data-action="inc">+</button>
          </div>
          <button class="remove-btn" title="Remove">✕</button>
        </div>
      `

      cartItem.querySelector('[data-action="dec"]')?.addEventListener('click', () => updateQty(index, item.qty - 1))
      cartItem.querySelector('[data-action="inc"]')?.addEventListener('click', () => updateQty(index, item.qty + 1))
      cartItem.querySelector('.qty-val')?.addEventListener('change', (e) => updateQty(index, Number((e.target as HTMLInputElement).value)))
      cartItem.querySelector('.remove-btn')?.addEventListener('click', () => removeItem(index))

      itemsEl.appendChild(cartItem)
    })

    const shipping = subtotal >= 50 ? 0 : 4.99
    summaryEl.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:#28a745">FREE</span>' : formatPrice(shipping)}</span></div>
      ${subtotal < 50 ? `<p style="font-size:12px;color:#999;margin-bottom:8px">Add ${formatPrice(50 - subtotal)} more for free shipping!</p>` : ''}
      <div class="summary-row total"><span>Total</span><span>${formatPrice(subtotal + shipping)}</span></div>
      <button class="btn btn-primary btn-block btn-lg" style="margin-top:16px" id="checkoutBtn">Proceed to Checkout</button>
      <a href="/" style="display:block;text-align:center;margin-top:12px;font-size:13px;color:#ee4d2d">Continue Shopping</a>
    `

    summaryEl.querySelector('#checkoutBtn')?.addEventListener('click', () => navigate('/checkout'))
  }

  function updateQty(index: number, qty: number) {
    const currentCart = getCart()
    if (qty <= 0) { removeItem(index); return }
    currentCart[index].qty = qty
    saveCart(currentCart)
    renderCartItems()
  }

  function removeItem(index: number) {
    const currentCart = getCart()
    currentCart.splice(index, 1)
    saveCart(currentCart)
    renderCartItems()
    showToast('Item removed from cart')
  }
}
