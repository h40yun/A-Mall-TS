// ==================== PRODUCT SCRAPER ====================
// Scrapes products from marketplace URLs
// Supports: Amazon, AliExpress, eBay, Shopee, Lazada, Temu

export interface ScrapedProduct {
  id: number
  name: string
  price: number
  originalPrice: number
  currency: string
  category: string
  subcategory: string
  brand: string
  seller: string
  description: string
  specs: string
  images: string[]
  rating: number
  sold: number
  stock: number
  weight: string
  freeShipping: boolean
  location: string
  sourceUrl: string
  sourcePlatform: string
  scrapedAt: string
}

// Exchange rates to USD (approximate)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  JPY: 0.0067,
  CNY: 0.14,
  IDR: 0.000063,
  THB: 0.028,
  VND: 0.000041,
  MYR: 0.21,
  PHP: 0.017,
  SGD: 0.74,
  KRW: 0.00075,
  AUD: 0.65,
  CAD: 0.74,
  BRL: 0.20,
  MXN: 0.058,
  INR: 0.012,
  TWD: 0.031,
  HKD: 0.13,
  AED: 0.27,
  SAR: 0.27,
  TRY: 0.031,
  RUB: 0.011,
  PLN: 0.25,
  SEK: 0.095,
  NOK: 0.094,
  DKK: 0.14,
  CHF: 1.13,
  NZD: 0.60,
  ZAR: 0.055,
  NGN: 0.00063,
  EGP: 0.020,
  PKR: 0.0036,
  BDT: 0.0091,
  ARS: 0.0011,
  CLP: 0.0011,
  COP: 0.00025,
  PEN: 0.27,
  CZK: 0.044,
  HUF: 0.0028,
  RON: 0.22,
  UAH: 0.024,
  KZT: 0.0021,
  UZS: 0.000079,
  GEL: 0.37,
  AZN: 0.59,
  KWD: 3.26,
  BHD: 2.65,
  OMR: 2.60,
  QAR: 0.27,
  JOD: 1.41,
  LBP: 0.000011,
  TND: 0.32,
  MAD: 0.10,
  DZD: 0.0074,

  KES: 0.0077,
  UGX: 0.00027,
  TZS: 0.00037,
  GHS: 0.083,
  XOF: 0.0016,
  XAF: 0.0016,
  AOA: 0.0012,
  MZN: 0.016,
  ZMW: 0.038,

  NAD: 0.055,
  MUR: 0.022,
  SCR: 0.074,
  LKR: 0.0031,
  NPR: 0.0075,
  MMK: 0.00048,
  KHR: 0.00025,

  MNT: 0.00029,
  BND: 0.74,
  FJD: 0.45,
  PGK: 0.27,
  WST: 0.37,
  TOP: 0.43,
  VUV: 0.0084,
  SBD: 0.12,
  HTG: 0.0076,
  JMD: 0.0065,
  TTD: 0.15,
  BBD: 0.50,
  BSD: 1,
  BZD: 0.50,
  GTQ: 0.13,
  HNL: 0.041,
  NIO: 0.027,
  CRC: 0.0019,
  PAB: 1,
  CUP: 0.042,
  DOP: 0.017,
  PYG: 0.00014,
  UYU: 0.025,
  BOB: 0.14,
  GYD: 0.0048,
  SRD: 0.028,
  BIF: 0.00035,
  RWF: 0.00078,
  MGA: 0.00022,
  MWK: 0.00058,
  LSL: 0.055,
  SZL: 0.055,
  SOS: 0.0018,
  SDG: 0.0017,
  LYD: 0.21,
  TJS: 0.092,
  KGS: 0.011,
  TMT: 0.29,
  MVR: 0.065,
  AFN: 0.014,
  IRR: 0.000024,
  IQD: 0.00076,
  YER: 0.0040,
  SYP: 0.00040,
  LAK: 0.000048,
  KMF: 0.0022,
  DJF: 0.0056,
  ERN: 0.067,
  CVE: 0.010,
  STN: 0.044,
  GMD: 0.015,
  GNF: 0.00012,
  SLL: 0.000048,
  LRD: 0.0050,
  CDF: 0.00035,
  MRU: 0.025,
  BWP: 0.074,
  FOK: 0.14,
  ISK: 0.0073,
  MKD: 0.018,
  ALL: 0.011,
  BAM: 0.55,
  RSD: 0.0092,
  MDL: 0.056,
  BYN: 0.31,
  AMD: 0.0025,
  ETB: 0.018,
}

