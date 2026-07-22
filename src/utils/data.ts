// ==================== STATIC DATA ====================
// Products come from Supabase DB. Only static reference data here.
import type { Category, Coupon, Voucher, BrandStory } from '../types'

export const CATEGORIES: Category[] = [
  {name:"Electronics",icon:"📱",color:"#3498db",promoted:true,subcategories:[
    {name:"Audio",items:["Headphones","Speakers","Earbuds","Soundbars"]},
    {name:"Wearables",items:["Smartwatches","Fitness Trackers","Smart Rings"]},
    {name:"Peripherals",items:["Keyboards","Mice","Webcams","Monitors"]},
    {name:"Accessories",items:["Cables","Chargers","Cases","Power Banks"]},
    {name:"Gaming",items:["Consoles","Controllers","Gaming Chairs"]},
    {name:"Smart Home",items:["Smart Bulbs","Smart Plugs","Smart Speakers"]}
  ]},
  {name:"Fashion",icon:"👗",color:"#e91e63",promoted:true,subcategories:[
    {name:"Men's Clothing",items:["T-Shirts","Pants","Jackets","Suits"]},
    {name:"Women's Clothing",items:["Dresses","Tops","Skirts","Activewear"]},
    {name:"Shoes",items:["Sneakers","Sandals","Boots","Formal"]},
    {name:"Bags",items:["Handbags","Backpacks","Wallets","Luggage"]},
    {name:"Accessories",items:["Watches","Sunglasses","Hats","Belts"]}
  ]},
  {name:"Home & Kitchen",icon:"🏠",color:"#4caf50",promoted:false,subcategories:[
    {name:"Kitchen",items:["Cookware","Utensils","Storage","Appliances"]},
    {name:"Lighting",items:["Lamps","LED Strips","Ceiling Lights"]},
    {name:"Decor",items:["Candles","Vases","Wall Art","Rugs"]},
    {name:"Furniture",items:["Chairs","Tables","Shelves","Desks"]},
    {name:"Storage",items:["Bins","Organizers","Hooks","Shoe Racks"]}
  ]},
  {name:"Beauty & Personal Care",icon:"💄",color:"#9c27b0",promoted:true,subcategories:[
    {name:"Skincare",items:["Serums","Moisturizers","Cleansers","Sunscreen"]},
    {name:"Makeup",items:["Foundation","Lipstick","Mascara","Eyeshadow"]},
    {name:"Hair Care",items:["Shampoo","Conditioner","Styling Tools"]},
    {name:"Fragrance",items:["Perfume","Body Mist","Cologne"]},
    {name:"Tools",items:["Brushes","Mirrors","Hair Dryers"]}
  ]},
  {name:"Sports & Outdoors",icon:"⚽",color:"#ff9800",promoted:false,subcategories:[
    {name:"Yoga",items:["Mats","Blocks","Straps","Clothing"]},
    {name:"Fitness",items:["Resistance Bands","Dumbbells","Jump Ropes"]},
    {name:"Outdoor",items:["Tents","Backpacks","Water Bottles"]},
    {name:"Running",items:["Shoes","Socks","GPS Watch"]},
    {name:"Cycling",items:["Bikes","Helmets","Lights"]}
  ]},
  {name:"Toys & Games",icon:"🧸",color:"#f44336",promoted:false,subcategories:[
    {name:"Building",items:["Blocks","LEGO","Magnetic Tiles"]},
    {name:"RC Vehicles",items:["Cars","Drones","Boats"]},
    {name:"Puzzles",items:["Jigsaw","3D Puzzles","Brain Teasers"]},
    {name:"Board Games",items:["Strategy","Party","Card Games"]},
    {name:"Educational",items:["STEM Kits","Science Sets","Coding Toys"]}
  ]},
  {name:"Books & Media",icon:"📚",color:"#795548",promoted:false,subcategories:[
    {name:"Fiction",items:["Romance","Thriller","Fantasy","Sci-Fi"]},
    {name:"Non-Fiction",items:["Biography","Self-Help","History"]},
    {name:"Technology",items:["Programming","AI","Web Dev"]},
    {name:"Children",items:["Picture Books","Early Learning"]},
    {name:"Cooking",items:["Recipes","Baking","Healthy Eating"]}
  ]},
  {name:"Food & Grocery",icon:"🍕",color:"#ff5722",promoted:false,subcategories:[
    {name:"Tea & Coffee",items:["Green Tea","Black Tea","Matcha"]},
    {name:"Snacks",items:["Chips","Cookies","Protein Bars"]},
    {name:"Organic",items:["Superfoods","Honey","Seeds"]},
    {name:"Beverages",items:["Juice","Soda","Energy Drinks"]}
  ]},
  {name:"Health & Wellness",icon:"💊",color:"#009688",promoted:false,subcategories:[
    {name:"Supplements",items:["Vitamins","Protein","Collagen"]},
    {name:"Medical",items:["First Aid","Thermometers","Masks"]},
    {name:"Fitness Nutrition",items:["Protein Powder","BCAA","Creatine"]}
  ]},
  {name:"Smart Home",icon:"🏡",color:"#4caf50",promoted:false,subcategories:[
    {name:"Voice Assistants",items:["Alexa","Google Home","Smart Display"]},
    {name:"Security",items:["Camera","Doorbell","Lock"]},
    {name:"Lighting",items:["Smart Bulb","LED Strip","Switch"]}
  ]}
]

