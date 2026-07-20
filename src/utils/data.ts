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
    {name:"Audio",items:["Headphones","Speakers","Earbuds","Soundbars","Amplifiers"]},
    {name:"Wearables",items:["Smartwatches","Fitness Trackers","Smart Rings","VR Headsets"]},
    {name:"Peripherals",items:["Keyboards","Mice","Webcams","Monitors","USB Hubs"]},
    {name:"Accessories",items:["Cables","Chargers","Cases","Screen Protectors","Power Banks"]},
    {name:"Cameras",items:["DSLR","Mirrorless","Action Cameras","Drones","Lenses"]},
    {name:"Gaming",items:["Consoles","Controllers","Gaming Chairs","VR Headsets","RGB Lighting"]},
    {name:"Smart Home",items:["Smart Bulbs","Smart Plugs","Smart Speakers","Sensors"]},
    {name:"Drones",items:["Camera Drones","Racing Drones","Mini Drones","Drone Accessories"]}
  ]},
  {name:"Phones & Accessories",icon:"📲",color:"#00bcd4",promoted:true,subcategories:[
    {name:"Smartphones",items:["Android","iOS","Foldable","Rugged"]},
    {name:"Cases",items:["Silicone","Leather","Clear","Wallet","Armor"]},
    {name:"Screen Protectors",items:["Tempered Glass","Privacy","Anti-Glare"]},
    {name:"Chargers",items:["Wireless","Car","Wall","Portable","Fast Charging"]},
    {name:"Holders",items:["Car Mount","Ring Holder","Stand","Armband","Magnetic"]},
    {name:"Cables",items:["USB-C","Lightning","Micro USB","HDMI","Adapter"]},
    {name:"Power Banks",items:["10000mAh","20000mAh","30000mAh","Solar","Slim"]}
  ]},
  {name:"Computers & Tablets",icon:"💻",color:"#607d8b",promoted:true,subcategories:[
    {name:"Laptops",items:["Gaming","Ultrabook","Business","2-in-1","Chromebook"]},
    {name:"Desktops",items:["Gaming PC","Workstation","Mini PC","All-in-One"]},
    {name:"Tablets",items:["Android","iOS","Drawing","Kids","E-Reader"]},
    {name:"Monitors",items:["Gaming","4K","Ultrawide","Portable","Curved"]},
    {name:"Storage",items:["SSD","HDD","USB Flash","Memory Cards","NAS"]},
    {name:"Networking",items:["Router","Mesh","WiFi Extender","Ethernet","Modem"]},
    {name:"Components",items:["CPU","GPU","RAM","Motherboard","PSU","Case"]},
    {name:"Software",items:["Windows","Office","Antivirus","Design","Development"]}
  ]},
  {name:"Fashion",icon:"👗",color:"#e91e63",promoted:true,subcategories:[
    {name:"Men's Clothing",items:["T-Shirts","Pants","Jackets","Suits","Hoodies","Shorts"]},
    {name:"Women's Clothing",items:["Dresses","Tops","Skirts","Activewear","Blouses","Pants"]},
    {name:"Shoes",items:["Sneakers","Sandals","Boots","Formal","Slippers","Loafers"]},
    {name:"Bags",items:["Handbags","Backpacks","Wallets","Luggage","Crossbody","Tote"]},
    {name:"Jewelry",items:["Necklaces","Rings","Bracelets","Earrings","Anklets","Brooches"]},
    {name:"Accessories",items:["Watches","Sunglasses","Hats","Scarves","Belts","Ties"]},
    {name:"Kids Fashion",items:["Boys","Girls","Baby","Shoes","School"]},
    {name:"Sportswear",items:["Gym","Running","Yoga","Swim","Cycling"]},
    {name:"Underwear",items:["Men's","Women's","Socks","Thermal","Shapewear"]}
  ]},
  {name:"Home & Kitchen",icon:"🏠",color:"#4caf50",promoted:false,subcategories:[
    {name:"Kitchen",items:["Cookware","Utensils","Storage","Appliances","Bakeware","Knives"]},
    {name:"Lighting",items:["Lamps","LED Strips","Ceiling Lights","Smart Lights","Outdoor"]},
    {name:"Decor",items:["Candles","Vases","Wall Art","Rugs","Clocks","Mirrors"]},
    {name:"Furniture",items:["Chairs","Tables","Shelves","Beds","Sofas","Desks"]},
    {name:"Storage",items:["Bins","Organizers","Hooks","Shoe Racks","Closet","Garage"]},
    {name:"Bedding",items:["Sheets","Pillows","Blankets","Mattress Toppers","Duvet"]},
    {name:"Bathroom",items:["Towels","Shower Curtains","Bath Mats","Soap Dispensers"]},
    {name:"Cleaning",items:["Vacuum","Mop","Detergent","Broom","Organizers"]},
    {name:"Laundry",items:["Hampers","Drying Racks","Ironing","Stain Remover","Bags"]}
  ]},
  {name:"Beauty & Personal Care",icon:"💄",color:"#9c27b0",promoted:true,subcategories:[
    {name:"Skincare",items:["Serums","Moisturizers","Cleansers","Sunscreen","Masks","Toners"]},
    {name:"Makeup",items:["Foundation","Lipstick","Mascara","Eyeshadow","Blush","Concealer"]},
    {name:"Hair Care",items:["Shampoo","Conditioner","Styling Tools","Hair Color","Oil","Serum"]},
    {name:"Fragrance",items:["Perfume","Body Mist","Cologne","Gift Sets","Roll-On"]},
    {name:"Tools",items:["Brushes","Mirrors","Hair Dryers","Straighteners","Curlers"]},
    {name:"Bath & Body",items:["Body Wash","Lotion","Scrubs","Bath Bombs","Deodorant"]},
    {name:"Men's Grooming",items:["Shaving","Beard Care","Skincare","Hair","Fragrance"]},
    {name:"Nail Care",items:["Polish","Gel","Tools","Art","Press-On","Remover"]}
  ]},
  {name:"Health & Wellness",icon:"💊",color:"#009688",promoted:false,subcategories:[
    {name:"Supplements",items:["Vitamins","Protein","Collagen","Probiotics","Omega","Multivitamin"]},
    {name:"Medical",items:["First Aid","Thermometers","Masks","Gloves","BP Monitor","Pulse Ox"]},
    {name:"Fitness Nutrition",items:["Protein Powder","BCAA","Pre-Workout","Creatine","Glutamine"]},
    {name:"Wellness",items:["Essential Oils","Aromatherapy","Massage","Acupuncture","Meditation"]},
    {name:"Vision Care",items:["Glasses","Contact Lens","Eye Drops","Reading Glasses","Blue Light"]},
    {name:"Oral Care",items:["Toothbrush","Toothpaste","Mouthwash","Floss","Whitening","Water Flosser"]},
    {name:"Mobility",items:["Wheelchair","Walker","Cane","Crutches","Knee Brace","Back Support"]}
  ]},
  {name:"Sports & Outdoors",icon:"⚽",color:"#ff9800",promoted:false,subcategories:[
    {name:"Yoga",items:["Mats","Blocks","Straps","Clothing","Wheels","Bolsters"]},
    {name:"Fitness",items:["Resistance Bands","Dumbbells","Jump Ropes","Kettlebells","Treadmills","Benches"]},
    {name:"Outdoor",items:["Tents","Backpacks","Water Bottles","Camping Gear","Hammocks","Sleeping Bags"]},
    {name:"Running",items:["Shoes","Socks","Armbands","Hydration","GPS Watch","Shorts"]},
    {name:"Swimming",items:["Goggles","Swimsuits","Fins","Pool Accessories","Snorkel","Wetsuits"]},
    {name:"Cycling",items:["Bikes","Helmets","Lights","Locks","Jerseys","Gloves"]},
    {name:"Team Sports",items:["Soccer","Basketball","Tennis","Volleyball","Baseball","Cricket"]},
    {name:"Winter Sports",items:["Skiing","Snowboarding","Ice Skating","Snowshoes","Gloves","Goggles"]}
  ]},
  {name:"Toys & Games",icon:"🧸",color:"#f44336",promoted:false,subcategories:[
    {name:"Building",items:["Blocks","LEGO","Magnetic Tiles","K'Nex","Marble Run"]},
    {name:"RC Vehicles",items:["Cars","Drones","Boats","Helicopters","Planes","Robots"]},
    {name:"Puzzles",items:["Jigsaw","3D Puzzles","Brain Teasers","Rubik's Cube","Wooden"]},
    {name:"Board Games",items:["Strategy","Party","Card Games","Educational","Chess","Monopoly"]},
    {name:"Dolls",items:["Action Figures","Plush","Fashion Dolls","Collectibles","Puppets"]},
    {name:"Educational",items:["STEM Kits","Science Sets","Art Supplies","Coding Toys","Math"]},
    {name:"Outdoor Play",items:["Swings","Slides","Water Guns","Bubbles","Kites","Sandbox"]},
    {name:"Baby Toys",items:["Rattles","Teethers","Play Mats","Mobiles","Stacking","Sensory"]}
  ]},
  {name:"Books & Media",icon:"📚",color:"#795548",promoted:false,subcategories:[
    {name:"Fiction",items:["Romance","Thriller","Fantasy","Sci-Fi","Mystery","Horror"]},
    {name:"Non-Fiction",items:["Biography","Self-Help","History","Science","Business","Psychology"]},
    {name:"Technology",items:["Programming","AI","Web Dev","Data Science","Cybersecurity","DevOps"]},
    {name:"Children",items:["Picture Books","Early Learning","Activity Books","Comics","Stories"]},
    {name:"Textbooks",items:["Math","Science","Language","Engineering","Medical","Law"]},
    {name:"Digital",items:["E-Books","Audiobooks","Magazines","Comics","PDF","Courses"]},
    {name:"Comics",items:["Manga","Graphic Novels","Superhero","Webtoons","Indie"]},
    {name:"Cooking",items:["Recipes","Baking","Healthy Eating","World Cuisine","BBQ","Vegan"]}
  ]},
  {name:"Food & Grocery",icon:"🍕",color:"#ff5722",promoted:false,subcategories:[
    {name:"Tea & Coffee",items:["Green Tea","Black Tea","Matcha","Ground Coffee","Instant","Espresso"]},
    {name:"Snacks",items:["Chips","Cookies","Protein Bars","Dried Fruit","Nuts","Crackers"]},
    {name:"Pantry",items:["Rice","Pasta","Oil","Sauce","Spices","Flour"]},
    {name:"Beverages",items:["Juice","Soda","Energy Drinks","Water","Smoothie","Kombucha"]},
    {name:"Organic",items:["Superfoods","Honey","Seeds","Grains","Gluten-Free","Vegan"]},
    {name:"Baking",items:["Flour","Sugar","Yeast","Chocolate Chips","Sprinkles","Mixes"]},
    {name:"Condiments",items:["Ketchup","Mustard","Hot Sauce","Soy Sauce","Mayo","BBQ Sauce"]},
    {name:"Baby Food",items:["Puree","Cereal","Snacks","Formula","Teething","Organic"]}
  ]},
  {name:"Automotive",icon:"🚗",color:"#455a64",promoted:false,subcategories:[
    {name:"Car Electronics",items:["Dash Cam","GPS","Car Charger","Bluetooth FM","OBD2","Radar"]},
    {name:"Interior",items:["Seat Covers","Floor Mats","Steering Wheel","Air Freshener","Sunshade"]},
    {name:"Exterior",items:["Car Wax","Polish","Scratch Repair","Car Cover","Tire Shine","Wipers"]},
    {name:"Tools",items:["Wrench Set","Jack","Jump Starter","Tire Inflator","OBD Scanner"]},
    {name:"Motorcycle",items:["Helmets","Gloves","Jackets","Accessories","Parts","Mirrors"]},
    {name:"Car Parts",items:["Brake Pads","Filters","Spark Plugs","Belt","Battery","Alternator"]},
    {name:"Tires",items:["All-Season","Winter","Summer","Off-Road","Performance","Spare"]},
    {name:"Oils & Fluids",items:["Engine Oil","Transmission","Brake Fluid","Coolant","Power Steering"]}
  ]},
  {name:"Baby & Kids",icon:"👶",color:"#e91e63",promoted:false,subcategories:[
    {name:"Diapers",items:["Diapers","Baby Wipes","Diaper Cream","Changing Pad","Diaper Bag"]},
    {name:"Feeding",items:["Bottles","Formula","High Chair","Bibs","Sippy Cups","Breast Pump"]},
    {name:"Strollers",items:["Umbrella Stroller","Travel System","Jogging Stroller","Double"]},
    {name:"Car Seats",items:["Infant","Convertible","Booster","All-in-One","Toddler"]},
    {name:"Nursery",items:["Crib","Changing Table","Glider","Mobile","Night Light","Monitor"]},
    {name:"Kids Fashion",items:["Boys","Girls","Shoes","Accessories","School Uniform"]},
    {name:"Baby Safety",items:["Gates","Locks","Corner Guards","Outlet Covers","Monitors"]},
    {name:"Health",items:["Thermometer","Nasal Aspirator","Medicine Dispenser","Grooming Kit"]}
  ]},
  {name:"Pet Supplies",icon:"🐾",color:"#795548",promoted:false,subcategories:[
    {name:"Dogs",items:["Food","Treats","Toys","Beds","Collars","Leashes"]},
    {name:"Cats",items:["Food","Litter","Toys","Scratchers","Beds","Trees"]},
    {name:"Fish",items:["Aquarium","Food","Filters","Plants","Decorations","Heaters"]},
    {name:"Birds",items:["Cages","Food","Toys","Perches","Nesting","Minerals"]},
    {name:"Small Animals",items:["Hamster","Rabbit","Guinea Pig","Food","Cages","Bedding"]},
    {name:"Reptiles",items:["Terrarium","Heating","Lighting","Food","Substrate","Décor"]},
    {name:"Pet Health",items:["Flea & Tick","Dewormer","Vitamins","Dental","Joint","Skin"]},
    {name:"Pet Tech",items:["GPS Tracker","Automatic Feeder","Pet Camera","Smart Bowl","Door"]}
  ]},
  {name:"Garden & Outdoor",icon:"🌿",color:"#4caf50",promoted:false,subcategories:[
    {name:"Plants",items:["Indoor","Outdoor","Seeds","Succulents","Herbs","Trees"]},
    {name:"Tools",items:["Shovel","Rake","Pruner","Hose","Gloves","Wheelbarrow"]},
    {name:"Furniture",items:["Patio Set","Hammock","Umbrella","Grill","Fire Pit","Bench"]},
    {name:"Planters",items:["Hanging","Ceramic","Plastic","Self-Watering","Raised Bed","Window Box"]},
    {name:"Watering",items:["Sprinkler","Drip Irrigation","Watering Can","Rain Barrel","Timer"]},
    {name:"Decor",items:["Solar Lights","Wind Chimes","Statues","Fountains","Bird Feeder","Pathway"]},
    {name:"Lighting",items:["Solar","String Lights","Lanterns","Spotlights","Path Lights"]},
    {name:"Fencing",items:["Wood","Metal","Vinyl","Bamboo","Netting","Gates"]}
  ]},
  {name:"Office Supplies",icon:"📎",color:"#607d8b",promoted:false,subcategories:[
    {name:"Paper",items:["Printer Paper","Notebooks","Sticky Notes","Envelopes","Cardstock"]},
    {name:"Writing",items:["Pens","Pencils","Markers","Highlighters","Erasers","Crayons"]},
    {name:"Desk",items:["Organizer","Lamp","Mouse Pad","Monitor Stand","Cup","Mat"]},
    {name:"Filing",items:["Folders","Binders","Labels","File Cabinet","Sheet Protectors"]},
    {name:"Technology",items:["Printer","Scanner","Shredder","Laminator","Calculator","Projector"]},
    {name:"School",items:["Backpack","Lunch Box","Ruler","Scissors","Glue","Tape"]},
    {name:"Presentation",items:["Whiteboard","Markers","Easel","Projector","Screen","Pointer"]}
  ]},
  {name:"Tools & Hardware",icon:"🔧",color:"#ff9800",promoted:false,subcategories:[
    {name:"Hand Tools",items:["Hammer","Screwdriver","Pliers","Wrench","Tape Measure","Level"]},
    {name:"Power Tools",items:["Drill","Saw","Sander","Grinder","Router","Jigsaw"]},
    {name:"Electrical",items:["Wire","Switches","Outlets","Circuit Breaker","LED Bulbs","Conduit"]},
    {name:"Plumbing",items:["Pipes","Faucets","Shower Head","Toilet Parts","Drain","Valve"]},
    {name:"Safety",items:["Goggles","Gloves","Helmets","Ear Protection","Masks","Vests"]},
    {name:"Storage",items:["Toolbox","Workbench","Pegboard","Shelving","Cabinet","Hooks"]},
    {name:"Adhesives",items:["Super Glue","Epoxy","Tape","Silicone","Wood Glue","Spray"]},
    {name:"Fasteners",items:["Screws","Nails","Bolts","Anchors","Washers","Clamps"]},
    {name:"Measuring",items:["Tape Measure","Level","Square","Caliper","Protractor","Laser"]},
    {name:"Painting",items:["Brush","Roller","Spray","Painter's Tape","Drop Cloth","Primer"]}
  ]},
  {name:"Musical Instruments",icon:"🎸",color:"#9c27b0",promoted:false,subcategories:[
    {name:"Guitar",items:["Acoustic","Electric","Bass","Ukulele","Strings","Picks"]},
    {name:"Keyboard",items:["Piano","Synthesizer","MIDI","Organ","Accordion","Keytar"]},
    {name:"Drums",items:["Acoustic","Electronic","Cymbals","Sticks","Percussion","Pad"]},
    {name:"Wind",items:["Flute","Saxophone","Trumpet","Clarinet","Harmonica","Trombone"]},
    {name:"DJ",items:["Controller","Turntable","Mixer","Headphones","Speakers","Lights"]},
    {name:"Recording",items:["Microphone","Audio Interface","Mixer","Studio Monitor","Pop Filter"]},
    {name:"Strings",items:["Violin","Cello","Banjo","Mandolin","Harp","Double Bass"]}
  ]},
  {name:"Movies & TV",icon:"🎬",color:"#f44336",promoted:false,subcategories:[
    {name:"Movies",items:["Action","Comedy","Drama","Horror","Sci-Fi","Romance"]},
    {name:"TV Series",items:["Box Sets","Complete Series","New Releases","Classics","K-Drama"]},
    {name:"Anime",items:["Series","Movies","Manga","Figures","Merchandise","Blu-ray"]},
    {name:"Documentary",items:["Nature","History","Science","Crime","Sports","Food"]},
    {name:"Kids",items:["Cartoons","Educational","Disney","Pixar","DreamWorks","Nickelodeon"]},
    {name:"Music",items:["CD","Vinyl","Digital","Box Set","Collector","Live"]}
  ]},
  {name:"Video Games",icon:"🎮",color:"#3f51b5",promoted:false,subcategories:[
    {name:"Console Games",items:["PlayStation","Xbox","Nintendo","Retro","Portable"]},
    {name:"PC Games",items:["Steam","Epic","GOG","MMO","Indie","VR"]},
    {name:"Gaming Gear",items:["Headset","Mouse","Keyboard","Controller","Chair","Desk"]},
    {name:"Collectibles",items:["Figures","Posters","Clothing","Keychains","Art","Plush"]},
    {name:"Gift Cards",items:["Steam","PlayStation","Xbox","Nintendo","Roblox","Fortnite"]},
    {name:"Retro",items:["NES","SNES","N64","Genesis","PS1","Arcade"]},
    {name:"VR",items:["Headset","Games","Accessories","Controllers","Prescription","Face Cover"]}
  ]},
  {name:"Luggage & Travel",icon:"✈️",color:"#00bcd4",promoted:false,subcategories:[
    {name:"Suitcases",items:["Carry-On","Checked","Hardside","Softside","Spinner","Set"]},
    {name:"Bags",items:["Duffel","Backpack","Messenger","Garment","Weekend","Tote"]},
    {name:"Accessories",items:["Pillow","Eye Mask","Packing Cubes","Lock","Tag","Scale"]},
    {name:"Business",items:["Laptop Bag","Briefcase","Rolling Bag","Portfolio","Padfolio"]},
    {name:"Outdoor",items:["Hiking Backpack","Travel Backpack","Daypack","Hydration","Waist Pack"]},
    {name:"Kids",items:["Kids Suitcase","Travel Activity","Car Seat","Stroller","Harness"]},
    {name:"Packing",items:["Cubes","Compression Bags","Toiletry Bag","Shoe Bag","Laundry Bag"]},
    {name:"Security",items:["TSA Lock","Money Belt","RFID Wallet","Luggage Strap","Tracker"]}
  ]},
  {name:"Arts & Crafts",icon:"🎨",color:"#e91e63",promoted:false,subcategories:[
    {name:"Painting",items:["Acrylic","Oil","Watercolor","Canvas","Brushes","Easel"]},
    {name:"Drawing",items:["Pencils","Sketchbook","Charcoal","Pastels","Markers","Ink"]},
    {name:"Crafting",items:["Glue Gun","Scissors","Tape","Beads","Fabric","Wire"]},
    {name:"Sewing",items:["Machine","Thread","Needles","Patterns","Fabric","Scissors"]},
    {name:"Knitting",items:["Yarn","Needles","Hooks","Patterns","Accessories","Stitch Markers"]},
    {name:"Jewelry Making",items:["Beads","Wire","Pliers","Findings","Charms","Chain"]},
    {name:"Woodworking",items:["Chisels","Sandpaper","Stain","Varnish","Wood Glue","Clamps"]},
    {name:"Pottery",items:["Clay","Wheel","Kiln","Glaze","Tools","Stains"]}
  ]},
  {name:"Industrial & Scientific",icon:"🔬",color:"#607d8b",promoted:false,subcategories:[
    {name:"Lab",items:["Microscope","Centrifuge","Pipette","Beaker","Scale","Test Tubes"]},
    {name:"Safety",items:["Goggles","Gloves","Lab Coat","Face Shield","Respirator","Ear Muffs"]},
    {name:"Measurement",items:["Caliper","Micrometer","Thermometer","Multimeter","Ruler","Gauge"]},
    {name:"Raw Materials",items:["Metal","Wood","Plastic","Rubber","Glass","Ceramic"]},
    {name:"Adhesives",items:["Epoxy","Super Glue","Tape","Silicone","Cement","Resin"]},
    {name:"Electrical",items:["Wire","Solder","PCB","Components","Tools","Sensors"]},
    {name:"Plumbing",items:["Pipes","Fittings","Valves","Tape","Wrench","Pump"]},
    {name:"HVAC",items:["Filter","Thermostat","Duct","Vent","Refrigerant","Gauge"]},
    {name:"Janitorial",items:["Mop","Broom","Chemicals","Trash Bags","Gloves","Dispensers"]}
  ]},
  {name:"Collectibles & Fine Art",icon:"🖼️",color:"#795548",promoted:false,subcategories:[
    {name:"Coins",items:["Gold","Silver","Commemorative","Ancient","Sets","Bullion"]},
    {name:"Stamps",items:["Vintage","Modern","Collections","Supplies","Albums","First Day"]},
    {name:"Art",items:["Paintings","Prints","Sculptures","Photography","Digital","Mixed Media"]},
    {name:"Antiques",items:["Furniture","Jewelry","Toys","Books","Pottery","Glass"]},
    {name:"Trading Cards",items:["Sports","Pokemon","Magic","Yu-Gi-Oh","Lorcana","NBA"]},
    {name:"Memorabilia",items:["Movie","Music","Sports","Historical","Celebrity","Military"]},
    {name:"Figurines",items:["Funko Pop","Action","Bobblehead","Miniature","Resin","Porcelain"]},
    {name:"Vintage",items:["Toads","Signs","Tin","Advertising","Clothing","Electronics"]}
  ]},
  {name:"Gift Cards",icon:"🎁",color:"#f39c12",promoted:false,subcategories:[
    {name:"Digital",items:["Amazon","iTunes","Google Play","Steam","Netflix","Spotify"]},
    {name:"Restaurant",items:["Starbucks","McDonald's","Subway","Pizza","Sushi","Chipotle"]},
    {name:"Retail",items:["Walmart","Target","Best Buy","Home Depot","Macy's","Nordstrom"]},
    {name:"Experience",items:["Spa","Travel","Adventure","Dining","Concert","Escape Room"]},
    {name:"Prepaid",items:["Visa","Mastercard","Amex","Discover","Vanilla","OneVanilla"]},
    {name:"Gaming",items:["PlayStation","Xbox","Nintendo","Roblox","Fortnite","League"]}
  ]},
  {name:"Smart Home",icon:"🏡",color:"#4caf50",promoted:false,subcategories:[
    {name:"Voice Assistants",items:["Alexa","Google Home","Siri","Smart Display","Speaker Hub"]},
    {name:"Security",items:["Camera","Doorbell","Lock","Alarm","Sensor","Safe"]},
    {name:"Lighting",items:["Smart Bulb","LED Strip","Switch","Dimmer","Motion Sensor"]},
    {name:"Climate",items:["Thermostat","Heater","Fan","Humidifier","Purifier","AC"]},
    {name:"Cleaning",items:["Robot Vacuum","Mop","Air Purifier","Water Filter","Laundry"]},
    {name:"Entertainment",items:["Smart TV","Streaming","Speaker","Projector","Remote","Soundbar"]},
    {name:"Blinds",items:["Motorized","Roller","Cellular","Smart Curtains","Controller"]},
    {name:"Doors",items:["Smart Lock","Garage Opener","Intercom","Keypad","Deadbolt"]}
  ]},
  {name:"Costumes & Party",icon:"🎉",color:"#9c27b0",promoted:false,subcategories:[
    {name:"Costumes",items:["Halloween","Cosplay","Historical","Animal","Superhero","Funny"]},
    {name:"Party Supplies",items:["Balloons","Banners","Tableware","Candles","Confetti","Streamers"]},
    {name:"Decoration",items:["Backdrop","Lights","Garland","Centerpiece","Signs","Bunting"]},
    {name:"Wedding",items:["Dress","Suit","Decoration","Favors","Cake Topper","Invitations"]},
    {name:"Birthday",items:["Cake Topper","Candles","Party Hats","Banners","Games","Balloons"]},
    {name:"Holiday",items:["Christmas","Easter","Valentine","Thanksgiving","New Year","Hanukkah"]},
    {name:"Themed",items:["Superhero","Princess","Pirate","Space","Dinosaur","Unicorn"]}
  ]},
  {name:"Seasonal",icon:"🎄",color:"#f44336",promoted:false,subcategories:[
    {name:"Summer",items:["Swimwear","Beach Gear","Cooler","Sunscreen","Sunglasses","Inflatable"]},
    {name:"Winter",items:["Coat","Gloves","Scarf","Boots","Heater","Thermal"]},
    {name:"Spring",items:["Rain Jacket","Umbrella","Garden","Allergy","Light Layers","Pollen"]},
    {name:"Fall",items:["Sweater","Boots","Pumpkin","Candle","Warm Drinks","Decoration"]},
    {name:"Back to School",items:["Backpack","Supplies","Lunch Box","Uniform","Shoes","Tech"]},
    {name:"Holiday",items:["Gift Sets","Stocking Stuffers","Decor","Wrapping","Cards","Lights"]},
    {name:"Valentine",items:["Flowers","Chocolate","Cards","Gifts","Jewelry","Stuffed Animals"]},
    {name:"Halloween",items:["Costumes","Decorations","Candy","Masks","Props","Makeup"]},
    {name:"Christmas",items:["Tree","Ornaments","Lights","Gifts","Stockings","Wrapping Paper"]}
  ]},
  {name:"Watches & Luxury",icon:"⌚",color:"#ffc107",promoted:false,subcategories:[
    {name:"Smartwatches",items:["Apple","Samsung","Garmin","Fitbit","Amazfit","Huawei"]},
    {name:"Luxury",items:["Rolex","Omega","Tag Heuer","Cartier","Breitling","IWC"]},
    {name:"Fashion",items:["Casio","Fossil","Michael Kors","Seiko","Citizen","Tissot"]},
    {name:"Sports",items:["GPS Watch","Dive Watch","Running Watch","Heart Rate","Pilot","Chronograph"]},
    {name:"Accessories",items:["Watch Bands","Watch Boxes","Watch Tools","Watch Winder","Cases"]},
    {name:"Kids",items:["Digital","Analog","Character","Fitness","Educational","Smart"]},
    {name:"Vintage",items:["Antique","Pocket Watch","Mechanical","Retro","Military","Art Deco"]}
  ]},
  {name:"Digital Products",icon:"💾",color:"#2196f3",promoted:false,subcategories:[
    {name:"Software",items:["Antivirus","Office","Design","Development","Utility","VPN"]},
    {name:"E-Books",items:["Fiction","Non-Fiction","Textbooks","Comics","Audio","Cookbook"]},
    {name:"Online Courses",items:["Programming","Business","Design","Language","Music","Photography"]},
    {name:"Templates",items:["Website","Resume","Presentation","Social Media","Email","Invoice"]},
    {name:"Stock Media",items:["Photos","Videos","Music","Graphics","Fonts","Icons"]},
    {name:"Game Items",items:["In-Game Currency","Skins","DLC","Gift Cards","Subscriptions","Accounts"]},
    {name:"Plugins",items:["WordPress","Shopify","Photoshop","Figma","Notion","VS Code"]},
    {name:"Subscriptions",items:["Streaming","Cloud Storage","VPN","Email","Domain","Hosting"]}
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

export const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Japan', 'South Korea', 'Singapore', 'Indonesia',
  'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'India',
  'Brazil', 'Mexico', 'Argentina', 'Netherlands', 'Italy',
  'Spain', 'Sweden', 'Norway', 'Denmark', 'New Zealand',
  'South Africa', 'Egypt', 'Turkey', 'Russia', 'China'
]

// ==================== MEGA CATALOG (20,000+ Products) ====================
// Generated with varied subcategories per category (4-10 subs each)

const CATEGORY_SUBS_MAP: Record<string, string[]> = {
  'Electronics': ['Audio', 'Wearables', 'Peripherals', 'Accessories', 'Cameras', 'Gaming', 'Smart Home', 'Drones'],
  'Phones & Accessories': ['Smartphones', 'Cases', 'Screen Protectors', 'Chargers', 'Holders', 'Cables', 'Power Banks'],
  'Computers & Tablets': ['Laptops', 'Desktops', 'Tablets', 'Monitors', 'Storage', 'Networking', 'Components', 'Software'],
  'Fashion': ["Men's Clothing", "Women's Clothing", 'Shoes', 'Bags', 'Jewelry', 'Accessories', 'Kids Fashion', 'Sportswear', 'Underwear'],
  'Home & Kitchen': ['Kitchen', 'Lighting', 'Decor', 'Furniture', 'Storage', 'Bedding', 'Bathroom', 'Cleaning', 'Laundry'],
  'Beauty & Personal Care': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Tools', 'Bath & Body', "Men's Grooming", 'Nail Care'],
  'Health & Wellness': ['Supplements', 'Medical', 'Fitness Nutrition', 'Wellness', 'Vision Care', 'Oral Care', 'Mobility'],
  'Sports & Outdoors': ['Yoga', 'Fitness', 'Outdoor', 'Running', 'Swimming', 'Cycling', 'Team Sports', 'Winter Sports'],
  'Toys & Games': ['Building', 'RC Vehicles', 'Puzzles', 'Board Games', 'Dolls', 'Educational', 'Outdoor Play', 'Baby Toys'],
  'Books & Media': ['Fiction', 'Non-Fiction', 'Technology', 'Children', 'Textbooks', 'Digital', 'Comics', 'Cooking'],
  'Food & Grocery': ['Tea & Coffee', 'Snacks', 'Pantry', 'Beverages', 'Organic', 'Baking', 'Condiments', 'Baby Food'],
  'Automotive': ['Car Electronics', 'Interior', 'Exterior', 'Tools', 'Motorcycle', 'Car Parts', 'Tires', 'Oils & Fluids'],
  'Baby & Kids': ['Diapers', 'Feeding', 'Strollers', 'Car Seats', 'Nursery', 'Kids Fashion', 'Baby Safety', 'Health'],
  'Pet Supplies': ['Dogs', 'Cats', 'Fish', 'Birds', 'Small Animals', 'Reptiles', 'Pet Health', 'Pet Tech'],
  'Garden & Outdoor': ['Plants', 'Tools', 'Furniture', 'Planters', 'Watering', 'Decor', 'Lighting', 'Fencing'],
  'Office Supplies': ['Paper', 'Writing', 'Desk', 'Filing', 'Technology', 'School', 'Presentation'],
  'Tools & Hardware': ['Hand Tools', 'Power Tools', 'Electrical', 'Plumbing', 'Safety', 'Storage', 'Adhesives', 'Fasteners', 'Measuring', 'Painting'],
  'Musical Instruments': ['Guitar', 'Keyboard', 'Drums', 'Wind', 'DJ', 'Recording', 'Strings'],
  'Movies & TV': ['Movies', 'TV Series', 'Anime', 'Documentary', 'Kids', 'Music'],
  'Video Games': ['Console Games', 'PC Games', 'Gaming Gear', 'Collectibles', 'Gift Cards', 'Retro', 'VR'],
  'Luggage & Travel': ['Suitcases', 'Bags', 'Accessories', 'Business', 'Outdoor', 'Kids', 'Packing', 'Security'],
  'Arts & Crafts': ['Painting', 'Drawing', 'Crafting', 'Sewing', 'Knitting', 'Jewelry Making', 'Woodworking', 'Pottery'],
  'Industrial & Scientific': ['Lab', 'Safety', 'Measurement', 'Raw Materials', 'Adhesives', 'Electrical', 'Plumbing', 'HVAC', 'Janitorial'],
  'Collectibles & Fine Art': ['Coins', 'Stamps', 'Art', 'Antiques', 'Trading Cards', 'Memorabilia', 'Figurines', 'Vintage'],
  'Gift Cards': ['Digital', 'Restaurant', 'Retail', 'Experience', 'Prepaid', 'Gaming'],
  'Smart Home': ['Voice Assistants', 'Security', 'Lighting', 'Climate', 'Cleaning', 'Entertainment', 'Blinds', 'Doors'],
  'Costumes & Party': ['Costumes', 'Party Supplies', 'Decoration', 'Wedding', 'Birthday', 'Holiday', 'Themed'],
  'Seasonal': ['Summer', 'Winter', 'Spring', 'Fall', 'Back to School', 'Holiday', 'Valentine', 'Halloween', 'Christmas'],
  'Watches & Luxury': ['Smartwatches', 'Luxury', 'Fashion', 'Sports', 'Accessories', 'Kids', 'Vintage'],
  'Digital Products': ['Software', 'E-Books', 'Online Courses', 'Templates', 'Stock Media', 'Game Items', 'Plugins', 'Subscriptions'],
}

const BRANDS_MAP: Record<string, string[]> = {
  'Electronics': ['TechSound', 'ProMax', 'EliteGear', 'SmartWave', 'DigiCore', 'VoltEdge', 'NexGen', 'PrimeAudio'],
  'Phones & Accessories': ['PhoneGuard', 'ScreenShield', 'ChargePro', 'CaseMaster', 'DigiCase', 'PowerMax', 'GripTech'],
  'Computers & Tablets': ['ByteCore', 'PixelMax', 'LogicPro', 'DataFlow', 'CircuitLab', 'ChipSet', 'RamBoost'],
  'Fashion': ['UrbanStyle', 'LuxeWear', 'StreetVibe', 'ClassicFit', 'TrendSet', 'VogueLine', 'DenimCo'],
  'Home & Kitchen': ['HomeElite', 'KitchenPro', 'CozyNest', 'BrightHome', 'CleanMax', 'CookStar', 'DecoLux'],
  'Beauty & Personal Care': ['GlowSkin', 'LuxeGlam', 'PureBeauty', 'SkinScience', 'GlamPro', 'NatureGlow', 'DermaCare'],
  'Health & Wellness': ['VitaLife', 'NutriMax', 'HealthPlus', 'PureBody', 'WellnessPro', 'FitFuel', 'NatureCure'],
  'Sports & Outdoors': ['FlexFit', 'SportPeak', 'TrailMax', 'ActivePro', 'Endurance', 'SummitGear', 'AquaSport'],
  'Toys & Games': ['PlaySmart', 'ToyWorld', 'FunFactory', 'KidZone', 'GameMaster', 'BuildPro', 'PuzzleKing'],
  'Books & Media': ['BookWorld', 'PageTurner', 'CodePress', 'StoryCraft', 'LearnMore', 'ComicVault', 'AudioBook'],
  'Food & Grocery': ['TasteGood', 'NatureHarvest', 'FreshFarm', 'OrganicLife', 'SpiceRoute', 'TeaGarden', 'CoffeeBean'],
  'Automotive': ['AutoPro', 'CarTech', 'DriveMax', 'MechanicPro', 'RoadKing', 'TireTrack', 'OilMax'],
  'Baby & Kids': ['BabyLove', 'TinyTots', 'KidsFirst', 'SafeNest', 'LittleStar', 'BabyJoy', 'MomCare'],
  'Pet Supplies': ['PetJoy', 'FurryFriend', 'PawPrint', 'AquaPet', 'BirdSong', 'ReptilePro', 'PetHealth'],
  'Garden & Outdoor': ['GreenThumb', 'GardenPro', 'PlantLife', 'OutdoorLiving', 'FlowerPower', 'LawnCare', 'TreeHouse'],
  'Office Supplies': ['OfficeMax', 'DeskPro', 'PaperPlus', 'WriteRight', 'FileSmart', 'PrintPro', 'SchoolKit'],
  'Tools & Hardware': ['ToolMaster', 'BuildPro', 'FixIt', 'HandyTool', 'PowerGrip', 'Craftsman', 'ToughTool'],
  'Musical Instruments': ['SoundCraft', 'MusicPro', 'StringMaster', 'BeatDrop', 'DJMix', 'StudioPro', 'GuitarHero'],
  'Movies & TV': ['CinemaPlus', 'MovieMax', 'SeriesHub', 'AnimeWorld', 'DocuLife', 'ClassicFilm', 'HorrorVault'],
  'Video Games': ['GameZone', 'PlayerOne', 'PixelHero', 'QuestMaster', 'LevelUp', 'BossFight', 'RetroPlay'],
  'Luggage & Travel': ['TravelPro', 'JetSet', 'PackRight', 'WanderLust', 'GlobeTrot', 'TripMaster', 'BagPack'],
  'Arts & Crafts': ['ArtSupply', 'CraftMaster', 'CreateIt', 'BrushStroke', 'ColorWheel', 'DesignPro', 'SketchPad'],
  'Industrial & Scientific': ['LabPro', 'SciTools', 'MeasureMax', 'SafetyFirst', 'IndustrialGrade', 'PrecisionLab', 'BioTech'],
  'Collectibles & Fine Art': ['RareFind', 'CollectPro', 'ArtVault', 'VintageGold', 'CoinMaster', 'StampCol', 'CardShop'],
  'Gift Cards': ['GiftCard', 'SurpriseMe', 'GiftBox', 'TreatYourself', 'GiftVoucher', 'RewardCard', 'GiftIt'],
  'Smart Home': ['SmartLife', 'HomeAuto', 'IntelliHome', 'ConnectedHome', 'SmartLiving', 'HomeHub', 'NestPro'],
  'Costumes & Party': ['PartyTime', 'CostumeKing', 'FunDress', 'CelebrationBox', 'PartyPro', 'DressUp', 'ThemeParty'],
  'Seasonal': ['SeasonPro', 'HolidayJoy', 'SummerFun', 'WinterWarm', 'SpringBloom', 'FallHarvest', 'BackToSchool'],
  'Watches & Luxury': ['TimePiece', 'LuxWatch', 'ChronoMax', 'EliteTime', 'WatchCraft', 'PrecisionTime', 'ClassicWatch'],
  'Digital Products': ['DigitalPro', 'CodeLib', 'TemplateHub', 'CourseMax', 'AssetVault', 'PluginPro', 'FontShop'],
}

const SELLER_NAMES = ['MegaStore', 'TopSeller', 'PrimeShop', 'ValueMart', 'EliteGoods', 'BestDeal', 'QuickShip', 'TrustSeller', 'GlobalTrade', 'DirectFactory']
const SELLER_SUFFIXES = ['Store', 'Shop', 'Mall', 'Hub', 'Center', 'Direct', 'Outlet', 'Market']
const COUNTRY_LIST = ['China', 'USA', 'Indonesia', 'Japan', 'Korea', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'India', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Australia', 'Canada', 'Brazil', 'Mexico', 'Turkey']
const CITY_MAP: Record<string, string[]> = {
  'China': ['Shenzhen', 'Guangzhou', 'Shanghai', 'Beijing', 'Hangzhou'],
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco'],
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo'],
  'Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'],
  'UK': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Hat Yai'],
  'Vietnam': ['Ho Chi Minh', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho'],
  'Malaysia': ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam'],
  'Singapore': ['Singapore'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'],
}

const COLOR_POOL = ['#000', '#fff', '#1a73e8', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#3498db', '#e67e22', '#1abc9c', '#c0392b', '#2c3e50']

function _rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
function _randF(min: number, max: number): number { return Math.round((Math.random() * (max - min) + min) * 100) / 100 }
function _pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function _pickN<T>(arr: T[], n: number): T[] { return [...arr].sort(() => Math.random() - 0.5).slice(0, n) }

function _genPrice(base: number): { price: number; original: number } {
  const markup = _randF(1.3, 2.5)
  const original = Math.round(base * markup * 100) / 100
  const discount = _randF(0.5, 0.85)
  const price = Math.round(original * discount * 100) / 100
  return { price, original }
}

const _BASE_PRICES: Record<string, [number, number]> = {
  'Electronics': [15, 200], 'Phones & Accessories': [5, 150], 'Computers & Tablets': [50, 500],
  'Fashion': [8, 80], 'Home & Kitchen': [10, 120], 'Beauty & Personal Care': [5, 60],
  'Health & Wellness': [10, 80], 'Sports & Outdoors': [10, 100], 'Toys & Games': [8, 60],
  'Books & Media': [5, 40], 'Food & Grocery': [3, 30], 'Automotive': [10, 150],
  'Baby & Kids': [8, 80], 'Pet Supplies': [5, 50], 'Garden & Outdoor': [10, 100],
  'Office Supplies': [3, 30], 'Tools & Hardware': [10, 120], 'Musical Instruments': [15, 200],
  'Movies & TV': [5, 30], 'Video Games': [10, 60], 'Luggage & Travel': [15, 120],
  'Arts & Crafts': [5, 50], 'Industrial & Scientific': [10, 200], 'Collectibles & Fine Art': [10, 150],
  'Gift Cards': [10, 100], 'Smart Home': [15, 150], 'Costumes & Party': [8, 50],
  'Seasonal': [5, 60], 'Watches & Luxury': [20, 300], 'Digital Products': [5, 50],
}

function _genProducts(count: number): Product[] {
  const prods: Product[] = []
  let id = 50000
  const cats = Object.keys(CATEGORY_SUBS_MAP)
  
  while (prods.length < count) {
    for (const cat of cats) {
      if (prods.length >= count) break
      const subs = CATEGORY_SUBS_MAP[cat]
      const brands = BRANDS_MAP[cat] || ['Generic', 'Premium', 'Value']
      const [pMin, pMax] = _BASE_PRICES[cat] || [10, 80]
      const batch = _rand(5, 20)
      
      for (let i = 0; i < batch; i++) {
        if (prods.length >= count) break
        const sub = _pick(subs)
        const brand = _pick(brands)
        const country = _pick(COUNTRY_LIST)
        const city = _pick(CITY_MAP[country] || ['Unknown'])
        const seller = _pick(SELLER_NAMES) + ' ' + _pick(SELLER_SUFFIXES)
        const base = _rand(pMin, pMax)
        const { price, original } = _genPrice(base)
        const hasSizes = ['Fashion', 'Sports & Outdoors'].includes(cat) && Math.random() > 0.4
        const hasColors = Math.random() > 0.3
        
        prods.push({
          id: id++,
          name: `${brand} ${sub} ${_rand(100, 9999)}`,
          price, originalPrice: original,
          category: cat, subcategory: sub,
          brand, seller, sellerId: seller.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: `High quality ${sub.toLowerCase()} from ${brand}. Premium materials, excellent durability. Perfect for everyday use.`,
          specs: `Brand: ${brand} | Category: ${cat} | Sub: ${sub} | Origin: ${country}`,
          colors: hasColors ? _pickN(COLOR_POOL, _rand(2, 5)) : [],
          sizes: hasSizes ? _pickN(['S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'], _rand(3, 6)) : [],
          stock: _rand(50, 5000),
          sku: `${brand.substring(0, 3).toUpperCase()}-${sub.substring(0, 3).toUpperCase()}-${id}`,
          images: [`https://picsum.photos/seed/p${id}/600/600`, `https://picsum.photos/seed/p${id}b/600/600`],
          weight: _rand(50, 3000) + 'g',
          returnPolicy: Math.random() > 0.2 ? '30-day return policy.' : 'Non-returnable.',
          rating: Math.round((_randF(3.5, 5.0)) * 10) / 10,
          sold: _rand(10, 50000),
          freeShipping: Math.random() > 0.4,
          minOrder: _rand(1, 5),
          location: `${city}, ${country}`,
        })
      }
    }
  }
  return prods
}

// Generate and merge with original products
const MEGA_CATALOG: Product[] = _genProducts(20000)
export const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...MEGA_CATALOG]