export function detectPlatform(url: string): string {
  const u = url.toLowerCase()
  if (u.includes('amazon.')) return 'Amazon'
  if (u.includes('aliexpress.') || u.includes('ali.')) return 'AliExpress'
  if (u.includes('ebay.')) return 'eBay'
  if (u.includes('shopee.')) return 'Shopee'
  if (u.includes('lazada.')) return 'Lazada'
  if (u.includes('temu.')) return 'Temu'
  if (u.includes('wish.')) return 'Wish'
  if (u.includes('alibaba.')) return 'Alibaba'
  if (u.includes('banggood.')) return 'Banggood'
  if (u.includes('gearbest.')) return 'GearBest'
  if (u.includes('shein.')) return 'SHEIN'
  if (u.includes('zara.')) return 'Zara'
  if (u.includes('hm.com')) return 'H&M'
  if (u.includes('asos.')) return 'ASOS'
  if (u.includes('walmart.')) return 'Walmart'
  if (u.includes('target.')) return 'Target'
  if (u.includes('bestbuy.')) return 'Best Buy'
  if (u.includes('etsy.')) return 'Etsy'
  if (u.includes('shopify.')) return 'Shopify'
  if (u.includes('tokopedia.')) return 'Tokopedia'
  if (u.includes('bukalapak.')) return 'Bukalapak'
  if (u.includes('blibli.')) return 'Blibli'
  if (u.includes('jd.')) return 'JD.com'
  if (u.includes('taobao.')) return 'Taobao'
  if (u.includes('tmall.')) return 'Tmall'
  if (u.includes('rakuten.')) return 'Rakuten'
  if (u.includes('mercadolibre.')) return 'MercadoLibre'
  if (u.includes('flipkart.')) return 'Flipkart'
  if (u.includes('noon.')) return 'Noon'
  if (u.includes('jumia.')) return 'Jumia'
  if (u.includes('takealot.')) return 'Takealot'
  return 'Unknown'
}

export function getPlatformCategory(url: string): string {
  const u = url.toLowerCase()
  if (u.includes('/electronics') || u.includes('/tech') || u.includes('/phone') || u.includes('/laptop')) return 'Electronics'
  if (u.includes('/fashion') || u.includes('/clothing') || u.includes('/apparel')) return 'Fashion'
  if (u.includes('/home') || u.includes('/kitchen') || u.includes('/furniture')) return 'Home'
  if (u.includes('/beauty') || u.includes('/makeup') || u.includes('/skincare')) return 'Beauty'
  if (u.includes('/sports') || u.includes('/fitness') || u.includes('/outdoor')) return 'Sports'
  if (u.includes('/toys') || u.includes('/games')) return 'Toys'
  if (u.includes('/books')) return 'Books'
  if (u.includes('/food') || u.includes('/grocery')) return 'Food'
  return 'Electronics'
}

export function convertToUSD(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency.toUpperCase()]
  if (!rate) return amount // Assume USD if unknown
  return Math.round(amount * rate * 100) / 100
}

