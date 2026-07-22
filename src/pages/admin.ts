// @ts-nocheck
// ==================== ADMIN DASHBOARD ====================
// Full control & access for entire website
import { getCurrentProfile, isAdmin, logout } from '../utils/auth'
import { formatPrice, showToast, renderStars } from '../utils/helpers'
import { CATEGORIES, COUPONS, VOUCHERS } from '../utils/data'
import { renderPage } from '../components'
import { navigate } from '../router'
import { supabase } from '../utils/supabase'

export async function renderAdminPage(): Promise<void> {
  const profile = getCurrentProfile()
  if (!profile || profile.role !== 'admin') {
    showToast('Access denied. Admin only.', 'error')
    navigate('/')
    return
  }

  const container = document.createElement('div')
  container.innerHTML = `
    <div style="display:flex;min-height:100vh" class="admin-layout">
      <!-- Sidebar -->
      <aside style="width:260px;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);color:#fff;padding:0;flex-shrink:0;overflow-y:auto" class="admin-sidebar">
        <div style="padding:24px 20px;border-bottom:1px solid rgba(255,255,255,0.1)">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#ee4d2d,#f97316);display:flex;align-items:center;justify-content:center;font-size:20px">🛡️</div>
            <div>
              <h2 style="font-size:16px;font-weight:700;color:#fff">Admin Panel</h2>
              <p style="font-size:11px;color:#8892b0">ALLIANCE MALL TK</p>
            </div>
          </div>
          <div style="margin-top:12px;padding:8px 12px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:12px;color:#64ffda">
            👤 ${profile.name} · ${profile.email}
          </div>
        </div>
        <nav style="padding:12px 0">
          <a class="admin-nav active" data-section="dashboard" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#ccd6f6;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>📊</span> Dashboard
          </a>
          <a class="admin-nav" data-section="users" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>👥</span> Users
          </a>
          <a class="admin-nav" data-section="products" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>🏷️</span> Products
          </a>
          <a class="admin-nav" data-section="orders" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>📦</span> Orders
          </a>
          <a class="admin-nav" data-section="sellers" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>🏪</span> Sellers
          </a>
          <a class="admin-nav" data-section="reviews" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>⭐</span> Reviews
          </a>
          <a class="admin-nav" data-section="messages" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>💬</span> Messages
          </a>
          <a class="admin-nav" data-section="disputes" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>⚖️</span> Disputes
          </a>
          <a class="admin-nav" data-section="returns" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>↩️</span> Returns
          </a>
          <a class="admin-nav" data-section="vouchers" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>🎟️</span> Vouchers
          </a>
          <a class="admin-nav" data-section="coupons" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>🏷️</span> Coupons
          </a>
          <a class="admin-nav" data-section="notifications" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>🔔</span> Notifications
          </a>
          <a class="admin-nav" data-section="analytics" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>📈</span> Analytics
          </a>
          <a class="admin-nav" data-section="settings" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;cursor:pointer;transition:all 0.2s;border-left:3px solid transparent">
            <span>⚙️</span> Settings
          </a>
          <div style="margin:12px 20px;border-top:1px solid rgba(255,255,255,0.1)"></div>
          <a href="/" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#8892b0;text-decoration:none">
            <span>🏪</span> View Store
          </a>
          <a href="#" id="adminLogout" style="display:flex;align-items:center;gap:12px;padding:12px 20px;font-size:13px;color:#ff6b6b;text-decoration:none;cursor:pointer">
            <span>🚪</span> Logout
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main style="flex:1;background:#f0f2f5;overflow-y:auto">
        <!-- Top Bar -->
        <div style="background:#fff;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 3px rgba(0,0,0,0.08);position:sticky;top:0;z-index:100">
          <h1 id="adminTitle" style="font-size:20px;font-weight:700;color:#1a1a2e">Dashboard</h1>
          <div style="display:flex;gap:12px;align-items:center">
            <span style="font-size:12px;color:#666">Last login: ${new Date().toLocaleString()}</span>
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">${profile.name[0]}</div>
          </div>
        </div>

        <!-- Sections -->
        <div style="padding:24px" id="adminContent">
          <div style="text-align:center;padding:60px;color:#999">Loading dashboard...</div>
        </div>
      </main>
    </div>
  `

  renderPage(container)

  // Navigation
  container.querySelectorAll('.admin-nav').forEach(nav => {
    nav.addEventListener('click', function(this: HTMLElement, e: Event) {
      e.preventDefault()
      const section = this.dataset.section
      if (!section) return

      container.querySelectorAll('.admin-nav').forEach(n => {
        (n as HTMLElement).style.color = '#8892b0'
        ;(n as HTMLElement).style.borderLeftColor = 'transparent'
        ;(n as HTMLElement).style.background = 'transparent'
      })
      this.style.color = '#64ffda'
      this.style.borderLeftColor = '#64ffda'
      this.style.background = 'rgba(100,255,218,0.05)'

      const titleEl = container.querySelector('#adminTitle')!
      titleEl.textContent = this.textContent?.trim() || section

      loadSection(section, container)
    })
  })

  // Logout
  container.querySelector('#adminLogout')?.addEventListener('click', (e) => {
    e.preventDefault()
    logout()
  })

  // Load dashboard by default
  loadSection('dashboard', container)
}

