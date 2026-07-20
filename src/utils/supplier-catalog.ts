// ==================== DROPSHIP SUPPLIER CATALOG ====================
// Products provided by suppliers in the platform ecosystem
// Sellers can browse and add to their store with one click

export interface SupplierProduct {
  id: number
  name: string
  slug: string
  price: number // Cost price (what seller pays)
  suggestedRetail: number // Suggested selling price
  minRetail: number // Minimum allowed selling price
  category: string
  subcategory: string
  brand: string
  supplier: string
  supplierId: string
  description: string
  specs: string
  colors: string[]
  sizes: string[]
  images: string[]
  stock: number
  weight: string
  freeShipping: boolean
  location: string
  shippingTime: string
  rating: number
  sold: number
  commission: number // Platform commission %
  tags: string[]
}

export const SUPPLIER_CATALOG: SupplierProduct[] = [
  // Electronics - Audio
  { id: 10001, name: 'Wireless Bluetooth Earbuds TWS Pro', slug: 'tws-pro', price: 8.50, suggestedRetail: 24.99, minRetail: 15.99, category: 'Electronics', subcategory: 'Audio', brand: 'SoundMax', supplier: 'TechSupply Co', supplierId: 'tech-supply', description: 'Premium TWS earbuds with ANC, 30h battery, Bluetooth 5.3, IPX5 waterproof. High margin product.', specs: 'BT 5.3 | ANC | 30h battery | IPX5 | Touch control', colors: ['#000', '#fff', '#1a73e8'], sizes: [], images: ['https://picsum.photos/seed/tws-pro/600/600', 'https://picsum.photos/seed/tws-pro2/600/600'], stock: 5000, weight: '50g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.5, sold: 45000, commission: 5, tags: ['bestseller', 'high-margin', 'trending'] },
  { id: 10002, name: 'Over-Ear Gaming Headset RGB', slug: 'gaming-headset', price: 12.00, suggestedRetail: 39.99, minRetail: 24.99, category: 'Electronics', subcategory: 'Audio', brand: 'GamePro', supplier: 'TechSupply Co', supplierId: 'tech-supply', description: '7.1 surround sound gaming headset with RGB lighting, noise-cancelling mic, comfortable memory foam.', specs: '7.1 Surround | RGB | Noise-cancelling mic | Memory foam', colors: ['#000', '#e74c3c'], sizes: [], images: ['https://picsum.photos/seed/gaming-headset/600/600'], stock: 3000, weight: '350g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.3, sold: 12000, commission: 5, tags: ['gaming', 'high-margin'] },
  { id: 10003, name: 'Portable Bluetooth Speaker Waterproof', slug: 'bt-speaker', price: 10.00, suggestedRetail: 34.99, minRetail: 19.99, category: 'Electronics', subcategory: 'Audio', brand: 'BassBoom', supplier: 'TechSupply Co', supplierId: 'tech-supply', description: 'IPX7 waterproof speaker with 360° sound, 24h battery, TWS pairing.', specs: '20W | IPX7 | 24h battery | TWS pairing', colors: ['#000', '#1a73e8', '#e74c3c'], sizes: [], images: ['https://picsum.photos/seed/bt-speaker/600/600'], stock: 4000, weight: '580g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.4, sold: 28000, commission: 5, tags: ['bestseller', 'outdoor'] },

  // Electronics - Wearables
  { id: 10004, name: 'Smart Watch Ultra Fitness Tracker', slug: 'smart-watch', price: 15.00, suggestedRetail: 49.99, minRetail: 29.99, category: 'Electronics', subcategory: 'Wearables', brand: 'TechFit', supplier: 'GadgetWorld', supplierId: 'gadget-world', description: 'Advanced smartwatch with AMOLED display, heart rate, SpO2, GPS, 7-day battery.', specs: '1.5" AMOLED | HR | SpO2 | GPS | 7-day battery | IP68', colors: ['#000', '#333', '#e74c3c'], sizes: [], images: ['https://picsum.photos/seed/smart-watch/600/600'], stock: 3000, weight: '45g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.3, sold: 32000, commission: 5, tags: ['bestseller', 'high-margin', 'trending'] },
  { id: 10005, name: 'Fitness Band Slim Health Tracker', slug: 'fitness-band', price: 5.00, suggestedRetail: 19.99, minRetail: 12.99, category: 'Electronics', subcategory: 'Wearables', brand: 'FitPro', supplier: 'GadgetWorld', supplierId: 'gadget-world', description: 'Slim fitness band with heart rate, sleep tracking, 14-day battery, IP67 waterproof.', specs: 'HR | Sleep | 14-day battery | IP67', colors: ['#000', '#1a73e8', '#e74c3c', '#27ae60'], sizes: [], images: ['https://picsum.photos/seed/fitness-band/600/600'], stock: 8000, weight: '25g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.2, sold: 55000, commission: 5, tags: ['budget', 'high-volume'] },

  // Electronics - Peripherals
  { id: 10006, name: 'Mechanical Gaming Keyboard RGB Hot-Swap', slug: 'mech-keyboard', price: 18.00, suggestedRetail: 59.99, minRetail: 34.99, category: 'Electronics', subcategory: 'Peripherals', brand: 'KeyMaster', supplier: 'TechSupply Co', supplierId: 'tech-supply', description: 'Full-size mechanical keyboard with hot-swappable switches, RGB, USB-C, PBT keycaps.', specs: 'Hot-swap | RGB | USB-C | PBT keycaps', colors: ['#000'], sizes: [], images: ['https://picsum.photos/seed/mech-keyboard/600/600'], stock: 2000, weight: '900g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.6, sold: 18000, commission: 5, tags: ['gaming', 'high-margin'] },
  { id: 10007, name: 'Wireless Ergonomic Mouse Silent', slug: 'wireless-mouse', price: 4.50, suggestedRetail: 15.99, minRetail: 9.99, category: 'Electronics', subcategory: 'Peripherals', brand: 'ClickPro', supplier: 'TechSupply Co', supplierId: 'tech-supply', description: 'Ergonomic wireless mouse with silent clicks, adjustable DPI, 18-month battery.', specs: '2400 DPI | Silent | 18-month battery', colors: ['#000', '#fff', '#1a73e8'], sizes: [], images: ['https://picsum.photos/seed/wireless-mouse/600/600'], stock: 10000, weight: '80g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.5, sold: 67000, commission: 5, tags: ['bestseller', 'budget', 'high-volume'] },

  // Electronics - Accessories
  { id: 10008, name: 'USB-C Fast Charging Cable 3-Pack', slug: 'usb-c-cable', price: 3.00, suggestedRetail: 12.99, minRetail: 7.99, category: 'Electronics', subcategory: 'Accessories', brand: 'ChargePro', supplier: 'TechSupply Co', supplierId: 'tech-supply', description: 'Braided USB-C cables, 100W PD, USB 3.0 data, 3ft/6ft/10ft.', specs: '100W PD | USB 3.0 | 3ft/6ft/10ft', colors: ['#000', '#fff'], sizes: [], images: ['https://picsum.photos/seed/usb-c-cable/600/600'], stock: 15000, weight: '120g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.7, sold: 89000, commission: 5, tags: ['bestseller', 'budget', 'high-volume'] },
  { id: 10009, name: 'Portable Charger 20000mAh 65W', slug: 'power-bank', price: 12.00, suggestedRetail: 39.99, minRetail: 24.99, category: 'Electronics', subcategory: 'Accessories', brand: 'PowerMax', supplier: 'GadgetWorld', supplierId: 'gadget-world', description: '20000mAh power bank with 65W USB-C PD, dual USB-A, LED display.', specs: '20000mAh | 65W PD | USB-C | 2x USB-A', colors: ['#000', '#fff'], sizes: [], images: ['https://picsum.photos/seed/power-bank/600/600'], stock: 5000, weight: '350g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.5, sold: 34000, commission: 5, tags: ['bestseller', 'high-margin'] },
  { id: 10010, name: 'Phone Ring Holder Stand Magnetic', slug: 'phone-ring', price: 0.80, suggestedRetail: 4.99, minRetail: 2.99, category: 'Electronics', subcategory: 'Accessories', brand: 'Generic', supplier: 'DirectChina', supplierId: 'direct-china', description: '360° rotating phone ring holder, magnetic car mount compatible.', specs: '360° rotation | Magnetic | Universal', colors: ['#000', '#c0392b', '#f39c12'], sizes: [], images: ['https://picsum.photos/seed/phone-ring/600/600'], stock: 30000, weight: '20g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '7-14 days', rating: 4.3, sold: 120000, commission: 5, tags: ['budget', 'high-volume', 'impulse'] },

  // Fashion
  { id: 10011, name: 'Men\'s Casual Cotton T-Shirt', slug: 'mens-tshirt', price: 3.50, suggestedRetail: 14.99, minRetail: 9.99, category: 'Fashion', subcategory: 'Men\'s Clothing', brand: 'UrbanStyle', supplier: 'FashionHub', supplierId: 'fashion-hub', description: '100% cotton casual t-shirt, modern fit, 15 colors available.', specs: '100% Cotton | Regular fit | S-3XL', colors: ['#000', '#fff', '#1a73e8', '#27ae60', '#e74c3c'], sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], images: ['https://picsum.photos/seed/mens-tshirt/600/600'], stock: 10000, weight: '200g', freeShipping: false, location: 'Guangzhou, China', shippingTime: '7-14 days', rating: 4.2, sold: 89000, commission: 5, tags: ['bestseller', 'fashion', 'high-volume'] },
  { id: 10012, name: 'Women\'s Running Shoes Lightweight', slug: 'womens-shoes', price: 10.00, suggestedRetail: 39.99, minRetail: 24.99, category: 'Fashion', subcategory: 'Women\'s Shoes', brand: 'SpeedRun', supplier: 'FashionHub', supplierId: 'fashion-hub', description: 'Lightweight mesh running shoes, EVA cushioning, breathable.', specs: '220g | EVA | Mesh upper', colors: ['#000', '#fff', '#e74c3c', '#1a73e8'], sizes: ['36', '37', '38', '39', '40', '41', '42'], images: ['https://picsum.photos/seed/womens-shoes/600/600'], stock: 5000, weight: '220g', freeShipping: true, location: 'Guangzhou, China', shippingTime: '7-14 days', rating: 4.6, sold: 45000, commission: 5, tags: ['fashion', 'trending'] },
  { id: 10013, name: 'Women\'s Leather Crossbody Bag', slug: 'crossbody-bag', price: 8.00, suggestedRetail: 35.99, minRetail: 19.99, category: 'Fashion', subcategory: 'Bags', brand: 'LuxeBag', supplier: 'FashionHub', supplierId: 'fashion-hub', description: 'PU leather crossbody bag, multiple compartments, adjustable strap.', specs: 'PU Leather | 25x18x8cm', colors: ['#000', '#8B4513', '#c0392b', '#f5c6d0'], sizes: [], images: ['https://picsum.photos/seed/crossbody-bag/600/600'], stock: 3000, weight: '400g', freeShipping: false, location: 'Guangzhou, China', shippingTime: '7-14 days', rating: 4.5, sold: 23000, commission: 5, tags: ['fashion', 'high-margin'] },

  // Home
  { id: 10014, name: 'LED Desk Lamp Dimmable Touch', slug: 'desk-lamp', price: 7.00, suggestedRetail: 24.99, minRetail: 14.99, category: 'Home', subcategory: 'Lighting', brand: 'BrightHome', supplier: 'HomeEssentials', supplierId: 'home-essentials', description: 'LED desk lamp with 5 color modes, 10 brightness levels, touch control, USB charging port.', specs: '10W | 5 modes | 10 levels | USB port', colors: ['#000', '#fff'], sizes: [], images: ['https://picsum.photos/seed/desk-lamp/600/600'], stock: 3000, weight: '600g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.5, sold: 28000, commission: 5, tags: ['home', 'high-margin'] },
  { id: 10015, name: 'Stainless Steel Water Bottle 750ml', slug: 'water-bottle', price: 4.00, suggestedRetail: 16.99, minRetail: 9.99, category: 'Home', subcategory: 'Kitchen & Dining', brand: 'HydroLife', supplier: 'HomeEssentials', supplierId: 'home-essentials', description: 'Double-wall vacuum insulated, keeps hot 12h / cold 24h.', specs: '750ml | 304 SS | Hot 12h | Cold 24h', colors: ['#c0392b', '#2c3e50', '#27ae60', '#f39c12'], sizes: [], images: ['https://picsum.photos/seed/water-bottle/600/600'], stock: 8000, weight: '350g', freeShipping: false, location: 'Shanghai, China', shippingTime: '7-14 days', rating: 4.8, sold: 67000, commission: 5, tags: ['bestseller', 'high-volume', 'home'] },
  { id: 10016, name: 'Essential Oil Diffuser 500ml', slug: 'oil-diffuser', price: 8.00, suggestedRetail: 26.99, minRetail: 16.99, category: 'Home', subcategory: 'Home Decor', brand: 'AromaHome', supplier: 'HomeEssentials', supplierId: 'home-essentials', description: 'Ultrasonic diffuser with 7 LED colors, 12h runtime, auto shut-off.', specs: '500ml | 12h | 7 LED | Auto shut-off', colors: ['#fff', '#8B4513'], sizes: [], images: ['https://picsum.photos/seed/oil-diffuser/600/600'], stock: 4000, weight: '400g', freeShipping: true, location: 'Shenzhen, China', shippingTime: '5-10 days', rating: 4.6, sold: 34000, commission: 5, tags: ['home', 'trending'] },

  // Beauty
  { id: 10017, name: 'Vitamin C Face Serum Brightening', slug: 'vitamin-c-serum', price: 3.00, suggestedRetail: 18.99, minRetail: 11.99, category: 'Beauty', subcategory: 'Skincare', brand: 'GlowSkin', supplier: 'BeautyWorld', supplierId: 'beauty-world', description: 'Vitamin C + Hyaluronic Acid + Vitamin E serum, 30ml.', specs: '30ml | Vitamin C | HA | Vitamin E', colors: [], sizes: [], images: ['https://picsum.photos/seed/vitamin-c-serum/600/600'], stock: 6000, weight: '50g', freeShipping: false, location: 'Seoul, Korea', shippingTime: '5-10 days', rating: 4.4, sold: 56000, commission: 5, tags: ['beauty', 'bestseller', 'high-margin'] },
  { id: 10018, name: 'Professional Makeup Brush Set 12pcs', slug: 'makeup-brushes', price: 4.00, suggestedRetail: 22.99, minRetail: 12.99, category: 'Beauty', subcategory: 'Makeup', brand: 'GlamPro', supplier: 'BeautyWorld', supplierId: 'beauty-world', description: '12-piece synthetic brush set with carrying case.', specs: '12 pieces | Synthetic | Wood handle', colors: ['#f5c6d0', '#2c3e50'], sizes: [], images: ['https://picsum.photos/seed/makeup-brushes/600/600'], stock: 5000, weight: '300g', freeShipping: false, location: 'Seoul, Korea', shippingTime: '5-10 days', rating: 4.6, sold: 42000, commission: 5, tags: ['beauty', 'high-margin'] },

  // Sports
  { id: 10019, name: 'Yoga Mat Non-Slip 6mm', slug: 'yoga-mat', price: 5.00, suggestedRetail: 19.99, minRetail: 12.99, category: 'Sports', subcategory: 'Yoga', brand: 'FlexFit', supplier: 'SportZone', supplierId: 'sport-zone', description: 'TPE non-slip yoga mat with alignment lines, 183x61cm.', specs: '6mm | 183x61cm | TPE | Non-slip', colors: ['#9b59b6', '#1a73e8', '#27ae60', '#e74c3c'], sizes: [], images: ['https://picsum.photos/seed/yoga-mat/600/600'], stock: 6000, weight: '1.2kg', freeShipping: true, location: 'Jakarta, Indonesia', shippingTime: '3-7 days', rating: 4.7, sold: 52000, commission: 5, tags: ['sports', 'bestseller'] },
  { id: 10020, name: 'Resistance Bands Set of 5', slug: 'resistance-bands', price: 3.00, suggestedRetail: 15.99, minRetail: 9.99, category: 'Sports', subcategory: 'Fitness', brand: 'FlexFit', supplier: 'SportZone', supplierId: 'sport-zone', description: '5 resistance levels (10-50 lbs), natural latex, with carry bag.', specs: '5 levels | 10-50 lbs | Natural latex', colors: ['#e74c3c', '#f39c12', '#27ae60', '#1a73e8', '#9b59b6'], sizes: [], images: ['https://picsum.photos/seed/resistance-bands/600/600'], stock: 10000, weight: '400g', freeShipping: false, location: 'Jakarta, Indonesia', shippingTime: '3-7 days', rating: 4.5, sold: 68000, commission: 5, tags: ['sports', 'budget', 'high-volume'] },
]

// Seller product (after adding from catalog)
export interface SellerProduct {
  id: number
  catalogId: number // Reference to supplier catalog
  name: string
  costPrice: number
  sellingPrice: number
  profit: number
  profitMargin: number
  category: string
  subcategory: string
  brand: string
  supplier: string
  description: string
  specs: string
  colors: string[]
  sizes: string[]
  images: string[]
  stock: number
  weight: string
  freeShipping: boolean
  location: string
  rating: number
  sold: number
  sellerId: string
  seller: string
  addedAt: string
  status: 'active' | 'inactive'
}

export function addFromCatalog(catalogId: number, sellingPrice: number, sellerId: string, sellerName: string): SellerProduct | null {
  const product = SUPPLIER_CATALOG.find(p => p.id === catalogId)
  if (!product) return null

  const profit = sellingPrice - product.price
  const profitMargin = Math.round((profit / product.price) * 100)

  const sellerProduct: SellerProduct = {
    id: Date.now(),
    catalogId: catalogId,
    name: product.name,
    costPrice: product.price,
    sellingPrice: sellingPrice,
    profit: profit,
    profitMargin: profitMargin,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand,
    supplier: product.supplier,
    description: product.description,
    specs: product.specs,
    colors: product.colors,
    sizes: product.sizes,
    images: product.images,
    stock: product.stock,
    weight: product.weight,
    freeShipping: product.freeShipping,
    location: product.location,
    rating: product.rating,
    sold: 0,
    sellerId: sellerId,
    seller: sellerName,
    addedAt: new Date().toISOString(),
    status: 'active',
  }

  // Save to seller products
  const existing = JSON.parse(localStorage.getItem('am_seller_products') || '[]')
  existing.push(sellerProduct)
  localStorage.setItem('am_seller_products', JSON.stringify(existing))

  return sellerProduct
}

export function getSellerCatalogProducts(sellerId: string): SellerProduct[] {
  return JSON.parse(localStorage.getItem('am_seller_products') || '[]').filter((p: SellerProduct) => p.sellerId === sellerId)
}

export function updateSellerProductPrice(productId: number, newPrice: number): void {
  const products = JSON.parse(localStorage.getItem('am_seller_products') || '[]')
  const product = products.find((p: SellerProduct) => p.id === productId)
  if (product) {
    product.sellingPrice = newPrice
    product.profit = newPrice - product.costPrice
    product.profitMargin = Math.round((product.profit / product.costPrice) * 100)
    localStorage.setItem('am_seller_products', JSON.stringify(products))
  }
}

export function removeSellerProduct(productId: number): void {
  const products = JSON.parse(localStorage.getItem('am_seller_products') || '[]').filter((p: SellerProduct) => p.id !== productId)
  localStorage.setItem('am_seller_products', JSON.stringify(products))
}

export function getSupplierByProduct(catalogId: number): string {
  const product = SUPPLIER_CATALOG.find(p => p.id === catalogId)
  return product?.supplier || 'Unknown'
}
