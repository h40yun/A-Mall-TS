// ==================== MESSAGES / LIVECHAT PAGE ====================
import { getCurrentUser, isLoggedIn, getConversations, getConversation, sendMessage, markMessagesRead, showToast, formatPrice } from '../utils/helpers'
import { PRODUCTS } from '../utils/data'
import { renderPage, renderEmptyState } from '../components'
import { navigate, getParam } from '../router'

export function renderMessagesPage(): void {
  if (!isLoggedIn()) { navigate('/auth'); return }
  const user = getCurrentUser()!
  const conversations = getConversations()
  const container = document.createElement('div')

  container.innerHTML = `
    <div class="section">
      <div class="breadcrumb"><a href="/">Home</a> / <span>Messages</span></div>
      <div style="display:grid;grid-template-columns:320px 1fr;gap:0;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;min-height:500px">
        <!-- Conversation List -->
        <div style="border-right:1px solid #e0e0e0;overflow-y:auto" id="convList">
          <div style="padding:16px;border-bottom:1px solid #e0e0e0"><h3 style="font-size:16px;font-weight:700">💬 Messages</h3></div>
          ${conversations.length ? conversations.map(conv => `
            <div class="conv-item ${conv.unread > 0 ? 'unread' : ''}" data-buyer="${conv.buyerId}" data-product="${conv.productId}" style="padding:12px 16px;border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background 0.2s">
              <div style="display:flex;gap:10px;align-items:center">
                <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#ee4d2d,#f97316);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">S</div>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;justify-content:space-between">
                    <strong style="font-size:13px">${conv.productName || 'General'}</strong>
                    <span style="font-size:11px;color:#999">${new Date(conv.lastDate).toLocaleDateString()}</span>
                  </div>
                  <div style="font-size:12px;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${conv.lastMessage}</div>
                </div>
                ${conv.unread > 0 ? `<span style="background:#ee4d2d;color:#fff;font-size:10px;min-width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center">${conv.unread}</span>` : ''}
              </div>
            </div>
          `).join('') : '<div style="padding:40px;text-align:center;color:#999">No conversations yet</div>'}
        </div>
        <!-- Chat Area -->
        <div style="display:flex;flex-direction:column" id="chatArea">
          <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#999" id="chatPlaceholder">
            <div style="text-align:center"><div style="font-size:48px;margin-bottom:12px">💬</div><p>Select a conversation or start a new one from a product page</p></div>
          </div>
          <div id="chatContent" style="display:none;flex:1;display:flex;flex-direction:column">
            <div style="padding:12px 16px;border-bottom:1px solid #e0e0e0;display:flex;align-items:center;gap:12px" id="chatHeader"></div>
            <div style="flex:1;overflow-y:auto;padding:16px" id="chatMessages"></div>
            <div style="padding:12px 16px;border-top:1px solid #e0e0e0;display:flex;gap:8px">
              <input type="text" class="form-control" id="chatInput" placeholder="Type a message..." style="flex:1">
              <button class="btn btn-primary" id="chatSendBtn">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  renderPage(container)

  // Click on conversation
  container.querySelectorAll('.conv-item').forEach(item => {
    item.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.conv-item').forEach(i => (i as HTMLElement).style.background = '')
      this.style.background = '#f5f5f5'
      const buyerId = Number(this.dataset.buyer)
      const productId = Number(this.dataset.product)
      openChat(buyerId, productId)
    })
  })

  function openChat(buyerId: number, productId: number) {
    const product = PRODUCTS.find(p => p.id === productId)
    const msgs = getConversation(buyerId, productId)
    markMessagesRead(buyerId, productId)

    const chatPlaceholder = container.querySelector('#chatPlaceholder')!
    const chatContent = container.querySelector('#chatContent') as HTMLElement
    (chatPlaceholder as HTMLElement).style.display = 'none'
    chatContent.style.display = 'flex'

    // Header
    container.querySelector('#chatHeader')!.innerHTML = `
      <div style="width:36px;height:36px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-weight:700">${product?.name?.[0] || 'S'}</div>
      <div>
        <strong style="font-size:14px">${product?.name || 'Product'}</strong>
        <div style="font-size:11px;color:#999">${product ? formatPrice(product.price) : ''}</div>
      </div>
    `

    // Messages
    const messagesEl = container.querySelector('#chatMessages')!
    messagesEl.innerHTML = msgs.map(m => `
      <div style="display:flex;justify-content:${m.from === 'buyer' ? 'flex-end' : 'flex-start'};margin-bottom:12px">
        <div style="max-width:70%;padding:10px 14px;border-radius:12px;font-size:13px;${m.from === 'buyer' ? 'background:#ee4d2d;color:#fff;border-bottom-right-radius:4px' : 'background:#f0f0f0;color:#333;border-bottom-left-radius:4px'}">
          <div>${m.text}</div>
          <div style="font-size:10px;opacity:0.7;margin-top:4px;text-align:right">${new Date(m.date).toLocaleTimeString()}</div>
        </div>
      </div>
    `).join('') || '<div style="text-align:center;color:#999;padding:40px">Start the conversation!</div>'
    messagesEl.scrollTop = messagesEl.scrollHeight

    // Send
    const chatInput = container.querySelector('#chatInput') as HTMLInputElement
    const sendBtn = container.querySelector('#chatSendBtn')!
    const sendMsg = () => {
      const text = chatInput.value.trim()
      if (!text) return
      sendMessage(String(buyerId), user.name, productId, product?.name || '', text)
      chatInput.value = ''
      openChat(buyerId, productId) // Refresh
    }
    const sendEl = sendBtn as HTMLElement; sendEl.onclick = sendMsg
    const inputEl = chatInput as HTMLInputElement; inputEl.onkeypress = (e: KeyboardEvent) => { if (e.key === 'Enter') sendMsg() }
  }

  // Auto-open if product ID in URL
  const urlProduct = getParam('product')
  if (urlProduct) {
    const pid = Number(urlProduct)
    const product = PRODUCTS.find(p => p.id === pid)
    if (product) {
      sendMessage(String(user.id), user.name, pid, product.name, `Hi! I'm interested in ${product.name}`)
      openChat(Number(user.id), pid)
    }
  }
}
