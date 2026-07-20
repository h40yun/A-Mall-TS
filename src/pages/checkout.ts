// ==================== CHECKOUT PAGE ====================
import { PRODUCTS, COUPONS } from '../utils/data'
import { getCart, formatPrice, createOrder, saveCart, showToast, getProductInitials, getProductColor, getProductImage, getCurrentUser, getAddresses, applyVoucher } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderCheckoutPage(): void {
  const cart = getCart()
  if (cart.length === 0) { navigate('/cart'); return }

  const user = getCurrentUser()
  const addresses = getAddresses()
  let selectedShipping = 'free'
  let shippingCost = 0
  let selectedPayment = 'credit-card'
  let voucherDiscount = 0
  let appliedVoucher = ''

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="breadcrumb" style="max-width:1200px;margin:0 auto;padding:16px 20px 0"><a href="/">Home</a> / <a href="/cart">Cart</a> / <span>Checkout</span></div>
    <div class="checkout-page">
      <div>
        <!-- Saved Addresses -->
        ${addresses.length ? `
          <div class="checkout-section">
            <h2>📍 Saved Addresses</h2>
            <div id="savedAddresses">
              ${addresses.map((addr, i) => `
                <div class="address-card ${addr.isDefault ? 'selected' : ''}" data-id="${addr.id}">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <strong>${addr.label || 'Address ' + (i + 1)}</strong>
                      ${addr.isDefault ? '<span class="badge badge-primary" style="margin-left:8px">Default</span>' : ''}
                    </div>
                    <input type="radio" name="savedAddress" value="${addr.id}" ${addr.isDefault ? 'checked' : ''}>
                  </div>
                  <div style="font-size:13px;color:#666;margin-top:8px">
                    <div>${addr.name} · ${addr.phone}</div>
                    <div>${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}</div>
                  </div>
                </div>
              `).join('')}
              <button class="btn btn-sm btn-outline" id="useNewAddress" style="margin-top:8px">+ Use New Address</button>
            </div>
          </div>
        ` : ''}

        <!-- Shipping Address Form -->
        <div class="checkout-section" id="addressFormSection" ${addresses.length ? 'style="display:none"' : ''}>
          <h2>📍 Shipping Address</h2>
          <div class="form-row">
            <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="shipName" placeholder="John Doe" value="${user?.name || ''}"></div>
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

        <!-- Shipping Method -->
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

        <!-- Payment Method -->
        <div class="checkout-section">
          <h2>💳 Payment Method</h2>
          <div class="payment-option active" data-method="credit-card"><input type="radio" name="payment" value="credit-card" checked> 💳 <span>Credit / Debit Card</span></div>
          <div class="payment-option" data-method="paypal"><input type="radio" name="payment" value="paypal"> 🅿️ <span>PayPal</span></div>
          <div class="payment-option" data-method="bank-transfer"><input type="radio" name="payment" value="bank-transfer"> 🏦 <span>Bank Transfer</span></div>
        </div>

        <!-- Voucher -->
        <div class="checkout-section">
          <h2>🎟️ Voucher / Coupon</h2>
          <div style="display:flex;gap:8px">
            <input type="text" class="form-control" id="voucherInput" placeholder="Enter voucher code" style="flex:1">
            <button class="btn btn-primary" id="applyVoucherBtn">Apply</button>
          </div>
          <div id="voucherMessage" style="margin-top:8px;font-size:13px"></div>
        </div>

        <!-- Order Notes -->
        <div class="checkout-section">
          <h2>📝 Order Notes (Optional)</h2>
          <textarea class="form-control" id="orderNotes" rows="3" placeholder="Special instructions for your order..."></textarea>
        </div>
      </div>

      <div>
        <div class="checkout-section" style="position:sticky;top:80px">
          <h2>Order Summary</h2>
          <div class="order-items" id="orderItems"></div>
          <div style="margin-top:16px">
            <div class="summary-row"><span>Subtotal</span><span id="sumSubtotal">$0.00</span></div>
            <div class="summary-row"><span>Shipping</span><span id="sumShipping">$0.00</span></div>
            <div class="summary-row" id="voucherRow" style="display:none;color:#28a745"><span>Voucher Discount</span><span id="sumDiscount">-$0.00</span></div>
            <div class="summary-row total"><span>Total</span><span id="sumTotal">$0.00</span></div>
          </div>
          <button class="btn btn-primary btn-block btn-lg" style="margin-top:20px" id="placeOrderBtn">Place Order</button>
        </div>
      </div>
    </div>
  `

  renderPage(container)

  // Use saved address
  if (addresses.length) {
    container.querySelectorAll('input[name="savedAddress"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const addrId = (radio as HTMLInputElement).value
        const addr = addresses.find(a => a.id === addrId)
        if (addr) {
          ;(container.querySelector('#shipName') as HTMLInputElement).value = addr.name
          ;(container.querySelector('#shipPhone') as HTMLInputElement).value = addr.phone
          ;(container.querySelector('#shipAddress') as HTMLInputElement).value = addr.address
          ;(container.querySelector('#shipCity') as HTMLInputElement).value = addr.city
          ;(container.querySelector('#shipState') as HTMLInputElement).value = addr.state
          ;(container.querySelector('#shipZip') as HTMLInputElement).value = addr.zip
        }
      })
    })

    container.querySelector('#useNewAddress')?.addEventListener('click', () => {
      ;(container.querySelector('#addressFormSection') as HTMLElement).style.display = 'block'
    })

    // Auto-fill default address
    const defaultAddr = addresses.find(a => a.isDefault)
    if (defaultAddr) {
      ;(container.querySelector('#shipName') as HTMLInputElement).value = defaultAddr.name
      ;(container.querySelector('#shipPhone') as HTMLInputElement).value = defaultAddr.phone
      ;(container.querySelector('#shipAddress') as HTMLInputElement).value = defaultAddr.address
      ;(container.querySelector('#shipCity') as HTMLInputElement).value = defaultAddr.city
      ;(container.querySelector('#shipState') as HTMLInputElement).value = defaultAddr.state
      ;(container.querySelector('#shipZip') as HTMLInputElement).value = defaultAddr.zip
    }
  }

  // Voucher
  container.querySelector('#applyVoucherBtn')?.addEventListener('click', () => {
    const code = (container.querySelector('#voucherInput') as HTMLInputElement).value.trim()
    if (!code) { showToast('Please enter a voucher code', 'error'); return }
    const currentCart = getCart()
    const subtotal = currentCart.reduce((s, item) => {
      const p = PRODUCTS.find(pr => pr.id === item.id)
      return s + (p ? p.price * item.qty : 0)
    }, 0)
    const result = applyVoucher(code, subtotal, shippingCost)
    const msgEl = container.querySelector('#voucherMessage')!
    if (result.discount > 0 || result.newShipping < shippingCost) {
      voucherDiscount = result.discount
      appliedVoucher = code
      if (result.newShipping < shippingCost) shippingCost = result.newShipping
      msgEl.innerHTML = `<span style="color:#28a745">✅ ${result.message}</span>`
      ;(container.querySelector('#voucherRow') as HTMLElement).style.display = 'flex'
      container.querySelector('#sumDiscount')!.textContent = '-' + formatPrice(voucherDiscount)
    } else {
      msgEl.innerHTML = `<span style="color:#dc3545">❌ ${result.message}</span>`
    }
    renderOrderSummary()
  })

  // Render order summary
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

    container.querySelector('#sumSubtotal')!.textContent = formatPrice(subtotal)
    container.querySelector('#sumShipping')!.textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)
    container.querySelector('#sumTotal')!.textContent = formatPrice(subtotal + shippingCost - voucherDiscount)
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
    const notes = (container.querySelector('#orderNotes') as HTMLTextAreaElement).value.trim()
    const order = createOrder(currentCart, fullAddress, selectedShipping, selectedPayment, PRODUCTS, notes, appliedVoucher, voucherDiscount)
    saveCart([])
    navigate(`/profile?tab=orders&order=${order.id}`)
  })
}