// ============================================================
// LOAD SECTION
// ============================================================
async function loadSection(section: string, container: HTMLElement) {
  const contentEl = container.querySelector('#adminContent')!
  contentEl.innerHTML = '<div style="text-align:center;padding:40px;color:#999">Loading...</div>'

  switch (section) {
    case 'dashboard': await loadDashboard(contentEl); break
    case 'users': await loadUsers(contentEl); break
    case 'products': await loadProducts(contentEl); break
    case 'orders': await loadOrders(contentEl); break
    case 'sellers': await loadSellers(contentEl); break
    case 'reviews': await loadReviews(contentEl); break
    case 'messages': await loadMessages(contentEl); break
    case 'disputes': await loadDisputes(contentEl); break
    case 'returns': await loadReturns(contentEl); break
    case 'vouchers': await loadVouchers(contentEl); break
    case 'coupons': await loadCoupons(contentEl); break
    case 'notifications': await loadNotifications(contentEl); break
    case 'analytics': await loadAnalytics(contentEl); break
    case 'settings': await loadSettings(contentEl); break
    default: contentEl.innerHTML = '<div style="padding:40px;text-align:center;color:#999">Section not found</div>'
  }
}

// ============================================================
// DASHBOARD
// ============================================================
async function loadDashboard(el: HTMLElement) {
  const [usersRes, ordersRes, productsRes, reviewsRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total, status, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
  ])

  const orders = ordersRes.data || []
  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
  const recentOrders = orders.slice(0, 5)

  el.innerHTML = `
    <!-- Stats Cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:24px">
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-left:4px solid #ee4d2d">
        <div style="font-size:28px;font-weight:800;color:#ee4d2d">${formatPrice(totalRevenue)}</div>
        <div style="font-size:13px;color:#888;margin-top:4px">Total Revenue</div>
        <div style="font-size:11px;color:#28a745;margin-top:8px">↑ ${orders.length} orders</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-left:4px solid #3498db">
        <div style="font-size:28px;font-weight:800;color:#3498db">${usersRes.count || 0}</div>
        <div style="font-size:13px;color:#888;margin-top:4px">Total Users</div>
        <div style="font-size:11px;color:#999;margin-top:8px">Registered accounts</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-left:4px solid #27ae60">
        <div style="font-size:28px;font-weight:800;color:#27ae60">${productsRes.count || 0}</div>
        <div style="font-size:13px;color:#888;margin-top:4px">Active Products</div>
        <div style="font-size:11px;color:#999;margin-top:8px">Listed products</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-left:4px solid #f39c12">
        <div style="font-size:28px;font-weight:800;color:#f39c12">${pendingOrders}</div>
        <div style="font-size:13px;color:#888;margin-top:4px">Pending Orders</div>
        <div style="font-size:11px;color:#e74c3c;margin-top:8px">Needs attention</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:24px">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:16px;color:#1a1a2e">⚡ Quick Actions</h3>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button onclick="document.querySelector('[data-section=products]').click()" style="padding:10px 20px;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+ Add Product</button>
        <button onclick="document.querySelector('[data-section=coupons]').click()" style="padding:10px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+ Create Coupon</button>
        <button onclick="document.querySelector('[data-section=vouchers]').click()" style="padding:10px 20px;background:linear-gradient(135deg,#f093fb,#f5576c);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+ Create Voucher</button>
        <button onclick="document.querySelector('[data-section=notifications]').click()" style="padding:10px 20px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">📢 Send Notification</button>
      </div>
    </div>

    <!-- Recent Orders -->
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:24px">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:16px;color:#1a1a2e">📦 Recent Orders</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0">
            <th style="text-align:left;padding:10px;font-size:12px;color:#888;font-weight:600">Date</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888;font-weight:600">Total</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          ${recentOrders.map((o: any) => `
            <tr style="border-bottom:1px solid #f8f8f8">
              <td style="padding:10px;font-size:13px">${new Date(o.created_at).toLocaleDateString()}</td>
              <td style="padding:10px;font-size:13px;font-weight:600">${formatPrice(o.total)}</td>
              <td style="padding:10px"><span style="padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600;background:${o.status === 'completed' ? '#e8f5e9' : o.status === 'pending' ? '#fff3e0' : '#fce4ec'};color:${o.status === 'completed' ? '#2e7d32' : o.status === 'pending' ? '#e65100' : '#c62828'}">${o.status}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="3" style="padding:20px;text-align:center;color:#999">No orders yet</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- System Info -->
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:16px;color:#1a1a2e">ℹ️ System Info</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div style="padding:12px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:11px;color:#888">Database</div>
          <div style="font-size:13px;font-weight:600;color:#27ae60">Supabase PostgreSQL</div>
        </div>
        <div style="padding:12px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:11px;color:#888">Hosting</div>
          <div style="font-size:13px;font-weight:600;color:#f39c12">Cloudflare Pages</div>
        </div>
        <div style="padding:12px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:11px;color:#888">Tables</div>
          <div style="font-size:13px;font-weight:600;color:#3498db">29 tables</div>
        </div>
      </div>
    </div>
  `
}

// ============================================================
// USERS
// ============================================================
async function loadUsers(el: HTMLElement) {
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:700">👥 All Users (${users?.length || 0})</h3>
        <input type="text" placeholder="Search users..." style="padding:8px 16px;border:1px solid #e0e0e0;border-radius:8px;font-size:13px;width:250px" id="userSearch">
      </div>
      <table style="width:100%;border-collapse:collapse" id="usersTable">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0">
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">User</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Email</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Role</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Coins</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Membership</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Joined</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${(users || []).map((u: any) => `
            <tr style="border-bottom:1px solid #f8f8f8" data-email="${u.email}" data-name="${u.name}">
              <td style="padding:10px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">${u.name?.[0] || '?'}</div>
                  <span style="font-size:13px;font-weight:600">${u.name}</span>
                </div>
              </td>
              <td style="padding:10px;font-size:12px;color:#666">${u.email}</td>
              <td style="padding:10px">
                <select class="role-select" data-user-id="${u.id}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:12px;background:#fff">
                  <option value="user" ${u.role === 'user' ? 'selected' : ''}>👤 User</option>
                  <option value="seller" ${u.role === 'seller' ? 'selected' : ''}>🏪 Seller</option>
                  <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>🛡️ Admin</option>
                </select>
              </td>
              <td style="padding:10px;font-size:13px;font-weight:600;color:#f39c12">🪙 ${u.coins || 0}</td>
              <td style="padding:10px"><span style="padding:3px 8px;border-radius:10px;font-size:11px;background:${u.membership === 'premium' ? '#fce4ec' : u.membership === 'prime' ? '#fff3e0' : '#e3f2fd'};color:${u.membership === 'premium' ? '#c62828' : u.membership === 'prime' ? '#e65100' : '#1565c0'}">${(u.membership || 'basic').toUpperCase()}</span></td>
              <td style="padding:10px;font-size:12px;color:#999">${new Date(u.created_at).toLocaleDateString()}</td>
              <td style="padding:10px">
                <button class="btn-sm btn-outline edit-coins" data-user-id="${u.id}" data-coins="${u.coins || 0}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:4px;font-size:11px;cursor:pointer;background:#fff">Edit Coins</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="7" style="padding:20px;text-align:center;color:#999">No users</td></tr>'}
        </tbody>
      </table>
    </div>
  `

  // Role change
  el.querySelectorAll('.role-select').forEach(sel => {
    sel.addEventListener('change', async function(this: HTMLSelectElement) {
      const userId = this.dataset.userId!
      const newRole = this.value
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
      if (error) showToast('Failed: ' + error.message, 'error')
      else showToast(`Role updated to ${newRole}`)
    })
  })

  // Edit coins
  el.querySelectorAll('.edit-coins').forEach(btn => {
    btn.addEventListener('click', async function(this: HTMLElement) {
      const userId = this.dataset.userId!
      const currentCoins = this.dataset.coins!
      const newCoins = prompt(`Enter new coins (current: ${currentCoins}):`, currentCoins)
      if (newCoins === null) return
      const { error } = await supabase.from('profiles').update({ coins: parseInt(newCoins) || 0 }).eq('id', userId)
      if (error) showToast('Failed: ' + error.message, 'error')
      else { showToast('Coins updated'); loadUsers(el) }
    })
  })

  // Search
  const searchInput = el.querySelector('#userSearch') as HTMLInputElement
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase()
    el.querySelectorAll('#usersTable tbody tr').forEach(row => {
      const name = (row as HTMLElement).dataset.name?.toLowerCase() || ''
      const email = (row as HTMLElement).dataset.email?.toLowerCase() || ''
      ;(row as HTMLElement).style.display = (name.includes(q) || email.includes(q)) ? '' : 'none'
    })
  })
}

// ============================================================
// PRODUCTS
// ============================================================
async function loadProducts(el: HTMLElement) {
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:700">🏷️ Products (${products?.length || 0})</h3>
        <button id="addProductBtn" style="padding:8px 20px;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+ Add Product</button>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0">
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Product</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Category</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Price</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Stock</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Sold</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Rating</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Status</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${(products || []).map((p: any) => `
            <tr style="border-bottom:1px solid #f8f8f8">
              <td style="padding:10px">
                <div style="display:flex;align-items:center;gap:10px">
                  <img src="${p.images?.[0] || 'https://picsum.photos/seed/p/40/40'}" style="width:40px;height:40px;border-radius:6px;object-fit:cover" onerror="this.style.display='none'">
                  <div>
                    <div style="font-size:13px;font-weight:600">${p.name}</div>
                    <div style="font-size:11px;color:#999">${p.brand} · ${p.sku || 'N/A'}</div>
                  </div>
                </div>
              </td>
              <td style="padding:10px;font-size:12px">${p.category}</td>
              <td style="padding:10px;font-size:13px;font-weight:600">${formatPrice(p.price)}</td>
              <td style="padding:10px;font-size:13px;color:${p.stock < 10 ? '#e74c3c' : '#27ae60'}">${p.stock}</td>
              <td style="padding:10px;font-size:13px">${p.sold}</td>
              <td style="padding:10px;font-size:12px">★ ${p.rating}</td>
              <td style="padding:10px">
                <span style="padding:3px 8px;border-radius:10px;font-size:11px;background:${p.is_active ? '#e8f5e9' : '#fce4ec'};color:${p.is_active ? '#2e7d32' : '#c62828'}">${p.is_active ? 'Active' : 'Inactive'}</span>
              </td>
              <td style="padding:10px">
                <div style="display:flex;gap:4px">
                  <button class="toggle-product" data-id="${p.id}" data-active="${p.is_active}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:4px;font-size:11px;cursor:pointer;background:#fff">${p.is_active ? 'Disable' : 'Enable'}</button>
                  <button class="delete-product" data-id="${p.id}" style="padding:4px 8px;border:1px solid #e74c3c;border-radius:4px;font-size:11px;cursor:pointer;background:#fff;color:#e74c3c">Delete</button>
                </div>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="8" style="padding:20px;text-align:center;color:#999">No products</td></tr>'}
        </tbody>
      </table>
    </div>
  `

  // Toggle active
  el.querySelectorAll('.toggle-product').forEach(btn => {
    btn.addEventListener('click', async function(this: HTMLElement) {
      const id = this.dataset.id!
      const isActive = this.dataset.active === 'true'
      const { error } = await supabase.from('products').update({ is_active: !isActive }).eq('id', id)
      if (error) showToast('Failed', 'error')
      else { showToast(isActive ? 'Product disabled' : 'Product enabled'); loadProducts(el) }
    })
  })

  // Delete
  el.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', async function(this: HTMLElement) {
      if (!confirm('Delete this product?')) return
      const id = this.dataset.id!
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) showToast('Failed: ' + error.message, 'error')
      else { showToast('Product deleted'); loadProducts(el) }
    })
  })
}

// ============================================================
// ORDERS
// ============================================================
async function loadOrders(el: HTMLElement) {
  const { data: orders } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">📦 All Orders (${orders?.length || 0})</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0">
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Order</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Customer</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Items</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Total</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Status</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Payment</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Date</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${(orders || []).map((o: any) => `
            <tr style="border-bottom:1px solid #f8f8f8">
              <td style="padding:10px;font-size:12px;font-weight:600;font-family:monospace">${o.order_number}</td>
              <td style="padding:10px;font-size:12px">${o.user_name}<br><span style="color:#999;font-size:11px">${o.user_email || ''}</span></td>
              <td style="padding:10px;font-size:12px">${o.order_items?.length || 0} items</td>
              <td style="padding:10px;font-size:13px;font-weight:600">${formatPrice(o.total)}</td>
              <td style="padding:10px">
                <select class="status-select" data-order-id="${o.id}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;background:#fff">
                  <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                  <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                  <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Completed</option>
                  <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
              <td style="padding:10px;font-size:11px">${o.payment_method || 'N/A'}</td>
              <td style="padding:10px;font-size:11px;color:#999">${new Date(o.created_at).toLocaleDateString()}</td>
              <td style="padding:10px">
                <button class="view-order" data-order-id="${o.id}" style="padding:4px 8px;border:1px solid #3498db;border-radius:4px;font-size:11px;cursor:pointer;background:#fff;color:#3498db">View</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="8" style="padding:20px;text-align:center;color:#999">No orders</td></tr>'}
        </tbody>
      </table>
    </div>
  `

  // Status change
  el.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', async function(this: HTMLSelectElement) {
      const orderId = this.dataset.orderId!
      const newStatus = this.value
      const { error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId)
      if (error) showToast('Failed: ' + error.message, 'error')
      else showToast(`Order status → ${newStatus}`)
    })
  })
}

// ============================================================
// SELLERS
// ============================================================
async function loadSellers(el: HTMLElement) {
  const { data: stores } = await supabase.from('seller_stores').select('*, owner:profiles(name, email)').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">🏪 Seller Stores (${stores?.length || 0})</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0">
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Store</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Owner</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Category</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Location</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Status</th>
            <th style="text-align:left;padding:10px;font-size:12px;color:#888">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${(stores || []).map((s: any) => `
            <tr style="border-bottom:1px solid #f8f8f8">
              <td style="padding:10px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:36px;height:36px;border-radius:8px;background:${s.banner_color || '#667eea'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">${s.logo_initial || s.name[0]}</div>
                  <div>
                    <div style="font-size:13px;font-weight:600">${s.name}</div>
                    <div style="font-size:11px;color:#999">${s.slug}</div>
                  </div>
                </div>
              </td>
              <td style="padding:10px;font-size:12px">${(s.owner as any)?.name || 'N/A'}<br><span style="color:#999;font-size:11px">${(s.owner as any)?.email || ''}</span></td>
              <td style="padding:10px;font-size:12px">${s.category || 'N/A'}</td>
              <td style="padding:10px;font-size:12px">${s.location || 'N/A'}</td>
              <td style="padding:10px">
                <select class="store-status" data-store-id="${s.id}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;background:#fff">
                  <option value="active" ${s.status === 'active' ? 'selected' : ''}>Active</option>
                  <option value="suspended" ${s.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                  <option value="pending" ${s.status === 'pending' ? 'selected' : ''}>Pending</option>
                </select>
              </td>
              <td style="padding:10px">
                <button class="delete-store" data-store-id="${s.id}" style="padding:4px 8px;border:1px solid #e74c3c;border-radius:4px;font-size:11px;cursor:pointer;background:#fff;color:#e74c3c">Delete</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="6" style="padding:20px;text-align:center;color:#999">No sellers</td></tr>'}
        </tbody>
      </table>
    </div>
  `

  el.querySelectorAll('.store-status').forEach(sel => {
    sel.addEventListener('change', async function(this: HTMLSelectElement) {
      const storeId = this.dataset.storeId!
      const { error } = await supabase.from('seller_stores').update({ status: this.value }).eq('id', storeId)
      if (error) showToast('Failed', 'error')
      else showToast('Store status updated')
    })
  })
}

// ============================================================
// REVIEWS
// ============================================================
async function loadReviews(el: HTMLElement) {
  const { data: reviews } = await supabase.from('reviews').select('*, product:products(name)').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">⭐ Reviews (${reviews?.length || 0})</h3>
      ${(reviews || []).map((r: any) => `
        <div style="padding:16px;border-bottom:1px solid #f0f0f0;display:flex;gap:12px;align-items:flex-start">
          <div style="width:36px;height:36px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">${r.user_name?.[0] || '?'}</div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between">
              <div>
                <strong style="font-size:13px">${r.user_name}</strong>
                <span style="color:#ffc107;margin-left:8px">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <span style="font-size:11px;color:#999">${new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <div style="font-size:12px;color:#666;margin-top:4px">Product: ${(r.product as any)?.name || 'N/A'}</div>
            <p style="font-size:13px;color:#333;margin-top:8px">${r.text}</p>
            ${r.seller_reply ? `<div style="font-size:12px;background:#f0f8ff;padding:8px;border-radius:6px;margin-top:8px"><strong>🏪 Seller:</strong> ${r.seller_reply}</div>` : ''}
            <div style="margin-top:8px">
              <button class="delete-review" data-review-id="${r.id}" style="padding:4px 8px;border:1px solid #e74c3c;border-radius:4px;font-size:11px;cursor:pointer;background:#fff;color:#e74c3c">Delete</button>
            </div>
          </div>
        </div>
      `).join('') || '<div style="padding:20px;text-align:center;color:#999">No reviews</div>'}
    </div>
  `

  el.querySelectorAll('.delete-review').forEach(btn => {
    btn.addEventListener('click', async function(this: HTMLElement) {
      if (!confirm('Delete this review?')) return
      const id = this.dataset.reviewId!
      await supabase.from('reviews').delete().eq('id', id)
      showToast('Review deleted')
      loadReviews(el)
    })
  })
}

// ============================================================
// MESSAGES
// ============================================================
async function loadMessages(el: HTMLElement) {
  const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(100)

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">💬 Messages (${messages?.length || 0})</h3>
      ${(messages || []).map((m: any) => `
        <div style="padding:12px;border-bottom:1px solid #f0f0f0">
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;font-weight:600;color:${m.from === 'buyer' ? '#ee4d2d' : '#3498db'}">${m.from === 'buyer' ? '👤 Buyer' : '🏪 Seller'}</span>
            <span style="font-size:11px;color:#999">${new Date(m.created_at).toLocaleString()}</span>
          </div>
          <p style="font-size:13px;margin-top:4px">${m.text}</p>
          <div style="font-size:11px;color:#999;margin-top:4px">Product: ${m.product_name || 'N/A'} · Read: ${m.is_read ? '✓' : '✗'}</div>
        </div>
      `).join('') || '<div style="padding:20px;text-align:center;color:#999">No messages</div>'}
    </div>
  `
}

// ============================================================
// DISPUTES
// ============================================================
async function loadDisputes(el: HTMLElement) {
  const { data: disputes } = await supabase.from('disputes').select('*, order:orders(order_number), user:profiles(name)').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">⚖️ Disputes (${disputes?.length || 0})</h3>
      ${(disputes || []).map((d: any) => `
        <div style="padding:16px;border-bottom:1px solid #f0f0f0;border-left:4px solid ${d.status === 'open' ? '#e74c3c' : d.status === 'resolved' ? '#27ae60' : '#f39c12'}">
          <div style="display:flex;justify-content:space-between">
            <div>
              <strong style="font-size:13px">${d.type.replace(/_/g, ' ').toUpperCase()}</strong>
              <span style="font-size:12px;color:#999;margin-left:8px">Order: ${(d.order as any)?.order_number || 'N/A'}</span>
            </div>
            <select class="dispute-status" data-dispute-id="${d.id}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;background:#fff">
              <option value="open" ${d.status === 'open' ? 'selected' : ''}>Open</option>
              <option value="under_review" ${d.status === 'under_review' ? 'selected' : ''}>Under Review</option>
              <option value="resolved" ${d.status === 'resolved' ? 'selected' : ''}>Resolved</option>
              <option value="closed" ${d.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
          <p style="font-size:13px;color:#666;margin-top:8px">${d.description}</p>
          <div style="font-size:11px;color:#999;margin-top:4px">By: ${(d.user as any)?.name || 'N/A'} · ${new Date(d.created_at).toLocaleString()}</div>
        </div>
      `).join('') || '<div style="padding:20px;text-align:center;color:#999">No disputes</div>'}
    </div>
  `

  el.querySelectorAll('.dispute-status').forEach(sel => {
    sel.addEventListener('change', async function(this: HTMLSelectElement) {
      await supabase.from('disputes').update({ status: this.value }).eq('id', this.dataset.disputeId!)
      showToast('Dispute status updated')
    })
  })
}

// ============================================================
// RETURNS
// ============================================================
async function loadReturns(el: HTMLElement) {
  const { data: returns } = await supabase.from('return_requests').select('*, order:orders(order_number)').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">↩️ Return Requests (${returns?.length || 0})</h3>
      ${(returns || []).map((r: any) => `
        <div style="padding:16px;border-bottom:1px solid #f0f0f0">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-size:13px">${r.id.substring(0, 8)}</strong>
              <span style="font-size:12px;color:#999;margin-left:8px">Order: ${(r.order as any)?.order_number || 'N/A'}</span>
            </div>
            <select class="return-status" data-return-id="${r.id}" style="padding:4px 8px;border:1px solid #e0e0e0;border-radius:6px;font-size:11px;background:#fff">
              <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="approved" ${r.status === 'approved' ? 'selected' : ''}>Approved</option>
              <option value="rejected" ${r.status === 'rejected' ? 'selected' : ''}>Rejected</option>
              <option value="completed" ${r.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
          <p style="font-size:13px;color:#666;margin-top:8px"><strong>Reason:</strong> ${r.reason}</p>
          ${r.description ? `<p style="font-size:12px;color:#999;margin-top:4px">${r.description}</p>` : ''}
          <div style="font-size:11px;color:#999;margin-top:4px">${new Date(r.created_at).toLocaleString()}</div>
        </div>
      `).join('') || '<div style="padding:20px;text-align:center;color:#999">No return requests</div>'}
    </div>
  `

  el.querySelectorAll('.return-status').forEach(sel => {
    sel.addEventListener('change', async function(this: HTMLSelectElement) {
      await supabase.from('return_requests').update({ status: this.value }).eq('id', this.dataset.returnId!)
      showToast('Return status updated')
    })
  })
}

// ============================================================
// VOUCHERS
// ============================================================
async function loadVouchers(el: HTMLElement) {
  const { data: vouchers } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false })

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:700">🎟️ Vouchers (${vouchers?.length || 0})</h3>
        <button id="addVoucherBtn" style="padding:8px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">+ Add Voucher</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
        ${(vouchers || []).map((v: any) => `
          <div style="padding:16px;border-radius:10px;border:1px solid #e0e0e0;border-left:4px solid ${v.type === 'free_shipping' ? '#27ae60' : '#ee4d2d'}">
            <div style="display:flex;justify-content:space-between">
              <div>
                <div style="font-size:18px;font-weight:700;color:#ee4d2d">${v.type === 'percentage' ? v.value + '%' : v.type === 'fixed' ? formatPrice(v.value) : 'FREE'} ${v.type === 'free_shipping' ? 'SHIPPING' : 'OFF'}</div>
                <div style="font-size:12px;color:#666;margin-top:4px">${v.description || ''}</div>
              </div>
              <button class="delete-voucher" data-voucher-id="${v.id}" style="padding:4px 8px;border:1px solid #e74c3c;border-radius:4px;font-size:11px;cursor:pointer;background:#fff;color:#e74c3c;height:fit-content">×</button>
            </div>
            <div style="font-size:11px;color:#999;margin-top:8px">Code: <strong>${v.code}</strong> · Min: ${formatPrice(v.min_spend)} · Expires: ${v.end_date || 'N/A'}</div>
          </div>
        `).join('') || '<div style="padding:20px;text-align:center;color:#999">No vouchers</div>'}
      </div>
    </div>
  `

  // Add voucher
  el.querySelector('#addVoucherBtn')?.addEventListener('click', () => {
    const code = prompt('Voucher code:')
    if (!code) return
    const type = prompt('Type (fixed/percentage/free_shipping):', 'percentage')
    if (!type) return
    const value = prompt('Value:', '10')
    const minSpend = prompt('Minimum spend:', '0')
    const desc = prompt('Description:', '')
    const endDate = prompt('End date (YYYY-MM-DD):', '2026-12-31')

    supabase.from('vouchers').insert({
      code: code.toUpperCase(),
      type,
      value: parseFloat(value) || 0,
      min_spend: parseFloat(minSpend) || 0,
      description: desc,
      end_date: endDate,
    }).then(({ error }) => {
      if (error) showToast('Failed: ' + error.message, 'error')
      else { showToast('Voucher created'); loadVouchers(el) }
    })
  })

  el.querySelectorAll('.delete-voucher').forEach(btn => {
    btn.addEventListener('click', async function(this: HTMLElement) {
      if (!confirm('Delete voucher?')) return
      await supabase.from('vouchers').delete().eq('id', this.dataset.voucherId!)
      showToast('Voucher deleted')
      loadVouchers(el)
    })
  })
}

// ============================================================
// COUPONS
// ============================================================
async function loadCoupons(el: HTMLElement) {
  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">🏷️ Coupons</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
        ${COUPONS.map(c => `
          <div style="padding:16px;border-radius:10px;border:1px solid #e0e0e0;border-left:4px solid ${c.type === 'free_shipping' ? '#27ae60' : '#3498db'}">
            <div style="font-size:16px;font-weight:700;color:#3498db">${c.code}</div>
            <div style="font-size:12px;color:#666;margin-top:4px">${c.type === 'percentage' ? c.value + '% off' : c.type === 'fixed' ? formatPrice(c.value) + ' off' : 'Free shipping'}</div>
            <div style="font-size:11px;color:#999;margin-top:4px">Min: ${formatPrice(c.minSpend)} · Used: ${c.usedCount}/${c.usageLimit}</div>
            <div style="font-size:11px;color:#999">Expires: ${c.endDate}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

// ============================================================
// NOTIFICATIONS
// ============================================================
async function loadNotifications(el: HTMLElement) {
  const { data: notifs } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)

  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:700">🔔 Notifications (${notifs?.length || 0})</h3>
        <button id="sendNotifBtn" style="padding:8px 20px;background:linear-gradient(135deg,#4facfe,#00f2fe);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600">📢 Send to All</button>
      </div>
      ${(notifs || []).map((n: any) => `
        <div style="padding:12px;border-bottom:1px solid #f0f0f0;${n.is_read ? 'opacity:0.6' : ''}">
          <div style="display:flex;justify-content:space-between">
            <strong style="font-size:13px">${n.title}</strong>
            <span style="font-size:11px;color:#999">${new Date(n.created_at).toLocaleString()}</span>
          </div>
          <p style="font-size:12px;color:#666;margin-top:4px">${n.message}</p>
          <span style="font-size:11px;color:#999">Type: ${n.type} · Read: ${n.is_read ? '✓' : '✗'}</span>
        </div>
      `).join('') || '<div style="padding:20px;text-align:center;color:#999">No notifications</div>'}
    </div>
  `

  el.querySelector('#sendNotifBtn')?.addEventListener('click', async () => {
    const title = prompt('Notification title:')
    if (!title) return
    const message = prompt('Notification message:')
    if (!message) return
    const link = prompt('Link (optional):', '/')

    // Get all user IDs
    const { data: users } = await supabase.from('profiles').select('id')
    if (!users) return

    const notifs = users.map((u: any) => ({
      user_id: u.id,
      type: 'admin',
      title,
      message,
      link: link || '/',
    }))

    const { error } = await supabase.from('notifications').insert(notifs)
    if (error) showToast('Failed: ' + error.message, 'error')
    else { showToast(`Sent to ${users.length} users`); loadNotifications(el) }
  })
}

// ============================================================
// ANALYTICS
// ============================================================
async function loadAnalytics(el: HTMLElement) {
  const [ordersRes, usersRes, productsRes, reviewsRes] = await Promise.all([
    supabase.from('orders').select('total, status, created_at'),
    supabase.from('profiles').select('created_at, role'),
    supabase.from('products').select('category, price, sold, rating'),
    supabase.from('reviews').select('rating'),
  ])

  const orders = ordersRes.data || []
  const users = usersRes.data || []
  const products = productsRes.data || []
  const reviews = reviewsRes.data || []

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const avgRating = reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0

  // Category breakdown
  const categoryMap = new Map<string, { count: number; revenue: number }>()
  products.forEach((p: any) => {
    const existing = categoryMap.get(p.category) || { count: 0, revenue: 0 }
    existing.count++
    existing.revenue += (p.price || 0) * (p.sold || 0)
    categoryMap.set(p.category, existing)
  })

  const topCategories = [...categoryMap.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5)

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:24px">
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px">Total Revenue</div>
        <div style="font-size:32px;font-weight:800;color:#ee4d2d;margin-top:8px">${formatPrice(totalRevenue)}</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px">Avg Order Value</div>
        <div style="font-size:32px;font-weight:800;color:#3498db;margin-top:8px">${formatPrice(avgOrderValue)}</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px">Avg Rating</div>
        <div style="font-size:32px;font-weight:800;color:#f39c12;margin-top:8px">★ ${avgRating.toFixed(1)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
      <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:16px">📊 Orders by Status</h3>
        ${['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'].map(status => {
          const count = orders.filter((o: any) => o.status === status).length
          const pct = orders.length ? (count / orders.length * 100) : 0
          const colors: Record<string, string> = { pending: '#f39c12', processing: '#3498db', shipped: '#9b59b6', delivered: '#27ae60', completed: '#2ecc71', cancelled: '#e74c3c' }
          return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:80px;font-size:12px;color:#666">${status}</div>
            <div style="flex:1;height:24px;background:#f0f0f0;border-radius:12px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:${colors[status]};border-radius:12px;transition:width 0.3s"></div>
            </div>
            <div style="width:40px;font-size:12px;font-weight:600;text-align:right">${count}</div>
          </div>`
        }).join('')}
      </div>

      <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:16px">🏷️ Top Categories</h3>
        ${topCategories.map(([cat, data], i) => `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:28px;height:28px;border-radius:8px;background:${['#ee4d2d','#3498db','#27ae60','#f39c12','#9b59b6'][i]};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">${i + 1}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">${cat}</div>
              <div style="font-size:11px;color:#999">${data.count} products</div>
            </div>
            <div style="font-size:13px;font-weight:600;color:#27ae60">${formatPrice(data.revenue)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:16px">📈 User Growth</h3>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
        <div style="text-align:center;padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#3498db">${users.length}</div>
          <div style="font-size:12px;color:#888">Total Users</div>
        </div>
        <div style="text-align:center;padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#27ae60">${users.filter((u: any) => u.role === 'seller').length}</div>
          <div style="font-size:12px;color:#888">Sellers</div>
        </div>
        <div style="text-align:center;padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#f39c12">${products.length}</div>
          <div style="font-size:12px;color:#888">Products</div>
        </div>
        <div style="text-align:center;padding:16px;background:#f8f9fa;border-radius:8px">
          <div style="font-size:24px;font-weight:700;color:#9b59b6">${reviews.length}</div>
          <div style="font-size:12px;color:#888">Reviews</div>
        </div>
      </div>
    </div>
  `
}

// ============================================================
// SETTINGS
// ============================================================
async function loadSettings(el: HTMLElement) {
  el.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:20px">⚙️ Site Settings</h3>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <!-- General -->
        <div style="padding:20px;background:#f8f9fa;border-radius:10px">
          <h4 style="font-size:14px;font-weight:600;margin-bottom:16px">🌐 General</h4>
          <div class="form-group" style="margin-bottom:12px">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Site Name</label>
            <input type="text" value="ALLIANCE MALL TK" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
          <div class="form-group" style="margin-bottom:12px">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Site URL</label>
            <input type="text" value="https://a-mall.pages.dev" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px" disabled>
          </div>
          <div class="form-group">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Support Email</label>
            <input type="email" value="support@alliancemall.com" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
        </div>

        <!-- Shipping -->
        <div style="padding:20px;background:#f8f9fa;border-radius:10px">
          <h4 style="font-size:14px;font-weight:600;margin-bottom:16px">🚚 Shipping</h4>
          <div class="form-group" style="margin-bottom:12px">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Free Shipping Min Order</label>
            <input type="number" value="50" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
          <div class="form-group" style="margin-bottom:12px">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Standard Shipping Rate</label>
            <input type="number" value="4.99" step="0.01" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
          <div class="form-group">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Express Shipping Rate</label>
            <input type="number" value="9.99" step="0.01" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
        </div>

        <!-- Commission -->
        <div style="padding:20px;background:#f8f9fa;border-radius:10px">
          <h4 style="font-size:14px;font-weight:600;margin-bottom:16px">💰 Commission</h4>
          <div class="form-group" style="margin-bottom:12px">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Default Commission Rate (%)</label>
            <input type="number" value="10" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
          <div class="form-group">
            <label style="font-size:12px;color:#666;display:block;margin-bottom:4px">Referral Reward ($)</label>
            <input type="number" value="5" step="0.01" style="width:100%;padding:8px 12px;border:1px solid #e0e0e0;border-radius:6px;font-size:13px">
          </div>
        </div>

        <!-- Database -->
        <div style="padding:20px;background:#f8f9fa;border-radius:10px">
          <h4 style="font-size:14px;font-weight:600;margin-bottom:16px">🗄️ Database</h4>
          <div style="font-size:13px;color:#666;line-height:2">
            <div>✅ Supabase PostgreSQL</div>
            <div>✅ 29 tables</div>
            <div>✅ Row Level Security</div>
            <div>✅ Full-text search index</div>
            <div>✅ Real-time subscriptions</div>
          </div>
        </div>
      </div>

      <div style="margin-top:24px;padding:16px;background:#e8f5e9;border-radius:8px;font-size:13px;color:#2e7d32">
        <strong>✅ System Status:</strong> All services operational. Database connected. CDN active.
      </div>
    </div>
  `
}
