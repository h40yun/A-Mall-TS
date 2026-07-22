// @ts-nocheck - Migrating to Supabase
// ==================== PROFILE PAGE ====================
import { getCurrentUser, getOrders, formatPrice, logout, showToast, getAddresses, saveAddress, deleteAddress, getClaimedVouchers, claimVoucher, getCoins, getMembership, upgradeMembership, getPaymentMethods, savePaymentMethod, deletePaymentMethod, getUserReviews, getReturnRequests, getBrowsingHistory, createReturnRequest } from '../utils/helpers'
import { VOUCHERS, PRODUCTS, COUNTRIES } from '../utils/data'
import { renderProductCard, renderPage } from '../components'
import { navigate } from '../router'
import { getUrlParam } from '../utils/helpers'
import type { Address, PaymentMethod } from '../types'

export function renderProfilePage(): void {
  const user = getCurrentUser()
  if (!user) { navigate('/auth'); return }
  const orders = getOrders().filter(o => o.userEmail === user.email || o.user === user.name)
  const addresses = getAddresses()
  const claimedVouchers = getClaimedVouchers()
  const urlTab = getUrlParam('tab') || 'orders'
  const coins = getCoins()
  const membership = getMembership()
  const paymentMethods = getPaymentMethods()
  const userReviews = getUserReviews()
  const returnRequests = getReturnRequests()
  const browsingHistory = getBrowsingHistory()

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="section">
      <div class="breadcrumb"><a href="/">Home</a> / <span>My Account</span></div>
      <div style="display:grid;grid-template-columns:240px 1fr;gap:24px" class="profile-grid">
        <div class="sidebar">
          <div style="text-align:center;padding:20px 0">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;margin:0 auto 12px">${user.name[0]}</div>
            <h3 style="font-size:16px">${user.name}</h3>
            <p style="font-size:12px;color:#999">${user.email}</p>
            <div style="margin-top:8px"><span class="badge badge-${membership === 'premium' ? 'danger' : membership === 'prime' ? 'warning' : 'info'}">${membership.toUpperCase()}</span></div>
            <div style="font-size:13px;color:#f39c12;margin-top:4px">🪙 ${coins} coins</div>
          </div>
          <div class="sidebar-title">Account</div>
          <a href="#" class="tab-link ${urlTab === 'orders' ? 'active' : ''}" data-tab="orders">📦 My Orders</a>
          <a href="#" class="tab-link ${urlTab === 'addresses' ? 'active' : ''}" data-tab="addresses">📍 Addresses</a>
          <a href="#" class="tab-link ${urlTab === 'vouchers' ? 'active' : ''}" data-tab="vouchers">🎟️ Vouchers</a>
          <a href="#" class="tab-link ${urlTab === 'payment' ? 'active' : ''}" data-tab="payment">💳 Payment Methods</a>
          <a href="#" class="tab-link ${urlTab === 'coins' ? 'active' : ''}" data-tab="coins">🪙 Coins & Membership</a>
          <a href="#" class="tab-link ${urlTab === 'returns' ? 'active' : ''}" data-tab="returns">↩️ Return Requests</a>
          <a href="#" class="tab-link ${urlTab === 'reviews' ? 'active' : ''}" data-tab="reviews">⭐ My Reviews</a>
          <a href="#" class="tab-link ${urlTab === 'history' ? 'active' : ''}" data-tab="history">🕐 Browsing History</a>
          <a href="#" class="tab-link ${urlTab === 'settings' ? 'active' : ''}" data-tab="settings">⚙️ Settings</a>
          <a href="#" class="tab-link" id="profileLogout">🚪 Logout</a>
        </div>
        <div id="profileContent">
          <!-- Orders -->
          <div id="tab-orders" class="tab-panel" ${urlTab !== 'orders' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">My Orders (${orders.length})</h2>
            ${orders.length ? orders.map(o => `
              <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                  <div><strong>${o.id}</strong><span style="font-size:12px;color:#999;margin-left:12px">${new Date(o.date).toLocaleDateString()}</span></div>
                  <div style="display:flex;gap:8px;align-items:center"><span class="status-badge status-${o.status}">${o.status}</span><a href="/track-order?id=${o.id}" class="btn btn-sm btn-outline">Track</a></div>
                </div>
                ${o.items.map(i => `<div style="display:flex;gap:12px;padding:8px 0;border-top:1px solid #e0e0e0;align-items:center"><div style="flex:1"><strong>${i.name}</strong><br><span style="color:#999;font-size:12px">Qty: ${i.qty} × ${formatPrice(i.price)}</span></div><strong>${formatPrice(i.price * i.qty)}</strong></div>`).join('')}
                <div style="text-align:right;padding-top:12px;border-top:1px solid #e0e0e0;margin-top:8px">
                  ${o.discount ? `<span style="font-size:13px;color:#28a745;margin-right:16px">Discount: -${formatPrice(o.discount)}</span>` : ''}
                  <span style="font-size:13px;color:#666">Shipping: ${o.shippingCost === 0 ? 'FREE' : formatPrice(o.shippingCost)}</span>
                  <span style="font-size:18px;font-weight:700;color:#ee4d2d;margin-left:16px">Total: ${formatPrice(o.total)}</span>
                </div>
                ${o.giftWrap ? '<div style="font-size:12px;color:#9c27b0;margin-top:4px">🎁 Gift wrapped</div>' : ''}
                ${o.notes ? `<div style="font-size:12px;color:#999;margin-top:4px">📝 ${o.notes}</div>` : ''}
                <div style="margin-top:8px"><button class="btn btn-sm btn-outline return-btn" data-order="${o.id}" ${o.status !== 'completed' ? 'disabled' : ''}>↩️ Request Return</button></div>
              </div>
            `).join('') : '<div class="empty-state"><div class="icon">📦</div><h3>No orders yet</h3><a href="/" class="btn btn-primary">Shop Now</a></div>'}
          </div>

          <!-- Addresses -->
          <div id="tab-addresses" class="tab-panel" ${urlTab !== 'addresses' ? 'style="display:none"' : ''}>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><h2 style="font-size:18px;font-weight:700">My Addresses (${addresses.length})</h2><button class="btn btn-primary btn-sm" id="addAddressBtn">+ Add Address</button></div>
            <div id="addressesList">${addresses.length ? addresses.map(a => `<div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;margin-bottom:12px;border:${a.isDefault ? '2px solid #ee4d2d' : '1px solid #e0e0e0'}"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><div><strong>${a.label || 'Address'}</strong>${a.isDefault ? '<span class="badge badge-primary" style="margin-left:8px">Default</span>' : ''}</div><div style="display:flex;gap:8px"><button class="btn btn-sm btn-outline edit-addr" data-id="${a.id}">Edit</button><button class="btn btn-sm btn-outline delete-addr" data-id="${a.id}">Delete</button></div></div><div style="font-size:13px;color:#666">${a.name} · ${a.phone}<br>${a.address}, ${a.city}, ${a.state} ${a.zip}, ${a.country}</div></div>`).join('') : '<div class="empty-state"><div class="icon">📍</div><h3>No addresses</h3></div>'}</div>
            <div id="addressForm" style="display:none;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:24px"><h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Add/Edit Address</h3><input type="hidden" id="editAddrId"><div class="form-group"><label>Label</label><input type="text" class="form-control" id="addrLabel" placeholder="e.g. Home"></div><div class="form-row"><div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="addrName"></div><div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="addrPhone"></div></div><div class="form-group"><label>Address</label><input type="text" class="form-control" id="addrAddress"></div><div class="form-row"><div class="form-group"><label>City</label><input type="text" class="form-control" id="addrCity"></div><div class="form-group"><label>State</label><input type="text" class="form-control" id="addrState"></div></div><div class="form-row"><div class="form-group"><label>ZIP</label><input type="text" class="form-control" id="addrZip"></div><div class="form-group"><label>Country</label><select class="form-control" id="addrCountry">${COUNTRIES.map(c => `<option>${c}</option>`).join('')}</select></div></div><label class="checkbox-wrap" style="margin-bottom:16px"><input type="checkbox" id="addrDefault"> Set as default</label><div style="display:flex;gap:8px"><button class="btn btn-primary" id="saveAddrBtn">Save</button><button class="btn btn-outline" id="cancelAddrBtn">Cancel</button></div></div>
          </div>

          <!-- Vouchers -->
          <div id="tab-vouchers" class="tab-panel" ${urlTab !== 'vouchers' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">My Vouchers</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
              ${VOUCHERS.map(v => { const claimed = claimedVouchers.includes(v.id); return `<div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:16px;border-left:4px solid ${v.type === 'free_shipping' ? '#28a745' : '#ee4d2d'}"><div style="display:flex;justify-content:space-between"><div><div style="font-size:18px;font-weight:700;color:#ee4d2d">${v.type === 'percentage' ? v.value + '% OFF' : v.type === 'fixed' ? formatPrice(v.value) + ' OFF' : 'FREE SHIPPING'}</div><div style="font-size:13px;color:#666;margin-top:4px">${v.description}</div><div style="font-size:11px;color:#999;margin-top:4px">Min. ${formatPrice(v.minSpend)} · Expires ${new Date(v.endDate).toLocaleDateString()}</div></div><button class="btn btn-sm ${claimed ? 'btn-outline' : 'btn-primary'} claim-voucher-btn" data-id="${v.id}" ${claimed ? 'disabled' : ''}>${claimed ? '✓' : 'Claim'}</button></div><div style="font-size:12px;color:#999;margin-top:8px;background:#f8f8f8;padding:4px 8px;border-radius:4px;font-family:monospace">Code: ${v.code}</div></div>` }).join('')}
            </div>
          </div>

          <!-- Payment Methods -->
          <div id="tab-payment" class="tab-panel" ${urlTab !== 'payment' ? 'style="display:none"' : ''}>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><h2 style="font-size:18px;font-weight:700">Payment Methods</h2><button class="btn btn-primary btn-sm" id="addPaymentBtn">+ Add Card</button></div>
            ${paymentMethods.length ? paymentMethods.map(pm => `<div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center"><div><strong>${pm.brand || pm.type} ${pm.last4 ? '••••' + pm.last4 : ''}</strong> ${pm.isDefault ? '<span class="badge badge-primary" style="margin-left:8px">Default</span>' : ''}<div style="font-size:12px;color:#999">${pm.label}${pm.expiry ? ' · Exp: ' + pm.expiry : ''}</div></div><button class="btn btn-sm btn-outline delete-payment" data-id="${pm.id}">Delete</button></div>`).join('') : '<div class="empty-state"><div class="icon">💳</div><h3>No payment methods</h3></div>'}
            <div id="paymentForm" style="display:none;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:24px;margin-top:16px"><h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Add Payment Method</h3><div class="form-group"><label>Card Number</label><input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19"></div><div class="form-row"><div class="form-group"><label>Expiry</label><input type="text" class="form-control" id="cardExpiry" placeholder="MM/YY" maxlength="5"></div><div class="form-group"><label>CVV</label><input type="text" class="form-control" id="cardCvv" placeholder="123" maxlength="3"></div></div><div class="form-group"><label>Cardholder Name</label><input type="text" class="form-control" id="cardName" placeholder="John Doe"></div><label class="checkbox-wrap" style="margin-bottom:16px"><input type="checkbox" id="cardDefault"> Set as default</label><div style="display:flex;gap:8px"><button class="btn btn-primary" id="savePaymentBtn">Save Card</button><button class="btn btn-outline" id="cancelPaymentBtn">Cancel</button></div></div>
          </div>

          <!-- Coins & Membership -->
          <div id="tab-coins" class="tab-panel" ${urlTab !== 'coins' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">🪙 Coins & Membership</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
              <div style="background:linear-gradient(135deg,#f39c12,#e67e22);color:#fff;border-radius:12px;padding:24px"><div style="font-size:32px;font-weight:800">${coins}</div><div style="font-size:14px;opacity:0.9">Available Coins</div><div style="font-size:12px;margin-top:8px">= ${formatPrice(coins / 100)} discount</div></div>
              <div style="background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;border-radius:12px;padding:24px"><div style="font-size:24px;font-weight:800">${membership.toUpperCase()}</div><div style="font-size:14px;opacity:0.9">Membership Tier</div><div style="font-size:12px;margin-top:8px">${membership === 'basic' ? 'Earn 1 coin/$1' : membership === 'prime' ? 'Earn 2 coins/$1' : 'Earn 3 coins/$1'}</div></div>
            </div>
            <h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Upgrade Membership</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
              ${['basic', 'prime', 'premium'].map(tier => `<div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;text-align:center;border:${membership === tier ? '2px solid #ee4d2d' : '1px solid #e0e0e0'}"><div style="font-size:18px;font-weight:700">${tier.charAt(0).toUpperCase() + tier.slice(1)}</div><div style="font-size:13px;color:#666;margin:8px 0">${tier === 'basic' ? 'Free' : tier === 'prime' ? '$9.99/mo' : '$19.99/mo'}</div><div style="font-size:12px;color:#999">${tier === 'basic' ? '1 coin/$1' : tier === 'prime' ? '2 coins/$1 + Free Shipping' : '3 coins/$1 + Free Shipping + Priority'}</div>${membership !== tier ? `<button class="btn btn-sm btn-primary upgrade-btn" data-tier="${tier}" style="margin-top:12px">Upgrade</button>` : '<div style="margin-top:12px;color:#28a745;font-weight:600">✓ Current</div>'}</div>`).join('')}
            </div>
          </div>

          <!-- Return Requests -->
          <div id="tab-returns" class="tab-panel" ${urlTab !== 'returns' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">Return Requests</h2>
            ${returnRequests.length ? returnRequests.map(r => `<div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:16px;margin-bottom:8px"><div style="display:flex;justify-content:space-between"><div><strong>${r.id}</strong> · Order ${r.orderId}</div><span class="status-badge status-${r.status === 'pending' ? 'pending' : r.status === 'approved' ? 'completed' : 'cancelled'}">${r.status}</span></div><div style="font-size:13px;color:#666;margin-top:8px">Reason: ${r.reason}</div><div style="font-size:12px;color:#999;margin-top:4px">${r.description}</div><div style="font-size:12px;color:#999;margin-top:4px">${new Date(r.date).toLocaleDateString()}</div></div>`).join('') : '<div class="empty-state"><div class="icon">↩️</div><h3>No return requests</h3></div>'}
          </div>

          <!-- Reviews History -->
          <div id="tab-reviews" class="tab-panel" ${urlTab !== 'reviews' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">My Reviews (${userReviews.length})</h2>
            ${userReviews.length ? userReviews.map(r => { const p = PRODUCTS.find(pr => pr.id === r.productId); return `<div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:16px;margin-bottom:8px"><div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">${p ? `<img src="${p.images?.[0] || ''}" style="width:48px;height:48px;border-radius:8px;object-fit:cover">` : ''}<div><strong>${p?.name || 'Product'}</strong><div style="font-size:12px;color:#ffc107">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div></div></div><p style="font-size:13px;color:#666">${r.text}</p><div style="font-size:12px;color:#999;margin-top:4px">${new Date(r.date).toLocaleDateString()}</div>${r.sellerReply ? `<div style="font-size:12px;background:#f0f8ff;padding:8px;border-radius:6px;margin-top:8px"><strong>🏪 Seller:</strong> ${r.sellerReply}</div>` : ''}</div>` }).join('') : '<div class="empty-state"><div class="icon">⭐</div><h3>No reviews yet</h3></div>'}
          </div>

          <!-- Browsing History -->
          <div id="tab-history" class="tab-panel" ${urlTab !== 'history' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">Browsing History</h2>
            ${browsingHistory.length ? '<div class="product-grid">' + PRODUCTS.filter(p => browsingHistory.includes(p.id)).map(p => { const card = document.createElement('div'); return `<div class="card product-card" onclick="window.location.href='/product/${p.id}'"><div class="product-img-wrap"><img class="product-img" src="${p.images?.[0] || `https://picsum.photos/seed/product${p.id}/300/300`}" alt="${p.name}"></div><div class="product-info"><div class="product-name">${p.name}</div><div class="product-price">${formatPrice(p.price)}</div></div></div>` }).join('') + '</div>' : '<div class="empty-state"><div class="icon">🕐</div><h3>No browsing history</h3></div>'}
          </div>

          <!-- Settings -->
          <div id="tab-settings" class="tab-panel" ${urlTab !== 'settings' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">Account Settings</h2>
            <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:24px">
              <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="settingsName" value="${user.name}"></div>
              <div class="form-group"><label>Email</label><input type="email" class="form-control" value="${user.email}" disabled></div>
              <div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="settingsPhone" value="${(user as any).phone || ''}"></div>
              <button class="btn btn-primary" id="saveSettingsBtn">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  renderPage(container)

  // Tab switching
  container.querySelectorAll('.tab-link').forEach(link => link.addEventListener('click', function(this: HTMLElement, e: Event) { e.preventDefault(); const tab = this.dataset.tab; if (!tab) return; container.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active')); this.classList.add('active'); container.querySelectorAll('.tab-panel').forEach(p => { (p as HTMLElement).style.display = 'none' }); (container.querySelector(`#tab-${tab}`) as HTMLElement).style.display = 'block' }))

  // Address management
  container.querySelector('#addAddressBtn')?.addEventListener('click', () => { (container.querySelector('#addressForm') as HTMLElement).style.display = 'block' })
  container.querySelector('#cancelAddrBtn')?.addEventListener('click', () => { (container.querySelector('#addressForm') as HTMLElement).style.display = 'none' })
  container.querySelector('#saveAddrBtn')?.addEventListener('click', () => { const a: Address = { id: (container.querySelector('#editAddrId') as HTMLInputElement).value || String(Date.now()), label: (container.querySelector('#addrLabel') as HTMLInputElement).value.trim(), name: (container.querySelector('#addrName') as HTMLInputElement).value.trim(), phone: (container.querySelector('#addrPhone') as HTMLInputElement).value.trim(), address: (container.querySelector('#addrAddress') as HTMLInputElement).value.trim(), city: (container.querySelector('#addrCity') as HTMLInputElement).value.trim(), state: (container.querySelector('#addrState') as HTMLInputElement).value.trim(), zip: (container.querySelector('#addrZip') as HTMLInputElement).value.trim(), country: (container.querySelector('#addrCountry') as HTMLSelectElement).value, isDefault: (container.querySelector('#addrDefault') as HTMLInputElement).checked }; if (!a.name || !a.address) { showToast('Fill required fields', 'error'); return }; saveAddress(a); showToast('Address saved!'); setTimeout(() => location.reload(), 500) })
  container.querySelectorAll('.edit-addr').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { const a = addresses.find(x => x.id === this.dataset.id); if (!a) return; (container.querySelector('#addressForm') as HTMLElement).style.display = 'block'; (container.querySelector('#editAddrId') as HTMLInputElement).value = a.id; (container.querySelector('#addrLabel') as HTMLInputElement).value = a.label || ''; (container.querySelector('#addrName') as HTMLInputElement).value = a.name; (container.querySelector('#addrPhone') as HTMLInputElement).value = a.phone; (container.querySelector('#addrAddress') as HTMLInputElement).value = a.address; (container.querySelector('#addrCity') as HTMLInputElement).value = a.city; (container.querySelector('#addrState') as HTMLInputElement).value = a.state; (container.querySelector('#addrZip') as HTMLInputElement).value = a.zip; (container.querySelector('#addrDefault') as HTMLInputElement).checked = a.isDefault }))
  container.querySelectorAll('.delete-addr').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { if (confirm('Delete?')) { deleteAddress(this.dataset.id!); showToast('Deleted'); setTimeout(() => location.reload(), 500) } }))

  // Voucher claiming
  container.querySelectorAll('.claim-voucher-btn').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { claimVoucher(this.dataset.id!); this.textContent = '✓'; (this as HTMLButtonElement).disabled = true; this.classList.remove('btn-primary'); this.classList.add('btn-outline') }))

  // Payment methods
  container.querySelector('#addPaymentBtn')?.addEventListener('click', () => { (container.querySelector('#paymentForm') as HTMLElement).style.display = 'block' })
  container.querySelector('#cancelPaymentBtn')?.addEventListener('click', () => { (container.querySelector('#paymentForm') as HTMLElement).style.display = 'none' })
  container.querySelector('#savePaymentBtn')?.addEventListener('click', () => { const num = (container.querySelector('#cardNumber') as HTMLInputElement).value.trim(); const exp = (container.querySelector('#cardExpiry') as HTMLInputElement).value.trim(); const name = (container.querySelector('#cardName') as HTMLInputElement).value.trim(); if (!num) { showToast('Enter card number', 'error'); return }; const pm: PaymentMethod = { id: String(Date.now()), type: 'card', label: name || 'Credit Card', last4: num.slice(-4), brand: num.startsWith('4') ? 'Visa' : num.startsWith('5') ? 'Mastercard' : 'Card', expiry: exp, isDefault: (container.querySelector('#cardDefault') as HTMLInputElement).checked }; savePaymentMethod(pm); showToast('Card saved!'); setTimeout(() => location.reload(), 500) })
  container.querySelectorAll('.delete-payment').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { if (confirm('Delete?')) { deletePaymentMethod(this.dataset.id!); showToast('Deleted'); setTimeout(() => location.reload(), 500) } }))

  // Membership upgrade
  container.querySelectorAll('.upgrade-btn').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { upgradeMembership(this.dataset.tier!); setTimeout(() => location.reload(), 500) }))

  // Return requests
  container.querySelectorAll('.return-btn').forEach(btn => btn.addEventListener('click', function(this: HTMLElement) { const orderId = this.dataset.order!; const reason = prompt('Reason for return:'); if (reason) { createReturnRequest(orderId, reason, 'Return requested from profile'); setTimeout(() => location.reload(), 500) } }))

  // Logout
  container.querySelector('#profileLogout')?.addEventListener('click', (e) => { e.preventDefault(); logout() })

  // Save settings
  container.querySelector('#saveSettingsBtn')?.addEventListener('click', () => { const name = (container.querySelector('#settingsName') as HTMLInputElement).value.trim(); const phone = (container.querySelector('#settingsPhone') as HTMLInputElement).value.trim(); if (name) { const users = JSON.parse(localStorage.getItem('am_users') || '[]'); const u = users.find((u: any) => u.email === user.email); if (u) { u.name = name; u.phone = phone; localStorage.setItem('am_users', JSON.stringify(users)) }; user.name = name; localStorage.setItem('am_current_user', JSON.stringify(user)); showToast('Settings saved!') } })
}