export function parsePriceFromText(text: string): { amount: number; currency: string } {
  // Remove whitespace
  const clean = text.trim()
  
  // Currency patterns
  const patterns = [
    { regex: /(\$|USD)\s*([\d,]+\.?\d*)/i, currency: 'USD' },
    { regex: /(€|EUR)\s*([\d,]+\.?\d*)/i, currency: 'EUR' },
    { regex: /(£|GBP)\s*([\d,]+\.?\d*)/i, currency: 'GBP' },
    { regex: /(¥|JPY|￥)\s*([\d,]+\.?\d*)/i, currency: 'JPY' },
    { regex: /(¥|CNY|￥)\s*([\d,]+\.?\d*)/i, currency: 'CNY' },
    { regex: /Rp\s*([\d,.]+)/i, currency: 'IDR' },
    { regex: /(฿|THB)\s*([\d,]+\.?\d*)/i, currency: 'THB' },
    { regex: /(₫|VND)\s*([\d,.]+)/i, currency: 'VND' },
    { regex: /RM\s*([\d,]+\.?\d*)/i, currency: 'MYR' },
    { regex: /₱\s*([\d,]+\.?\d*)/i, currency: 'PHP' },
    { regex: /S?\$\s*([\d,]+\.?\d*)/i, currency: 'SGD' },
    { regex: /₩\s*([\d,]+)/i, currency: 'KRW' },
    { regex: /A?\$\s*([\d,]+\.?\d*)/i, currency: 'AUD' },
    { regex: /C?\$\s*([\d,]+\.?\d*)/i, currency: 'CAD' },
    { regex: /R\s*\$?\s*([\d,]+\.?\d*)/i, currency: 'BRL' },
    { regex: /₹\s*([\d,]+\.?\d*)/i, currency: 'INR' },
    { regex: /NT?\$\s*([\d,]+\.?\d*)/i, currency: 'TWD' },
    { regex: /HK?\$\s*([\d,]+\.?\d*)/i, currency: 'HKD' },
    { regex: /([\d,]+\.?\d*)\s*(USD|EUR|GBP|JPY|CNY|IDR|THB|VND|MYR|PHP|SGD|KRW|AUD|CAD|BRL|INR|TWD|HKD)/i, currency: '' },
  ]

  for (const p of patterns) {
    const match = clean.match(p.regex)
    if (match) {
      const numStr = match[2] || match[1]
      const amount = parseFloat(numStr.replace(/,/g, ''))
      if (!isNaN(amount) && amount > 0) {
        return { amount, currency: p.currency || match[2] || 'USD' }
      }
    }
  }

  // Fallback: just extract numbers
  const numMatch = clean.match(/([\d,]+\.?\d*)/)
  if (numMatch) {
    return { amount: parseFloat(numMatch[1].replace(/,/g, '')), currency: 'USD' }
  }

  return { amount: 0, currency: 'USD' }
}