export const COUPONS: Coupon[] = [
  {id:"c1",code:"WELCOME10",type:"percentage",value:10,minSpend:20,maxDiscount:5,usageLimit:100,usedCount:45,startDate:"2026-01-01",endDate:"2026-12-31",status:"active"},
  {id:"c2",code:"SAVE5",type:"fixed",value:5,minSpend:30,usageLimit:200,usedCount:120,startDate:"2026-01-01",endDate:"2026-12-31",status:"active"},
  {id:"c3",code:"FREESHIP",type:"free_shipping",value:0,minSpend:50,usageLimit:500,usedCount:230,startDate:"2026-01-01",endDate:"2026-12-31",status:"active"},
  {id:"c4",code:"TECH20",type:"percentage",value:20,minSpend:50,maxDiscount:15,usageLimit:50,usedCount:30,startDate:"2026-01-01",endDate:"2026-12-31",storeId:"gadget-hub",status:"active"},
  {id:"c5",code:"FASHION15",type:"percentage",value:15,minSpend:40,maxDiscount:10,usageLimit:80,usedCount:55,startDate:"2026-01-01",endDate:"2026-12-31",storeId:"fashion-hub",status:"active"}
]

export const VOUCHERS: Voucher[] = [
  {id:"v1",code:"NEWUSER",type:"fixed",value:10,minSpend:0,description:"New User Voucher - $10 off your first order",endDate:"2026-12-31",claimed:false},
  {id:"v2",code:"FLASH50",type:"percentage",value:50,minSpend:30,maxDiscount:20,description:"Flash Sale - 50% off (max $20)",endDate:"2026-08-01",claimed:false},
  {id:"v3",code:"FREESHIP50",type:"free_shipping",value:0,minSpend:50,description:"Free Shipping on orders $50+",endDate:"2026-12-31",claimed:false},
  {id:"v4",code:"WEEKEND15",type:"percentage",value:15,minSpend:25,maxDiscount:8,description:"Weekend Special - 15% off",endDate:"2026-08-15",claimed:false},
  {id:"v5",code:"LOYALTY5",type:"fixed",value:5,minSpend:20,description:"Loyalty Reward - $5 off",endDate:"2026-12-31",claimed:false}
]

