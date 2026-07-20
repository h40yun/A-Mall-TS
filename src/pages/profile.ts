// ==================== PROFILE PAGE ====================
import { getCurrentUser, getOrders, formatPrice, logout, showToast } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderProfilePage(): void {
  const user = getCurrentUser()
  if (!user) { navigate('/auth'); return }

  const container = document.createElement('div')
  const orders = getOrders().filter(o => o.userEmail === user.email || o.user === user.name)

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
          <a href="#" class="tab-link active" data-tab="orders">📦 My Orders</a>
          <a href="#" class="tab-link" data-tab="settings">⚙️ Settings</a>
          <a href="#" class="tab-link" id="profileLogout">🚪 Logout</a>
        </div>
        <div id="profileContent">
          <div id="tab-orders" class="tab-panel active">
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">My Orders (${orders.length})</h2>
            ${orders.length ? orders.map(o => `
              <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                  <div>
                    <strong>${o.id}</strong>
                    <span style="font-size:12px;color:#999;margin-left:12px">${new Date(o.date).toLocaleDateString()}</span>
                  </div>
                  <span class="status-badge status-${o.status}">${o.status}</span>
                </div>
                ${o.items.map(item => `
                  <div style="display:flex;gap:12px;padding:8px 0;border-top:1px solid #e0e0e0;align-items:center">
                    <div style="flex:1"><strong>${item.name}</strong><br><span style="color:#999;font-size:12px">Qty: ${item.qty} × ${formatPrice(item.price)}</span></div>
                    <strong>${formatPrice(item.price * item.qty)}</strong>
                  </div>
                `).join('')}
                <div style="text-align:right;padding-top:12px;border-top:1px solid #e0e0e0;margin-top:8px">
                  <span style="font-size:13px;color:#666">Shipping: ${o.shippingCost === 0 ? 'FREE' : formatPrice(o.shippingCost)}</span>
                  <span style="font-size:18px;font-weight:700;color:#ee4d2d;margin-left:16px">Total: ${formatPrice(o.total)}</span>
                </div>
              </div>
            `).join('') : '<div class="empty-state"><div class="icon">📦</div><h3>No orders yet</h3><p>Start shopping to see your orders here</p><a href="/" class="btn btn-primary">Shop Now</a></div>'}
          </div>
          <div id="tab-settings" class="tab-panel" style="display:none">
            <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">Account Settings</h2>
            <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:24px">
              <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="settingsName" value="${user.name}"></div>
              <div class="form-group"><label>Email</label><input type="email" class="form-control" value="${user.email}" disabled></div>
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
      container.querySelectorAll('.tab-panel').forEach(p => { (p as HTMLElement).style.display = 'none' });
      (container.querySelector(`#tab-${tab}`) as HTMLElement).style.display = 'block'
    })
  })

  // Logout
  container.querySelector('#profileLogout')?.addEventListener('click', (e) => { e.preventDefault(); logout() })

  // Save settings
  container.querySelector('#saveSettingsBtn')?.addEventListener('click', () => {
    const name = (container.querySelector('#settingsName') as HTMLInputElement).value.trim()
    if (name) {
      const users = JSON.parse(localStorage.getItem('am_users') || '[]')
      const u = users.find((u: any) => u.email === user.email)
      if (u) { u.name = name; localStorage.setItem('am_users', JSON.stringify(users)) }
      user.name = name
      localStorage.setItem('am_current_user', JSON.stringify(user))
      showToast('Settings saved!')
    }
  })
}
