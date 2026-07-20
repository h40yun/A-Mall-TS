// ==================== 404 NOT FOUND PAGE ====================
import { renderPage } from '../components'

export function renderNotFoundPage(): void {
  const container = document.createElement('div')
  container.innerHTML = `
    <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:40px 20px">
      <div style="text-align:center;max-width:500px">
        <div style="font-size:120px;font-weight:800;background:linear-gradient(135deg,#ee4d2d,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1;margin-bottom:16px">404</div>
        <h1 style="font-size:28px;font-weight:700;margin-bottom:12px;color:#222">Page Not Found</h1>
        <p style="font-size:16px;color:#666;margin-bottom:32px;line-height:1.6">Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="/" class="btn btn-primary" style="padding:12px 32px">🏠 Go Home</a>
          <a href="/category" class="btn btn-outline" style="padding:12px 32px">🛍️ Browse Products</a>
          <a href="/help" class="btn btn-outline" style="padding:12px 32px">❓ Help Center</a>
        </div>
        <div style="margin-top:40px;padding:20px;background:#f8f8f8;border-radius:12px">
          <h3 style="font-size:14px;font-weight:600;margin-bottom:12px;color:#666">Popular Pages</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
            <a href="/deals" style="padding:6px 14px;background:#fff;border-radius:20px;font-size:13px;color:#ee4d2d;border:1px solid #e0e0e0">🔥 Deals</a>
            <a href="/category?cat=Electronics" style="padding:6px 14px;background:#fff;border-radius:20px;font-size:13px;color:#ee4d2d;border:1px solid #e0e0e0">📱 Electronics</a>
            <a href="/category?cat=Fashion" style="padding:6px 14px;background:#fff;border-radius:20px;font-size:13px;color:#ee4d2d;border:1px solid #e0e0e0">👗 Fashion</a>
            <a href="/stores" style="padding:6px 14px;background:#fff;border-radius:20px;font-size:13px;color:#ee4d2d;border:1px solid #e0e0e0">🏪 Stores</a>
          </div>
        </div>
      </div>
    </div>
  `
  renderPage(container)
}