export const BRAND_STORIES: BrandStory[] = [
  {id:"bs1",brand:"SoundMax",logo:"🔊",tagline:"Premium Audio Experience",image:"https://picsum.photos/seed/brand1/400/200",link:"/store/AudioWorld Store"},
  {id:"bs2",brand:"TechFit",logo:"⌚",tagline:"Smart Wearables for Life",image:"https://picsum.photos/seed/brand2/400/200",link:"/store/GadgetHub"},
  {id:"bs3",brand:"UrbanStyle",logo:"👔",tagline:"Fashion Forward",image:"https://picsum.photos/seed/brand3/400/200",link:"/store/Fashion Hub"},
  {id:"bs4",brand:"FlexFit",logo:"🧘",tagline:"Fitness & Wellness",image:"https://picsum.photos/seed/brand4/400/200",link:"/store/SportZone"},
  {id:"bs5",brand:"GlowSkin",logo:"✨",tagline:"Beauty Essentials",image:"https://picsum.photos/seed/brand5/400/200",link:"/store/Beauty Palace"},
  {id:"bs6",brand:"HydroLife",logo:"💧",tagline:"Sustainable Living",image:"https://picsum.photos/seed/brand6/400/200",link:"/store/Home Essentials"}
]

export const TOP_SEARCHES = [
  "wireless earbuds", "smart watch", "phone case", "laptop stand",
  "yoga mat", "protein powder", "led lights", "air fryer",
  "bluetooth speaker", "running shoes", "backpack", "skincare set"
]

// Backward compatibility: ALL_PRODUCTS now comes from DB
export const ALL_PRODUCTS: any[] = []
export const PRODUCTS: any[] = []

export const LOCATIONS = [
  "All Locations", "China", "USA", "Indonesia", "Japan", "Korea", "UK", "France", "Italy", "Germany", "Australia"
]

export const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Japan', 'South Korea', 'Singapore', 'Indonesia',
  'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'India',
  'Brazil', 'Mexico', 'Argentina', 'Netherlands', 'Italy',
  'Spain', 'Sweden', 'Norway', 'Denmark', 'New Zealand',
  'South Africa', 'Egypt', 'Turkey', 'Russia', 'China'
]

