// ==================== SELLER AUTH PAGE ====================
import { login, register, getCurrentUser, showToast, isSeller, registerSeller } from '../utils/helpers'
import { renderPage } from '../components'
import { navigate } from '../router'
import { CATEGORIES } from '../utils/data'

export function renderSellerLoginPage(): void {
  if (getCurrentUser() && isSeller()) { navigate('/seller'); return }

  const container = document.createElement('div')
  let currentTab: 'login' | 'register' = 'login'
  let regStep = 1
  const totalRegSteps = 4

  function render() {
    container.innerHTML = `
      <div style="min-height:100vh;display:flex;background:#f5f5f5">
        <!-- Left Panel - Branding -->
        <div style="flex:0 0 440px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);color:#fff;padding:60px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden">
          <div style="position:absolute;top:0;right:0;width:300px;height:300px;background:radial-gradient(circle,rgba(238,77,45,0.15) 0%,transparent 70%);border-radius:50%;transform:translate(30%,-30%)"></div>
          <div style="position:absolute;bottom:0;left:0;width:200px;height:200px;background:radial-gradient(circle,rgba(238,77,45,0.1) 0%,transparent 70%);border-radius:50%;transform:translate(-30%,30%)"></div>
          
          <div style="position:relative;z-index:1">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:40px">
              <div style="width:48px;height:48px;background:linear-gradient(135deg,#ee4d2d,#f97316);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px">🏪</div>
              <div>
                <div style="font-size:20px;font-weight:800;letter-spacing:-0.5px">ALLIANCE MALL</div>
                <div style="font-size:12px;opacity:0.7;letter-spacing:2px">SELLER CENTER</div>
              </div>
            </div>
            
            <h1 style="font-size:32px;font-weight:800;line-height:1.2;margin-bottom:16px">Start selling to<br>millions of buyers</h1>
            <p style="font-size:15px;opacity:0.8;line-height:1.6;margin-bottom:40px">Join over 500,000 sellers on Alliance Mall. Reach customers worldwide and grow your business with our powerful tools.</p>
            
            <div style="display:flex;flex-direction:column;gap:20px">
              ${[
                { num: '500K+', label: 'Active Sellers' },
                { num: '180+', label: 'Countries' },
                { num: '$2B+', label: 'Monthly GMV' },
                { num: '5%', label: 'Commission' }
              ].map(s => `
                <div style="display:flex;align-items:center;gap:16px">
                  <div style="font-size:24px;font-weight:800;color:#f97316;min-width:80px">${s.num}</div>
                  <div style="font-size:14px;opacity:0.7">${s.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Panel - Form -->
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px">
          <div style="width:100%;max-width:460px">
            <!-- Tab Switcher -->
            <div style="display:flex;background:#e0e0e0;border-radius:8px;padding:4px;margin-bottom:32px">
              <button class="seller-auth-tab ${currentTab === 'login' ? 'active' : ''}" data-tab="login" style="flex:1;padding:12px;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;${currentTab === 'login' ? 'background:#fff;color:#222;box-shadow:0 2px 8px rgba(0,0,0,0.1)' : 'background:transparent;color:#666'}">Sign In</button>
              <button class="seller-auth-tab ${currentTab === 'register' ? 'active' : ''}" data-tab="register" style="flex:1;padding:12px;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;${currentTab === 'register' ? 'background:#fff;color:#222;box-shadow:0 2px 8px rgba(0,0,0,0.1)' : 'background:transparent;color:#666'}">Register</button>
            </div>

            ${currentTab === 'login' ? renderSellerLogin() : renderSellerRegister()}
          </div>
        </div>
      </div>
    `

    // Tab switching
    container.querySelectorAll('.seller-auth-tab').forEach(tab => {
      tab.addEventListener('click', function(this: HTMLElement) {
        currentTab = (this.dataset.tab as 'login' | 'register') || 'login'
        regStep = 1
        render()
      })
    })

    if (currentTab === 'login') bindLoginEvents()
    else bindRegisterEvents()
  }

  function renderSellerLogin(): string {
    return `
      <h2 style="font-size:24px;font-weight:700;margin-bottom:4px">Welcome back</h2>
      <p style="font-size:14px;color:#666;margin-bottom:28px">Sign in to your seller account</p>
      
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Email or Phone</label>
        <input type="text" class="form-control" id="sellerLoginId" placeholder="Enter your email or phone number" style="padding:14px 16px;font-size:14px;border-radius:8px;border:1px solid #ddd">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Password</label>
        <div style="position:relative">
          <input type="password" class="form-control" id="sellerLoginPass" placeholder="Enter your password" style="padding:14px 16px;font-size:14px;border-radius:8px;border:1px solid #ddd;padding-right:44px">
          <button type="button" id="toggleSellerPass" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:#999">👁</button>
        </div>
      </div>
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:#666;cursor:pointer">
          <input type="checkbox" id="rememberMe" style="accent-color:#ee4d2d"> Remember me
        </label>
        <a href="#" id="sellerForgotLink" style="font-size:13px;color:#ee4d2d;font-weight:500">Forgot password?</a>
      </div>
      
      <button class="btn btn-primary btn-block" id="sellerLoginBtn" style="padding:14px;font-size:15px;border-radius:8px;font-weight:700">Sign In</button>
      
      <div style="text-align:center;margin:24px 0;position:relative">
        <div style="height:1px;background:#e0e0e0"></div>
        <span style="background:#fff;padding:0 16px;font-size:12px;color:#999;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">or continue with</span>
      </div>
      
      <div style="display:flex;gap:12px">
        <button class="seller-oauth-btn" data-provider="Google" style="flex:1;padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s">
          <span style="font-size:18px">🔵</span> Google
        </button>
        <button class="seller-oauth-btn" data-provider="Facebook" style="flex:1;padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s">
          <span style="font-size:18px">⬛</span> Facebook
        </button>
      </div>
      
      <p style="text-align:center;margin-top:24px;font-size:13px;color:#666">
        Don't have a seller account? <a href="#" id="switchToRegister" style="color:#ee4d2d;font-weight:600">Register now</a>
      </p>
      
      <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0">
        <a href="/auth" style="font-size:12px;color:#999">← Back to buyer login</a>
      </div>
    `
  }

  function renderSellerRegister(): string {
    return `
      <h2 style="font-size:24px;font-weight:700;margin-bottom:4px">Create Seller Account</h2>
      <p style="font-size:14px;color:#666;margin-bottom:20px">Step ${regStep} of ${totalRegSteps} — ${['Account','Business','Verification','Store'][regStep-1]}</p>
      
      <!-- Progress Bar -->
      <div style="display:flex;gap:4px;margin-bottom:28px">
        ${Array.from({length: totalRegSteps}, (_, i) => `
          <div style="flex:1;height:4px;border-radius:2px;background:${i < regStep ? '#ee4d2d' : '#e0e0e0'};transition:background 0.3s"></div>
        `).join('')}
      </div>

      ${regStep === 1 ? renderRegStep1() : regStep === 2 ? renderRegStep2() : regStep === 3 ? renderRegStep3() : renderRegStep4()}

      <div style="display:flex;gap:12px;margin-top:24px">
        ${regStep > 1 ? '<button class="btn btn-outline" id="regPrevBtn" style="flex:1;padding:14px;border-radius:8px">← Back</button>' : ''}
        ${regStep < totalRegSteps 
          ? '<button class="btn btn-primary" id="regNextBtn" style="flex:1;padding:14px;border-radius:8px;font-weight:700">Continue →</button>'
          : '<button class="btn btn-primary" id="regSubmitBtn" style="flex:1;padding:14px;border-radius:8px;font-weight:700">🏪 Create Seller Account</button>'
        }
      </div>

      ${regStep === 1 ? `
        <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0">
          <a href="#" id="switchToLogin" style="font-size:13px;color:#666">Already have an account? <span style="color:#ee4d2d;font-weight:600">Sign in</span></a>
        </div>
      ` : ''}
    `
  }

  function renderRegStep1(): string {
    return `
      <!-- Account Info -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">First Name *</label>
          <input type="text" class="form-control" id="regFirstName" placeholder="John" style="padding:12px 14px;border-radius:8px">
        </div>
        <div class="form-group">
          <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Last Name *</label>
          <input type="text" class="form-control" id="regLastName" placeholder="Doe" style="padding:12px 14px;border-radius:8px">
        </div>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Email Address *</label>
        <input type="email" class="form-control" id="regEmail" placeholder="john@example.com" style="padding:12px 14px;border-radius:8px">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Phone Number *</label>
        <div style="display:flex;gap:8px">
          <select class="form-control" id="regPhoneCode" style="width:100px;padding:12px 8px;border-radius:8px">
            <option>+1</option><option>+44</option><option>+62</option><option>+86</option><option>+81</option><option>+82</option><option>+60</option><option>+63</option><option>+66</option><option>+84</option>
          </select>
          <input type="tel" class="form-control" id="regPhone" placeholder="234 567 8900" style="padding:12px 14px;border-radius:8px;flex:1">
        </div>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Password *</label>
        <input type="password" class="form-control" id="regPassword" placeholder="Min 8 characters with uppercase, number & symbol" style="padding:12px 14px;border-radius:8px">
        <div id="passStrength" style="margin-top:6px;font-size:11px;color:#999"></div>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Confirm Password *</label>
        <input type="password" class="form-control" id="regConfirmPass" placeholder="Re-enter password" style="padding:12px 14px;border-radius:8px">
      </div>
    `
  }

  function renderRegStep2(): string {
    return `
      <!-- Business Info -->
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Business Type *</label>
        <select class="form-control" id="regBizType" style="padding:12px 14px;border-radius:8px">
          <option value="">Select business type</option>
          <option value="individual">Individual / Sole Proprietor</option>
          <option value="partnership">Partnership</option>
          <option value="llc">Limited Liability Company (LLC)</option>
          <option value="corporation">Corporation</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Company / Business Name *</label>
        <input type="text" class="form-control" id="regCompanyName" placeholder="Your registered business name" style="padding:12px 14px;border-radius:8px">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Registration Number / Tax ID</label>
        <input type="text" class="form-control" id="regBizNumber" placeholder="Business registration or tax ID" style="padding:12px 14px;border-radius:8px">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Country / Region *</label>
          <select class="form-control" id="regCountry" style="padding:12px 14px;border-radius:8px">
            <option value="">Select country</option>
            ${['United States','Canada','United Kingdom','Australia','Indonesia','Malaysia','Philippines','Thailand','Vietnam','Singapore','Japan','South Korea','China','India','Brazil','Mexico','Germany','France','Italy','Spain','Netherlands','Turkey','Russia','South Africa','Nigeria','Egypt','Saudi Arabia','UAE','New Zealand'].map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">City *</label>
          <input type="text" class="form-control" id="regCity" placeholder="Your city" style="padding:12px 14px;border-radius:8px">
        </div>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Business Address *</label>
        <input type="text" class="form-control" id="regAddress" placeholder="Full business address" style="padding:12px 14px;border-radius:8px">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Website / Social Media</label>
        <input type="text" class="form-control" id="regWebsite" placeholder="https://yourstore.com (optional)" style="padding:12px 14px;border-radius:8px">
      </div>
    `
  }

  function renderRegStep3(): string {
    return `
      <!-- Identity Verification -->
      <div style="background:#fff5f3;border:1px solid #ffd4cc;border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <span style="font-size:20px">🪪</span>
          <h3 style="font-size:15px;font-weight:700;color:#ee4d2d">Identity Verification</h3>
        </div>
        <p style="font-size:13px;color:#666;line-height:1.6">To ensure marketplace safety, we need to verify your identity. This information is encrypted and kept secure.</p>
      </div>

      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">ID Document Type *</label>
        <select class="form-control" id="regIdType" style="padding:12px 14px;border-radius:8px">
          <option value="">Select document type</option>
          <option value="national_id">National ID Card</option>
          <option value="passport">Passport</option>
          <option value="drivers_license">Driver's License</option>
          <option value="business_license">Business License</option>
        </select>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">ID Number *</label>
        <input type="text" class="form-control" id="regIdNumber" placeholder="Enter your ID number" style="padding:12px 14px;border-radius:8px">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Full Legal Name (as on ID) *</label>
        <input type="text" class="form-control" id="regLegalName" placeholder="Exactly as shown on your ID" style="padding:12px 14px;border-radius:8px">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Date of Birth *</label>
        <input type="date" class="form-control" id="regDob" style="padding:12px 14px;border-radius:8px">
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">ID Document Photo URL</label>
        <input type="text" class="form-control" id="regIdPhoto" placeholder="https://... (photo of your ID document)" style="padding:12px 14px;border-radius:8px">
        <div style="font-size:11px;color:#999;margin-top:4px">Upload a clear photo of your ID document</div>
      </div>

      <div style="background:#f0f8ff;border-radius:8px;padding:14px;margin-top:12px">
        <div style="font-size:12px;color:#444;line-height:1.6">
          <strong>🔒 Privacy Notice:</strong> Your personal information is encrypted and used solely for verification purposes. We comply with GDPR and local data protection laws.
        </div>
      </div>
    `
  }

  function renderRegStep4(): string {
    return `
      <!-- Store Setup -->
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Store Name *</label>
        <input type="text" class="form-control" id="regStoreName" placeholder="Your store name on Alliance Mall" style="padding:12px 14px;border-radius:8px" maxlength="50">
        <div style="font-size:11px;color:#999;margin-top:4px">This is how buyers will see your store</div>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Store Category *</label>
        <select class="form-control" id="regStoreCategory" style="padding:12px 14px;border-radius:8px">
          <option value="">Select primary category</option>
          ${CATEGORIES.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Store Description *</label>
        <textarea class="form-control" id="regStoreDesc" rows="3" placeholder="Describe what you sell and why buyers should choose you..." style="padding:12px 14px;border-radius:8px"></textarea>
      </div>
      <div class="form-group">
        <label style="font-size:13px;font-weight:600;color:#444;margin-bottom:6px;display:block">Product Types You Plan to Sell</label>
        <input type="text" class="form-control" id="regProductTypes" placeholder="e.g. Electronics, Clothing, Home Goods" style="padding:12px 14px;border-radius:8px">
      </div>

      <div style="background:#f8f8f8;border-radius:12px;padding:16px;margin-bottom:16px">
        <h4 style="font-size:13px;font-weight:700;margin-bottom:10px">📋 Seller Agreement</h4>
        <div style="font-size:12px;color:#666;line-height:1.8;max-height:150px;overflow-y:auto;padding:12px;background:#fff;border-radius:8px;border:1px solid #e0e0e0">
          <p>By creating a seller account, you agree to:</p>
          <ul style="padding-left:16px;list-style:disc">
            <li>Provide accurate product information and pricing</li>
            <li>Ship orders within the specified timeframe</li>
            <li>Respond to customer inquiries within 24 hours</li>
            <li>Comply with all marketplace policies and guidelines</li>
            <li>Accept the 5% commission rate on all sales</li>
            <li>Weekly payout schedule (every Monday)</li>
            <li>Maintain a minimum seller rating of 3.0</li>
            <li>Not list counterfeit, prohibited, or illegal items</li>
          </ul>
        </div>
      </div>

      <label style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;cursor:pointer">
        <input type="checkbox" id="regAgreeTerms" style="accent-color:#ee4d2d;margin-top:2px">
        <span style="font-size:12px;color:#666;line-height:1.5">I agree to the <a href="/terms" target="_blank" style="color:#ee4d2d">Seller Terms & Conditions</a> and <a href="/privacy" target="_blank" style="color:#ee4d2d">Privacy Policy</a></span>
      </label>
      <label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer">
        <input type="checkbox" id="regAgreeCommission" style="accent-color:#ee4d2d;margin-top:2px">
        <span style="font-size:12px;color:#666;line-height:1.5">I understand the 5% commission rate and weekly payout schedule</span>
      </label>
    `
  }

  function bindLoginEvents() {
    container.querySelector('#toggleSellerPass')?.addEventListener('click', () => {
      const input = container.querySelector('#sellerLoginPass') as HTMLInputElement
      input.type = input.type === 'password' ? 'text' : 'password'
    })

    container.querySelector('#sellerLoginBtn')?.addEventListener('click', () => {
      const id = (container.querySelector('#sellerLoginId') as HTMLInputElement).value.trim()
      const pass = (container.querySelector('#sellerLoginPass') as HTMLInputElement).value
      if (!id || !pass) { showToast('Please fill in all fields', 'error'); return }
      const result = login(id, pass)
      if (result.success) {
        if (isSeller() || (result.user as any)?.sellerStore) {
          showToast('Welcome back, ' + result.user!.name + '!')
          setTimeout(() => navigate('/seller'), 500)
        } else {
          showToast('This account is not a seller. Register as seller first.', 'warning')
        }
      } else {
        showToast(result.message!, 'error')
      }
    })

    container.querySelector('#switchToRegister')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'register'; regStep = 1; render() })
    container.querySelector('#sellerForgotLink')?.addEventListener('click', (e) => { e.preventDefault(); navigate('/auth') })

    container.querySelectorAll('.seller-oauth-btn').forEach(btn => {
      btn.addEventListener('click', function(this: HTMLElement) {
        showToast('OAuth ' + this.dataset.provider + ' — Coming soon', 'info')
      })
    })
  }

  function bindRegisterEvents() {
    container.querySelector('#switchToLogin')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'login'; render() })
    
    container.querySelector('#regPrevBtn')?.addEventListener('click', () => { if (regStep > 1) { regStep--; render() } })
    
    container.querySelector('#regNextBtn')?.addEventListener('click', () => {
      if (regStep === 1) {
        const fn = (container.querySelector('#regFirstName') as HTMLInputElement)?.value.trim()
        const ln = (container.querySelector('#regLastName') as HTMLInputElement)?.value.trim()
        const email = (container.querySelector('#regEmail') as HTMLInputElement)?.value.trim()
        const phone = (container.querySelector('#regPhone') as HTMLInputElement)?.value.trim()
        const pass = (container.querySelector('#regPassword') as HTMLInputElement)?.value
        const confirm = (container.querySelector('#regConfirmPass') as HTMLInputElement)?.value
        if (!fn || !ln || !email || !phone || !pass) { showToast('Fill all required fields', 'error'); return }
        if (pass.length < 8) { showToast('Password must be at least 8 characters', 'error'); return }
        if (pass !== confirm) { showToast('Passwords do not match', 'error'); return }
      }
      if (regStep === 2) {
        const bizType = (container.querySelector('#regBizType') as HTMLSelectElement)?.value
        const companyName = (container.querySelector('#regCompanyName') as HTMLInputElement)?.value.trim()
        const country = (container.querySelector('#regCountry') as HTMLSelectElement)?.value
        const city = (container.querySelector('#regCity') as HTMLInputElement)?.value.trim()
        const address = (container.querySelector('#regAddress') as HTMLInputElement)?.value.trim()
        if (!bizType || !companyName || !country || !city || !address) { showToast('Fill all required fields', 'error'); return }
      }
      if (regStep === 3) {
        const idType = (container.querySelector('#regIdType') as HTMLSelectElement)?.value
        const idNumber = (container.querySelector('#regIdNumber') as HTMLInputElement)?.value.trim()
        const legalName = (container.querySelector('#regLegalName') as HTMLInputElement)?.value.trim()
        const dob = (container.querySelector('#regDob') as HTMLInputElement)?.value
        if (!idType || !idNumber || !legalName || !dob) { showToast('Fill all required fields', 'error'); return }
      }
      regStep++
      render()
    })

    container.querySelector('#regSubmitBtn')?.addEventListener('click', () => {
      const storeName = (container.querySelector('#regStoreName') as HTMLInputElement)?.value.trim()
      const storeCategory = (container.querySelector('#regStoreCategory') as HTMLSelectElement)?.value
      const storeDesc = (container.querySelector('#regStoreDesc') as HTMLTextAreaElement)?.value.trim()
      const agreeTerms = (container.querySelector('#regAgreeTerms') as HTMLInputElement)?.checked
      const agreeCommission = (container.querySelector('#regAgreeCommission') as HTMLInputElement)?.checked
      
      if (!storeName || !storeCategory || !storeDesc) { showToast('Fill all required fields', 'error'); return }
      if (!agreeTerms || !agreeCommission) { showToast('You must agree to all terms', 'error'); return }

      // Step 1 data
      const firstName = (container.querySelector('#regFirstName') as HTMLInputElement).value.trim()
      const lastName = (container.querySelector('#regLastName') as HTMLInputElement).value.trim()
      const email = (container.querySelector('#regEmail') as HTMLInputElement).value.trim()
      const phoneCode = (container.querySelector('#regPhoneCode') as HTMLSelectElement).value
      const phone = (container.querySelector('#regPhone') as HTMLInputElement).value.trim()
      const password = (container.querySelector('#regPassword') as HTMLInputElement).value

      // Step 2 data
      const bizType = (container.querySelector('#regBizType') as HTMLSelectElement).value
      const companyName = (container.querySelector('#regCompanyName') as HTMLInputElement).value.trim()
      const country = (container.querySelector('#regCountry') as HTMLSelectElement).value
      const city = (container.querySelector('#regCity') as HTMLInputElement).value.trim()
      const address = (container.querySelector('#regAddress') as HTMLInputElement).value.trim()

      // Step 3 data
      const idType = (container.querySelector('#regIdType') as HTMLSelectElement).value
      const idNumber = (container.querySelector('#regIdNumber') as HTMLInputElement).value.trim()
      const legalName = (container.querySelector('#regLegalName') as HTMLInputElement).value.trim()
      const dob = (container.querySelector('#regDob') as HTMLInputElement).value

      // Register user account first
      const fullName = firstName + ' ' + lastName
      const regResult = register(fullName, email, password)
      if (!regResult.success) {
        // Try login if already registered
        const loginResult = login(email, password)
        if (!loginResult.success) { showToast(regResult.message!, 'error'); return }
      }

      // Register as seller
      const sellerResult = registerSeller(
        storeName, storeCategory, storeDesc,
        city + ', ' + country,
        phoneCode + ' ' + phone,
        bizType,
        '30-day return policy. Items must be unused and in original packaging.',
        'Free shipping on orders over $50. Standard delivery 5-7 days.'
      )

      if (sellerResult.success) {
        // Save extra seller application data
        const appData = {
          firstName, lastName, email, phone: phoneCode + ' ' + phone,
          businessType: bizType, companyName, country, city, address,
          idType, idNumber, legalName, dob,
          storeName, storeCategory, storeDesc,
          status: 'approved',
          appliedAt: new Date().toISOString()
        }
        localStorage.setItem('am_seller_app', JSON.stringify(appData))
        
        showToast('🎉 Seller account created successfully!')
        setTimeout(() => navigate('/seller'), 1000)
      } else {
        showToast(sellerResult.message!, 'error')
      }
    })

    // Password strength indicator
    container.querySelector('#regPassword')?.addEventListener('input', function(this: HTMLInputElement) {
      const val = this.value
      const strengthEl = container.querySelector('#passStrength') as HTMLElement | null
      if (!strengthEl) return
      let score = 0
      if (val.length >= 8) score++
      if (/[A-Z]/.test(val)) score++
      if (/[0-9]/.test(val)) score++
      if (/[^A-Za-z0-9]/.test(val)) score++
      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
      const colors = ['', '#dc3545', '#ffc107', '#17a2b8', '#28a745']
      strengthEl.textContent = val ? `Password strength: ${labels[score]}` : ''
      strengthEl.style.color = colors[score]
    })
  }

  render()
  renderPage(container)
}
