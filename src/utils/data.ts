// ==================== PRODUCT DATA ====================
import type { Product, Category, Coupon, Voucher, BrandStory } from '../types'

export const PRODUCTS: Product[] = [
  {id:1,name:"Wireless Bluetooth Headphones Pro",price:29.99,originalPrice:59.99,category:"Electronics",subcategory:"Audio",rating:4.5,sold:2847,brand:"SoundMax",seller:"AudioWorld Store",sellerId:"audio-world",description:"Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",specs:"Driver: 40mm | Battery: 30h | Weight: 250g | Bluetooth: 5.0 | ANC: Yes",colors:["#000","#fff","#1a73e8"],stock:156,sku:"SM-BT500-BLK",images:["https://picsum.photos/seed/headphones1/600/600","https://picsum.photos/seed/headphones2/600/600","https://picsum.photos/seed/headphones3/600/600","https://picsum.photos/seed/headphones4/600/600"],weight:"250g",returnPolicy:"30-day return policy. Items must be unused and in original packaging.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {id:2,name:"Smart Watch Ultra Fitness Tracker",price:49.99,originalPrice:89.99,category:"Electronics",subcategory:"Wearables",rating:4.3,sold:5120,brand:"TechFit",seller:"GadgetHub",sellerId:"gadget-hub",description:"Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis, and 100+ workout modes.",specs:"Display: 1.4\" AMOLED | Battery: 7 days | Waterproof: IP68",colors:["#000","#333","#e74c3c"],stock:230,sku:"TF-SWU-001",images:["https://picsum.photos/seed/watch1/600/600","https://picsum.photos/seed/watch2/600/600","https://picsum.photos/seed/watch3/600/600"],weight:"45g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {id:3,name:"USB-C Fast Charging Cable 3-Pack",price:12.99,originalPrice:24.99,category:"Electronics",subcategory:"Accessories",rating:4.7,sold:12400,brand:"ChargePro",seller:"Tech Essentials",sellerId:"tech-essentials",description:"Premium braided USB-C cables with 100W fast charging support.",specs:"Length: 3ft/6ft/10ft | Power: 100W | Data: USB 3.0",colors:["#000","#fff"],stock:500,sku:"CP-USBC-3PK",images:["https://picsum.photos/seed/cable1/600/600","https://picsum.photos/seed/cable2/600/600"],weight:"120g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Guangzhou, China"},
  {id:4,name:"Portable Bluetooth Speaker Waterproof",price:34.99,originalPrice:69.99,category:"Electronics",subcategory:"Audio",rating:4.4,sold:3800,brand:"BassBoom",seller:"AudioWorld Store",sellerId:"audio-world",description:"Powerful portable speaker with 360° sound, IPX7 waterproof rating, and 24-hour playtime.",specs:"Power: 20W | Battery: 24h | Waterproof: IPX7",colors:["#000","#1a73e8","#e74c3c"],stock:189,sku:"BB-SPK-020",images:["https://picsum.photos/seed/speaker1/600/600","https://picsum.photos/seed/speaker2/600/600","https://picsum.photos/seed/speaker3/600/600"],weight:"580g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {id:5,name:"Men's Casual Cotton T-Shirt",price:14.99,originalPrice:29.99,category:"Fashion",subcategory:"Men's Clothing",rating:4.2,sold:8900,brand:"UrbanStyle",seller:"Fashion Hub",sellerId:"fashion-hub",description:"Comfortable 100% cotton t-shirt with modern fit.",specs:"Material: 100% Cotton | Fit: Regular | Sizes: S-3XL",colors:["#000","#fff","#1a73e8","#27ae60","#e74c3c"],sizes:["S","M","L","XL","XXL","3XL"],stock:350,sku:"US-CT-M01",images:["https://picsum.photos/seed/tshirt1/600/600","https://picsum.photos/seed/tshirt2/600/600","https://picsum.photos/seed/tshirt3/600/600"],weight:"200g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Los Angeles, USA"},
  {id:6,name:"Women's Running Shoes Lightweight",price:39.99,originalPrice:79.99,category:"Fashion",subcategory:"Women's Shoes",rating:4.6,sold:6200,brand:"SpeedRun",seller:"SportZone",sellerId:"sport-zone",description:"Ultra-lightweight running shoes with responsive cushioning.",specs:"Weight: 220g | Cushion: EVA | Upper: Mesh",colors:["#000","#fff","#e74c3c","#1a73e8"],sizes:["36","37","38","39","40","41","42"],stock:200,sku:"SR-RS-LW",images:["https://picsum.photos/seed/shoes1/600/600","https://picsum.photos/seed/shoes2/600/600","https://picsum.photos/seed/shoes3/600/600","https://picsum.photos/seed/shoes4/600/600"],weight:"220g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Jakarta, Indonesia"},
  {id:7,name:"Stainless Steel Water Bottle 750ml",price:16.99,originalPrice:29.99,category:"Home",subcategory:"Kitchen & Dining",rating:4.8,sold:15600,brand:"HydroLife",seller:"Home Essentials",sellerId:"home-essentials",description:"Double-wall vacuum insulated water bottle.",specs:"Capacity: 750ml | Material: 304 Stainless Steel",colors:["#c0392b","#2c3e50","#27ae60","#f39c12"],stock:800,sku:"HL-WB-750",images:["https://picsum.photos/seed/bottle1/600/600","https://picsum.photos/seed/bottle2/600/600"],weight:"350g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shanghai, China"},
  {id:8,name:"LED Desk Lamp Dimmable Touch Control",price:24.99,originalPrice:49.99,category:"Home",subcategory:"Lighting",rating:4.5,sold:4300,brand:"BrightHome",seller:"Home Essentials",sellerId:"home-essentials",description:"Modern LED desk lamp with 5 color modes and 10 brightness levels.",specs:"Power: 10W | Modes: 5 Color | Brightness: 10 Levels",colors:["#000","#fff"],stock:320,sku:"BH-DL-010",images:["https://picsum.photos/seed/lamp1/600/600","https://picsum.photos/seed/lamp2/600/600"],weight:"600g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {id:9,name:"Vitamin C Face Serum Brightening",price:18.99,originalPrice:35.99,category:"Beauty",subcategory:"Skincare",rating:4.4,sold:7800,brand:"GlowSkin",seller:"Beauty Palace",sellerId:"beauty-palace",description:"Potent Vitamin C serum with hyaluronic acid and vitamin E.",specs:"Volume: 30ml | Key: Vitamin C, Hyaluronic Acid",colors:[],stock:450,sku:"GS-VC-30ML",images:["https://picsum.photos/seed/serum1/600/600","https://picsum.photos/seed/serum2/600/600"],weight:"50g",returnPolicy:"Sealed products only.",freeShipping:false,minOrder:1,location:"Seoul, Korea"},
  {id:10,name:"Professional Makeup Brush Set 12pcs",price:22.99,originalPrice:44.99,category:"Beauty",subcategory:"Makeup",rating:4.6,sold:9200,brand:"GlamPro",seller:"Beauty Palace",sellerId:"beauty-palace",description:"Complete 12-piece makeup brush set with synthetic bristles.",specs:"Pieces: 12 | Bristle: Synthetic | Handle: Wood",colors:["#f5c6d0","#2c3e50"],stock:600,sku:"GP-MB-12P",images:["https://picsum.photos/seed/brush1/600/600","https://picsum.photos/seed/brush2/600/600"],weight:"300g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Tokyo, Japan"},
  {id:11,name:"Yoga Mat Non-Slip 6mm Thick",price:19.99,originalPrice:39.99,category:"Sports",subcategory:"Yoga",rating:4.7,sold:11000,brand:"FlexFit",seller:"SportZone",sellerId:"sport-zone",description:"Premium non-slip yoga mat with alignment lines.",specs:"Thickness: 6mm | Size: 183x61cm | Material: TPE",colors:["#9b59b6","#1a73e8","#27ae60","#e74c3c"],stock:700,sku:"FF-YM-6MM",images:["https://picsum.photos/seed/yoga1/600/600","https://picsum.photos/seed/yoga2/600/600"],weight:"1.2kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Jakarta, Indonesia"},
  {id:12,name:"Resistance Bands Set of 5",price:15.99,originalPrice:29.99,category:"Sports",subcategory:"Fitness",rating:4.5,sold:8400,brand:"FlexFit",seller:"SportZone",sellerId:"sport-zone",description:"Set of 5 resistance bands with different resistance levels.",specs:"Levels: 5 (10-50 lbs) | Material: Natural Latex",colors:["#e74c3c","#f39c12","#27ae60","#1a73e8","#9b59b6"],stock:900,sku:"FF-RB-5P",images:["https://picsum.photos/seed/bands1/600/600","https://picsum.photos/seed/bands2/600/600"],weight:"400g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Jakarta, Indonesia"},
  {id:13,name:"Building Blocks Creative Set 500pcs",price:27.99,originalPrice:49.99,category:"Toys",subcategory:"Building Sets",rating:4.8,sold:6500,brand:"BuildMaster",seller:"Toy Land",sellerId:"toy-land",description:"500-piece creative building block set.",specs:"Pieces: 500 | Age: 6+ | Material: ABS Plastic",colors:[],stock:250,sku:"BM-BB-500",images:["https://picsum.photos/seed/blocks1/600/600","https://picsum.photos/seed/blocks2/600/600"],weight:"1.5kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {id:14,name:"Remote Control Racing Car",price:32.99,originalPrice:59.99,category:"Toys",subcategory:"RC Vehicles",rating:4.3,sold:3200,brand:"SpeedRacer",seller:"Toy Land",sellerId:"toy-land",description:"High-speed RC car with 2.4GHz remote control.",specs:"Speed: 30km/h | Range: 50m | Battery: 1200mAh",colors:["#e74c3c","#1a73e8","#f39c12"],stock:180,sku:"SR-RC-030",images:["https://picsum.photos/seed/rccar1/600/600","https://picsum.photos/seed/rccar2/600/600"],weight:"800g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {id:15,name:"Bestselling Novel Collection Box Set",price:45.99,originalPrice:89.99,category:"Books",subcategory:"Fiction",rating:4.9,sold:2100,brand:"BookWorld",seller:"Book Haven",sellerId:"book-haven",description:"Collection of 5 bestselling novels.",specs:"Books: 5 | Format: Hardcover | Language: English",colors:[],stock:120,sku:"BW-NOVEL-5B",images:["https://picsum.photos/seed/books1/600/600","https://picsum.photos/seed/books2/600/600"],weight:"2kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"New York, USA"},
  {id:16,name:"Programming Guide for Beginners",price:24.99,originalPrice:44.99,category:"Books",subcategory:"Technology",rating:4.6,sold:4800,brand:"CodePress",seller:"Book Haven",sellerId:"book-haven",description:"Comprehensive guide to learning programming from scratch.",specs:"Pages: 450 | Format: Paperback",colors:[],stock:300,sku:"CP-PG-001",images:["https://picsum.photos/seed/codebook1/600/600"],weight:"600g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"San Francisco, USA"},
  {id:17,name:"Organic Green Tea Premium 100 Bags",price:11.99,originalPrice:22.99,category:"Food",subcategory:"Tea",rating:4.7,sold:9800,brand:"TeaNature",seller:"Organic Market",sellerId:"organic-market",description:"Premium organic green tea sourced from high-altitude gardens.",specs:"Bags: 100 | Type: Organic Green Tea | Origin: Japan",colors:[],stock:1000,sku:"TN-GT-100",images:["https://picsum.photos/seed/tea1/600/600","https://picsum.photos/seed/tea2/600/600"],weight:"200g",returnPolicy:"Sealed products only.",freeShipping:false,minOrder:1,location:"Kyoto, Japan"},
  {id:18,name:"Protein Bar Variety Pack 24 Count",price:29.99,originalPrice:49.99,category:"Food",subcategory:"Snacks",rating:4.4,sold:7200,brand:"FitFuel",seller:"Organic Market",sellerId:"organic-market",description:"24-count variety pack of high-protein bars.",specs:"Count: 24 | Protein: 20g/bar | Flavors: 6",colors:[],stock:400,sku:"FF-PB-24C",images:["https://picsum.photos/seed/protein1/600/600"],weight:"1.2kg",returnPolicy:"Non-returnable food item.",freeShipping:false,minOrder:1,location:"Los Angeles, USA"},
  {id:19,name:"Mechanical Gaming Keyboard RGB",price:44.99,originalPrice:79.99,category:"Electronics",subcategory:"Peripherals",rating:4.6,sold:5600,brand:"GamePro",seller:"GadgetHub",sellerId:"gadget-hub",description:"Full-size mechanical keyboard with hot-swappable switches, RGB backlighting.",specs:"Switches: Mechanical | Backlight: RGB | Layout: Full",colors:["#000"],stock:280,sku:"GP-KB-MEC",images:["https://picsum.photos/seed/keyboard1/600/600","https://picsum.photos/seed/keyboard2/600/600","https://picsum.photos/seed/keyboard3/600/600"],weight:"900g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Shenzhen, China"},
  {id:20,name:"Webcam HD 1080p with Microphone",price:29.99,originalPrice:54.99,category:"Electronics",subcategory:"Peripherals",rating:4.3,sold:4100,brand:"ClearView",seller:"GadgetHub",sellerId:"gadget-hub",description:"Full HD 1080p webcam with built-in noise-cancelling microphone.",specs:"Resolution: 1080p | FPS: 30 | Mic: Built-in",colors:["#000"],stock:350,sku:"CV-WC-1080",images:["https://picsum.photos/seed/webcam1/600/600","https://picsum.photos/seed/webcam2/600/600"],weight:"150g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {id:21,name:"Women's Leather Crossbody Bag",price:35.99,originalPrice:64.99,category:"Fashion",subcategory:"Bags",rating:4.5,sold:3600,brand:"LuxeBag",seller:"Fashion Hub",sellerId:"fashion-hub",description:"Elegant crossbody bag made from premium PU leather.",specs:"Material: PU Leather | Size: 25x18x8cm",colors:["#000","#8B4513","#c0392b","#f5c6d0"],stock:220,sku:"LB-CB-PU",images:["https://picsum.photos/seed/bag1/600/600","https://picsum.photos/seed/bag2/600/600","https://picsum.photos/seed/bag3/600/600"],weight:"400g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Milan, Italy"},
  {id:22,name:"Scented Candle Set 6-Pack",price:19.99,originalPrice:34.99,category:"Home",subcategory:"Home Decor",rating:4.6,sold:5800,brand:"AromaHome",seller:"Home Essentials",sellerId:"home-essentials",description:"Set of 6 scented soy wax candles.",specs:"Count: 6 | Material: Soy Wax | Burn: 30h each",colors:[],stock:500,sku:"AH-SC-6PK",images:["https://picsum.photos/seed/candle1/600/600","https://picsum.photos/seed/candle2/600/600"],weight:"800g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Paris, France"},
  {id:23,name:"Hair Dryer Professional 2000W",price:38.99,originalPrice:69.99,category:"Beauty",subcategory:"Hair Care",rating:4.4,sold:4500,brand:"StylePro",seller:"Beauty Palace",sellerId:"beauty-palace",description:"Professional 2000W hair dryer with ionic technology.",specs:"Power: 2000W | Settings: 3 Heat, 2 Speed",colors:["#000","#f5c6d0"],stock:300,sku:"SP-HD-2000",images:["https://picsum.photos/seed/dryer1/600/600","https://picsum.photos/seed/dryer2/600/600"],weight:"500g",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Seoul, Korea"},
  {id:24,name:"Camping Tent 2-Person Lightweight",price:55.99,originalPrice:99.99,category:"Sports",subcategory:"Outdoor",rating:4.5,sold:2800,brand:"OutdoorPro",seller:"SportZone",sellerId:"sport-zone",description:"Lightweight 2-person camping tent with rainfly.",specs:"Capacity: 2P | Weight: 2.5kg | Waterproof: 3000mm",colors:["#27ae60","#f39c12"],stock:150,sku:"OP-CT-2P",images:["https://picsum.photos/seed/tent1/600/600","https://picsum.photos/seed/tent2/600/600","https://picsum.photos/seed/tent3/600/600"],weight:"2.5kg",returnPolicy:"30-day return policy.",freeShipping:true,minOrder:1,location:"Denver, USA"},
  {id:25,name:"Puzzle 1000 Pieces Landscape",price:13.99,originalPrice:24.99,category:"Toys",subcategory:"Puzzles",rating:4.7,sold:3400,brand:"PuzzleWorld",seller:"Toy Land",sellerId:"toy-land",description:"Beautiful 1000-piece jigsaw puzzle.",specs:"Pieces: 1000 | Size: 70x50cm",colors:[],stock:400,sku:"PW-PZ-1000",images:["https://picsum.photos/seed/puzzle1/600/600"],weight:"500g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {id:26,name:"Cookbook Healthy Recipes 200+",price:19.99,originalPrice:34.99,category:"Books",subcategory:"Cooking",rating:4.5,sold:2600,brand:"ChefPress",seller:"Book Haven",sellerId:"book-haven",description:"Over 200 healthy and delicious recipes.",specs:"Recipes: 200+ | Pages: 320 | Format: Hardcover",colors:[],stock:200,sku:"CH-CB-200",images:["https://picsum.photos/seed/cookbook1/600/600"],weight:"800g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"London, UK"},
  {id:27,name:"Mixed Nuts Premium Gift Box 1kg",price:34.99,originalPrice:59.99,category:"Food",subcategory:"Nuts",rating:4.8,sold:4200,brand:"NutriNuts",seller:"Organic Market",sellerId:"organic-market",description:"Premium mixed nuts gift box.",specs:"Weight: 1kg | Contents: 5 types | Packaging: Gift Box",colors:[],stock:300,sku:"NN-MN-1KG",images:["https://picsum.photos/seed/nuts1/600/600","https://picsum.photos/seed/nuts2/600/600"],weight:"1kg",returnPolicy:"Non-returnable food item.",freeShipping:true,minOrder:1,location:"California, USA"},
  {id:28,name:"Wireless Mouse Ergonomic Silent",price:15.99,originalPrice:29.99,category:"Electronics",subcategory:"Peripherals",rating:4.4,sold:7600,brand:"ClickPro",seller:"Tech Essentials",sellerId:"tech-essentials",description:"Ergonomic wireless mouse with silent clicks.",specs:"DPI: 800/1200/1600/2400 | Battery: 18 months",colors:["#000","#fff","#1a73e8"],stock:600,sku:"CP-WM-ERG",images:["https://picsum.photos/seed/mouse1/600/600","https://picsum.photos/seed/mouse2/600/600"],weight:"80g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"},
  {id:29,name:"Denim Jacket Vintage Wash",price:42.99,originalPrice:79.99,category:"Fashion",subcategory:"Men's Clothing",rating:4.3,sold:2100,brand:"DenimCo",seller:"Fashion Hub",sellerId:"fashion-hub",description:"Classic vintage wash denim jacket.",specs:"Material: 100% Cotton Denim | Fit: Regular | Sizes: S-XXL",colors:["#4a6fa5","#2c3e50"],sizes:["S","M","L","XL","XXL"],stock:180,sku:"DC-DJ-VW",images:["https://picsum.photos/seed/jacket1/600/600","https://picsum.photos/seed/jacket2/600/600"],weight:"600g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Los Angeles, USA"},
  {id:30,name:"Essential Oil Diffuser 500ml",price:26.99,originalPrice:49.99,category:"Home",subcategory:"Home Decor",rating:4.6,sold:6100,brand:"AromaHome",seller:"Home Essentials",sellerId:"home-essentials",description:"Ultrasonic essential oil diffuser with 500ml capacity.",specs:"Capacity: 500ml | Runtime: 12h | Colors: 7 LED",colors:["#fff","#8B4513"],stock:350,sku:"AH-OD-500",images:["https://picsum.photos/seed/diffuser1/600/600","https://picsum.photos/seed/diffuser2/600/600"],weight:"400g",returnPolicy:"30-day return policy.",freeShipping:false,minOrder:1,location:"Shenzhen, China"}
]

export const CATEGORIES: Category[] = [
  {name:"Electronics",icon:"📱",color:"#3498db",promoted:true,subcategories:[
    {name:"Audio",items:["Headphones","Speakers","Earbuds","Soundbars"]},
    {name:"Wearables",items:["Smartwatches","Fitness Trackers","Smart Rings"]},
    {name:"Peripherals",items:["Keyboards","Mice","Webcams","Monitors"]},
    {name:"Accessories",items:["Cables","Chargers","Cases","Screen Protectors"]},
    {name:"Cameras",items:["DSLR","Mirrorless","Action Cameras","Drones"]},
    {name:"Gaming",items:["Consoles","Controllers","Gaming Chairs","VR Headsets"]}
  ]},
  {name:"Fashion",icon:"👗",color:"#e91e63",promoted:true,subcategories:[
    {name:"Men's Clothing",items:["T-Shirts","Pants","Jackets","Suits"]},
    {name:"Women's Clothing",items:["Dresses","Tops","Skirts","Activewear"]},
    {name:"Shoes",items:["Sneakers","Sandals","Boots","Formal"]},
    {name:"Bags",items:["Handbags","Backpacks","Wallets","Luggage"]},
    {name:"Jewelry",items:["Necklaces","Rings","Bracelets","Earrings"]},
    {name:"Accessories",items:["Watches","Sunglasses","Hats","Scarves"]}
  ]},
  {name:"Home",icon:"🏠",color:"#4caf50",promoted:false,subcategories:[
    {name:"Kitchen & Dining",items:["Cookware","Utensils","Storage","Appliances"]},
    {name:"Lighting",items:["Lamps","LED Strips","Ceiling Lights","Smart Lights"]},
    {name:"Home Decor",items:["Candles","Vases","Wall Art","Rugs"]},
    {name:"Furniture",items:["Chairs","Tables","Shelves","Beds"]},
    {name:"Storage",items:["Bins","Organizers","Hooks","Shoe Racks"]},
    {name:"Bedding",items:["Sheets","Pillows","Blankets","Mattress Toppers"]}
  ]},
  {name:"Beauty",icon:"💄",color:"#9c27b0",promoted:true,subcategories:[
    {name:"Skincare",items:["Serums","Moisturizers","Cleansers","Sunscreen"]},
    {name:"Makeup",items:["Foundation","Lipstick","Mascara","Eyeshadow"]},
    {name:"Hair Care",items:["Shampoo","Conditioner","Styling Tools","Hair Color"]},
    {name:"Fragrance",items:["Perfume","Body Mist","Cologne","Gift Sets"]},
    {name:"Tools",items:["Brushes","Mirrors","Hair Dryers","Straighteners"]},
    {name:"Bath & Body",items:["Body Wash","Lotion","Scrubs","Bath Bombs"]}
  ]},
  {name:"Sports",icon:"⚽",color:"#ff9800",promoted:false,subcategories:[
    {name:"Yoga",items:["Mats","Blocks","Straps","Clothing"]},
    {name:"Fitness",items:["Resistance Bands","Dumbbells","Jump Ropes","Kettlebells"]},
    {name:"Outdoor",items:["Tents","Backpacks","Water Bottles","Camping Gear"]},
    {name:"Running",items:["Shoes","Socks","Armbands","Hydration"]},
    {name:"Swimming",items:["Goggles","Swimsuits","Fins","Pool Accessories"]},
    {name:"Cycling",items:["Bikes","Helmets","Lights","Locks"]}
  ]},
  {name:"Toys",icon:"🧸",color:"#f44336",promoted:false,subcategories:[
    {name:"Building Sets",items:["Blocks","LEGO","Magnetic Tiles"]},
    {name:"RC Vehicles",items:["Cars","Drones","Boats","Helicopters"]},
    {name:"Puzzles",items:["Jigsaw","3D Puzzles","Brain Teasers"]},
    {name:"Board Games",items:["Strategy","Party","Card Games","Educational"]},
    {name:"Dolls",items:["Action Figures","Plush","Fashion Dolls"]},
    {name:"Educational",items:["STEM Kits","Science Sets","Art Supplies"]}
  ]},
  {name:"Books",icon:"📚",color:"#795548",promoted:false,subcategories:[
    {name:"Fiction",items:["Romance","Thriller","Fantasy","Sci-Fi"]},
    {name:"Technology",items:["Programming","AI","Web Dev","Data Science"]},
    {name:"Cooking",items:["Recipes","Baking","Healthy Eating","World Cuisine"]},
    {name:"Self-Help",items:["Productivity","Mindfulness","Finance","Health"]},
    {name:"Children",items:["Picture Books","Early Learning","Activity Books"]},
    {name:"Comics",items:["Manga","Graphic Novels","Superhero","Webtoons"]}
  ]},
  {name:"Food",icon:"🍕",color:"#ff5722",promoted:false,subcategories:[
    {name:"Tea",items:["Green Tea","Black Tea","Herbal Tea","Matcha"]},
    {name:"Snacks",items:["Chips","Cookies","Protein Bars","Dried Fruit"]},
    {name:"Nuts",items:["Almonds","Cashews","Mixed Nuts","Trail Mix"]},
    {name:"Coffee",items:["Ground","Beans","Instant","Cold Brew"]},
    {name:"Chocolate",items:["Dark","Milk","White","Gift Boxes"]},
    {name:"Organic",items:["Superfoods","Supplements","Honey","Spices"]}
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

export const LOCATIONS = [
  "All Locations", "China", "USA", "Indonesia", "Japan", "Korea", "UK", "France", "Italy", "Germany", "Australia"
]