// ============================================================
// SEED PRODUCTS (for initial database population)
// Run: npx tsx scripts/seed-products.ts
// ============================================================
export const SEED_PRODUCTS = [
  {name:"Wireless Bluetooth Headphones Pro",price:29.99,originalPrice:59.99,category:"Electronics",subcategory:"Audio",rating:4.5,sold:2847,brand:"SoundMax",seller:"AudioWorld Store",description:"Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",specs:"Driver: 40mm | Battery: 30h | Weight: 250g | Bluetooth: 5.0 | ANC: Yes",colors:["#000","#fff","#1a73e8"],stock:156,sku:"SM-BT500-BLK",images:["https://picsum.photos/seed/headphones1/600/600","https://picsum.photos/seed/headphones2/600/600"],weight:"250g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {name:"Smart Watch Ultra Fitness Tracker",price:49.99,originalPrice:89.99,category:"Electronics",subcategory:"Wearables",rating:4.3,sold:5120,brand:"TechFit",seller:"GadgetHub",description:"Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis.",specs:"Display: 1.4\" AMOLED | Battery: 7 days | Waterproof: IP68",colors:["#000","#333","#e74c3c"],stock:230,sku:"TF-SWU-001",images:["https://picsum.photos/seed/watch1/600/600","https://picsum.photos/seed/watch2/600/600"],weight:"45g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {name:"USB-C Fast Charging Cable 3-Pack",price:12.99,originalPrice:24.99,category:"Electronics",subcategory:"Accessories",rating:4.7,sold:12400,brand:"ChargePro",seller:"Tech Essentials",description:"Premium braided USB-C cables with 100W fast charging support.",specs:"Length: 3ft/6ft/10ft | Power: 100W | Data: USB 3.0",colors:["#000","#fff"],stock:500,sku:"CP-USBC-3PK",images:["https://picsum.photos/seed/cable1/600/600"],weight:"120g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Guangzhou, China"},
  {name:"Portable Bluetooth Speaker Waterproof",price:34.99,originalPrice:69.99,category:"Electronics",subcategory:"Audio",rating:4.4,sold:3800,brand:"BassBoom",seller:"AudioWorld Store",description:"Powerful portable speaker with 360° sound, IPX7 waterproof rating.",specs:"Power: 20W | Battery: 24h | Waterproof: IPX7",colors:["#000","#1a73e8","#e74c3c"],stock:189,sku:"BB-SPK-020",images:["https://picsum.photos/seed/speaker1/600/600","https://picsum.photos/seed/speaker2/600/600"],weight:"580g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {name:"Men's Casual Cotton T-Shirt",price:14.99,originalPrice:29.99,category:"Fashion",subcategory:"Men's Clothing",rating:4.2,sold:8900,brand:"UrbanStyle",seller:"Fashion Hub",description:"Comfortable 100% cotton t-shirt with modern fit.",specs:"Material: 100% Cotton | Fit: Regular | Sizes: S-3XL",colors:["#000","#fff","#1a73e8","#27ae60","#e74c3c"],sizes:["S","M","L","XL","XXL","3XL"],stock:350,sku:"US-CT-M01",images:["https://picsum.photos/seed/tshirt1/600/600","https://picsum.photos/seed/tshirt2/600/600"],weight:"200g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Los Angeles, USA"},
  {name:"Women's Running Shoes Lightweight",price:39.99,originalPrice:79.99,category:"Fashion",subcategory:"Shoes",rating:4.6,sold:6200,brand:"SpeedRun",seller:"SportZone",description:"Ultra-lightweight running shoes with responsive cushioning.",specs:"Weight: 220g | Cushion: EVA | Upper: Mesh",colors:["#000","#fff","#e74c3c","#1a73e8"],sizes:["36","37","38","39","40","41","42"],stock:200,sku:"SR-RS-LW",images:["https://picsum.photos/seed/shoes1/600/600","https://picsum.photos/seed/shoes2/600/600"],weight:"220g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Jakarta, Indonesia"},
  {name:"Stainless Steel Water Bottle 750ml",price:16.99,originalPrice:29.99,category:"Home & Kitchen",subcategory:"Kitchen",rating:4.8,sold:15600,brand:"HydroLife",seller:"Home Essentials",description:"Double-wall vacuum insulated water bottle.",specs:"Capacity: 750ml | Material: 304 Stainless Steel",colors:["#c0392b","#2c3e50","#27ae60","#f39c12"],stock:800,sku:"HL-WB-750",images:["https://picsum.photos/seed/bottle1/600/600","https://picsum.photos/seed/bottle2/600/600"],weight:"350g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shanghai, China"},
  {name:"LED Desk Lamp Dimmable Touch Control",price:24.99,originalPrice:49.99,category:"Home & Kitchen",subcategory:"Lighting",rating:4.5,sold:4300,brand:"BrightHome",seller:"Home Essentials",description:"Modern LED desk lamp with 5 color modes and 10 brightness levels.",specs:"Power: 10W | Modes: 5 Color | Brightness: 10 Levels",colors:["#000","#fff"],stock:320,sku:"BH-DL-010",images:["https://picsum.photos/seed/lamp1/600/600","https://picsum.photos/seed/lamp2/600/600"],weight:"600g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {name:"Vitamin C Face Serum Brightening",price:18.99,originalPrice:35.99,category:"Beauty & Personal Care",subcategory:"Skincare",rating:4.4,sold:7800,brand:"GlowSkin",seller:"Beauty Palace",description:"Potent Vitamin C serum with hyaluronic acid and vitamin E.",specs:"Volume: 30ml | Key: Vitamin C, Hyaluronic Acid",colors:[],stock:450,sku:"GS-VC-30ML",images:["https://picsum.photos/seed/serum1/600/600","https://picsum.photos/seed/serum2/600/600"],weight:"50g",returnPolicy:"Sealed products only.",freeShipping:false,minOrder:1,location:"Seoul, Korea"},
  {name:"Yoga Mat Non-Slip 6mm Thick",price:19.99,originalPrice:39.99,category:"Sports & Outdoors",subcategory:"Yoga",rating:4.7,sold:11000,brand:"FlexFit",seller:"SportZone",description:"Premium non-slip yoga mat with alignment lines.",specs:"Thickness: 6mm | Size: 183x61cm | Material: TPE",colors:["#9b59b6","#1a73e8","#27ae60","#e74c3c"],stock:700,sku:"FF-YM-6MM",images:["https://picsum.photos/seed/yoga1/600/600","https://picsum.photos/seed/yoga2/600/600"],weight:"1.2kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Jakarta, Indonesia"},
  {name:"Mechanical Gaming Keyboard RGB",price:44.99,originalPrice:79.99,category:"Electronics",subcategory:"Peripherals",rating:4.6,sold:5600,brand:"GamePro",seller:"GadgetHub",description:"Full-size mechanical keyboard with hot-swappable switches, RGB backlighting.",specs:"Switches: Mechanical | Backlight: RGB | Layout: Full",colors:["#000"],stock:280,sku:"GP-KB-MEC",images:["https://picsum.photos/seed/keyboard1/600/600","https://picsum.photos/seed/keyboard2/600/600"],weight:"900g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {name:"Wireless Mouse Ergonomic Silent",price:15.99,originalPrice:29.99,category:"Electronics",subcategory:"Peripherals",rating:4.4,sold:7600,brand:"ClickPro",seller:"Tech Essentials",description:"Ergonomic wireless mouse with silent clicks.",specs:"DPI: 800/1200/1600/2400 | Battery: 18 months",colors:["#000","#fff","#1a73e8"],stock:600,sku:"CP-WM-ERG",images:["https://picsum.photos/seed/mouse1/600/600","https://picsum.photos/seed/mouse2/600/600"],weight:"80g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {name:"Organic Green Tea Premium 100 Bags",price:11.99,originalPrice:22.99,category:"Food & Grocery",subcategory:"Tea & Coffee",rating:4.7,sold:9800,brand:"TeaNature",seller:"Organic Market",description:"Premium organic green tea sourced from high-altitude gardens.",specs:"Bags: 100 | Type: Organic Green Tea | Origin: Japan",colors:[],stock:1000,sku:"TN-GT-100",images:["https://picsum.photos/seed/tea1/600/600","https://picsum.photos/seed/tea2/600/600"],weight:"200g",returnPolicy:"Sealed products only.",freeShipping:false,minOrder:1,location:"Kyoto, Japan"},
  {name:"Building Blocks Creative Set 500pcs",price:27.99,originalPrice:49.99,category:"Toys & Games",subcategory:"Building",rating:4.8,sold:6500,brand:"BuildMaster",seller:"Toy Land",description:"500-piece creative building block set.",specs:"Pieces: 500 | Age: 6+ | Material: ABS Plastic",colors:[],stock:250,sku:"BM-BB-500",images:["https://picsum.photos/seed/blocks1/600/600","https://picsum.photos/seed/blocks2/600/600"],weight:"1.5kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {name:"Bestselling Novel Collection Box Set",price:45.99,originalPrice:89.99,category:"Books & Media",subcategory:"Fiction",rating:4.9,sold:2100,brand:"BookWorld",seller:"Book Haven",description:"Collection of 5 bestselling novels.",specs:"Books: 5 | Format: Hardcover | Language: English",colors:[],stock:120,sku:"BW-NOVEL-5B",images:["https://picsum.photos/seed/books1/600/600","https://picsum.photos/seed/books2/600/600"],weight:"2kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"New York, USA"},
]
