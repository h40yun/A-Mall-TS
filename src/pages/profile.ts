// ==================== PROFILE PAGE ====================
import { getCurrentUser, getOrders, formatPrice, logout, showToast, getAddresses, saveAddress, deleteAddress, getClaimedVouchers, getOrderById, getUrlParam, claimVoucher } from '../utils/helpers'
import { VOUCHERS, PRODUCTS } from '../utils/data'
import { renderPage } from '../components'
import { navigate } from '../router'
import type { Address } from '../types'

export function renderProfilePage(): void {
  const user = getCurrentUser()
  if (!user) { navigate('/auth'); return }

  const orders = getOrders().filter(o => o.userEmail === user.email || o.user === user.name)
  const addresses = getAddresses()
  const claimedVouchers = getClaimedVouchers()
  const urlTab = getUrlParam('tab') || 'orders'
  const urlOrder = getUrlParam('order')

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="section">
      <div class="breadcrumb"><a href="/">Home</a> / <span>My Account</span></div>
      <div style="display:grid;grid-template-columns:240px 1fr;gap:24px">
        <div class="sidebar">
          <div style="text-align:center;padding:20px 0">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;margin:0 auto 12px">${user.name[0]}</div>
            <h3 style="font-size:16px">${user.name}</h3>
            <p style="font-size:12px;color:#999">${user.email}</p>
          </div>
          <div class="sidebar-title">Account</div>
          <a href="#" class="tab-link ${urlTab === 'orders' ? 'active' : ''}" data-tab="orders">📦 My Orders</a>
          <a href="#" class="tab-link ${urlTab === 'addresses' ? 'active' : ''}" data-tab="addresses">📍 My Addresses</a>
          <a href="#" class="tab-link ${urlTab === 'vouchers' ? 'active' : ''}" data-tab="vouchers">🎟️ My Vouchers</a>
          <a href="#" class="tab-link ${urlTab === 'settings' ? 'active' : ''}" data-tab="settings">⚙️ Settings</a>
          <a href="#" class="tab-link" id="profileLogout">🚪 Logout</a>
        </div>
        <div id="profileContent">
          <!-- Orders Tab -->
          <div id="tab-orders" class="tab-panel" ${urlTab !== 'orders' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">My Orders (${orders.length})</h2>
            ${orders.length ? orders.map(o => `
              <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                  <div>
                    <strong>${o.id}</strong>
                    <span style="font-size:12px;color:#999;margin-left:12px">${new Date(o.date).toLocaleDateString()}</span>
                  </div>
                  <div style="display:flex;gap:8px;align-items:center">
                    <span class="status-badge status-${o.status}">${o.status}</span>
                    <a href="/track-order?id=${o.id}" class="btn btn-sm btn-outline">Track</a>
                  </div>
                </div>
                ${o.items.map(item => `
                  <div style="display:flex;gap:12px;padding:8px 0;border-top:1px solid #e0e0e0;align-items:center">
                    <div style="flex:1"><strong>${item.name}</strong><br><span style="color:#999;font-size:12px">Qty: ${item.qty} × ${formatPrice(item.price)}</span></div>
                    <strong>${formatPrice(item.price * item.qty)}</strong>
                  </div>
                `).join('')}
                <div style="text-align:right;padding-top:12px;border-top:1px solid #e0e0e0;margin-top:8px">
                  ${o.discount ? `<span style="font-size:13px;color:#28a745;margin-right:16px">Discount: -${formatPrice(o.discount)}</span>` : ''}
                  <span style="font-size:13px;color:#666">Shipping: ${o.shippingCost === 0 ? 'FREE' : formatPrice(o.shippingCost)}</span>
                  <span style="font-size:18px;font-weight:700;color:#ee4d2d;margin-left:16px">Total: ${formatPrice(o.total)}</span>
                </div>
                ${o.trackingNumber ? `<div style="font-size:12px;color:#999;margin-top:8px">Tracking: ${o.trackingNumber}</div>` : ''}
                ${o.notes ? `<div style="font-size:12px;color:#999;margin-top:4px">Notes: ${o.notes}</div>` : ''}
              </div>
            `).join('') : '<div class="empty-state"><div class="icon">📦</div><h3>No orders yet</h3><p>Start shopping to see your orders here</p><a href="/" class="btn btn-primary">Shop Now</a></div>'}
          </div>

          <!-- Addresses Tab -->
          <div id="tab-addresses" class="tab-panel" ${urlTab !== 'addresses' ? 'style="display:none"' : ''}>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
              <h2 style="font-size:18px;font-weight:700">My Addresses (${addresses.length})</h2>
              <button class="btn btn-primary btn-sm" id="addAddressBtn">+ Add Address</button>
            </div>
            <div id="addressesList">
              ${addresses.length ? addresses.map(addr => `
                <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;margin-bottom:12px;border:${addr.isDefault ? '2px solid #ee4d2d' : '1px solid #e0e0e0'}">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                    <div>
                      <strong>${addr.label || 'Address'}</strong>
                      ${addr.isDefault ? '<span class="badge badge-primary" style="margin-left:8px">Default</span>' : ''}
                    </div>
                    <div style="display:flex;gap:8px">
                      <button class="btn btn-sm btn-outline edit-addr" data-id="${addr.id}">Edit</button>
                      <button class="btn btn-sm btn-outline delete-addr" data-id="${addr.id}">Delete</button>
                    </div>
                  </div>
                  <div style="font-size:13px;color:#666">
                    <div>${addr.name} · ${addr.phone}</div>
                    <div>${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}</div>
                  </div>
                </div>
              `).join('') : '<div class="empty-state"><div class="icon">📍</div><h3>No addresses saved</h3><p>Add an address for faster checkout</p></div>'}
            </div>
            <!-- Address Form -->
            <div id="addressForm" style="display:none;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:24px">
              <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Add/Edit Address</h3>
              <input type="hidden" id="editAddrId" value="">
              <div class="form-group"><label>Label (Home, Work, etc.)</label><input type="text" class="form-control" id="addrLabel" placeholder="e.g. Home"></div>
              <div class="form-row">
                <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="addrName" placeholder="John Doe"></div>
                <div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="addrPhone" placeholder="+1 234 567 8900"></div>
              </div>
              <div class="form-group"><label>Address</label><input type="text" class="form-control" id="addrAddress" placeholder="123 Main Street"></div>
              <div class="form-row">
                <div class="form-group"><label>City</label><input type="text" class="form-control" id="addrCity" placeholder="New York"></div>
                <div class="form-group"><label>State</label><input type="text" class="form-control" id="addrState" placeholder="NY"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>ZIP Code</label><input type="text" class="form-control" id="addrZip" placeholder="10001"></div>
                <div class="form-group"><label>Country</label><select class="form-control" id="addrCountry"><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option></select></div>
              </div>
              <label class="checkbox-wrap" style="margin-bottom:16px"><input type="checkbox" id="addrDefault"> Set as default address</label>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary" id="saveAddrBtn">Save Address</button>
                <button class="btn btn-outline" id="cancelAddrBtn">Cancel</button>
              </div>
            </div>
          </div>

          <!-- Vouchers Tab -->
          <div id="tab-vouchers" class="tab-panel" ${urlTab !== 'vouchers' ? 'style="display:none"' : ''}>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">My Vouchers</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
              ${VOUCHERS.map(v => {
                const claimed = claimedVouchers.includes(v.id)
                return `
                  <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:16px;border-left:4px solid ${v.type === 'free_shipping' ? '#28a745' : '#ee4d2d'}">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                      <div>
                        <div style="font-size:18px;font-weight:700;color:#ee4d2d">${v.type === 'percentage' ? v.value + '% OFF' : v.type === 'fixed' ? formatPrice(v.value) + ' OFF' : 'FREE SHIPPING'}</div>
                        <div style="font-size:13px;color:#666;margin-top:4px">${v.description}</div>
                        <div style="font-size:11px;color:#999;margin-top:4px">Min. spend: ${formatPrice(v.minSpend)} · Expires: ${new Date(v.endDate).toLocaleDateString()}</div>
                      </div>
                      <button class="btn btn-sm ${claimed ? 'btn-outline' : 'btn-primary'} claim-voucher" data-id="${v.id}" ${claimed ? 'disabled' : ''}>${claimed ? 'Claimed ✓' : 'Claim'}</button>
                    </div>
                    <div style="font-size:12px;color:#999;margin-top:8px;background:#f8f8f8;padding:4px 8px;border-radius:4px;font-family:monospace">Code: ${v.code}</div>
                  </div>
                `
              }).join('')}
            </div>
          </div>

          <!-- Settings Tab -->
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
  container.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function(this: HTMLElement, e: Event) {
      e.preventDefault()
      const tab = this.dataset.tab
      if (!tab) return
      container.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'))
      this.classList.add('active')
      container.querySelectorAll('.tab-panel').forEach(p => { (p as HTMLElement).style.display = 'none' })
      ;(container.querySelector(`#tab-${tab}`) as HTMLElement).style.display = 'block'
    })
  })

  // Address management
  container.querySelector('#addAddressBtn')?.addEventListener('click', () => {
    ;(container.querySelector('#addressForm') as HTMLElement).style.display = 'block'
    ;(container.querySelector('#editAddrId') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrLabel') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrName') as HTMLInputElement).value = user.name
    ;(container.querySelector('#addrPhone') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrAddress') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrCity') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrState') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrZip') as HTMLInputElement).value = ''
    ;(container.querySelector('#addrDefault') as HTMLInputElement).checked = false
  })

  container.querySelector('#cancelAddrBtn')?.addEventListener('click', () => {
    ;(container.querySelector('#addressForm') as HTMLElement).style.display = 'none'
  })

  container.querySelector('#saveAddrBtn')?.addEventListener('click', () => {
    const addr: Address = {
      id: (container.querySelector('#editAddrId') as HTMLInputElement).value || String(Date.now()),
      label: (container.querySelector('#addrLabel') as HTMLInputElement).value.trim(),
      name: (container.querySelector('#addrName') as HTMLInputElement).value.trim(),
      phone: (container.querySelector('#addrPhone') as HTMLInputElement).value.trim(),
      address: (container.querySelector('#addrAddress') as HTMLInputElement).value.trim(),
      city: (container.querySelector('#addrCity') as HTMLInputElement).value.trim(),
      state: (container.querySelector('#addrState') as HTMLInputElement).value.trim(),
      zip: (container.querySelector('#addrZip') as HTMLInputElement).value.trim(),
      country: (container.querySelector('#addrCountry') as HTMLSelectElement).value,
      isDefault: (container.querySelector('#addrDefault') as HTMLInputElement).checked
    }
    if (!addr.name || !addr.address) { showToast('Please fill in required fields', 'error'); return }
    saveAddress(addr)
    showToast('Address saved!')
    setTimeout(() => location.reload(), 500)
  })

  container.querySelectorAll('.edit-addr').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      const addr = addresses.find(a => a.id === this.dataset.id)
      if (!addr) return
      ;(container.querySelector('#addressForm') as HTMLElement).style.display = 'block'
      ;(container.querySelector('#editAddrId') as HTMLInputElement).value = addr.id
      ;(container.querySelector('#addrLabel') as HTMLInputElement).value = addr.label || ''
      ;(container.querySelector('#addrName') as HTMLInputElement).value = addr.name
      ;(container.querySelector('#addrPhone') as HTMLInputElement).value = addr.phone
      ;(container.querySelector('#addrAddress') as HTMLInputElement).value = addr.address
      ;(container.querySelector('#addrCity') as HTMLInputElement).value = addr.city
      ;(container.querySelector('#addrState') as HTMLInputElement).value = addr.state
      ;(container.querySelector('#addrZip') as HTMLInputElement).value = addr.zip
      ;(container.querySelector('#addrDefault') as HTMLInputElement).checked = addr.isDefault
    })
  })

  container.querySelectorAll('.delete-addr').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      if (confirm('Delete this address?')) {
        deleteAddress(this.dataset.id!)
        showToast('Address deleted')
        setTimeout(() => location.reload(), 500)
      }
    })
  })

  // Voucher claiming
  container.querySelectorAll('.claim-voucher').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      claimVoucher(this.dataset.id!)
      this.textContent = 'Claimed ✓'
      ;(this as HTMLButtonElement).disabled = true
      this.classList.remove('btn-primary')
      this.classList.add('btn-outline')
    })
  })

  // Logout
  container.querySelector('#profileLogout')?.addEventListener('click', (e) => { e.preventDefault(); logout() })

  // Save settings
  container.querySelector('#saveSettingsBtn')?.addEventListener('click', () => {
    const name = (container.querySelector('#settingsName') as HTMLInputElement).value.trim()
    const phone = (container.querySelector('#settingsPhone') as HTMLInputElement).value.trim()
    if (name) {
      const users = JSON.parse(localStorage.getItem('am_users') || '[]')
      const u = users.find((u: any) => u.email === user.email)
      if (u) { u.name = name; u.phone = phone; localStorage.setItem('am_users', JSON.stringify(users)) }
      user.name = name
      localStorage.setItem('am_current_user', JSON.stringify(user))
      showToast('Settings saved!')
    }
  })
}
