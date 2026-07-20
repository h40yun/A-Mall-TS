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
            <div class="forgot-link"><a href="#">Forgot Password?</a></div>
            <button class="btn btn-primary" id="loginBtn">Login</button>
            <div class="auth-divider"><span>or continue with</span></div>
            <div class="social-buttons">
              <button class="social-btn" onclick="alert('Coming soon')">🔵 Google</button>
              <button class="social-btn" onclick="alert('Coming soon')">⬛ Facebook</button>
            </div>
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
}
