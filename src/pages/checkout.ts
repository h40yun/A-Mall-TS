// ==================== CHECKOUT PAGE ====================
import { PRODUCTS } from '../utils/data'
import { getCart, formatPrice, createOrder, saveCart, showToast, getProductInitials, getProductColor, getProductImage } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderCheckoutPage(): void {
  const cart = getCart()
  if (cart.length === 0) { navigate('/cart'); return }

  let selectedShipping = 'free'
  let shippingCost = 0
  let selectedPayment = 'credit-card'

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="breadcrumb" style="max-width:1200px;margin:0 auto;padding:16px 20px 0"><a href="/">Home</a> / <a href="/cart">Cart</a> / <span>Checkout</span></div>
    <div class="checkout-page">
      <div>
        <div class="checkout-section">
          <h2>📍 Shipping Address</h2>
          <div class="form-row">
            <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="shipName" placeholder="John Doe"></div>
            <div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="shipPhone" placeholder="+1 234 567 8900"></div>
          </div>
          <div class="form-group"><label>Address</label><input type="text" class="form-control" id="shipAddress" placeholder="123 Main Street"></div>
          <div class="form-row">
            <div class="form-group"><label>City</label><input type="text" class="form-control" id="shipCity" placeholder="New York"></div>
            <div class="form-group"><label>State</label><input type="text" class="form-control" id="shipState" placeholder="NY"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>ZIP Code</label><input type="text" class="form-control" id="shipZip" placeholder="10001"></div>
            <div class="form-group"><label>Country</label><select class="form-control" id="shipCountry"><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option></select></div>
          </div>
        </div>
        <div class="checkout-section">
          <h2>🚚 Shipping Method</h2>
          <div class="shipping-option active" data-method="free" data-cost="0">
            <input type="radio" name="shipping" value="free" checked>
            <div class="ship-info"><h4>Free Shipping</h4><p>Estimated 7-14 business days</p></div>
            <div class="ship-price">FREE</div>
          </div>
          <div class="shipping-option" data-method="standard" data-cost="4.99">
            <input type="radio" name="shipping" value="standard">
            <div class="ship-info"><h4>Standard Shipping</h4><p>Estimated 5-7 business days</p></div>
            <div class="ship-price">$4.99</div>
          </div>
          <div class="shipping-option" data-method="express" data-cost="9.99">
            <input type="radio" name="shipping" value="express">
            <div class="ship-info"><h4>Express Shipping</h4><p>Estimated 2-3 business days</p></div>
            <div class="ship-price">$9.99</div>
          </div>
        </div>
        <div class="checkout-section">
          <h2>💳 Payment Method</h2>
          <div class="payment-option active" data-method="credit-card"><input type="radio" name="payment" value="credit-card" checked> 💳 <span>Credit / Debit Card</span></div>
          <div class="payment-option" data-method="paypal"><input type="radio" name="payment" value="paypal"> 🅿️ <span>PayPal</span></div>
          <div class="payment-option" data-method="bank-transfer"><input type="radio" name="payment" value="bank-transfer"> 🏦 <span>Bank Transfer</span></div>
        </div>
      </div>
      <div>
        <div class="checkout-section" style="position:sticky;top:80px">
          <h2>Order Summary</h2>
          <div class="order-items" id="orderItems"></div>
          <div style="margin-top:16px">
            <div class="summary-row"><span>Subtotal</span><span id="sumSubtotal">$0.00</span></div>
            <div class="summary-row"><span>Shipping</span><span id="sumShipping">$0.00</span></div>
            <div class="summary-row total"><span>Total</span><span id="sumTotal">$0.00</span></div>
          </div>
          <button class="btn btn-primary btn-block btn-lg" style="margin-top:20px" id="placeOrderBtn">Place Order</button>
        </div>
      </div>
    </div>
  `

  renderPage(container)

  // Render order items
  function renderOrderSummary() {
    const currentCart = getCart()
    const itemsEl = container.querySelector('#orderItems')!
    let subtotal = 0

    itemsEl.innerHTML = ''
    currentCart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id)
      if (!product) return
      subtotal += product.price * item.qty
      const div = document.createElement('div')
      div.className = 'order-item'
      div.innerHTML = `
        <div class="order-item-img">
          <img src="${getProductImage(product)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
        </div>
        <div class="order-item-info"><div class="name">${product.name}</div><div class="qty">Qty: ${item.qty}</div></div>
        <div class="order-item-price">${formatPrice(product.price * item.qty)}</div>
      `
      itemsEl.appendChild(div)
    })

    const sumSubtotal = container.querySelector('#sumSubtotal')!
    const sumShipping = container.querySelector('#sumShipping')!
    const sumTotal = container.querySelector('#sumTotal')!
    sumSubtotal.textContent = formatPrice(subtotal)
    sumShipping.textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)
    sumTotal.textContent = formatPrice(subtotal + shippingCost)
  }

  renderOrderSummary()

  // Shipping selection
  container.querySelectorAll('.shipping-option').forEach(opt => {
    opt.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('active'))
      this.classList.add('active')
      const radio = this.querySelector('input') as HTMLInputElement
      radio.checked = true
      selectedShipping = this.dataset.method!
      shippingCost = Number(this.dataset.cost)
      renderOrderSummary()
    })
  })

  // Payment selection
  container.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'))
      this.classList.add('active')
      const radio = this.querySelector('input') as HTMLInputElement
      radio.checked = true
      selectedPayment = this.dataset.method!
    })
  })

  // Place order
  container.querySelector('#placeOrderBtn')?.addEventListener('click', () => {
    const name = (container.querySelector('#shipName') as HTMLInputElement).value.trim()
    const address = (container.querySelector('#shipAddress') as HTMLInputElement).value.trim()
    if (!name || !address) { showToast('Please fill in your shipping address', 'error'); return }
    const currentCart = getCart()
    if (currentCart.length === 0) { showToast('Your cart is empty', 'error'); return }
    const fullAddress = `${name}, ${address}, ${(container.querySelector('#shipCity') as HTMLInputElement).value}, ${(container.querySelector('#shipState') as HTMLInputElement).value} ${(container.querySelector('#shipZip') as HTMLInputElement).value}, ${(container.querySelector('#shipCountry') as HTMLSelectElement).value}`
    const order = createOrder(currentCart, fullAddress, selectedShipping, selectedPayment, PRODUCTS)
    saveCart([])
    navigate(`/profile?tab=orders&order=${order.id}`)
  })
}
