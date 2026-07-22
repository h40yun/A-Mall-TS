# 🆓 ALLIANCE MALL TK - Free Hosting Architecture

## Multi-Platform Free Hosting Strategy

```
                    ┌─────────────────────┐
                    │   Supabase (Free)    │
                    │  ─────────────────── │
                    │  • PostgreSQL DB     │
                    │  • Auth              │
                    │  • Storage           │
                    │  • Edge Functions    │
                    │  • Realtime          │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Cloudflare    │   │ Vercel        │   │ Netlify       │
│ Pages (Free)  │   │ (Free)        │   │ (Free)        │
│ ───────────── │   │ ───────────── │   │ ───────────── │
│ • Unlimited   │   │ • 100GB/mo    │   │ • 100GB/mo    │
│   bandwidth   │   │ • Auto SSL    │   │ • Auto SSL    │
│ • Global CDN  │   │ • Edge Fn     │   │ • Functions   │
│ • Auto SSL    │   │ • Analytics   │   │ • Forms       │
│ • Custom dom  │   │ • Custom dom  │   │ • Identity    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                      │                      │
        ▼                      ▼                      ▼
   a-mall.pages.dev    a-mall.vercel.app    a-mall.netlify.app
```

## Free Tier Limits Comparison

| Service | Bandwidth | Builds | Storage | Functions | Custom Domain |
|---------|-----------|--------|---------|-----------|---------------|
| **Cloudflare Pages** | ✅ Unlimited | 500/mo | 25MB/file | Workers (100K/day) | ✅ Free |
| **Vercel** | 100GB/mo | 100/day | 1GB | Serverless (100K/mo) | ✅ Free |
| **Netlify** | 100GB/mo | 300/mo | — | Functions (125K/mo) | ✅ Free |
| **GitHub Pages** | ✅ Soft limit | 10/hour | 1GB repo | ❌ | ✅ Free |
| **Render** | 100GB/mo | 500/mo | — | Web Services | ✅ Free |
| **Railway** | 100GB/mo | — | 1GB | 500hrs/mo | ✅ Free |
| **Fly.io** | 160GB/mo | — | 3GB | 3 shared VMs | ✅ Free |
| **Surge.sh** | ✅ Unlimited | — | — | ❌ | ✅ Free |

## Supabase Free Tier

| Feature | Limit |
|---------|-------|
| Database | 500MB |
| Auth | 50,000 MAU |
| Storage | 1GB |
| Edge Functions | 500K invocations/mo |
| Realtime | 200 concurrent |
| Bandwidth | 5GB/mo |
| Projects | 2 active |

## How to Deploy to Each Platform

### 1. Cloudflare Pages (Already Done ✅)
```
URL: https://a-mall.pages.dev
```

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd A-Mall-TS
vercel --prod

# Or connect GitHub repo at vercel.com/new
```

### 3. Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd A-Mall-TS
netlify deploy --prod --dir=dist

# Or connect GitHub repo at app.netlify.com
```

### 4. GitHub Pages
```bash
# Already configured in .github/workflows/deploy.yml
# Just push to main and it auto-deploys
# URL: https://h40yun.github.io/A-Mall-TS
```

### 5. Render
```yaml
# render.yaml
services:
  - type: web
    name: a-mall
    buildCommand: npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_SUPABASE_URL
        value: https://toyehtrxtlaajudaxedk.supabase.co
```

### 6. Surge.sh
```bash
npm i -g surge
cd dist
surge . a-mall.surge.sh
```

## Additional Free Services

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Resend** | Transactional Email | 100 emails/day |
| **Upstash** | Redis Cache | 10K commands/day |
| **PlanetScale** | MySQL (backup DB) | 5GB, 1B reads/mo |
| **Neon** | PostgreSQL (backup) | 512MB |
| **Firebase** | Auth + Firestore | Generous free |
| **Cloudflare R2** | Object Storage | 10GB, 10M reads/mo |
| **ImageKit** | Image CDN | 20GB bandwidth |
| **Umami** | Analytics | Self-hosted free |
| **Crisp** | Live Chat | 2 agents free |
| **Tawk.to** | Live Chat | ✅ Free |
| **Sentry** | Error Tracking | 5K events/mo |
| **LogRocket** | Session Replay | 1K sessions/mo |
| **Stripe** | Payments | No monthly fee |

## Recommended Stack (100% Free)

```
Frontend:     Cloudflare Pages (primary) + Vercel (backup)
Database:     Supabase PostgreSQL
Auth:         Supabase Auth
Storage:      Supabase Storage + Cloudflare R2
Email:        Resend (100/day)
Analytics:    Umami (self-hosted) or Cloudflare Web Analytics
Live Chat:    Crisp or Tawk.to
Error Track:  Sentry
Payments:     Stripe (pay-per-transaction)
CDN:          Cloudflare (built-in)
DNS:          Cloudflare (free)
SSL:          Auto (all platforms)
```

## Monthly Cost Estimate

| Item | Cost |
|------|------|
| Hosting (Cloudflare Pages) | $0 |
| Database (Supabase) | $0 |
| Auth (Supabase) | $0 |
| Storage (Supabase + R2) | $0 |
| Email (Resend) | $0 |
| DNS + SSL (Cloudflare) | $0 |
| Analytics (Umami) | $0 |
| **Total** | **$0/month** |

*Only pay when you earn: Stripe takes 2.9% + $0.30 per transaction*
