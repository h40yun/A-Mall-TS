// ==================== CHECKOUT PAGE ====================
import { PRODUCTS, COUPONS } from '../utils/data'
import { getCart, formatPrice, createOrder, saveCart, showToast, getProductInitials, getProductColor, getProductImage, getCurrentUser, getAddresses, applyVoucher, getCoins, useCoins } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderCheckoutPage(): void {
  const cart = getCart()
  if (cart.length === 0) { navigate('/cart'); return }
  const user = getCurrentUser()
  const addresses = getAddresses()
  let selectedShipping = 'free'; let shippingCost = 0; let selectedPayment = 'credit-card'
  let voucherDiscount = 0; let appliedVoucher = ''; let useCoinsEnabled = false; let coinsDiscount = 0
  let giftWrap = false; let giftMessage = ''

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="breadcrumb" style="max-width:1200px;margin:0 auto;padding:16px 20px 0"><a href="/">Home</a> / <a href="/cart">Cart</a> / <span>Checkout</span></div>
    <div class="checkout-page"><div>
      ${addresses.length ? `<div class="checkout-section"><h2>📍 Saved Addresses</h2><div id="savedAddresses">${addresses.map((a, i) => `<div class="address-card ${a.isDefault ? 'selected' : ''}" data-id="${a.id}"><div style="display:flex;justify-content:space-between"><div><strong>${a.label || 'Address ' + (i + 1)}</strong>${a.isDefault ? '<span class="badge badge-primary" style="margin-left:8px">Default</span>' : ''}</div><input type="radio" name="savedAddress" value="${a.id}" ${a.isDefault ? 'checked' : ''}></div><div style="font-size:13px;color:#666;margin-top:8px">${a.name} · ${a.phone}<br>${a.address}, ${a.city}, ${a.state} ${a.zip}, ${a.country}</div></div>`).join('')}<button class="btn btn-sm btn-outline" id="useNewAddress" style="margin-top:8px">+ New Address</button></div></div>` : ''}
      <div class="checkout-section" id="addressFormSection" ${addresses.length ? 'style="display:none"' : ''}>
        <h2>📍 Shipping Address</h2>
        <div class="form-row"><div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="shipName" placeholder="John Doe" value="${user?.name || ''}"></div><div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="shipPhone" placeholder="+1 234 567 8900"></div></div>
        <div class="form-group"><label>Address</label><input type="text" class="form-control" id="shipAddress" placeholder="123 Main Street"></div>
        <div class="form-row"><div class="form-group"><label>City</label><input type="text" class="form-control" id="shipCity" placeholder="New York"></div><div class="form-group"><label>State</label><input type="text" class="form-control" id="shipState" placeholder="NY"></div></div>
        <div class="form-row"><div class="form-group"><label>ZIP Code</label><input type="text" class="form-control" id="shipZip" placeholder="10001"></div><div class="form-group"><label>Country</label><select class="form-control" id="shipCountry"><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option></select></div></div>
      </div>
      <div class="checkout-section"><h2>🚚 Shipping Method</h2>
        <div class="shipping-option active" data-method="free" data-cost="0"><input type="radio" name="shipping" value="free" checked><div class="ship-info"><h4>Free Shipping</h4><p>7-14 business days</p></div><div class="ship-price">FREE</div></div>
        <div class="shipping-option" data-method="standard" data-cost="4.99"><input type="radio" name="shipping" value="standard"><div class="ship-info"><h4>Standard</h4><p>5-7 business days</p></div><div class="ship-price">$4.99</div></div>
        <div class="shipping-option" data-method="express" data-cost="9.99"><input type="radio" name="shipping" value="express"><div class="ship-info"><h4>Express</h4><p>2-3 business days</p></div><div class="ship-price">$9.99</div></div>
      </div>
      <div class="checkout-section"><h2>💳 Payment Method</h2>
        <div class="payment-option active" data-method="credit-card"><input type="radio" name="payment" value="credit-card" checked> 💳 <span>Credit / Debit Card</span></div>
        <div class="payment-option" data-method="paypal"><input type="radio" name="payment" value="paypal"> 🅿️ <span>PayPal</span></div>
        <div class="payment-option" data-method="bank-transfer"><input type="radio" name="payment" value="bank-transfer"> 🏦 <span>Bank Transfer</span></div>
      </div>
      <div class="checkout-section"><h2>🎟️ Voucher / Coupon</h2>
        <div style="display:flex;gap:8px"><input type="text" class="form-control" id="voucherInput" placeholder="Enter voucher code" style="flex:1"><button class="btn btn-primary" id="applyVoucherBtn">Apply</button></div>
        <div id="voucherMessage" style="margin-top:8px;font-size:13px"></div>
      </div>
      <div class="checkout-section"><h2>🪙 Use Coins</h2>
        <label class="checkbox-wrap"><input type="checkbox" id="useCoinsCb"> Use ${getCoins()} coins (${formatPrice(getCoins() / 100)} discount)</label>
      </div>
      <div class="checkout-section"><h2>🎁 Gift Option</h2>
        <label class="checkbox-wrap"><input type="checkbox" id="giftWrapCb"> 🎁 Wrap as gift (+$2.99)</label>
        <div id="giftMsgWrap" style="display:none;margin-top:8px"><textarea class="form-control" id="giftMessage" rows="2" placeholder="Gift message (optional)"></textarea></div>
      </div>
      <div class="checkout-section"><h2>📝 Order Notes (Optional)</h2><textarea class="form-control" id="orderNotes" rows="3" placeholder="Special instructions..."></textarea></div>
    </div><div>
      <div class="checkout-section" style="position:sticky;top:80px"><h2>Order Summary</h2><div class="order-items" id="orderItems"></div><div style="margin-top:16px">
        <div class="summary-row"><span>Subtotal</span><span id="sumSubtotal">$0.00</span></div>
        <div class="summary-row"><span>Shipping</span><span id="sumShipping">$0.00</span></div>
        <div class="summary-row" id="voucherRow" style="display:none;color:#28a745"><span>Voucher</span><span id="sumDiscount">-$0.00</span></div>
        <div class="summary-row" id="coinsRow" style="display:none;color:#f39c12"><span>Coins</span><span id="sumCoins">-$0.00</span></div>
        <div class="summary-row" id="giftRow" style="display:none"><span>Gift Wrap</span><span id="sumGift">$2.99</span></div>
        <div class="summary-row total"><span>Total</span><span id="sumTotal">$0.00</span></div>
      </div><button class="btn btn-primary btn-block btn-lg" style="margin-top:20px" id="placeOrderBtn">Place Order</button></div>
    </div></div>
  `
  renderPage(container)

  // Address selection
  if (addresses.length) {
    container.querySelectorAll('input[name="savedAddress"]').forEach(r => r.addEventListener('change', () => { const a = addresses.find(x => x.id === (r as HTMLInputElement).value); if (a) { (container.querySelector('#shipName') as HTMLInputElement).value = a.name; (container.querySelector('#shipPhone') as HTMLInputElement).value = a.phone; (container.querySelector('#shipAddress') as HTMLInputElement).value = a.address; (container.querySelector('#shipCity') as HTMLInputElement).value = a.city; (container.querySelector('#shipState') as HTMLInputElement).value = a.state; (container.querySelector('#shipZip') as HTMLInputElement).value = a.zip } }))
    container.querySelector('#useNewAddress')?.addEventListener('click', () => { (container.querySelector('#addressFormSection') as HTMLElement).style.display = 'block' })
    const def = addresses.find(a => a.isDefault)
    if (def) { (container.querySelector('#shipName') as HTMLInputElement).value = def.name; (container.querySelector('#shipPhone') as HTMLInputElement).value = def.phone; (container.querySelector('#shipAddress') as HTMLInputElement).value = def.address; (container.querySelector('#shipCity') as HTMLInputElement).value = def.city; (container.querySelector('#shipState') as HTMLInputElement).value = def.state; (container.querySelector('#shipZip') as HTMLInputElement).value = def.zip }
  }

  // Voucher
  container.querySelector('#applyVoucherBtn')?.addEventListener('click', () => {
    const code = (container.querySelector('#voucherInput') as HTMLInputElement).value.trim()
    if (!code) { showToast('Enter voucher code', 'error'); return }
    const sub = getCart().reduce((s, i) => { const p = PRODUCTS.find(pr => pr.id === i.id); return s + (p ? p.price * i.qty : 0) }, 0)
    const r = applyVoucher(code, sub, shippingCost)
    const msg = container.querySelector('#voucherMessage')!
    if (r.discount > 0 || r.newShipping < shippingCost) { voucherDiscount = r.discount; appliedVoucher = code; if (r.newShipping < shippingCost) shippingCost = r.newShipping; msg.innerHTML = `<span style="color:#28a745">✅ ${r.message}</span>`; (container.querySelector('#voucherRow') as HTMLElement).style.display = 'flex'; container.querySelector('#sumDiscount')!.textContent = '-' + formatPrice(voucherDiscount) }
    else msg.innerHTML = `<span style="color:#dc3545">❌ ${r.message}</span>`
    renderOrderSummary()
  })

  // Coins
  container.querySelector('#useCoinsCb')?.addEventListener('change', (e) => {
    useCoinsEnabled = (e.target as HTMLInputElement).checked
    if (useCoinsEnabled) { coinsDiscount = Math.min(getCoins() / 100, 50); (container.querySelector('#coinsRow') as HTMLElement).style.display = 'flex'; container.querySelector('#sumCoins')!.textContent = '-' + formatPrice(coinsDiscount) }
    else { coinsDiscount = 0; (container.querySelector('#coinsRow') as HTMLElement).style.display = 'none' }
    renderOrderSummary()
  })

  // Gift
  container.querySelector('#giftWrapCb')?.addEventListener('change', (e) => {
    giftWrap = (e.target as HTMLInputElement).checked
    ;(container.querySelector('#giftMsgWrap') as HTMLElement).style.display = giftWrap ? 'block' : 'none'
    ;(container.querySelector('#giftRow') as HTMLElement).style.display = giftWrap ? 'flex' : 'none'
    renderOrderSummary()
  })

  function renderOrderSummary() {
    const curCart = getCart(); const itemsEl = container.querySelector('#orderItems')!; let sub = 0
    itemsEl.innerHTML = ''
    curCart.forEach(i => { const p = PRODUCTS.find(pr => pr.id === i.id); if (!p) return; sub += p.price * i.qty; const d = document.createElement('div'); d.className = 'order-item'; d.innerHTML = `<div class="order-item-img"><img src="${getProductImage(p)}" onerror="this.style.display='none'"><div class="img-placeholder" style="display:none;background:${getProductColor(p)}">${getProductInitials(p)}</div></div><div class="order-item-info"><div class="name">${p.name}</div><div class="qty">Qty: ${i.qty}</div></div><div class="order-item-price">${formatPrice(p.price * i.qty)}</div>`; itemsEl.appendChild(d) })
    const giftCost = giftWrap ? 2.99 : 0
    container.querySelector('#sumSubtotal')!.textContent = formatPrice(sub)
    container.querySelector('#sumShipping')!.textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)
    container.querySelector('#sumTotal')!.textContent = formatPrice(sub + shippingCost - voucherDiscount - coinsDiscount + giftCost)
  }
  renderOrderSummary()

  // Shipping/Payment
  container.querySelectorAll('.shipping-option').forEach(o => o.addEventListener('click', function(this: HTMLElement) { container.querySelectorAll('.shipping-option').forEach(x => x.classList.remove('active')); this.classList.add('active'); (this.querySelector('input') as HTMLInputElement).checked = true; selectedShipping = this.dataset.method!; shippingCost = Number(this.dataset.cost); renderOrderSummary() }))
  container.querySelectorAll('.payment-option').forEach(o => o.addEventListener('click', function(this: HTMLElement) { container.querySelectorAll('.payment-option').forEach(x => x.classList.remove('active')); this.classList.add('active'); (this.querySelector('input') as HTMLInputElement).checked = true; selectedPayment = this.dataset.method! }))

  // Place order
  container.querySelector('#placeOrderBtn')?.addEventListener('click', () => {
    const name = (container.querySelector('#shipName') as HTMLInputElement).value.trim()
    const addr = (container.querySelector('#shipAddress') as HTMLInputElement).value.trim()
    if (!name || !addr) { showToast('Fill shipping address', 'error'); return }
    const curCart = getCart(); if (!curCart.length) { showToast('Cart empty', 'error'); return }
    const full = `${name}, ${addr}, ${(container.querySelector('#shipCity') as HTMLInputElement).value}, ${(container.querySelector('#shipState') as HTMLInputElement).value} ${(container.querySelector('#shipZip') as HTMLInputElement).value}, ${(container.querySelector('#shipCountry') as HTMLSelectElement).value}`
    const notes = (container.querySelector('#orderNotes') as HTMLTextAreaElement).value.trim()
    const giftMsg = giftWrap ? (container.querySelector('#giftMessage') as HTMLTextAreaElement)?.value.trim() || '' : ''
    if (useCoinsEnabled) useCoins(Math.floor(coinsDiscount * 100))
    const order = createOrder(curCart, full, selectedShipping, selectedPayment, PRODUCTS, notes, appliedVoucher, voucherDiscount + coinsDiscount, giftWrap, giftMsg)
    saveCart([]); navigate(`/profile?tab=orders&order=${order.id}`)
  })
}
