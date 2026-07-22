// @ts-nocheck - Migrating to Supabase, will fix types later
// ==================== SELLER DASHBOARD ====================
import { getCurrentUser, isLoggedIn, getSellerStore, saveSellerStore, getSellerProducts, saveSellerProduct, deleteSellerProduct, getOrders, getMessages, getConversations, getConversation, markMessagesRead, showToast, formatPrice, renderStars, getReviews, addNotification } from '../utils/helpers'
import { ALL_PRODUCTS as PRODUCTS, CATEGORIES } from '../utils/data'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderSellerDashboardPage(): void {
  if (!isLoggedIn()) { navigate('/seller/login'); return }
  const user = getCurrentUser()!
  const store = getSellerStore()
  const sellerProducts = getSellerProducts()
  const allOrders = getOrders()
  const conversations = getConversations()
  const reviews = getReviews()

  // Get orders containing seller's products
  const sellerProductIds = [...sellerProducts.map((p: any) => p.id), ...PRODUCTS.filter(p => p.seller === store?.name).map(p => p.id)]
  const sellerOrders = allOrders.filter(o => o.items.some(i => sellerProductIds.includes(i.id)))

  const totalRevenue = sellerOrders.reduce((s, o) => s + o.items.filter(i => sellerProductIds.includes(i.id)).reduce((ss, i) => ss + i.price * i.qty, 0), 0)
  const totalProducts = sellerProducts.length + PRODUCTS.filter(p => p.seller === store?.name).length

  const container = document.createElement('div')
  container.innerHTML = `
    <div style="display:flex;min-height:100vh" class="seller-layout">
      <!-- Sidebar -->
      <aside style="width:240px;background:#1a1a2e;color:#fff;padding:20px 0;flex-shrink:0" class="seller-sidebar">
        <div style="padding:0 20px 20px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:16px">
          <h2 style="font-size:16px;color:#ff7356">🏪 Seller Center</h2>
          <p style="font-size:11px;color:#666">${store?.name || 'Your Store'}</p>
        </div>
        <nav>
          <a class="seller-nav active" data-section="dashboard">📊 Dashboard</a>
          <a class="seller-nav" data-section="products">📦 Products</a>
          <a class="seller-nav" data-section="orders">🧾 Orders</a>
          <a class="seller-nav" data-section="chat">💬 Chat (${conversations.reduce((s, c) => s + c.unread, 0)})</a>
          <a class="seller-nav" data-section="reviews">⭐ Reviews</a>
          <a class="seller-nav" data-section="analytics">📈 Analytics</a>
          <a class="seller-nav" data-section="store">🏪 Store Settings</a>
          <a class="seller-nav" data-section="add-product">➕ Add Product</a>
          <a href="/" style="display:block;padding:12px 20px;font-size:13px;color:#aaa;margin-top:20px">← Back to Mall</a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main style="flex:1;padding:24px;overflow-y:auto;background:#f5f5f5" class="seller-main">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h1 id="sectionTitle" style="font-size:22px;font-weight:700">Seller Dashboard</h1>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:13px;color:#666">Welcome, <strong>${user.name}</strong></span>
            <a href="/store/${encodeURIComponent(store?.name || '')}" class="btn btn-sm btn-outline">View Store</a>
          </div>
        </div>

        <!-- Dashboard -->
        <div id="section-dashboard">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:24px;font-weight:700;color:#ee4d2d">${formatPrice(totalRevenue)}</div><div style="font-size:13px;color:#999">Total Revenue</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:24px;font-weight:700;color:#3498db">${sellerOrders.length}</div><div style="font-size:13px;color:#999">Total Orders</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:24px;font-weight:700;color:#27ae60">${totalProducts}</div><div style="font-size:13px;color:#999">Products</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:24px;font-weight:700;color:#f39c12">${conversations.reduce((s, c) => s + c.unread, 0)}</div><div style="font-size:13px;color:#999">Unread Messages</div></div>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Recent Orders</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead><tr><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Order</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Customer</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Total</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Status</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Date</th></tr></thead>
              <tbody>${sellerOrders.slice(0, 5).map(o => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${o.id}</strong></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.user}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${formatPrice(o.total)}</strong></td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><span class="status-badge status-${o.status}">${o.status}</span></td><td style="padding:8px;font-size:12px;color:#999;border-bottom:1px solid #f0f0f0">${new Date(o.date).toLocaleDateString()}</td></tr>`).join('') || '<tr><td colspan="5" style="padding:20px;text-align:center;color:#999">No orders yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <!-- Products -->
        <div id="section-products" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 style="font-size:16px;font-weight:700">My Products (${totalProducts})</h3>
            <button class="btn btn-primary btn-sm" id="showAddProduct">+ Add Product</button>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <table style="width:100%;border-collapse:collapse">
              <thead><tr><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Product</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Price</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Stock</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Sold</th><th style="text-align:left;padding:8px;font-size:12px;color:#999;border-bottom:1px solid #e0e0e0">Actions</th></tr></thead>
              <tbody>${[...sellerProducts, ...PRODUCTS.filter(p => p.seller === store?.name)].map(p => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><strong>${p.name}</strong><br><span style="font-size:11px;color:#999">${p.category}</span></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${formatPrice(p.price)}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0"><span style="color:${p.stock < 10 ? '#dc3545' : '#28a745'}">${p.stock}</span></td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${p.sold}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><button class="btn btn-sm btn-outline edit-product" data-id="${p.id}">Edit</button> <button class="btn btn-sm btn-outline delete-product" data-id="${p.id}" style="color:#dc3545">Delete</button></td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>

        <!-- Orders -->
        <div id="section-orders" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Order Management</h3>
          <div style="display:flex;gap:8px;margin-bottom:16px">
            <button class="btn btn-sm btn-outline order-filter active" data-status="">All</button>
            <button class="btn btn-sm btn-outline order-filter" data-status="pending">Pending</button>
            <button class="btn btn-sm btn-outline order-filter" data-status="processing">Processing</button>
            <button class="btn btn-sm btn-outline order-filter" data-status="shipped">Shipped</button>
            <button class="btn btn-sm btn-outline order-filter" data-status="completed">Completed</button>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)" id="ordersTable"></div>
        </div>

        <!-- Chat -->
        <div id="section-chat" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">💬 Customer Messages</h3>
          <div style="display:grid;grid-template-columns:300px 1fr;gap:0;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;min-height:400px">
            <div style="border-right:1px solid #e0e0e0;overflow-y:auto" id="sellerConvList">
              ${conversations.map(c => `<div class="seller-conv-item" data-buyer="${c.buyerId}" data-product="${c.productId}" style="padding:12px;border-bottom:1px solid #f0f0f0;cursor:pointer"><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">${c.buyerName}</strong><span style="font-size:11px;color:#999">${new Date(c.lastDate).toLocaleDateString()}</span></div><div style="font-size:12px;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.lastMessage}</div>${c.unread > 0 ? `<span style="background:#ee4d2d;color:#fff;font-size:10px;padding:2px 6px;border-radius:10px">${c.unread} new</span>` : ''}</div>`).join('') || '<div style="padding:40px;text-align:center;color:#999">No messages</div>'}
            </div>
            <div style="display:flex;flex-direction:column" id="sellerChatArea">
              <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#999" id="sellerChatPlaceholder"><div style="text-align:center"><div style="font-size:48px">💬</div><p>Select a conversation</p></div></div>
              <div id="sellerChatContent" style="display:none;flex:1;display:flex;flex-direction:column">
                <div style="padding:12px;border-bottom:1px solid #e0e0e0" id="sellerChatHeader"></div>
                <div style="flex:1;overflow-y:auto;padding:16px" id="sellerChatMessages"></div>
                <div style="padding:12px;border-top:1px solid #e0e0e0;display:flex;gap:8px">
                  <input type="text" class="form-control" id="sellerChatInput" placeholder="Reply to customer..." style="flex:1">
                  <button class="btn btn-primary" id="sellerChatSend">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div id="section-reviews" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Customer Reviews</h3>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            ${reviews.filter(r => sellerProductIds.includes(r.productId)).map(r => {
              const product = PRODUCTS.find(p => p.id === r.productId) || sellerProducts.find((p: any) => p.id === r.productId)
              return `<div style="padding:12px 0;border-bottom:1px solid #f0f0f0"><div style="display:flex;gap:12px;align-items:center;margin-bottom:8px"><div style="width:32px;height:32px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-weight:600">${r.userName[0]}</div><div><strong>${r.userName}</strong> · <span style="color:#ffc107">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span> · <span style="font-size:11px;color:#999">${new Date(r.date).toLocaleDateString()}</span></div></div><p style="font-size:13px;color:#666;margin-left:44px">${r.text}</p>${r.sellerReply ? `<div style="margin:8px 0 0 44px;padding:8px 12px;background:#f0f8ff;border-radius:6px;font-size:12px"><strong>🏪 Your Reply:</strong> ${r.sellerReply}</div>` : `<div style="margin:8px 0 0 44px;display:flex;gap:8px"><input type="text" class="form-control reply-input" data-id="${r.id}" placeholder="Reply to review..." style="padding:6px 10px;font-size:12px;flex:1"><button class="btn btn-sm btn-outline reply-btn" data-id="${r.id}">Reply</button></div>`}</div>`
            }).join('') || '<p style="color:#999;text-align:center;padding:20px">No reviews yet</p>'}
          </div>
        </div>

        <!-- Analytics -->
        <div id="section-analytics" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📈 Analytics</h3>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${sellerOrders.length ? (totalRevenue / sellerOrders.length).toFixed(2) : '0.00'}</div><div style="font-size:12px;color:#999">Avg Order Value</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${totalProducts}</div><div style="font-size:12px;color:#999">Total Products</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">${reviews.length ? (reviews.filter(r => sellerProductIds.includes(r.productId)).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => sellerProductIds.includes(r.productId)).length).toFixed(1) : '0.0'}</div><div style="font-size:12px;color:#999">Avg Rating</div></div>
            <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><div style="font-size:20px;font-weight:700">3.2%</div><div style="font-size:12px;color:#999">Conversion Rate</div></div>
          </div>
          <div style="background:#fff;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <h4 style="font-size:14px;font-weight:700;margin-bottom:12px">Revenue by Category</h4>
            ${Object.entries(sellerOrders.reduce((acc: any, o) => { o.items.filter(i => sellerProductIds.includes(i.id)).forEach(i => { const p = PRODUCTS.find(pr => pr.id === i.id) || sellerProducts.find((pr: any) => pr.id === i.id); const cat = p?.category || 'Other'; acc[cat] = (acc[cat] || 0) + i.price * i.qty }); return acc }, {})).map(([cat, val]) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px"><span>${cat}</span><strong>${formatPrice(val as number)}</strong></div>`).join('') || '<p style="color:#999">No data</p>'}
          </div>
        </div>

        <!-- Store Settings -->
        <div id="section-store" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">🏪 Store Settings</h3>
          <div style="background:#fff;border-radius:8px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <div class="form-group"><label>Store Name</label><input type="text" class="form-control" id="storeName" value="${store?.name || ''}"></div>
            <div class="form-group"><label>Category</label><select class="form-control" id="storeCategory">${CATEGORIES.map(c => `<option ${store?.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Description</label><textarea class="form-control" id="storeDesc" rows="3">${store?.description || ''}</textarea></div>
            <div class="form-group"><label>Location</label><input type="text" class="form-control" id="storeLocation" value="${store?.location || ''}"></div>
            <div class="form-group"><label>Return Policy</label><textarea class="form-control" id="storeReturnPolicy" rows="2">${store?.returnPolicy || ''}</textarea></div>
            <div class="form-group"><label>Shipping Policy</label><textarea class="form-control" id="storeShippingPolicy" rows="2">${store?.shippingPolicy || ''}</textarea></div>
            <div class="form-group"><label>Banner Color</label><input type="color" class="form-control" id="storeBannerColor" value="${store?.bannerColor || '#667eea'}" style="height:40px;padding:4px"></div>
            <button class="btn btn-primary" id="saveStoreBtn">Save Settings</button>
          </div>
        </div>

        <!-- Add Product -->
        <div id="section-add-product" style="display:none">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">➕ Add New Product</h3>
          <div style="background:#fff;border-radius:8px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label>Product Name *</label><input type="text" class="form-control" id="prodName"></div>
              <div class="form-group"><label>Category *</label><select class="form-control" id="prodCategory">${CATEGORIES.map(c => `<option>${c.name}</option>`).join('')}</select></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label>Brand</label><input type="text" class="form-control" id="prodBrand"></div>
              <div class="form-group"><label>SKU</label><input type="text" class="form-control" id="prodSKU"></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
              <div class="form-group"><label>Price ($) *</label><input type="number" class="form-control" id="prodPrice" step="0.01"></div>
              <div class="form-group"><label>Original Price ($)</label><input type="number" class="form-control" id="prodOrigPrice" step="0.01"></div>
              <div class="form-group"><label>Stock</label><input type="number" class="form-control" id="prodStock" value="100"></div>
            </div>
            <div class="form-group"><label>Description</label><textarea class="form-control" id="prodDesc" rows="3"></textarea></div>
            <div class="form-group"><label>Image URLs (one per line)</label><textarea class="form-control" id="prodImages" rows="3" placeholder="https://example.com/image1.jpg"></textarea></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label>Specs</label><input type="text" class="form-control" id="prodSpecs" placeholder="Material: Cotton | Size: M"></div>
              <div class="form-group"><label>Colors (hex, comma)</label><input type="text" class="form-control" id="prodColors" placeholder="#000,#fff"></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label>Weight</label><input type="text" class="form-control" id="prodWeight" placeholder="250g"></div>
              <div class="form-group"><label>Free Shipping</label><select class="form-control" id="prodFreeShip"><option value="false">No</option><option value="true">Yes</option></select></div>
            </div>
            <button class="btn btn-primary btn-lg" id="saveProductBtn" style="margin-top:8px">💾 Save Product</button>
          </div>
        </div>
      </main>
    </div>
  `

  renderPage(container)

  // Section navigation
  container.querySelectorAll('.seller-nav').forEach(nav => {
    nav.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.seller-nav').forEach(n => n.classList.remove('active')); this.classList.add('active')
      const section = this.dataset.section!
      container.querySelectorAll('[id^="section-"]').forEach(s => (s as HTMLElement).style.display = 'none')
      ;(container.querySelector(`#section-${section}`) as HTMLElement).style.display = 'block'
      const titles: Record<string, string> = { dashboard: 'Seller Dashboard', products: 'My Products', orders: 'Order Management', chat: 'Customer Messages', reviews: 'Customer Reviews', analytics: 'Analytics', 'store': 'Store Settings', 'add-product': 'Add Product' }
      container.querySelector('#sectionTitle')!.textContent = titles[section] || 'Dashboard'
    })
  })

  // Orders filter
  container.querySelectorAll('.order-filter').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.order-filter').forEach(b => b.classList.remove('active')); this.classList.add('active')
      const status = this.dataset.status!
      const filtered = status ? sellerOrders.filter(o => o.status === status) : sellerOrders
      container.querySelector('#ordersTable')!.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px;font-size:12px;color:#999">Order</th><th style="text-align:left;padding:8px;font-size:12px;color:#999">Customer</th><th style="text-align:left;padding:8px;font-size:12px;color:#999">Items</th><th style="text-align:left;padding:8px;font-size:12px;color:#999">Total</th><th style="text-align:left;padding:8px;font-size:12px;color:#999">Status</th><th style="text-align:left;padding:8px;font-size:12px;color:#999">Actions</th></tr></thead><tbody>${filtered.map(o => `<tr><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.id}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.user}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${o.items.length}</td><td style="padding:8px;font-size:13px;border-bottom:1px solid #f0f0f0">${formatPrice(o.total)}</td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><select class="form-control status-select" data-id="${o.id}" style="width:auto;padding:4px 8px;font-size:12px">${['pending','processing','shipped','delivered','completed','cancelled'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td style="padding:8px;border-bottom:1px solid #f0f0f0"><a href="/track-order?id=${o.id}" class="btn btn-sm btn-outline">View</a></td></tr>`).join('') || '<tr><td colspan="6" style="padding:20px;text-align:center;color:#999">No orders</td></tr>'}</tbody></table>`

      // Status change
      container.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', function(this: HTMLSelectElement) {
          const orderId = this.dataset.id!
          const newStatus = this.value
          const orders = getOrders()
          const order = orders.find(o => o.id === orderId)
          if (order) { order.status = newStatus as any; localStorage.setItem('am_orders', JSON.stringify(orders)); showToast(`Order ${orderId} → ${newStatus}`); addNotification('order', 'Order Updated', `Order ${orderId} status changed to ${newStatus}`, `/track-order?id=${orderId}`) }
        })
      })
    })
  })

  // Chat
  container.querySelectorAll('.seller-conv-item').forEach(item => {
    item.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.seller-conv-item').forEach(i => (i as HTMLElement).style.background = '')
      this.style.background = '#f5f5f5'
      const buyerId = Number(this.dataset.buyer)
      const productId = Number(this.dataset.product)
      const msgs = getConversation(buyerId, productId)
      markMessagesRead(buyerId, productId)
      const product = PRODUCTS.find(p => p.id === productId);
      (container.querySelector('#sellerChatPlaceholder') as HTMLElement).style.display = 'none'
      const chatContent = container.querySelector('#sellerChatContent') as HTMLElement
      (chatContent as HTMLElement).style.display = 'flex'
      container.querySelector('#sellerChatHeader')!.innerHTML = `<strong>${msgs[0]?.buyerName || 'Customer'}</strong> · ${product?.name || 'Product'}`
      container.querySelector('#sellerChatMessages')!.innerHTML = msgs.map(m => `<div style="display:flex;justify-content:${m.from === 'seller' ? 'flex-end' : 'flex-start'};margin-bottom:8px"><div style="max-width:70%;padding:8px 12px;border-radius:12px;font-size:13px;${m.from === 'seller' ? 'background:#ee4d2d;color:#fff' : 'background:#f0f0f0'}">${m.text}<div style="font-size:10px;opacity:0.7;margin-top:4px;text-align:right">${new Date(m.date).toLocaleTimeString()}</div></div></div>`).join('')
      const chatMessages = container.querySelector('#sellerChatMessages')!
      chatMessages.scrollTop = chatMessages.scrollHeight

      const chatInput = container.querySelector('#sellerChatInput') as HTMLInputElement
      const sendBtn = container.querySelector('#sellerChatSend')!
      const sendReply = () => {
        const text = chatInput.value.trim(); if (!text) return
        const allMsgs = getMessages()
        allMsgs.push({ id: Date.now(), from: 'seller', buyerName: msgs[0]?.buyerName || '', buyerId, productId, productName: product?.name || '', text, date: new Date().toISOString(), read: true })
        localStorage.setItem('am_messages', JSON.stringify(allMsgs))
        chatInput.value = ''
        // Refresh chat
        const updatedMsgs = getConversation(buyerId, productId)
        container.querySelector('#sellerChatMessages')!.innerHTML = updatedMsgs.map(m => `<div style="display:flex;justify-content:${m.from === 'seller' ? 'flex-end' : 'flex-start'};margin-bottom:8px"><div style="max-width:70%;padding:8px 12px;border-radius:12px;font-size:13px;${m.from === 'seller' ? 'background:#ee4d2d;color:#fff' : 'background:#f0f0f0'}">${m.text}<div style="font-size:10px;opacity:0.7;margin-top:4px;text-align:right">${new Date(m.date).toLocaleTimeString()}</div></div></div>`).join('')
        container.querySelector('#sellerChatMessages')!.scrollTop = container.querySelector('#sellerChatMessages')!.scrollHeight
      }
      (sendBtn as HTMLElement).onclick = sendReply
      const chatInputEl = chatInput as HTMLInputElement; chatInputEl.onkeydown = (e: KeyboardEvent) => { if (e.key === 'Enter') sendReply() }
    })
  })

  // Review reply
  container.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      const reviewId = Number(this.dataset.id)
      const input = container.querySelector(`.reply-input[data-id="${reviewId}"]`) as HTMLInputElement
      const text = input.value.trim(); if (!text) return
      const allReviews = getReviews()
      const review = allReviews.find(r => r.id === reviewId)
      if (review) { review.sellerReply = text; review.sellerReplyDate = new Date().toISOString(); localStorage.setItem('am_reviews', JSON.stringify(allReviews)); showToast('Reply sent!'); setTimeout(() => location.reload(), 500) }
    })
  })

  // Save store settings
  container.querySelector('#saveStoreBtn')?.addEventListener('click', () => {
    const storeData = {
      name: (container.querySelector('#storeName') as HTMLInputElement).value,
      category: (container.querySelector('#storeCategory') as HTMLSelectElement).value,
      description: (container.querySelector('#storeDesc') as HTMLTextAreaElement).value,
      location: (container.querySelector('#storeLocation') as HTMLInputElement).value,
      returnPolicy: (container.querySelector('#storeReturnPolicy') as HTMLTextAreaElement).value,
      shippingPolicy: (container.querySelector('#storeShippingPolicy') as HTMLTextAreaElement).value,
      bannerColor: (container.querySelector('#storeBannerColor') as HTMLInputElement).value
    }
    saveSellerStore({ ...store, ...storeData })
    showToast('Store settings saved!')
  })

  // Save product
  container.querySelector('#saveProductBtn')?.addEventListener('click', () => {
    const name = (container.querySelector('#prodName') as HTMLInputElement).value.trim()
    const price = parseFloat((container.querySelector('#prodPrice') as HTMLInputElement).value)
    if (!name || !price) { showToast('Name and price required', 'error'); return }
    const images = (container.querySelector('#prodImages') as HTMLTextAreaElement).value.split('\n').map(u => u.trim()).filter(u => u.startsWith('http'))
    const product = {
      id: Date.now(), name, price,
      originalPrice: parseFloat((container.querySelector('#prodOrigPrice') as HTMLInputElement).value) || price * 1.5,
      category: (container.querySelector('#prodCategory') as HTMLSelectElement).value,
      brand: (container.querySelector('#prodBrand') as HTMLInputElement).value || name.split(' ')[0],
      sku: (container.querySelector('#prodSKU') as HTMLInputElement).value,
      stock: parseInt((container.querySelector('#prodStock') as HTMLInputElement).value) || 100,
      description: (container.querySelector('#prodDesc') as HTMLTextAreaElement).value || name,
      specs: (container.querySelector('#prodSpecs') as HTMLInputElement).value || '',
      colors: (container.querySelector('#prodColors') as HTMLInputElement).value.split(',').filter(c => c.trim()),
      images: images.length ? images : [`https://picsum.photos/seed/product${Date.now()}/600/600`],
      weight: (container.querySelector('#prodWeight') as HTMLInputElement).value || '',
      freeShipping: (container.querySelector('#prodFreeShip') as HTMLSelectElement).value === 'true',
      seller: store?.name || user.name,
      sellerId: store?.id || user.id,
      rating: 4.5, sold: 0, location: store?.location || ''
    }
    saveSellerProduct(product)
    showToast('Product added!')
    setTimeout(() => location.reload(), 500)
  })

  // Show add product section
  container.querySelector('#showAddProduct')?.addEventListener('click', () => {
    container.querySelectorAll('.seller-nav').forEach(n => n.classList.remove('active'))
    container.querySelector('[data-section="add-product"]')?.classList.add('active')
    container.querySelectorAll('[id^="section-"]').forEach(s => (s as HTMLElement).style.display = 'none')
    ;(container.querySelector('#section-add-product') as HTMLElement).style.display = 'block'
    container.querySelector('#sectionTitle')!.textContent = 'Add Product'
  })

  // Delete product
  container.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      if (confirm('Delete this product?')) { deleteSellerProduct(Number(this.dataset.id)); showToast('Product deleted'); setTimeout(() => location.reload(), 500) }
    })
  })

  // Init orders table
  container.querySelector('.order-filter[data-status=""]')?.dispatchEvent(new Event('click'))
}
