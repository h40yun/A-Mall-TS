// @ts-nocheck - Migrating to Supabase
// ==================== ORDER TRACKING PAGE ====================
import { getOrders, formatPrice, getOrderById, getUrlParam, showToast } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate, getParam } from '../router'

export function renderTrackOrderPage(): void {
  const orderId = getParam('id') || getUrlParam('id')
  const container = document.createElement('div')
  container.className = 'section'

  if (orderId) {
    const order = getOrderById(orderId)
    if (!order) {
      container.innerHTML = `
        <div class="breadcrumb"><a href="/">Home</a> / <a href="/track-order">Track Order</a> / <span>Not Found</span></div>
        <div class="empty-state"><div class="icon">❌</div><h3>Order not found</h3><p>Please check your order ID</p><a href="/track-order" class="btn btn-primary">Try Again</a></div>
      `
      renderPage(container)
      return
    }

    const statusSteps = ['pending', 'processing', 'shipped', 'delivered', 'completed']
    const currentStep = statusSteps.indexOf(order.status)

    container.innerHTML = `
      <div class="breadcrumb"><a href="/">Home</a> / <a href="/track-order">Track Order</a> / <span>${order.id}</span></div>
      <div style="max-width:800px;margin:0 auto">
        <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:32px;margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
            <div>
              <h1 style="font-size:22px;font-weight:700">Order ${order.id}</h1>
              <p style="font-size:13px;color:#999">Placed on ${new Date(order.date).toLocaleDateString()}</p>
            </div>
            <span class="status-badge status-${order.status}" style="font-size:14px;padding:8px 16px">${order.status.toUpperCase()}</span>
          </div>

          ${order.trackingNumber ? `
            <div style="background:#f8f8f8;border-radius:8px;padding:12px 16px;margin-bottom:24px">
              <span style="font-size:13px;color:#666">Tracking Number: </span>
              <strong style="font-size:14px">${order.trackingNumber}</strong>
            </div>
          ` : ''}

          <!-- Progress Bar -->
          <div style="display:flex;justify-content:space-between;margin-bottom:32px;position:relative">
            <div style="position:absolute;top:16px;left:0;right:0;height:4px;background:#e0e0e0;z-index:0"></div>
            <div style="position:absolute;top:16px;left:0;width:${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%;height:4px;background:#ee4d2d;z-index:1;transition:width 0.5s"></div>
            ${statusSteps.map((step, i) => `
              <div style="text-align:center;position:relative;z-index:2;flex:1">
                <div style="width:32px;height:32px;border-radius:50%;background:${i <= currentStep ? '#ee4d2d' : '#e0e0e0'};color:${i <= currentStep ? '#fff' : '#999'};display:flex;align-items:center;justify-content:center;margin:0 auto 8px;font-size:14px;font-weight:700">${i <= currentStep ? '✓' : i + 1}</div>
                <div style="font-size:11px;color:${i <= currentStep ? '#ee4d2d' : '#999'};text-transform:capitalize">${step}</div>
              </div>
            `).join('')}
          </div>

          <!-- Tracking History -->
          ${order.trackingHistory?.length ? `
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Tracking History</h3>
            <div style="border-left:2px solid #e0e0e0;margin-left:16px;padding-left:24px">
              ${order.trackingHistory.map(event => `
                <div style="margin-bottom:16px;position:relative">
                  <div style="position:absolute;left:-30px;top:4px;width:12px;height:12px;border-radius:50%;background:#ee4d2d;border:2px solid #fff"></div>
                  <div style="font-size:14px;font-weight:600">${event.status}</div>
                  <div style="font-size:12px;color:#999">${new Date(event.timestamp).toLocaleString()} · ${event.location}</div>
                  <div style="font-size:13px;color:#666;margin-top:4px">${event.description}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Order Details -->
        <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:32px">
          <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Order Details</h3>
          ${order.items.map(item => `
            <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #e0e0e0;align-items:center">
              <div style="flex:1"><strong>${item.name}</strong><br><span style="color:#999;font-size:12px">Qty: ${item.qty} × ${formatPrice(item.price)}</span></div>
              <strong>${formatPrice(item.price * item.qty)}</strong>
            </div>
          `).join('')}
          <div style="text-align:right;padding-top:16px">
            <div style="font-size:13px;color:#666">Subtotal: ${formatPrice(order.subtotal)} · Shipping: ${order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</div>
            ${order.discount ? `<div style="font-size:13px;color:#28a745">Discount: -${formatPrice(order.discount)}</div>` : ''}
            <div style="font-size:20px;font-weight:700;color:#ee4d2d;margin-top:8px">Total: ${formatPrice(order.total)}</div>
          </div>
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:13px;color:#666">
            <div>📍 ${order.address}</div>
            <div>💳 ${order.payment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
            ${order.notes ? `<div>📝 ${order.notes}</div>` : ''}
          </div>
        </div>
      </div>
    `
  } else {
    // Show tracking form
    const orders = getOrders()
    container.innerHTML = `
      <div class="breadcrumb"><a href="/">Home</a> / <span>Track Order</span></div>
      <div style="max-width:600px;margin:0 auto">
        <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:40px;text-align:center">
          <div style="font-size:48px;margin-bottom:16px">📦</div>
          <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Track Your Order</h1>
          <p style="font-size:14px;color:#999;margin-bottom:24px">Enter your order ID to track your package</p>
          <div style="display:flex;gap:8px;max-width:400px;margin:0 auto">
            <input type="text" class="form-control" id="trackInput" placeholder="e.g. ORD-1234567890">
            <button class="btn btn-primary" id="trackBtn">Track</button>
          </div>
        </div>

        ${orders.length ? `
          <div style="margin-top:24px">
            <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Your Recent Orders</h3>
            ${orders.slice(0, 5).map(o => `
              <a href="/track-order?id=${o.id}" style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:8px;text-decoration:none;color:inherit">
                <div>
                  <strong>${o.id}</strong>
                  <span style="font-size:12px;color:#999;margin-left:8px">${new Date(o.date).toLocaleDateString()}</span>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  <span style="font-weight:700;color:#ee4d2d">${formatPrice(o.total)}</span>
                  <span class="status-badge status-${o.status}">${o.status}</span>
                </div>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `
  }

  renderPage(container)

  // Track button
  container.querySelector('#trackBtn')?.addEventListener('click', () => {
    const input = (container.querySelector('#trackInput') as HTMLInputElement).value.trim()
    if (!input) { showToast('Please enter an order ID', 'error'); return }
    navigate(`/track-order?id=${input}`)
  })

  container.querySelector('#trackInput')?.addEventListener('keypress', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') container.querySelector('#trackBtn')?.dispatchEvent(new Event('click'))
  })
}
