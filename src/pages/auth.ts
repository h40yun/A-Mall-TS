// ==================== AUTH PAGE ====================
import { login, register, getCurrentUser, showToast } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'

export function renderAuthPage(): void {
  if (getCurrentUser()) { navigate('/'); return }

  const container = document.createElement('div')
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-logo">
          <h1>ALLIANCE MALL TK</h1>
          <p>Your trusted online marketplace</p>
        </div>
        <div class="auth-card">
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Login</button>
            <button class="auth-tab" data-tab="register">Register</button>
          </div>
          <div class="auth-form" id="loginForm">
            <div class="form-group"><label>Email Address</label><input type="email" class="form-control" id="loginEmail" placeholder="Enter your email"></div>
            <div class="form-group"><label>Password</label><input type="password" class="form-control" id="loginPassword" placeholder="Enter your password"></div>
            <div class="forgot-link"><a href="#" id="forgotPasswordLink">Forgot Password?</a></div>
            <button class="btn btn-primary" id="loginBtn">Login</button>
            <div class="auth-divider"><span>or continue with</span></div>
            <div class="social-buttons">
              <button class="social-btn" id="googleLoginBtn">🔵 Google</button>
              <button class="social-btn" id="facebookLoginBtn">⬛ Facebook</button>
            </div>
          </div>
          <!-- Forgot Password Form -->
          <div class="auth-form" id="forgotForm" style="display:none">
            <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">Reset Password</h3>
            <p style="font-size:13px;color:#666;margin-bottom:16px">Enter your email and we'll send you a reset link.</p>
            <div class="form-group"><label>Email Address</label><input type="email" class="form-control" id="forgotEmail" placeholder="Enter your email"></div>
            <button class="btn btn-primary" id="forgotBtn" style="margin-bottom:12px">Send Reset Link</button>
            <button class="btn btn-outline" id="backToLoginBtn" style="width:100%">Back to Login</button>
          </div>
          <!-- Reset Password Form -->
          <div class="auth-form" id="resetForm" style="display:none">
            <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">Set New Password</h3>
            <div class="form-group"><label>New Password</label><input type="password" class="form-control" id="newPassword" placeholder="New password (min 6 chars)"></div>
            <div class="form-group"><label>Confirm Password</label><input type="password" class="form-control" id="confirmNewPassword" placeholder="Confirm new password"></div>
            <button class="btn btn-primary" id="resetPasswordBtn">Reset Password</button>
          </div>
          <div class="auth-form" id="registerForm" style="display:none">
            <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="regName" placeholder="Enter your full name"></div>
            <div class="form-group"><label>Email Address</label><input type="email" class="form-control" id="regEmail" placeholder="Enter your email"></div>
            <div class="form-group"><label>Password</label><input type="password" class="form-control" id="regPassword" placeholder="Create a password (min 6 chars)"></div>
            <div class="form-group"><label>Confirm Password</label><input type="password" class="form-control" id="regConfirm" placeholder="Confirm your password"></div>
            <button class="btn btn-primary" id="registerBtn">Create Account</button>
          </div>
        </div>
      </div>
    </div>
  `

  renderPage(container)

  // Tab switching
  container.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function(this: HTMLElement) {
      container.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
      this.classList.add('active')
      const tabName: string = this.dataset.tab || 'login'
      const loginForm = container.querySelector('#loginForm') as HTMLElement
      const registerForm = container.querySelector('#registerForm') as HTMLElement
      loginForm.style.display = tabName === 'login' ? 'block' : 'none'
      registerForm.style.display = tabName === 'register' ? 'block' : 'none'
    })
  })

  // Login
  container.querySelector('#loginBtn')?.addEventListener('click', () => {
    const email = (container.querySelector('#loginEmail') as HTMLInputElement).value.trim()
    const password = (container.querySelector('#loginPassword') as HTMLInputElement).value
    if (!email || !password) { showToast('Please fill in all fields', 'error'); return }
    const result = login(email, password)
    if (result.success) {
      showToast('Welcome back, ' + result.user!.name + '!')
      setTimeout(() => navigate('/'), 500)
    } else {
      showToast(result.message!, 'error')
    }
  })

  // Register
  container.querySelector('#registerBtn')?.addEventListener('click', () => {
    const name = (container.querySelector('#regName') as HTMLInputElement).value.trim()
    const email = (container.querySelector('#regEmail') as HTMLInputElement).value.trim()
    const password = (container.querySelector('#regPassword') as HTMLInputElement).value
    const confirm = (container.querySelector('#regConfirm') as HTMLInputElement).value
    if (!name || !email || !password) { showToast('Please fill in all fields', 'error'); return }
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return }
    if (password !== confirm) { showToast('Passwords do not match', 'error'); return }
    const result = register(name, email, password)
    if (result.success) {
      showToast('Account created! Welcome, ' + result.user!.name + '!')
      setTimeout(() => navigate('/'), 500)
    } else {
      showToast(result.message!, 'error')
    }
  })

  // Forgot Password
  const showForm = (formId: string) => {
    ;(container.querySelector('#loginForm') as HTMLElement).style.display = 'none'
    ;(container.querySelector('#registerForm') as HTMLElement).style.display = 'none'
    ;(container.querySelector('#forgotForm') as HTMLElement).style.display = 'none'
    ;(container.querySelector('#resetForm') as HTMLElement).style.display = 'none'
    ;(container.querySelector(formId) as HTMLElement).style.display = 'block'
    container.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
  }

  container.querySelector('#forgotPasswordLink')?.addEventListener('click', (e) => { e.preventDefault(); showForm('#forgotForm') })
  container.querySelector('#backToLoginBtn')?.addEventListener('click', () => { showForm('#loginForm'); container.querySelector('.auth-tab[data-tab="login"]')?.classList.add('active') })

  container.querySelector('#forgotBtn')?.addEventListener('click', () => {
    const email = (container.querySelector('#forgotEmail') as HTMLInputElement).value.trim()
    if (!email) { showToast('Enter your email', 'error'); return }
    const users = JSON.parse(localStorage.getItem('am_users') || '[]')
    const user = users.find((u: any) => u.email === email)
    if (!user) { showToast('Email not found', 'error'); return }
    const token = 'rst_' + Date.now().toString(36)
    localStorage.setItem('am_reset_token', JSON.stringify({ token, email, expires: Date.now() + 3600000 }))
    showToast('Reset link sent! (Token: ' + token + ')')
    showForm('#resetForm')
  })

  container.querySelector('#resetPasswordBtn')?.addEventListener('click', () => {
    const newPass = (container.querySelector('#newPassword') as HTMLInputElement).value
    const confirmPass = (container.querySelector('#confirmNewPassword') as HTMLInputElement).value
    if (!newPass || newPass.length < 6) { showToast('Password must be at least 6 characters', 'error'); return }
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return }
    const resetData = JSON.parse(localStorage.getItem('am_reset_token') || 'null')
    if (!resetData || resetData.expires < Date.now()) { showToast('Reset token expired', 'error'); return }
    const users = JSON.parse(localStorage.getItem('am_users') || '[]')
    const user = users.find((u: any) => u.email === resetData.email)
    if (user) { user.password = newPass; localStorage.setItem('am_users', JSON.stringify(users)); showToast('Password reset successful!') }
    localStorage.removeItem('am_reset_token')
    showForm('#loginForm'); container.querySelector('.auth-tab[data-tab="login"]')?.classList.add('active')
  })

  // Google/Facebook OAuth Simulation
  const oauthLogin = (provider: string) => {
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000'
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:32px;max-width:380px;width:90%;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">${provider === 'Google' ? '🔵' : '⬛'}</div>
        <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">Sign in with ${provider}</h3>
        <p style="font-size:13px;color:#666;margin-bottom:20px">This is a simulation. Enter your details to continue.</p>
        <div class="form-group"><input type="text" class="form-control" id="oauthName" placeholder="Your Name"></div>
        <div class="form-group"><input type="email" class="form-control" id="oauthEmail" placeholder="Your Email"></div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-primary" id="oauthConfirmBtn" style="flex:1">Continue</button>
          <button class="btn btn-outline" id="oauthCancelBtn" style="flex:1">Cancel</button>
        </div>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('#oauthCancelBtn')?.addEventListener('click', () => overlay.remove())
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    overlay.querySelector('#oauthConfirmBtn')?.addEventListener('click', () => {
      const name = (overlay.querySelector('#oauthName') as HTMLInputElement).value.trim()
      const email = (overlay.querySelector('#oauthEmail') as HTMLInputElement).value.trim()
      if (!name || !email) { showToast('Fill in all fields', 'error'); return }
      const result = register(name, email, 'oauth_' + Date.now())
      if (result.success) {
        showToast('Welcome, ' + name + '! (via ' + provider + ')')
        overlay.remove()
        setTimeout(() => navigate('/'), 500)
      } else {
        // Already registered, try login
        const users = JSON.parse(localStorage.getItem('am_users') || '[]')
        const user = users.find((u: any) => u.email === email)
        if (user) { localStorage.setItem('am_current_user', JSON.stringify(user)); showToast('Welcome back, ' + user.name + '!'); overlay.remove(); setTimeout(() => navigate('/'), 500) }
        else showToast(result.message!, 'error')
      }
    })
  }
  container.querySelector('#googleLoginBtn')?.addEventListener('click', () => oauthLogin('Google'))
  container.querySelector('#facebookLoginBtn')?.addEventListener('click', () => oauthLogin('Facebook'))
}
