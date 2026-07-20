# 🏪 ALLIANCE MALL TK

Full-stack e-commerce marketplace built with Vite + TypeScript + Supabase.

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/h40yun/A-Mall-TS.git
cd A-Mall-TS

# 2. Install
npm install

# 3. Environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Dev
npm run dev

# 5. Build
npm run build

# 6. Preview
npm run preview
```

## 📦 Tech Stack

- **Frontend:** Vite + TypeScript
- **Styling:** Custom CSS (responsive)
- **Database:** Supabase (config ready)
- **Deploy:** Cloudflare Pages / GitHub Pages
- **Auth:** localStorage (Supabase Auth ready)

## 🗺️ Routes (31 Pages)

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/product/:id` | Product Detail | Public |
| `/cart` | Shopping Cart | Public |
| `/checkout` | Checkout | Public |
| `/auth` | Login/Register | Guest |
| `/category` | Category Browser | Public |
| `/search` | Search Results | Public |
| `/profile` | User Profile (9 tabs) | Login |
| `/wishlist` | Wishlist | Public |
| `/track-order` | Order Tracking | Public |
| `/messages` | Buyer-Seller Chat | Login |
| `/seller` | Seller Dashboard | Seller |
| `/seller/login` | Seller Auth | Guest |
| `/comparison` | Product Comparison | Public |
| `/about` | About Us | Public |
| `/contact` | Contact | Public |
| `/help` | Help Center | Public |
| `/how-to-buy` | How to Buy | Public |
| `/shipping` | Shipping Info | Public |
| `/return-policy` | Return Policy | Public |
| `/payment-methods` | Payment Methods | Public |
| `/terms` | Terms & Conditions | Public |
| `/privacy` | Privacy Policy | Public |
| `/deals` | Deals & Promotions | Public |
| `/blog` | Blog | Public |
| `/stores` | All Stores | Public |
| `/notifications` | Notifications | Login |
| `/sell` | Become a Seller | Public |
| `/store/:id` | Store Detail | Public |
| `/admin` | Admin Panel | Admin |
| `/404` | Not Found | Public |

## 🔐 Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | zh3ngniu@gmail.com | Qilin13579@ |

## 📱 Responsive Breakpoints

| Device | Width | Grid |
|---|---|---|
| Mobile (XS) | 320-480px | 2 columns |
| Tablet (SM) | 481-768px | 3 columns |
| Desktop (MD) | 769-1024px | 4 columns |
| Large (LG) | 1025px+ | 6 columns |

## 🚀 Deploy to GitHub Pages

### Automatic (via GitHub Actions)

Push to `main` branch triggers auto-deploy via `.github/workflows/deploy.yml`.

### Manual

```bash
npm run build
# Upload dist/ folder to your hosting
```

## 🚀 Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
npm run build
wrangler pages deploy dist
```

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🚀 Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
A-Mall-TS/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── wrangler.toml           # Cloudflare config
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # SEO robots
│   └── sitemap.xml         # SEO sitemap
├── src/
│   ├── main.ts             # Entry point + routes
│   ├── router/
│   │   └── index.ts        # SPA router
│   ├── components/
│   │   └── index.ts        # Header, Footer, Cards
│   ├── pages/
│   │   ├── home.ts         # Home page
│   │   ├── product.ts      # Product detail
│   │   ├── cart.ts         # Shopping cart
│   │   ├── checkout.ts     # Checkout
│   │   ├── auth.ts         # Login/Register
│   │   ├── category.ts     # Category/Search
│   │   ├── profile.ts      # User profile
│   │   ├── wishlist.ts     # Wishlist
│   │   ├── track-order.ts  # Order tracking
│   │   ├── messages.ts     # Chat
│   │   ├── seller.ts       # Seller dashboard
│   │   ├── seller-auth.ts  # Seller login/register
│   │   ├── admin.ts        # Admin panel
│   │   ├── static.ts       # Static pages
│   │   └── not-found.ts    # 404 page
│   ├── utils/
│   │   ├── helpers.ts      # Utility functions
│   │   ├── data.ts         # Product data
│   │   └── supabase.ts     # Supabase client
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── styles/
│       └── main.css        # All styles
└── dist/                   # Build output
```

## 🛠️ Development

```bash
# Dev server
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build

# Preview build
npm run preview
```

## 📄 License

MIT

## 👤 Author

- GitHub: [@h40yun](https://github.com/h40yun)
