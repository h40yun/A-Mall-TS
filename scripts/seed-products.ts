// ==================== SEED PRODUCTS SCRIPT ====================
// Run: npx tsx scripts/seed-products.ts
// Populates Supabase with initial product data

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://toyehtrxtlaajudaxedk.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '' // Use service key for seeding

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const SEED_PRODUCTS = [
  {name:"Wireless Bluetooth Headphones Pro",price:29.99,original_price:59.99,category:"Electronics",subcategory:"Audio",rating:4.5,sold:2847,brand:"SoundMax",description:"Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",specs:"Driver: 40mm | Battery: 30h | Weight: 250g | Bluetooth: 5.0 | ANC: Yes",colors:["#000","#fff","#1a73e8"],stock:156,sku:"SM-BT500-BLK",images:["https://picsum.photos/seed/headphones1/600/600","https://picsum.photos/seed/headphones2/600/600"],weight:"250g",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Shenzhen, China"},
  {name:"Smart Watch Ultra Fitness Tracker",price:49.99,original_price:89.99,category:"Electronics",subcategory:"Wearables",rating:4.3,sold:5120,brand:"TechFit",description:"Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis.",specs:"Display: 1.4\" AMOLED | Battery: 7 days | Waterproof: IP68",colors:["#000","#333","#e74c3c"],stock:230,sku:"TF-SWU-001",images:["https://picsum.photos/seed/watch1/600/600","https://picsum.photos/seed/watch2/600/600"],weight:"45g",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Shenzhen, China"},
  {name:"USB-C Fast Charging Cable 3-Pack",price:12.99,original_price:24.99,category:"Electronics",subcategory:"Accessories",rating:4.7,sold:12400,brand:"ChargePro",description:"Premium braided USB-C cables with 100W fast charging support.",specs:"Length: 3ft/6ft/10ft | Power: 100W | Data: USB 3.0",colors:["#000","#fff"],stock:500,sku:"CP-USBC-3PK",images:["https://picsum.photos/seed/cable1/600/600"],weight:"120g",return_policy:"30-day return policy.",free_shipping:false,min_order:1,location:"Guangzhou, China"},
  {name:"Portable Bluetooth Speaker Waterproof",price:34.99,original_price:69.99,category:"Electronics",subcategory:"Audio",rating:4.4,sold:3800,brand:"BassBoom",description:"Powerful portable speaker with 360° sound, IPX7 waterproof rating.",specs:"Power: 20W | Battery: 24h | Waterproof: IPX7",colors:["#000","#1a73e8","#e74c3c"],stock:189,sku:"BB-SPK-020",images:["https://picsum.photos/seed/speaker1/600/600","https://picsum.photos/seed/speaker2/600/600"],weight:"580g",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Shenzhen, China"},
  {name:"Men's Casual Cotton T-Shirt",price:14.99,original_price:29.99,category:"Fashion",subcategory:"Men's Clothing",rating:4.2,sold:8900,brand:"UrbanStyle",description:"Comfortable 100% cotton t-shirt with modern fit.",specs:"Material: 100% Cotton | Fit: Regular | Sizes: S-3XL",colors:["#000","#fff","#1a73e8","#27ae60","#e74c3c"],sizes:["S","M","L","XL","XXL","3XL"],stock:350,sku:"US-CT-M01",images:["https://picsum.photos/seed/tshirt1/600/600","https://picsum.photos/seed/tshirt2/600/600"],weight:"200g",return_policy:"30-day return policy.",free_shipping:false,min_order:1,location:"Los Angeles, USA"},
  {name:"Women's Running Shoes Lightweight",price:39.99,original_price:79.99,category:"Fashion",subcategory:"Shoes",rating:4.6,sold:6200,brand:"SpeedRun",description:"Ultra-lightweight running shoes with responsive cushioning.",specs:"Weight: 220g | Cushion: EVA | Upper: Mesh",colors:["#000","#fff","#e74c3c","#1a73e8"],sizes:["36","37","38","39","40","41","42"],stock:200,sku:"SR-RS-LW",images:["https://picsum.photos/seed/shoes1/600/600","https://picsum.photos/seed/shoes2/600/600"],weight:"220g",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Jakarta, Indonesia"},
  {name:"Stainless Steel Water Bottle 750ml",price:16.99,original_price:29.99,category:"Home & Kitchen",subcategory:"Kitchen",rating:4.8,sold:15600,brand:"HydroLife",description:"Double-wall vacuum insulated water bottle.",specs:"Capacity: 750ml | Material: 304 Stainless Steel",colors:["#c0392b","#2c3e50","#27ae60","#f39c12"],stock:800,sku:"HL-WB-750",images:["https://picsum.photos/seed/bottle1/600/600","https://picsum.photos/seed/bottle2/600/600"],weight:"350g",return_policy:"30-day return policy.",free_shipping:false,min_order:1,location:"Shanghai, China"},
  {name:"LED Desk Lamp Dimmable Touch Control",price:24.99,original_price:49.99,category:"Home & Kitchen",subcategory:"Lighting",rating:4.5,sold:4300,brand:"BrightHome",description:"Modern LED desk lamp with 5 color modes and 10 brightness levels.",specs:"Power: 10W | Modes: 5 Color | Brightness: 10 Levels",colors:["#000","#fff"],stock:320,sku:"BH-DL-010",images:["https://picsum.photos/seed/lamp1/600/600","https://picsum.photos/seed/lamp2/600/600"],weight:"600g",return_policy:"30-day return policy.",free_shipping:false,min_order:1,location:"Shenzhen, China"},
  {name:"Vitamin C Face Serum Brightening",price:18.99,original_price:35.99,category:"Beauty & Personal Care",subcategory:"Skincare",rating:4.4,sold:7800,brand:"GlowSkin",description:"Potent Vitamin C serum with hyaluronic acid and vitamin E.",specs:"Volume: 30ml | Key: Vitamin C, Hyaluronic Acid",colors:[],stock:450,sku:"GS-VC-30ML",images:["https://picsum.photos/seed/serum1/600/600","https://picsum.photos/seed/serum2/600/600"],weight:"50g",return_policy:"Sealed products only.",free_shipping:false,min_order:1,location:"Seoul, Korea"},
  {name:"Yoga Mat Non-Slip 6mm Thick",price:19.99,original_price:39.99,category:"Sports & Outdoors",subcategory:"Yoga",rating:4.7,sold:11000,brand:"FlexFit",description:"Premium non-slip yoga mat with alignment lines.",specs:"Thickness: 6mm | Size: 183x61cm | Material: TPE",colors:["#9b59b6","#1a73e8","#27ae60","#e74c3c"],stock:700,sku:"FF-YM-6MM",images:["https://picsum.photos/seed/yoga1/600/600","https://picsum.photos/seed/yoga2/600/600"],weight:"1.2kg",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Jakarta, Indonesia"},
  {name:"Mechanical Gaming Keyboard RGB",price:44.99,original_price:79.99,category:"Electronics",subcategory:"Peripherals",rating:4.6,sold:5600,brand:"GamePro",description:"Full-size mechanical keyboard with hot-swappable switches, RGB backlighting.",specs:"Switches: Mechanical | Backlight: RGB | Layout: Full",colors:["#000"],stock:280,sku:"GP-KB-MEC",images:["https://picsum.photos/seed/keyboard1/600/600","https://picsum.photos/seed/keyboard2/600/600"],weight:"900g",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Shenzhen, China"},
  {name:"Wireless Mouse Ergonomic Silent",price:15.99,original_price:29.99,category:"Electronics",subcategory:"Peripherals",rating:4.4,sold:7600,brand:"ClickPro",description:"Ergonomic wireless mouse with silent clicks.",specs:"DPI: 800/1200/1600/2400 | Battery: 18 months",colors:["#000","#fff","#1a73e8"],stock:600,sku:"CP-WM-ERG",images:["https://picsum.photos/seed/mouse1/600/600","https://picsum.photos/seed/mouse2/600/600"],weight:"80g",return_policy:"30-day return policy.",free_shipping:false,min_order:1,location:"Shenzhen, China"},
  {name:"Organic Green Tea Premium 100 Bags",price:11.99,original_price:22.99,category:"Food & Grocery",subcategory:"Tea & Coffee",rating:4.7,sold:9800,brand:"TeaNature",description:"Premium organic green tea sourced from high-altitude gardens.",specs:"Bags: 100 | Type: Organic Green Tea | Origin: Japan",colors:[],stock:1000,sku:"TN-GT-100",images:["https://picsum.photos/seed/tea1/600/600","https://picsum.photos/seed/tea2/600/600"],weight:"200g",return_policy:"Sealed products only.",free_shipping:false,min_order:1,location:"Kyoto, Japan"},
  {name:"Building Blocks Creative Set 500pcs",price:27.99,original_price:49.99,category:"Toys & Games",subcategory:"Building",rating:4.8,sold:6500,brand:"BuildMaster",description:"500-piece creative building block set.",specs:"Pieces: 500 | Age: 6+ | Material: ABS Plastic",colors:[],stock:250,sku:"BM-BB-500",images:["https://picsum.photos/seed/blocks1/600/600","https://picsum.photos/seed/blocks2/600/600"],weight:"1.5kg",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"Shenzhen, China"},
  {name:"Bestselling Novel Collection Box Set",price:45.99,original_price:89.99,category:"Books & Media",subcategory:"Fiction",rating:4.9,sold:2100,brand:"BookWorld",description:"Collection of 5 bestselling novels.",specs:"Books: 5 | Format: Hardcover | Language: English",colors:[],stock:120,sku:"BW-NOVEL-5B",images:["https://picsum.photos/seed/books1/600/600","https://picsum.photos/seed/books2/600/600"],weight:"2kg",return_policy:"30-day return policy.",free_shipping:true,min_order:1,location:"New York, USA"},
]

async function seed() {
  console.log('Seeding products...')

  // First, create seller stores
  const stores = [
    { name: 'AudioWorld Store', slug: 'audio-world', category: 'Electronics', logo_initial: 'A', location: 'Shenzhen, China' },
    { name: 'GadgetHub', slug: 'gadget-hub', category: 'Electronics', logo_initial: 'G', location: 'Shenzhen, China' },
    { name: 'Tech Essentials', slug: 'tech-essentials', category: 'Electronics', logo_initial: 'T', location: 'Guangzhou, China' },
    { name: 'Fashion Hub', slug: 'fashion-hub', category: 'Fashion', logo_initial: 'F', location: 'Los Angeles, USA' },
    { name: 'SportZone', slug: 'sport-zone', category: 'Sports & Outdoors', logo_initial: 'S', location: 'Jakarta, Indonesia' },
    { name: 'Home Essentials', slug: 'home-essentials', category: 'Home & Kitchen', logo_initial: 'H', location: 'Shanghai, China' },
    { name: 'Beauty Palace', slug: 'beauty-palace', category: 'Beauty & Personal Care', logo_initial: 'B', location: 'Seoul, Korea' },
    { name: 'Organic Market', slug: 'organic-market', category: 'Food & Grocery', logo_initial: 'O', location: 'Kyoto, Japan' },
    { name: 'Toy Land', slug: 'toy-land', category: 'Toys & Games', logo_initial: 'T', location: 'Shenzhen, China' },
    { name: 'Book Haven', slug: 'book-haven', category: 'Books & Media', logo_initial: 'B', location: 'New York, USA' },
  ]

  // Upsert stores
  for (const store of stores) {
    const { error } = await supabase
      .from('seller_stores')
      .upsert(store, { onConflict: 'slug' })
    if (error) console.error(`Store ${store.name} error:`, error.message)
    else console.log(`  ✓ Store: ${store.name}`)
  }

  // Get store IDs
  const { data: dbStores } = await supabase.from('seller_stores').select('id, name')
  const storeMap = new Map(dbStores?.map(s => [s.name, s.id]) || [])

  // Insert products
  let count = 0
  for (const p of SEED_PRODUCTS) {
    const storeName = p.name.includes('Headphones') || p.name.includes('Speaker') ? 'AudioWorld Store'
      : p.name.includes('Watch') || p.name.includes('Keyboard') ? 'GadgetHub'
      : p.name.includes('Cable') || p.name.includes('Mouse') ? 'Tech Essentials'
      : p.name.includes('T-Shirt') ? 'Fashion Hub'
      : p.name.includes('Shoes') ? 'SportZone'
      : p.name.includes('Bottle') || p.name.includes('Lamp') ? 'Home Essentials'
      : p.name.includes('Serum') ? 'Beauty Palace'
      : p.name.includes('Yoga') ? 'SportZone'
      : p.name.includes('Tea') ? 'Organic Market'
      : p.name.includes('Blocks') ? 'Toy Land'
      : p.name.includes('Novel') ? 'Book Haven'
      : 'GadgetHub'

    const { error } = await supabase.from('products').upsert({
      ...p,
      seller_id: storeMap.get(storeName) || null,
      is_active: true,
    }, { onConflict: 'sku' })

    if (error) console.error(`Product ${p.name} error:`, error.message)
    else { count++; console.log(`  ✓ Product: ${p.name}` })
  }

  console.log(`\nDone! Seeded ${count} products and ${stores.length} stores.`)
}

seed().catch(console.error)
