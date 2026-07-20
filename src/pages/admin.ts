// ==================== ADMIN DASHBOARD ====================
import { getCurrentUser, isAdmin, getUsers, getOrders, getReviews, getMessages, getNotifications, getSellerStore, getSellerProducts, getReturnRequests, formatPrice, renderStars, showToast, addNotification } from '../utils/helpers'
import { ALL_PRODUCTS as PRODUCTS, CATEGORIES, COUPONS, VOUCHERS } from '../utils/data'
import { scrapeProducts, saveScrapedProducts, getScrapedProducts, deleteScrapedProduct, clearScrapedProducts, importToMarketplace, detectPlatform, type ScrapedProduct } from '../utils/scraper'
import { isDemoAccount, getDemoAccounts } from '../utils/demo-accounts'
import { adminConfirmDelivery, adminUpdateOrderStatus, autoUpdateOrderStatus } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderAdminPage(): void {
  if (!isAdmin()) { navigate('/'); return }

  const users = getUsers()
  const orders = getOrders()
  const reviews = getReviews()
  const messages = getMessages()
  const notifications = getNotifications()
  const returnRequests = getReturnRequests()
  const sellerStore = getSellerStore()
  const sellerProducts = getSellerProducts()
  const allProducts = [...PRODUCTS, ...sellerProducts]

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const totalProducts = allProducts.length
  const totalUsers = users.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const pendingReturns = returnRequests.filter((r: any) => r.status === 'pending').length
  const unreadMsgs = messages.filter(m => !m.read && m.from === 'buyer').length

  // Sellers list
  const sellers = users.filter(u => u.role === 'seller' || (u as any).sellerStore)

  const container = document.createElement('div')
  container.innerHTML = `
    <div style="display:flex;min-height:100vh" class="admin-layout">
      <!-- Admin Sidebar -->
      <aside style="width:240px;background:#1a1a2e;color:#fff;padding:20px 0;flex-shrink:0" class="admin-sidebar">
        <div style="padding:0 20px 20px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:16px">
          <h2 style="font-size:16px;color:#ff7356">🛡️ Admin Panel</h2>
          <p style="font-size:11px;color:#666">ALLIANCE MALL TK</p>
        </div>
        <nav>
          <a class="admin-nav active" data-section="dashboard">📊 Dashboard</a>
          <a class="admin-nav" data-section="users">👥 Users (${totalUsers})</a>
          <a class="admin-nav" data-section="orders">📦 Orders (${orders.length})</a>
          <a class="admin-nav" data-section="products">🏷️ Products (${totalProducts})</a>
          <a class="admin-nav" data-section="sellers">🏪 Sellers (${sellers.length})</a>
          <a class="admin-nav" data-section="reviews">⭐ Reviews (${reviews.length})</a>
          <a class="admin-nav" data-section="messages">💬 Messages (${unreadMsgs})</a>
          <a class="admin-nav" data-section="returns">↩️ Returns (${pendingReturns})</a>
          <a class="admin-nav" data-section="vouchers">🎟️ Vouchers</a>
          <a class="admin-nav" data-section="coupons">🏷️ Coupons</a>
          <a class="admin-nav" data-section="notifications">🔔 Notifications</a>
          <a class="admin-nav" data-section="analytics">📈 Analytics</a>
          <a class="admin-nav" data-section="scraper">🕷️ Scrap Products</a>
          <a class="admin-nav" data-section="settings">⚙️ Settings</a>
          <a href="/" style="display:block;padding:12px 20px;font-size:13px;color:#aaa;margin-top:20px">← Back to Mall</a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main style="flex:1;padding:24px;overflow-y:auto;background:#f5f5f5" class="admin-main">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h1 id="adminTitle" style="font-size:22px;font-weight:700">Admin Dashboard</h1>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:13px;color:#666">Admin: <strong>${getCurrentUser()?.name}</strong></span>
            <button class="btn btn-sm btn-outline" onclick="localStorage.removeItem('am_current_user');window.location.href='/'">Logout</button>
          </div>
        </div>

        <!-- ==================== DASHBOARD ==================== -->
        <div id="section-dashboard">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:28px;font-weight:700;color:#ee4d2d">${formatPrice(totalRevenue)}</div><div style="font-size:13px;color:#999">Total Revenue</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:28px;font-weight:700;color:#3498db">${orders.length}</div><div style="font-size:13px;color:#999">Total Orders (${pendingOrders} pending)</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:28px;font-weight:700;color:#27ae60">${totalUsers}</div><div style="font-size:13px;color:#999">Total Users</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:28px;font-weight:700;color:#f39c12">${totalProducts}</div><div style="font-size:13px;color:#999">Total Products</div></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Order Status Breakdown</h3>
              ${['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'].map(status => {
                const count = orders.filter(o => o.status === status).length
                const pct = orders.length ? Math.round(count / orders.length * 100) : 0
                const colors: Record<string, string> = { pending: '#ffc107', processing: '#6c757d', shipped: '#17a2b8', delivered: '#20c997', completed: '#28a745', cancelled: '#dc3545' }
                return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><div style="width:12px;height:12px;border-radius:50%;background:${colors[status]}"></div><span style="font-size:13px;flex:1;text-transform:capitalize">${status}</span><strong>${count}</strong><div style="width:100px;height:6px;background:#eee;border-radius:3px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${colors[status]};border-radius:3px"></div></div></div>`
              }).join('')}
            </div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Revenue by Category</h3>
              ${Object.entries(orders.reduce((acc: any, o) => { o.items.forEach(i => { const p = allProducts.find(pr => pr.id === i.id); const cat = p?.category || 'Other'; acc[cat] = (acc[cat] || 0) + i.price * i.qty }); return acc }, {})).sort((a: any, b: any) => b[1] - a[1]).map(([cat, val]) => {
                const catObj = CATEGORIES.find(c => c.name === cat)
                return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px"><span>${catObj?.icon || '📦'} ${cat}</span><strong>${formatPrice(val as number)}</strong></div>`
              }).join('') || '<p style="color:#999">No data</p>'}
            </div>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Recent Orders</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead><tr>${['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => `<th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">${h}</th>`).join('')}</tr></thead>
              <tbody>${orders.slice(0, 10).map(o => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${o.id}</strong></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.user}<br><span style="font-size:11px;color:#999">${o.userEmail}</span></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.items.length}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${formatPrice(o.total)}</strong></td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><span class="status-badge status-${o.status}">${o.status}</span></td><td style="padding:8px;font-size:12px;color:#999;border-bottom:1px solid #f0f0f0">${new Date(o.date).toLocaleDateString()}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><select class="form-control admin-status-select" data-id="${o.id}" style="width:auto;padding:4px 8px;font-size:12px">${['pending','processing','shipped','delivered','completed','cancelled'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>

        <!-- ==================== USERS ==================== -->
        <div id="section-users" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="font-size:16px;font-weight:700">👥 User Management (${totalUsers})</h3>
            <div style="display:flex;gap:8px"><input type="text" class="form-control" id="userSearch" placeholder="Search users..." style="width:200px;padding:6px 12px;font-size:13px"><select class="form-control" id="userRoleFilter" style="width:120px;padding:6px;font-size:13px"><option value="">All Roles</option><option>user</option><option>seller</option><option>admin</option></select><select class="form-control" id="userDemoFilter" style="width:120px;padding:6px;font-size:13px"><option value="">All Types</option><option value="real">Real Users</option><option value="demo">🟡 Demo Only</option></select></div>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr>${['ID', 'Name', 'Email', 'Role', 'Coins', 'Membership', 'Joined', 'Actions'].map(h => `<th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">${h}</th>`).join('')}</tr></thead>
              <tbody id="usersTableBody"></tbody>
            </table>
          </div>
        </div>

        <!-- ==================== ORDERS ==================== -->
        <div id="section-orders" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="font-size:16px;font-weight:700">📦 Order Management (${orders.length})</h3>
            <div style="display:flex;gap:8px"><input type="text" class="form-control" id="orderSearch" placeholder="Search orders..." style="width:200px;padding:6px 12px;font-size:13px"><select class="form-control" id="orderStatusFilter" style="width:120px;padding:6px;font-size:13px"><option value="">All Status</option>${['pending','processing','shipped','delivered','completed','cancelled'].map(s => `<option>${s}</option>`).join('')}</select><button class="btn btn-sm btn-outline" id="exportOrdersBtn">📥 Export CSV</button></div>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:16px">${['', 'pending', 'processing', 'shipped', 'completed', 'cancelled'].map(s => `<button class="btn btn-sm btn-outline admin-order-filter ${s === '' ? 'active' : ''}" data-status="${s}">${s || 'All'}</button>`).join('')}</div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)" id="ordersTableContainer"></div>
        </div>

        <!-- ==================== PRODUCTS ==================== -->
        <div id="section-products" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="font-size:16px;font-weight:700">🏷️ Product Management (${totalProducts})</h3>
            <div style="display:flex;gap:8px"><input type="text" class="form-control" id="productSearch" placeholder="Search products..." style="width:200px;padding:6px 12px;font-size:13px"><select class="form-control" id="productCatFilter" style="width:120px;padding:6px;font-size:13px"><option value="">All Categories</option>${CATEGORIES.map(c => `<option>${c.name}</option>`).join('')}</select></div>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr>${['ID', 'Product', 'Seller', 'Category', 'Price', 'Stock', 'Sold', 'Rating', 'Actions'].map(h => `<th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">${h}</th>`).join('')}</tr></thead>
              <tbody id="productsTableBody"></tbody>
            </table>
          </div>
        </div>

        <!-- ==================== SELLERS ==================== -->
        <div id="section-sellers" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">🏪 Seller Management</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
            ${sellers.map(s => {
              const store = (s as any).sellerStore
              const sProducts = allProducts.filter(p => p.seller === store?.name || p.sellerId === store?.id)
              const sOrders = orders.filter(o => o.items.some(i => sProducts.some(p => p.id === i.id)))
              const sRevenue = sOrders.reduce((sum, o) => sum + o.items.filter(i => sProducts.some(p => p.id === i.id)).reduce((ss, i) => ss + i.price * i.qty, 0), 0)
              return `<div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
                  <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700">${store?.name?.[0] || s.name[0]}</div>
                  <div><strong>${store?.name || s.name}</strong><div style="font-size:12px;color:#999">${s.email} · ${store?.category || 'N/A'}</div></div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
                  <div style="text-align:center;padding:8px;background:#f8f8f8;border-radius:6px"><div style="font-size:16px;font-weight:700;color:#ee4d2d">${formatPrice(sRevenue)}</div><div style="font-size:11px;color:#999">Revenue</div></div>
                  <div style="text-align:center;padding:8px;background:#f8f8f8;border-radius:6px"><div style="font-size:16px;font-weight:700">${sProducts.length}</div><div style="font-size:11px;color:#999">Products</div></div>
                  <div style="text-align:center;padding:8px;background:#f8f8f8;border-radius:6px"><div style="font-size:16px;font-weight:700">${sOrders.length}</div><div style="font-size:11px;color:#999">Orders</div></div>
                </div>
                <div style="font-size:12px;color:#999">📍 ${store?.location || 'N/A'}</div>
              </div>`
            }).join('')}
          </div>
        </div>

        <!-- ==================== REVIEWS ==================== -->
        <div id="section-reviews" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">⭐ Review Management (${reviews.length})</h3>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            ${reviews.map(r => {
              const product = allProducts.find(p => p.id === r.productId)
              return `<div style="padding:12px 0;border-bottom:1px solid #f0f0f0">
                <div style="display:flex;justify-content:space-between;align-items:start">
                  <div style="display:flex;gap:12px;align-items:center">
                    <div style="width:36px;height:36px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-weight:600">${r.userName[0]}</div>
                    <div><strong>${r.userName}</strong> · <span style="color:#ffc107">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span><div style="font-size:12px;color:#999">on <a href="/product/${r.productId}" style="color:#ee4d2d">${product?.name || 'Product'}</a> · ${new Date(r.date).toLocaleDateString()}</div></div>
                  </div>
                  <button class="btn btn-sm btn-outline admin-delete-review" data-id="${r.id}" style="color:#dc3545">Delete</button>
                </div>
                <p style="font-size:13px;color:#666;margin:8px 0 0 48px">${r.text}</p>
                ${r.sellerReply ? `<div style="margin:8px 0 0 48px;padding:8px 12px;background:#f0f8ff;border-radius:6px;font-size:12px"><strong>🏪 Seller:</strong> ${r.sellerReply}</div>` : ''}
              </div>`
            }).join('') || '<p style="color:#999;text-align:center;padding:20px">No reviews</p>'}
          </div>
        </div>

        <!-- ==================== MESSAGES ==================== -->
        <div id="section-messages" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">💬 All Messages (${messages.length})</h3>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr>${['From', 'To', 'Product', 'Message', 'Date', 'Status'].map(h => `<th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">${h}</th>`).join('')}</tr></thead>
              <tbody>${messages.slice(0, 20).map(m => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${m.from === 'buyer' ? m.buyerName : 'Seller'}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${m.from === 'buyer' ? 'Seller' : m.buyerName}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${m.productName || '-'}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.text}</td><td style="padding:8px;font-size:12px;color:#999;border-bottom:1px solid #f0f0f0">${new Date(m.date).toLocaleDateString()}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0">${m.read ? '<span class="badge badge-success">Read</span>' : '<span class="badge badge-warning">Unread</span>'}</td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>

        <!-- ==================== RETURNS ==================== -->
        <div id="section-returns" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">↩️ Return Requests (${returnRequests.length})</h3>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            ${returnRequests.length ? returnRequests.map((r: any) => `<div style="padding:16px;border:1px solid #e0e0e0;border-radius:8px;margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div><strong>${r.id}</strong> · Order <a href="/track-order?id=${r.orderId}" style="color:#ee4d2d">${r.orderId}</a></div><span class="status-badge status-${r.status === 'pending' ? 'pending' : r.status === 'approved' ? 'completed' : 'cancelled'}">${r.status}</span></div>
              <div style="font-size:13px;color:#666">Reason: ${r.reason}</div>
              <div style="font-size:12px;color:#999;margin-top:4px">${r.description}</div>
              <div style="font-size:12px;color:#999;margin-top:4px">${new Date(r.date).toLocaleDateString()}</div>
              ${r.status === 'pending' ? `<div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-sm btn-success admin-approve-return" data-id="${r.id}">Approve</button><button class="btn btn-sm btn-danger admin-reject-return" data-id="${r.id}">Reject</button></div>` : ''}
            </div>`).join('') : '<p style="color:#999;text-align:center;padding:20px">No return requests</p>'}
          </div>
        </div>

        <!-- ==================== VOUCHERS ==================== -->
        <div id="section-vouchers" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">🎟️ Vouchers (${VOUCHERS.length})</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">
            ${VOUCHERS.map(v => `<div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-left:4px solid ${v.type === 'free_shipping' ? '#28a745' : '#ee4d2d'}">
              <div style="display:flex;justify-content:space-between"><div><div style="font-size:18px;font-weight:700;color:#ee4d2d">${v.type === 'percentage' ? v.value + '% OFF' : v.type === 'fixed' ? formatPrice(v.value) + ' OFF' : 'FREE SHIPPING'}</div><div style="font-size:13px;color:#666">${v.description}</div><div style="font-size:11px;color:#999;margin-top:4px">Min: ${formatPrice(v.minSpend)} · Expires: ${new Date(v.endDate).toLocaleDateString()}</div></div></div>
              <div style="font-size:12px;color:#999;margin-top:8px;background:#f8f8f8;padding:4px 8px;border-radius:4px;font-family:monospace">Code: ${v.code}</div>
            </div>`).join('')}
          </div>
        </div>

        <!-- ==================== COUPONS ==================== -->
        <div id="section-coupons" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">🏷️ Coupons (${COUPONS.length})</h3>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr>${['Code', 'Type', 'Value', 'Min Spend', 'Used/Limit', 'Store', 'Status', 'Expires'].map(h => `<th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">${h}</th>`).join('')}</tr></thead>
              <tbody>${COUPONS.map(c => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0;font-family:monospace"><strong>${c.code}</strong></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${c.type}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${c.type === 'percentage' ? c.value + '%' : c.type === 'fixed' ? formatPrice(c.value) : 'Free Ship'}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${formatPrice(c.minSpend)}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${c.usedCount}/${c.usageLimit}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${c.storeId || 'All'}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><span class="badge badge-${c.status === 'active' ? 'success' : 'danger'}">${c.status}</span></td><td style="padding:8px;font-size:12px;color:#999;border-bottom:1px solid #f0f0f0">${new Date(c.endDate).toLocaleDateString()}</td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>

        <!-- ==================== NOTIFICATIONS ==================== -->
        <div id="section-notifications" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">🔔 Notifications (${notifications.length})</h3>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            ${notifications.length ? notifications.map((n: any) => `<div style="display:flex;gap:12px;padding:12px;border-bottom:1px solid #f0f0f0;${!n.isRead ? 'background:#fff5f3' : ''}">
              <div style="font-size:20px">${n.type === 'order' ? '📦' : n.type === 'promo' ? '🎉' : '🔔'}</div>
              <div style="flex:1"><strong style="font-size:13px">${n.title}</strong><p style="font-size:12px;color:#666">${n.message}</p><div style="font-size:11px;color:#999">${new Date(n.createdAt).toLocaleString()}</div></div>
            </div>`).join('') : '<p style="color:#999;text-align:center;padding:20px">No notifications</p>'}
          </div>
        </div>

        <!-- ==================== ANALYTICS ==================== -->
        <div id="section-analytics" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📈 Analytics</h3>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${orders.length ? formatPrice(totalRevenue / orders.length) : '$0.00'}</div><div style="font-size:12px;color:#999">Avg Order Value</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${allProducts.reduce((s, p) => s + p.sold, 0).toLocaleString()}</div><div style="font-size:12px;color:#999">Total Items Sold</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</div><div style="font-size:12px;color:#999">Avg Rating</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${sellers.length}</div><div style="font-size:12px;color:#999">Active Sellers</div></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Top Selling Products</h4>
              ${[...allProducts].sort((a, b) => b.sold - a.sold).slice(0, 10).map((p, i) => `<div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;align-items:center"><span style="color:#999;width:20px">${i + 1}</span><div style="flex:1"><strong>${p.name}</strong><br><span style="font-size:11px;color:#999">${p.seller}</span></div><div><strong>${p.sold.toLocaleString()}</strong> sold</div></div>`).join('')}
            </div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Rating Distribution</h4>
              ${[5, 4, 3, 2, 1].map(star => { const count = reviews.filter(r => r.rating === star).length; const pct = reviews.length ? Math.round(count / reviews.length * 100) : 0; return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:30px;font-size:13px">${star}★</span><div style="flex:1;height:8px;background:#eee;border-radius:4px;overflow:hidden"><div style="width:${pct}%;height:100%;background:#ffc107;border-radius:4px"></div></div><span style="width:30px;font-size:12px;color:#999">${count}</span></div>` }).join('')}
            </div>
          </div>
        </div>

        <!-- ==================== SETTINGS ==================== -->

        <!-- ==================== SCRAP PRODUCTS ==================== -->
        <div id="section-scraper" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">🕷️ Scrap Products from Marketplace</h3>
          
          <!-- URL Input -->
          <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:20px">
            <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Enter Marketplace URL</h4>
            <p style="font-size:13px;color:#666;margin-bottom:16px">Paste a category, search, or store page URL from any supported marketplace. Products will be extracted automatically.</p>
            <div style="display:flex;gap:8px;margin-bottom:12px">
              <input type="text" class="form-control" id="scrapeUrlInput" placeholder="https://www.amazon.com/s?k=wireless+earbuds" style="flex:1;padding:14px 16px;font-size:14px;border-radius:8px">
              <button class="btn btn-primary" id="scrapeBtn" style="padding:14px 28px;white-space:nowrap">🔍 Scrape</button>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Amazon" style="font-size:11px;padding:4px 10px">Amazon</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="AliExpress" style="font-size:11px;padding:4px 10px">AliExpress</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="eBay" style="font-size:11px;padding:4px 10px">eBay</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Shopee" style="font-size:11px;padding:4px 10px">Shopee</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Lazada" style="font-size:11px;padding:4px 10px">Lazada</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Temu" style="font-size:11px;padding:4px 10px">Temu</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Walmart" style="font-size:11px;padding:4px 10px">Walmart</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Alibaba" style="font-size:11px;padding:4px 10px">Alibaba</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="SHEIN" style="font-size:11px;padding:4px 10px">SHEIN</button>
              <button class="btn btn-sm btn-outline platform-quick-btn" data-platform="Banggood" style="font-size:11px;padding:4px 10px">Banggood</button>
            </div>
            <div id="scrapeStatus" style="margin-top:12px;font-size:13px;color:#666"></div>
          </div>

          <!-- Supported Platforms -->
          <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:20px">
            <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Supported Platforms (30+)</h4>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Amazon</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">AliExpress</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">eBay</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Shopee</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Lazada</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Temu</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Wish</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Alibaba</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Banggood</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">GearBest</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">SHEIN</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Zara</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">H&amp;M</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">ASOS</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Walmart</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Target</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Best Buy</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Etsy</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Shopify</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Tokopedia</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Bukalapak</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Blibli</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">JD.com</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Taobao</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Tmall</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Rakuten</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">MercadoLibre</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Flipkart</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Noon</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Jumia</span>
              <span style="padding:4px 10px;background:#f0f0f0;border-radius:16px;font-size:11px;color:#444">Takealot</span>
            </div>
          </div>

          <!-- Scraped Products -->
          <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <h4 style="font-size:14px;font-weight:700">Scraped Products (<span id="scrapedCount">0</span>)</h4>
              <div style="display:flex;gap:8px">
                <button class="btn btn-sm btn-primary" id="importAllBtn" disabled>📥 Import All to Store</button>
                <button class="btn btn-sm btn-outline" id="clearScrapedBtn" disabled style="color:#dc3545">🗑️ Clear All</button>
              </div>
            </div>
            <div id="scrapedProductsList"></div>
          </div>
        </div>

        <div id="section-settings" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">⚙️ System Settings</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div style="background:#fff;border-radius:8px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <h4 style="font-size:14px;font-weight:700;margin-bottom:16px">General</h4>
              <div class="form-group"><label>Site Name</label><input type="text" class="form-control" value="ALLIANCE MALL TK"></div>
              <div class="form-group"><label>Currency</label><select class="form-control"><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select></div>
              <div class="form-group"><label>Commission Rate (%)</label><input type="number" class="form-control" value="15"></div>
              <button class="btn btn-primary" onclick="alert('Settings saved!')">Save</button>
            </div>
            <div style="background:#fff;border-radius:8px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
              <h4 style="font-size:14px;font-weight:700;margin-bottom:16px">Data Management</h4>
              <div style="display:flex;flex-direction:column;gap:8px">
                <button class="btn btn-outline" onclick="if(confirm('Reset all orders?')){localStorage.removeItem('am_orders');location.reload()}">Reset Orders</button>
                <button class="btn btn-outline" onclick="if(confirm('Reset all reviews?')){localStorage.removeItem('am_reviews');location.reload()}">Reset Reviews</button>
                <button class="btn btn-outline" onclick="if(confirm('Reset all messages?')){localStorage.removeItem('am_messages');location.reload()}">Reset Messages</button>
                <button class="btn btn-outline" onclick="if(confirm('Reset all users?')){localStorage.removeItem('am_users');localStorage.removeItem('am_current_user');location.reload()}">Reset Users</button>
                <button class="btn btn-danger" onclick="if(confirm('CLEAR ALL DATA?')){localStorage.clear();location.reload()}">Clear All Data</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `

  renderPage(container)

  // ==================== NAVIGATION ====================
  container.querySelectorAll('.admin-nav').forEach(nav => {
    nav.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.admin-nav').forEach(n => n.classList.remove('active')); this.classList.add('active')
      const section = this.dataset.section!
      container.querySelectorAll('[id^="section-"]').forEach(s => (s as HTMLElement).style.display = 'none')
      ;(container.querySelector(`#section-${section}`) as HTMLElement).style.display = 'block'
      const titles: Record<string, string> = { dashboard: 'Admin Dashboard', users: 'User Management', orders: 'Order Management', products: 'Product Management', sellers: 'Seller Management', reviews: 'Review Management', messages: 'Message Management', returns: 'Return Requests', vouchers: 'Vouchers', coupons: 'Coupons', notifications: 'Notifications', analytics: 'Analytics', scraper: 'Scrap Products', settings: 'System Settings' }
      container.querySelector('#adminTitle')!.textContent = titles[section] || 'Admin'
      if (section === 'users') renderUsersTable()
      if (section === 'orders') renderOrdersTable()
      if (section === 'products') renderProductsTable()
    })
  })

  // ==================== USERS TABLE ====================
  function renderUsersTable() {
    const search = (container.querySelector('#userSearch') as HTMLInputElement)?.value?.toLowerCase() || ''
    const roleFilter = (container.querySelector('#userRoleFilter') as HTMLSelectElement)?.value || ''
    const demoFilter = (container.querySelector('#userDemoFilter') as HTMLSelectElement)?.value || ''
    const filtered = users.filter(u => {
      if (search && !u.name.toLowerCase().includes(search) && !u.email.toLowerCase().includes(search)) return false
      if (roleFilter && u.role !== roleFilter) return false
      if (demoFilter === 'demo' && !(u as any).isDemo) return false
      if (demoFilter === 'real' && (u as any).isDemo) return false
      return true
    })
    const demoCount = users.filter(u => (u as any).isDemo).length
    const realCount = users.filter(u => !(u as any).isDemo).length
    container.querySelector('#usersTableBody')!.innerHTML = filtered.map(u => {
      const isDemo = (u as any).isDemo
      const country = (u as any).demoCountry || ''
      return `<tr style="${isDemo ? 'background:#fffde7' : ''}">
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${u.id}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${u.name}</strong> ${isDemo ? '<span style="background:#ffc107;color:#000;padding:1px 6px;border-radius:10px;font-size:10px;font-weight:700;margin-left:4px">DEMO</span>' : ''}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${u.email}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0"><span class="badge badge-${u.role === 'admin' ? 'danger' : u.role === 'seller' ? 'warning' : 'info'}">${u.role}</span></td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${isDemo ? '🟡 ' : ''}${country || '-'}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${(u as any).coins || 0}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${(u as any).membership || 'basic'}</td>
      <td style="padding:8px;font-size:12px;color:#999;border-bottom:1px solid #f0f0f0">${new Date(u.joinDate).toLocaleDateString()}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0"><select class="form-control user-role-select" data-id="${u.id}" style="width:auto;padding:4px 8px;font-size:12px">${['user', 'seller', 'admin'].map(r => `<option ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></td>
    </tr>`
    }).join('')

    container.querySelectorAll('.user-role-select').forEach(sel => {
      sel.addEventListener('change', function(this: HTMLSelectElement) {
        const userId = this.dataset.id!
        const newRole = this.value
        const user = users.find(u => u.id === userId)
        if (user) { user.role = newRole as any; localStorage.setItem('am_users', JSON.stringify(users)); showToast(`User ${user.name} → ${newRole}`) }
      })
    })
  }

  // ==================== ORDERS TABLE ====================
  function renderOrdersTable(statusFilter = '') {
    const search = (container.querySelector('#orderSearch') as HTMLInputElement)?.value?.toLowerCase() || ''
    const filtered = orders.filter(o => {
      if (statusFilter && o.status !== statusFilter) return false
      if (search && !o.id.toLowerCase().includes(search) && !o.user.toLowerCase().includes(search)) return false
      return true
    })
    container.querySelector('#ordersTableContainer')!.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr>${['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => `<th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">${h}</th>`).join('')}</tr></thead><tbody>${filtered.map(o => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${o.id}</strong></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.user}<br><span style="font-size:11px;color:#999">${o.userEmail}</span></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.items.length}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${formatPrice(o.total)}</strong></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.payment.replace('-', ' ')}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><select class="form-control admin-status-select" data-id="${o.id}" style="width:auto;padding:4px 8px;font-size:12px">${['pending','processing','shipped','delivered','completed','cancelled'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td style="padding:8px;font-size:12px;color:#999;border-bottom:1px solid #f0f0f0">${new Date(o.date).toLocaleDateString()}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><a href="/track-order?id=${o.id}" class="btn btn-sm btn-outline">View</a></td></tr>`).join('')}</tbody></table>`

    container.querySelectorAll('.admin-status-select').forEach(sel => {
      sel.addEventListener('change', function(this: HTMLSelectElement) {
        const orderId = this.dataset.id!; const newStatus = this.value
        const order = orders.find(o => o.id === orderId)
        if (order) { 
          if (newStatus === 'delivered') {
            adminConfirmDelivery(orderId)
            showToast(`Order ${orderId} → Delivered (confirmed)`)
          } else {
            adminUpdateOrderStatus(orderId, newStatus)
            showToast(`Order ${orderId} → ${newStatus}`)
          }
        }
      })
    })
  }

  // ==================== PRODUCTS TABLE ====================
  function renderProductsTable() {
    const search = (container.querySelector('#productSearch') as HTMLInputElement)?.value?.toLowerCase() || ''
    const catFilter = (container.querySelector('#productCatFilter') as HTMLSelectElement)?.value || ''
    const filtered = allProducts.filter(p => {
      if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false
      if (catFilter && p.category !== catFilter) return false
      return true
    })
    container.querySelector('#productsTableBody')!.innerHTML = filtered.map(p => `<tr>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${p.id}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${p.name}</strong><br><span style="font-size:11px;color:#999">${p.brand}</span></td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${p.seller}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${p.category}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${formatPrice(p.price)}</strong></td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><span style="color:${p.stock < 10 ? '#dc3545' : '#28a745'}">${p.stock}</span></td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${p.sold}</td>
      <td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><span style="color:#ffc107">${'★'.repeat(Math.floor(p.rating))}</span> ${p.rating}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0"><a href="/product/${p.id}" class="btn btn-sm btn-outline">View</a></td>
    </tr>`).join('')
  }

  // ==================== ORDER FILTER BUTTONS ====================
  container.querySelectorAll('.admin-order-filter').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.admin-order-filter').forEach(b => b.classList.remove('active')); this.classList.add('active')
      renderOrdersTable(this.dataset.status!)
    })
  })

  // ==================== STATUS CHANGE (DASHBOARD) ====================
  container.querySelectorAll('.admin-status-select').forEach(sel => {
    sel.addEventListener('change', function(this: HTMLSelectElement) {
      const orderId = this.dataset.id!; const newStatus = this.value
      const order = orders.find(o => o.id === orderId)
      if (order) { 
        if (newStatus === 'delivered') {
          adminConfirmDelivery(orderId)
          showToast(`Order ${orderId} → Delivered (confirmed)`)
        } else {
          adminUpdateOrderStatus(orderId, newStatus)
          showToast(`Order ${orderId} → ${newStatus}`)
        }
      }
    })
  })

  // ==================== REVIEW DELETE ====================
  container.querySelectorAll('.admin-delete-review').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      if (confirm('Delete this review?')) {
        const reviewId = Number(this.dataset.id)
        const allReviews = getReviews().filter(r => r.id !== reviewId)
        localStorage.setItem('am_reviews', JSON.stringify(allReviews))
        showToast('Review deleted'); setTimeout(() => location.reload(), 500)
      }
    })
  })

  // ==================== RETURN APPROVE/REJECT ====================
  container.querySelectorAll('.admin-approve-return').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      const reqs = getReturnRequests(); const req = reqs.find((r: any) => r.id === this.dataset.id)
      if (req) { req.status = 'approved'; localStorage.setItem('am_returns', JSON.stringify(reqs)); showToast('Return approved'); setTimeout(() => location.reload(), 500) }
    })
  })
  container.querySelectorAll('.admin-reject-return').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      const reqs = getReturnRequests(); const req = reqs.find((r: any) => r.id === this.dataset.id)
      if (req) { req.status = 'rejected'; localStorage.setItem('am_returns', JSON.stringify(reqs)); showToast('Return rejected'); setTimeout(() => location.reload(), 500) }
    })
  })

  // ==================== SEARCH/FILTER LISTENERS ====================
  container.querySelector('#userSearch')?.addEventListener('input', renderUsersTable)
  container.querySelector('#userRoleFilter')?.addEventListener('change', renderUsersTable)
  container.querySelector('#userDemoFilter')?.addEventListener('change', renderUsersTable)
  container.querySelector('#orderSearch')?.addEventListener('input', () => renderOrdersTable())
  container.querySelector('#productSearch')?.addEventListener('input', renderProductsTable)
  container.querySelector('#productCatFilter')?.addEventListener('change', renderProductsTable)

  // ==================== EXPORT CSV ====================
  container.querySelector('#exportOrdersBtn')?.addEventListener('click', () => {
    let csv = 'Order ID,Customer,Email,Items,Total,Payment,Status,Date\n'
    orders.forEach(o => { csv += `${o.id},"${o.user}","${o.userEmail}",${o.items.length},${o.total},${o.payment},${o.status},${new Date(o.date).toLocaleDateString()}\n` })
    const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orders.csv'; a.click(); showToast('Orders exported!')
  })


  // ==================== SCRAP PRODUCTS ====================
  function renderScrapedProducts() {
    const products = getScrapedProducts()
    const countEl = container.querySelector('#scrapedCount')
    const listEl = container.querySelector('#scrapedProductsList')
    const importBtn = container.querySelector('#importAllBtn') as HTMLButtonElement
    const clearBtn = container.querySelector('#clearScrapedBtn') as HTMLButtonElement
    
    if (countEl) countEl.textContent = String(products.length)
    if (importBtn) importBtn.disabled = products.length === 0
    if (clearBtn) clearBtn.disabled = products.length === 0
    
    if (!listEl) return
    
    if (products.length === 0) {
      listEl.innerHTML = '<div style="text-align:center;padding:40px;color:#999"><div style="font-size:48px;margin-bottom:12px">🕷️</div><h3 style="font-size:16px;color:#666;margin-bottom:8px">No scraped products yet</h3><p style="font-size:13px">Enter a marketplace URL above to start scraping products</p></div>'
      return
    }
    
    listEl.innerHTML = products.map((p, i) => `
      <div style="display:flex;gap:12px;padding:12px;border-bottom:1px solid #f0f0f0;align-items:center" data-scraped-id="${p.id}">
        <img src="${p.images?.[0] || ''}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;background:#f0f0f0" onerror="this.src='https://picsum.photos/seed/scraped${i}/60/60'">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</div>
          <div style="display:flex;gap:12px;font-size:11px;color:#999;margin-top:4px">
            <span>${formatPrice(p.price)}</span>
            <span style="text-decoration:line-through">${formatPrice(p.originalPrice)}</span>
            <span style="color:#f39c12">★ ${p.rating}</span>
            <span>${p.sold.toLocaleString()} sold</span>
            <span style="color:#17a2b8">${p.sourcePlatform}</span>
          </div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-primary import-single-btn" data-id="${p.id}">Import</button>
          <button class="btn btn-sm btn-outline delete-scraped-btn" data-id="${p.id}" style="color:#dc3545">✕</button>
        </div>
      </div>
    `).join('')
    
    // Single import
    listEl.querySelectorAll('.import-single-btn').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const id = Number(this.dataset.id)
        const product = products.find(p => p.id === id)
        if (product) {
          importToMarketplace(product)
          deleteScrapedProduct(id)
          renderScrapedProducts()
          showToast('Product imported to store!')
        }
      })
    })
    
    // Delete single
    listEl.querySelectorAll('.delete-scraped-btn').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const id = Number(this.dataset.id)
        deleteScrapedProduct(id)
        renderScrapedProducts()
        showToast('Product removed')
      })
    })
  }
  
  // Scrape button
  container.querySelector('#scrapeBtn')?.addEventListener('click', async () => {
    const urlInput = container.querySelector('#scrapeUrlInput') as HTMLInputElement
    const url = urlInput?.value.trim()
    if (!url) { showToast('Enter a URL', 'error'); return }
    
    const statusEl = container.querySelector('#scrapeStatus')
    if (statusEl) statusEl.innerHTML = '<span style="color:#f39c12">⏳ Scraping products...</span>'
    
    const platform = detectPlatform(url)
    
    try {
      const result = await scrapeProducts(url)
      
      if (result.products.length > 0) {
        saveScrapedProducts(result.products)
        renderScrapedProducts()
        
        if (statusEl) {
          statusEl.innerHTML = `<span style="color:#28a745">✅ Found ${result.products.length} products from ${platform}${result.error ? ' — ' + result.error : ''}</span>`
        }
        showToast(`Scraped ${result.products.length} products from ${platform}!`)
      } else {
        if (statusEl) statusEl.innerHTML = '<span style="color:#dc3545">❌ No products found. Try a different URL.</span>'
      }
    } catch (error) {
      if (statusEl) statusEl.innerHTML = '<span style="color:#dc3545">❌ Scraping failed. Try again.</span>'
      showToast('Scraping failed', 'error')
    }
  })
  
  // Quick platform buttons
  container.querySelectorAll('.platform-quick-btn').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      const platform = this.dataset.platform
      const urls: Record<string, string> = {
        'Amazon': 'https://www.amazon.com/s?k=electronics',
        'AliExpress': 'https://www.aliexpress.com/w/wholesale-electronics.html',
        'eBay': 'https://www.ebay.com/sch/i.html?_nkw=electronics',
        'Shopee': 'https://shopee.com/search?keyword=electronics',
        'Lazada': 'https://www.lazada.com/catalog/?q=electronics',
        'Temu': 'https://www.temu.com/search_result.html?search_key=electronics',
        'Walmart': 'https://www.walmart.com/search?q=electronics',
        'Alibaba': 'https://www.alibaba.com/trade/search?SearchText=electronics',
        'SHEIN': 'https://www.shein.com/search?q=electronics',
        'Banggood': 'https://www.banggood.com/search/electronics.html',
      }
      const urlInput = container.querySelector('#scrapeUrlInput') as HTMLInputElement
      if (urlInput && platform && urls[platform]) {
        urlInput.value = urls[platform]
        const scrapeBtn = container.querySelector('#scrapeBtn')
        if (scrapeBtn) (scrapeBtn as HTMLElement).click()
      }
    })
  })
  
  // Import all
  container.querySelector('#importAllBtn')?.addEventListener('click', () => {
    const products = getScrapedProducts()
    if (!products.length) return
    products.forEach(p => importToMarketplace(p))
    clearScrapedProducts()
    renderScrapedProducts()
    showToast(`${products.length} products imported to store!`)
  })
  
  // Clear all
  container.querySelector('#clearScrapedBtn')?.addEventListener('click', () => {
    if (confirm('Clear all scraped products?')) {
      clearScrapedProducts()
      renderScrapedProducts()
      showToast('Scraped products cleared')
    }
  })
  
  // Init scraped products list
  renderScrapedProducts()


}