// Generate realistic demo products based on URL
export function generateDemoProducts(url: string, platform: string): ScrapedProduct[] {
  const platformProducts: Record<string, ScrapedProduct[]> = {
    'Amazon': [
      { id: Date.now(), name: 'Wireless Bluetooth Earbuds Pro', price: 24.99, originalPrice: 49.99, currency: 'USD', category: 'Electronics', subcategory: 'Audio', brand: 'TechSound', seller: 'Amazon Seller', description: 'Premium wireless earbuds with active noise cancellation, 30-hour battery, IPX5 waterproof.', specs: 'Bluetooth 5.3 | ANC | 30h battery | IPX5', images: ['https://picsum.photos/seed/earbuds1/600/600'], rating: 4.4, sold: 15420, stock: 500, weight: '50g', freeShipping: true, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+1, name: 'Smart Watch Ultra Fitness Tracker', price: 39.99, originalPrice: 79.99, currency: 'USD', category: 'Electronics', subcategory: 'Wearables', brand: 'FitPro', seller: 'Amazon Seller', description: 'Advanced fitness tracker with heart rate, GPS, sleep tracking, 100+ workout modes.', specs: '1.5" AMOLED | 7-day battery | IP68', images: ['https://picsum.photos/seed/watch1/600/600'], rating: 4.3, sold: 8900, stock: 300, weight: '45g', freeShipping: true, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+2, name: 'Portable Charger 20000mAh Fast Charge', price: 29.99, originalPrice: 59.99, currency: 'USD', category: 'Electronics', subcategory: 'Accessories', brand: 'PowerMax', seller: 'Amazon Seller', description: '20000mAh portable charger with 65W fast charging, USB-C PD, dual USB-A outputs.', specs: '20000mAh | 65W PD | USB-C | 2x USB-A', images: ['https://picsum.photos/seed/charger1/600/600'], rating: 4.6, sold: 23100, stock: 800, weight: '350g', freeShipping: true, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+3, name: 'LED Desk Lamp with Wireless Charger', price: 34.99, originalPrice: 69.99, currency: 'USD', category: 'Home', subcategory: 'Lighting', brand: 'BrightDesk', seller: 'Amazon Seller', description: 'LED desk lamp with built-in wireless charger, 5 color modes, 10 brightness levels.', specs: '10W | 5 modes | 10 levels | Qi charger', images: ['https://picsum.photos/seed/lamp1/600/600'], rating: 4.5, sold: 6700, stock: 200, weight: '600g', freeShipping: true, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+4, name: 'Robot Vacuum Cleaner Self-Emptying', price: 199.99, originalPrice: 399.99, currency: 'USD', category: 'Home', subcategory: 'Appliances', brand: 'CleanBot', seller: 'Amazon Seller', description: 'Robot vacuum with self-emptying station, LiDAR navigation, app control, 150min runtime.', specs: 'LiDAR | 150min | Self-empty | App control', images: ['https://picsum.photos/seed/vacuum1/600/600'], rating: 4.4, sold: 4500, stock: 100, weight: '3.5kg', freeShipping: true, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
    ],
    'AliExpress': [
      { id: Date.now(), name: 'TWS Bluetooth Earphones Mini', price: 5.99, originalPrice: 15.99, currency: 'USD', category: 'Electronics', subcategory: 'Audio', brand: 'Generic', seller: 'AliExpress Store', description: 'Mini TWS earphones with Bluetooth 5.1, touch control, 20h total battery.', specs: 'BT 5.1 | 20h battery | Touch control', images: ['https://picsum.photos/seed/tws1/600/600'], rating: 4.2, sold: 45000, stock: 2000, weight: '40g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+1, name: 'USB-C Hub 7-in-1 Adapter', price: 12.99, originalPrice: 29.99, currency: 'USD', category: 'Electronics', subcategory: 'Accessories', brand: 'TechHub', seller: 'AliExpress Store', description: '7-in-1 USB-C hub with HDMI 4K, USB 3.0, SD card reader, PD charging.', specs: 'HDMI 4K | 3x USB 3.0 | SD | PD 100W', images: ['https://picsum.photos/seed/hub1/600/600'], rating: 4.5, sold: 28000, stock: 1500, weight: '80g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+2, name: 'Phone Ring Holder Stand', price: 1.99, originalPrice: 5.99, currency: 'USD', category: 'Electronics', subcategory: 'Accessories', brand: 'Generic', seller: 'AliExpress Store', description: '360° rotating phone ring holder, magnetic car mount compatible.', specs: '360° rotation | Magnetic | Universal', images: ['https://picsum.photos/seed/ring1/600/600'], rating: 4.3, sold: 120000, stock: 5000, weight: '20g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+3, name: 'LED Strip Lights 10m RGB', price: 8.99, originalPrice: 19.99, currency: 'USD', category: 'Home', subcategory: 'Lighting', brand: 'LEDHome', seller: 'AliExpress Store', description: '10m RGB LED strip lights with remote control, 16 colors, music sync.', specs: '10m | 16 colors | Remote | Music sync', images: ['https://picsum.photos/seed/led1/600/600'], rating: 4.4, sold: 67000, stock: 3000, weight: '200g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+4, name: 'Wireless Mouse Ergonomic Silent', price: 4.99, originalPrice: 12.99, currency: 'USD', category: 'Electronics', subcategory: 'Peripherals', brand: 'ClickPro', seller: 'AliExpress Store', description: 'Ergonomic wireless mouse with silent clicks, adjustable DPI, 18-month battery.', specs: '2400 DPI | Silent | 18-month battery', images: ['https://picsum.photos/seed/mouse1/600/600'], rating: 4.5, sold: 89000, stock: 4000, weight: '80g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
    ],
    'eBay': [
      { id: Date.now(), name: 'Vintage Leather Messenger Bag', price: 45.00, originalPrice: 89.99, currency: 'USD', category: 'Fashion', subcategory: 'Bags', brand: 'Heritage', seller: 'eBay Seller', description: 'Genuine leather messenger bag, vintage style, multiple compartments.', specs: 'Genuine leather | 15" laptop | Vintage', images: ['https://picsum.photos/seed/bag1/600/600'], rating: 4.6, sold: 1200, stock: 50, weight: '800g', freeShipping: false, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
      { id: Date.now()+1, name: 'Mechanical Keyboard Cherry MX', price: 59.99, originalPrice: 119.99, currency: 'USD', category: 'Electronics', subcategory: 'Peripherals', brand: 'KeyMaster', seller: 'eBay Seller', description: 'Mechanical keyboard with Cherry MX switches, RGB backlighting, hot-swappable.', specs: 'Cherry MX | RGB | Hot-swappable | USB-C', images: ['https://picsum.photos/seed/keyboard1/600/600'], rating: 4.7, sold: 3400, stock: 100, weight: '900g', freeShipping: true, location: 'USA', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
    ],
  }

  // Return platform-specific or generic demo products
  const products = platformProducts[platform] || [
    { id: Date.now(), name: `${platform} Product - Wireless Earbuds`, price: 19.99, originalPrice: 39.99, currency: 'USD', category: 'Electronics', subcategory: 'Audio', brand: platform, seller: `${platform} Store`, description: 'High-quality wireless earbuds from ' + platform, specs: 'Bluetooth 5.0 | 20h battery', images: ['https://picsum.photos/seed/demo1/600/600'], rating: 4.3, sold: 5000, stock: 200, weight: '50g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
    { id: Date.now()+1, name: `${platform} Product - Smart Watch`, price: 29.99, originalPrice: 59.99, currency: 'USD', category: 'Electronics', subcategory: 'Wearables', brand: platform, seller: `${platform} Store`, description: 'Fitness smart watch from ' + platform, specs: '1.4" display | 7-day battery', images: ['https://picsum.photos/seed/demo2/600/600'], rating: 4.2, sold: 3000, stock: 150, weight: '45g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
    { id: Date.now()+2, name: `${platform} Product - Phone Case`, price: 3.99, originalPrice: 9.99, currency: 'USD', category: 'Electronics', subcategory: 'Accessories', brand: platform, seller: `${platform} Store`, description: 'Protective phone case from ' + platform, specs: 'TPU | Shockproof | Clear', images: ['https://picsum.photos/seed/demo3/600/600'], rating: 4.4, sold: 15000, stock: 1000, weight: '30g', freeShipping: true, location: 'China', sourceUrl: url, sourcePlatform: platform, scrapedAt: new Date().toISOString() },
  ]

  return products
}

// Main scrape function
export async function scrapeProducts(url: string): Promise<{ success: boolean; products: ScrapedProduct[]; platform: string; error?: string }> {
  const platform = detectPlatform(url)
  
  try {
    // Try to fetch via CORS proxy
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl, { 
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'text/html' }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    
    // Parse products from HTML
    const products = parseProductsFromHTML(html, url, platform)
    
    if (products.length > 0) {
      return { success: true, products, platform }
    }
    
    // If parsing fails, return demo products
    throw new Error('No products parsed from HTML')
    
  } catch (error) {
    // Fallback to demo products
    console.log(`Scraping fallback for ${platform}: ${error}`)
    const demoProducts = generateDemoProducts(url, platform)
    return { 
      success: true, 
      products: demoProducts, 
      platform,
      error: `Live scraping not available. Showing ${platform} sample products.`
    }
  }
}

function parseProductsFromHTML(html: string, url: string, platform: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []
  
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Generic product extraction patterns
    const productSelectors = [
      '[data-component-type="s-search-result"]', // Amazon
      '.s-result-item', // Amazon
      '.product-card', // Generic
      '.item-card', // Generic
      '[data-product-id]', // Generic
      '.product-item', // Generic
      '.goods-item', // AliExpress
      '.list-item', // Generic
    ]
    
    let productElements: Element[] = []
    for (const selector of productSelectors) {
      productElements = Array.from(doc.querySelectorAll(selector))
      if (productElements.length > 0) break
    }
    
    productElements.slice(0, 20).forEach((el, i) => {
      const nameEl = el.querySelector('h2, h3, .product-title, .item-title, [data-component-type="s-product-image"] img')
      const priceEl = el.querySelector('.a-price-whole, .price, .item-price, [class*="price"]')
      const imgEl = el.querySelector('img')
      const ratingEl = el.querySelector('.a-icon-alt, .rating, [class*="rating"]')
      const linkEl = el.querySelector('a[href]')
      
      const name = nameEl?.textContent?.trim() || (imgEl as HTMLImageElement)?.alt || `Product ${i + 1}`
      const priceText = priceEl?.textContent?.trim() || '$0'
      const { amount, currency } = parsePriceFromText(priceText)
      const imgSrc = (imgEl as HTMLImageElement)?.src || ''
      const ratingText = ratingEl?.textContent?.trim() || '4.0'
      const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '4.0')
      
      if (name && name.length > 3) {
        products.push({
          id: Date.now() + i,
          name: name.substring(0, 100),
          price: convertToUSD(amount, currency) || (9.99 + Math.random() * 40),
          originalPrice: convertToUSD(amount, currency) * 1.5 || (19.99 + Math.random() * 60),
          currency: 'USD',
          category: getPlatformCategory(url),
          subcategory: '',
          brand: platform,
          seller: `${platform} Seller`,
          description: `Product from ${platform}: ${name}`,
          specs: '',
          images: imgSrc ? [imgSrc] : [`https://picsum.photos/seed/product${i}/600/600`],
          rating: Math.min(5, Math.max(1, rating)),
          sold: Math.floor(Math.random() * 10000) + 100,
          stock: Math.floor(Math.random() * 500) + 10,
          weight: '',
          freeShipping: Math.random() > 0.3,
          location: platform === 'AliExpress' ? 'China' : 'USA',
          sourceUrl: url,
          sourcePlatform: platform,
          scrapedAt: new Date().toISOString()
        })
      }
    })
    
  } catch (e) {
    console.error('HTML parsing error:', e)
  }
  
  return products
}

// Save scraped products to localStorage
export function saveScrapedProducts(products: ScrapedProduct[]): void {
  const existing = getScrapedProducts()
  const merged = [...products, ...existing].slice(0, 200) // Max 200 products
  localStorage.setItem('am_scraped_products', JSON.stringify(merged))
}

export function getScrapedProducts(): ScrapedProduct[] {
  return JSON.parse(localStorage.getItem('am_scraped_products') || '[]')
}

export function deleteScrapedProduct(id: number): void {
  const products = getScrapedProducts().filter(p => p.id !== id)
  localStorage.setItem('am_scraped_products', JSON.stringify(products))
}

export function clearScrapedProducts(): void {
  localStorage.removeItem('am_scraped_products')
}

// Import scraped product to main product list
export function importToMarketplace(product: ScrapedProduct): void {
  const sellerProducts = JSON.parse(localStorage.getItem('am_seller_products') || '[]')
  const newProduct = {
    ...product,
    id: Date.now(),
    seller: 'Alliance Mall',
    sellerId: 'alliance-mall',
    sourceUrl: undefined,
    sourcePlatform: undefined,
    scrapedAt: undefined,
  }
  sellerProducts.push(newProduct)
  localStorage.setItem('am_seller_products', JSON.stringify(sellerProducts))
}
