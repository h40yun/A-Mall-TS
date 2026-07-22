// @ts-nocheck - Migrating to Supabase
// ==================== CART PAGE ====================
import { ALL_PRODUCTS as PRODUCTS } from '../utils/data'
import { getCart, saveCart, formatPrice, getProductImage, getProductInitials, getProductColor, showToast, saveForLater, getSavedItems, moveToCart, removeSavedItem } from '../utils/helpers'
import { renderProductCard, renderPage, renderEmptyState } from '../components'
import { navigate } from '../router'

export function renderCartPage(): void {
  const cart = getCart()
  const savedItems = getSavedItems()
  const container = document.createElement('div')

  if (cart.length === 0 && savedItems.length === 0) {
    container.appendChild(renderEmptyState('🛒', 'Your cart is empty', 'Looks like you haven\'t added anything yet', 'Start Shopping'))
    renderPage(container)
    return
  }

  container.innerHTML = `
    <div class="breadcrumb" style="max-width:1200px;margin:0 auto;padding:16px 20px 0"><a href="/">Home</a> / <span>Shopping Cart</span></div>
    <div class="cart-page">
      <div>
        <div id="cartItems"></div>
        <div id="savedItems" style="margin-top:24px"></div>
      </div>
      <div class="cart-summary" id="cartSummary"></div>
    </div>
  `

  renderPage(container)
  renderCartItems()
  renderSavedItems()

  function renderCartItems() {
    const itemsEl = container.querySelector('#cartItems')!
    const summaryEl = container.querySelector('#cartSummary') as HTMLElement
    const currentCart = getCart()

    if (currentCart.length === 0) {
      itemsEl.innerHTML = '<div class="empty-state"><div class="icon">🛒</div><h3>Your cart is empty</h3></div>'
      summaryEl.style.display = 'none'
      return
    }

    summaryEl.style.display = 'block'
    let html = `
      <div class="select-all-bar">
        <label class="checkbox-wrap"><input type="checkbox" id="selectAll" checked> Select All (${currentCart.length} items)</label>
      </div>
    `

    let subtotal = 0
    let selectedCount = 0

    currentCart.forEach((item, index) => {
      const product = PRODUCTS.find(p => p.id === item.id)
      if (!product) return
      const isSelected = item.selected !== false
      if (isSelected) { subtotal += product.price * item.qty; selectedCount++ }

      html += `
        <div class="cart-item ${isSelected ? '' : 'unselected'}" id="cartItem-${index}">
          <label class="checkbox-wrap" style="flex-shrink:0"><input type="checkbox" class="item-checkbox" data-index="${index}" ${isSelected ? 'checked' : ''}></label>
          <div class="cart-item-img">
            <img src="${getProductImage(product)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="img-placeholder" style="display:none;background:${getProductColor(product)}">${getProductInitials(product)}</div>
          </div>
          <div class="cart-item-info">
            <h3><a href="/product/${product.id}">${product.name}</a></h3>
            <div>
              <span class="item-price">${formatPrice(product.price)}</span>
              <span class="item-original">${formatPrice(product.originalPrice)}</span>
            </div>
            ${product.colors.length ? `<div style="font-size:11px;color:#999;margin-top:4px">Color: <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${product.colors[0]};vertical-align:middle;border:1px solid #ddd"></span></div>` : ''}
          </div>
          <div class="cart-item-actions">
            <div class="qty-selector">
              <button class="qty-btn" data-action="dec">−</button>
              <input type="number" value="${item.qty}" min="1" class="qty-val">
              <button class="qty-btn" data-action="inc">+</button>
            </div>
            <div style="display:flex;gap:8px">
              <button class="action-link save-for-later" data-index="${index}">Save for Later</button>
              <button class="action-link remove-btn" data-index="${index}">Remove</button>
            </div>
          </div>
        </div>
      `
    })

    itemsEl.innerHTML = html

    // Event listeners
    const selectAllCb = itemsEl.querySelector('#selectAll') as HTMLInputElement
    selectAllCb?.addEventListener('change', () => {
      const checked = selectAllCb.checked
      itemsEl.querySelectorAll('.item-checkbox').forEach((cb) => {
        (cb as HTMLInputElement).checked = checked
      })
      updateSelection()
    })

    itemsEl.querySelectorAll('.item-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const allChecked = [...itemsEl.querySelectorAll('.item-checkbox')].every(c => (c as HTMLInputElement).checked)
        if (selectAllCb) selectAllCb.checked = allChecked
        updateSelection()
      })
    })

    itemsEl.querySelectorAll('[data-action="dec"]').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const idx = Number(this.closest('.cart-item')?.id.split('-')[1])
        updateQty(idx, currentCart[idx].qty - 1)
      })
    })

    itemsEl.querySelectorAll('[data-action="inc"]').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const idx = Number(this.closest('.cart-item')?.id.split('-')[1])
        updateQty(idx, currentCart[idx].qty + 1)
      })
    })

    itemsEl.querySelectorAll('.qty-val').forEach(input => {
      input.addEventListener('change', function(this: HTMLElement) {
        const idx = Number(this.closest('.cart-item')?.id.split('-')[1])
        updateQty(idx, Number((this as HTMLInputElement).value))
      })
    })

    itemsEl.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const idx = Number(this.dataset.index)
        removeItem(idx)
      })
    })

    itemsEl.querySelectorAll('.save-for-later').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        const idx = Number(this.dataset.index)
        const currentCart = getCart()
        const item = currentCart[idx]
        if (item) {
          saveForLater(item.id)
          currentCart.splice(idx, 1)
          saveCart(currentCart)
          renderCartItems()
          renderSavedItems()
        }
      })
    })

    updateSummary(subtotal, selectedCount)
  }

  function updateSelection() {
    const currentCart = getCart()
    const checkboxes = container.querySelectorAll('.item-checkbox')
    let subtotal = 0
    let selectedCount = 0
    checkboxes.forEach((cb, i) => {
      const checked = (cb as HTMLInputElement).checked
      currentCart[i].selected = checked
      const product = PRODUCTS.find(p => p.id === currentCart[i].id)
      if (checked && product) { subtotal += product.price * currentCart[i].qty; selectedCount++ }
      const itemEl = container.querySelector(`#cartItem-${i}`)
      if (itemEl) itemEl.classList.toggle('unselected', !checked)
    })
    saveCart(currentCart)
    updateSummary(subtotal, selectedCount)
  }

  function updateSummary(subtotal: number, count: number) {
    const summaryEl = container.querySelector('#cartSummary') as HTMLElement
    const shipping = subtotal >= 50 ? 0 : 4.99
    summaryEl.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Items (${count})</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:#28a745">FREE</span>' : formatPrice(shipping)}</span></div>
      ${subtotal < 50 ? `<p style="font-size:12px;color:#999;margin-bottom:8px">Add ${formatPrice(50 - subtotal)} more for free shipping!</p>` : ''}
      <div class="summary-row total"><span>Total</span><span>${formatPrice(subtotal + shipping)}</span></div>
      <button class="btn btn-primary btn-block btn-lg" style="margin-top:16px" id="checkoutBtn">Proceed to Checkout</button>
      <a href="/" style="display:block;text-align:center;margin-top:12px;font-size:13px;color:#ee4d2d">Continue Shopping</a>
    `
    summaryEl.querySelector('#checkoutBtn')?.addEventListener('click', () => {
      if (count === 0) { showToast('Please select at least one item', 'error'); return }
      navigate('/checkout')
    })
  }

  function renderSavedItems() {
    const saved = getSavedItems()
    const savedEl = container.querySelector('#savedItems')!
    if (saved.length === 0) { savedEl.innerHTML = ''; return }

    const products = saved.map(s => PRODUCTS.find(p => p.id === s.id)).filter(Boolean)
    savedEl.innerHTML = `
      <div style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Saved for Later (${products.length})</h3>
        ${products.map(p => `
          <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #e0e0e0;align-items:center">
            <img src="${getProductImage(p!)}" style="width:60px;height:60px;border-radius:8px;object-fit:cover" onerror="this.src='https://via.placeholder.com/60'">
            <div style="flex:1">
              <a href="/product/${p!.id}" style="font-size:13px;font-weight:600">${p!.name}</a>
              <div style="color:#ee4d2d;font-weight:700">${formatPrice(p!.price)}</div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-sm btn-primary move-to-cart" data-id="${p!.id}">Move to Cart</button>
              <button class="btn btn-sm btn-outline remove-saved" data-id="${p!.id}">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `

    savedEl.querySelectorAll('.move-to-cart').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        moveToCart(Number(this.dataset.id))
        renderCartItems()
        renderSavedItems()
      })
    })

    savedEl.querySelectorAll('.remove-saved').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        removeSavedItem(Number(this.dataset.id))
        renderSavedItems()
      })
    })
  }

  function updateQty(index: number, qty: number) {
    const currentCart = getCart()
    if (qty <= 0) { removeItem(index); return }
    currentCart[index].qty = qty
    saveCart(currentCart)
    renderCartItems()
  }

  function removeItem(index: number) {
    const currentCart = getCart()
    currentCart.splice(index, 1)
    saveCart(currentCart)
    renderCartItems()
    showToast('Item removed from cart')
  }
}
