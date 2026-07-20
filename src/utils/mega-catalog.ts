// ==================== MEGA PRODUCT CATALOG ====================
// 20,000+ products with varied subcategories per category
// Data based on real marketplace patterns

import type { Product } from '../types'

// Varied subcategories per category (not always 6)
const CATEGORY_SUBS: Record<string, string[]> = {
  'Electronics': ['Audio', 'Wearables', 'Peripherals', 'Accessories', 'Cameras', 'Gaming', 'Smart Home', 'Drones', 'VR', 'Car Electronics'],
  'Phones & Accessories': ['Smartphones', 'Cases', 'Screen Protectors', 'Chargers', 'Holders', 'SIM & Memory', 'Cables', 'Power Banks', 'Headphones', 'Smartwatch Bands'],
  'Computers & Tablets': ['Laptops', 'Desktops', 'Tablets', 'Monitors', 'Storage', 'Networking', 'Components', 'Software', 'Printers', 'Keyboard & Mouse'],
  'Fashion': ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Jewelry', 'Accessories', 'Kids Fashion', 'Sportswear', 'Underwear', 'Swimwear'],
  'Home & Kitchen': ['Kitchen', 'Lighting', 'Decor', 'Furniture', 'Storage', 'Bedding', 'Bathroom', 'Cleaning', 'Laundry', 'Garden Tools'],
  'Beauty & Personal Care': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Tools', 'Bath & Body', 'Men\'s Grooming', 'Nail Care', 'Oral Care', 'Sun Protection'],
  'Health & Wellness': ['Supplements', 'Medical', 'Fitness Nutrition', 'Wellness', 'Vision Care', 'Oral Care', 'First Aid', 'Mobility', 'Massage', 'Aromatherapy'],
  'Sports & Outdoors': ['Yoga', 'Fitness', 'Outdoor', 'Running', 'Swimming', 'Cycling', 'Team Sports', 'Winter Sports', 'Water Sports', 'Martial Arts'],
  'Toys & Games': ['Building', 'RC Vehicles', 'Puzzles', 'Board Games', 'Dolls', 'Educational', 'Outdoor Play', 'Arts & Crafts', 'Action Figures', 'Baby Toys'],
  'Books & Media': ['Fiction', 'Non-Fiction', 'Technology', 'Children', 'Textbooks', 'Digital', 'Comics', 'Self-Help', 'Cooking', 'Travel'],
  'Food & Grocery': ['Tea & Coffee', 'Snacks', 'Pantry', 'Beverages', 'Organic', 'International', 'Baking', 'Condiments', 'Frozen', 'Baby Food'],
  'Automotive': ['Car Electronics', 'Interior', 'Exterior', 'Tools', 'Motorcycle', 'Car Parts', 'Tires', 'Oils & Fluids', 'Car Care', 'RV & Camper'],
  'Baby & Kids': ['Diapers', 'Feeding', 'Strollers', 'Car Seats', 'Nursery', 'Kids Fashion', 'Baby Safety', 'Toys', 'Books', 'Health'],
  'Pet Supplies': ['Dogs', 'Cats', 'Fish', 'Birds', 'Small Animals', 'Reptiles', 'Pet Health', 'Pet Food', 'Pet Toys', 'Pet Beds'],
  'Garden & Outdoor': ['Plants', 'Tools', 'Furniture', 'Planters', 'Watering', 'Decor', 'Lighting', 'Fencing', 'Grills', 'Pools'],
  'Office Supplies': ['Paper', 'Writing', 'Desk', 'Filing', 'Technology', 'Breakroom', 'School Supplies', 'Presentation', 'Labels', 'Shipping'],
  'Tools & Hardware': ['Hand Tools', 'Power Tools', 'Electrical', 'Plumbing', 'Safety', 'Storage', 'Adhesives', 'Fasteners', 'Measuring', 'Painting'],
  'Musical Instruments': ['Guitar', 'Keyboard', 'Drums', 'Wind', 'DJ', 'Recording', 'Strings', 'Accessories', 'Sheet Music', 'Cases'],
  'Movies & TV': ['Movies', 'TV Series', 'Anime', 'Documentary', 'Fitness', 'Kids', 'Music', 'Concerts', 'Blu-ray', '4K UHD'],
  'Video Games': ['Console Games', 'PC Games', 'Gaming Gear', 'Chairs', 'Collectibles', 'Gift Cards', 'Retro', 'VR Games', 'Mobile', 'Accessories'],
  'Luggage & Travel': ['Suitcases', 'Bags', 'Accessories', 'Business', 'Outdoor', 'Kids Travel', 'Packing', 'Security', 'Comfort', 'Tech Travel'],
  'Arts & Crafts': ['Painting', 'Drawing', 'Crafting', 'Sewing', 'Knitting', 'Scrapbooking', 'Jewelry Making', 'Woodworking', 'Pottery', 'Calligraphy'],
  'Industrial & Scientific': ['Lab', 'Safety', 'Measurement', 'Raw Materials', 'Adhesives', 'Electrical', 'Plumbing', 'HVAC', 'Janitorial', 'Packaging'],
  'Collectibles & Fine Art': ['Coins', 'Stamps', 'Art', 'Antiques', 'Trading Cards', 'Memorabilia', 'Comics', 'Figurines', 'Vintage', 'Sports'],
  'Gift Cards': ['Digital', 'Restaurant', 'Retail', 'Experience', 'Prepaid', 'Gaming', 'Travel', 'Spa', 'Subscription', 'Charity'],
  'Smart Home': ['Voice Assistants', 'Security', 'Lighting', 'Climate', 'Cleaning', 'Entertainment', 'Blinds', 'Doors', 'Kitchen', 'Energy'],
  'Costumes & Party': ['Costumes', 'Party Supplies', 'Decoration', 'Wedding', 'Birthday', 'Holiday', 'Themed', 'Accessories', 'Tableware', 'Invitations'],
  'Seasonal': ['Summer', 'Winter', 'Spring', 'Fall', 'Back to School', 'Holiday', 'Valentine', 'Halloween', 'Christmas', 'Easter'],
  'Watches & Luxury': ['Smartwatches', 'Luxury', 'Fashion', 'Sports', 'Accessories', 'Kids', 'Vintage', 'Pocket', 'Straps', 'Winders'],
  'Digital Products': ['Software', 'E-Books', 'Online Courses', 'Templates', 'Stock Media', 'Game Items', 'Fonts', 'Plugins', 'Subscriptions', 'Licenses'],
}

// Real product name templates per subcategory
const PRODUCT_TEMPLATES: Record<string, string[]> = {
  'Audio': ['Wireless Bluetooth Earbuds {brand}', 'Over-Ear Headphones {brand} Pro', 'Portable Speaker {brand} Waterproof', 'Soundbar {brand} 2.1 Channel', 'Noise Cancelling Headphones {brand}', 'Studio Monitor Speakers {brand}', 'True Wireless Earbuds {brand} ANC', 'Bluetooth Speaker {brand} Mini', 'Gaming Headset {brand} 7.1 Surround', 'Bone Conduction Headphones {brand}'],
  'Wearables': ['Smart Watch {brand} Ultra', 'Fitness Tracker {brand} Band', 'Smart Ring {brand} Health', 'Kids Smartwatch {brand} GPS', 'Sports Watch {brand} GPS', 'Sleep Tracker {brand} Pad', 'Smart Glasses {brand} AR', 'Fitness Band {brand} Slim', 'Heart Rate Monitor {brand} Chest', 'Smartwatch Band {brand} Silicone'],
  'Smartphones': ['{brand} Smartphone 6.7" AMOLED', '{brand} Phone 5G 128GB', '{brand} Pro Max 256GB', '{brand} Lite Budget Phone', '{brand} Fold 5G', '{brand} Gaming Phone 12GB RAM', '{brand} Camera Phone 108MP', '{brand} Ultra 512GB', '{brand} SE Compact', '{brand} Note 6000mAh'],
  'Laptops': ['{brand} Laptop 15.6" i7', '{brand} Ultrabook 14" Ryzen 7', '{brand} Gaming Laptop RTX 4060', '{brand} Business Laptop 16GB', '{brand} 2-in-1 Convertible', '{brand} Chromebook 14"', '{brand} Workstation 32GB', '{brand} Student Laptop', '{brand} Creator Laptop OLED', '{brand} Mini Laptop 11"'],
  'T-Shirts': ['Men\'s Cotton T-Shirt {brand}', 'Women\'s V-Neck Tee {brand}', 'Graphic Print T-Shirt {brand}', 'Oversized Tee {brand} Unisex', 'Polo Shirt {brand} Classic', 'Long Sleeve Tee {brand}', 'Tank Top {brand} Summer', 'Henley Shirt {brand}', 'Striped T-Shirt {brand}', 'Vintage Wash Tee {brand}'],
  'Sneakers': ['Running Shoes {brand} Lightweight', 'Casual Sneakers {brand} White', 'Basketball Shoes {brand} High-Top', 'Walking Shoes {brand} Comfort', 'Training Shoes {brand} Cross', 'Slip-On Sneakers {brand}', 'Retro Sneakers {brand} Classic', 'Trail Running Shoes {brand}', 'Fashion Sneakers {brand} Chunky', 'Kids Sneakers {brand} Light-Up'],
  'Skincare': ['Vitamin C Serum {brand} 30ml', 'Hyaluronic Acid Moisturizer {brand}', 'Retinol Night Cream {brand}', 'SPF 50 Sunscreen {brand}', 'Niacinamide Serum {brand} 10%', 'AHA BHA Exfoliant {brand}', 'Ceramide Moisturizer {brand}', 'Peptide Eye Cream {brand}', 'Centella Cleanser {brand}', 'Snail Mucin Essence {brand}'],
  'Yoga': ['Yoga Mat {brand} 6mm Non-Slip', 'Yoga Block {brand} EVA', 'Yoga Strap {brand} Cotton', 'Yoga Wheel {brand} Back Pain', 'Yoga Pants {brand} High Waist', 'Yoga Towel {brand} Microfiber', 'Yoga Ball {brand} 65cm', 'Yoga Gloves {brand} Grippy', 'Yoga Bag {brand} Carrier', 'Yoga Knee Pad {brand}'],
  'Protein': ['Whey Protein {brand} 5lbs', 'Plant Protein {brand} Vegan', 'Casein Protein {brand} Night', 'Protein Bar {brand} 12-Pack', 'BCAA Powder {brand} Branched', 'Pre-Workout {brand} Energy', 'Creatine Monohydrate {brand}', 'Protein Shake {brand} Ready', 'Collagen Peptides {brand}', 'Mass Gainer {brand} 8lbs'],
  'LEGO': ['Building Blocks {brand} 500pcs', 'Technic Set {brand} Car', 'City Set {brand} Police Station', 'Creator Set {brand} 3-in-1', 'Star Wars {brand} Ship', 'Harry Potter {brand} Castle', 'Minecraft {brand} Village', 'Architecture {brand} Landmark', 'Ideas Set {brand} Globe', 'Speed Champions {brand} Ferrari'],
  'Pens': ['Ballpoint Pen {brand} 12-Pack', 'Gel Pens {brand} 24 Colors', 'Fountain Pen {brand} Classic', 'Marker Set {brand} 48 Colors', 'Highlighter {brand} 6-Pack', 'Mechanical Pencil {brand} 0.5mm', 'Fine Liner {brand} Art Set', 'Whiteboard Markers {brand}', 'Calligraphy Pen {brand} Set', 'Erasable Pens {brand} 8-Pack'],
  'Drill': ['Cordless Drill {brand} 20V', 'Impact Driver {brand} 18V', 'Hammer Drill {brand} SDS', 'Drill Bit Set {brand} 100pcs', 'Drill Press {brand} Bench', 'Right Angle Drill {brand}', 'Drill Stand {brand} Magnetic', 'Drill Chuck {brand} Keyless', 'Drill Guide {brand} Pocket', 'Drill Extension {brand} Flex'],
  'Dog Food': ['Dry Dog Food {brand} 15kg', 'Wet Dog Food {brand} 12-Pack', 'Puppy Food {brand} Chicken', 'Senior Dog Food {brand} Grain-Free', 'Dog Treats {brand} Training', 'Dog Dental Chews {brand}', 'Raw Dog Food {brand} Freeze-Dried', 'Dog Supplements {brand} Joint', 'Dog Milk Replacer {brand}', 'Dog Jerky Treats {brand}'],
  'Camera': ['DSLR Camera {brand} 24MP', 'Mirrorless Camera {brand} 4K', 'Action Camera {brand} Waterproof', 'Instant Camera {brand} Mini', 'Dash Cam {brand} 4K', 'Webcam {brand} 1080p', 'Trail Camera {brand} Night Vision', 'Drone Camera {brand} GPS', 'Film Camera {brand} 35mm', 'Security Camera {brand} WiFi'],
  'Candle': ['Soy Candle {brand} Lavender', 'Beeswax Candle {brand} Natural', 'Scented Candle {brand} 3-Wick', 'Pillar Candle {brand} 6"', 'Tealight Candles {brand} 50-Pack', 'Jar Candle {brand} Vanilla', 'Wood Wick Candle {brand}', 'Floating Candles {brand}', 'LED Candle {brand} Flameless', 'Candle Set {brand} Gift Box'],
}

const BRANDS: Record<string, string[]> = {
  'Electronics': ['TechSound', 'ProMax', 'EliteGear', 'SmartWave', 'DigiCore', 'VoltEdge', 'NexGen', 'PrimeAudio', 'QuantumTech', 'FusionDev'],
  'Phones & Accessories': ['PhoneGuard', 'ScreenShield', 'ChargePro', 'CaseMaster', 'DigiCase', 'PowerMax', 'GripTech', 'ClearView', 'FlexCharge', 'ArmorCase'],
  'Computers & Tablets': ['ByteCore', 'PixelMax', 'LogicPro', 'DataFlow', 'CircuitLab', 'ChipSet', 'RamBoost', 'SSDPlus', 'NetGear', 'CodeStation'],
  'Fashion': ['UrbanStyle', 'LuxeWear', 'StreetVibe', 'ClassicFit', 'TrendSet', 'VogueLine', 'DenimCo', 'SilkRoad', 'CottonClub', 'LeatherCraft'],
  'Home & Kitchen': ['HomeElite', 'KitchenPro', 'CozyNest', 'BrightHome', 'CleanMax', 'CookStar', 'DecoLux', 'FurniCraft', 'StoragePro', 'BedComfy'],
  'Beauty & Personal Care': ['GlowSkin', 'LuxeGlam', 'PureBeauty', 'SkinScience', 'GlamPro', 'NatureGlow', 'DermaCare', 'BeautyLab', 'Radiance', 'SilkTouch'],
  'Health & Wellness': ['VitaLife', 'NutriMax', 'HealthPlus', 'PureBody', 'WellnessPro', 'FitFuel', 'NatureCure', 'BioHealth', 'CoreStrength', 'MindBody'],
  'Sports & Outdoors': ['FlexFit', 'SportPeak', 'TrailMax', 'ActivePro', 'Endurance', 'SummitGear', 'AquaSport', 'CyclePro', 'YogaFlow', 'MartialArts'],
  'Toys & Games': ['PlaySmart', 'ToyWorld', 'FunFactory', 'KidZone', 'GameMaster', 'BuildPro', 'PuzzleKing', 'DollyLand', 'RCDream', 'EduPlay'],
  'Books & Media': ['BookWorld', 'PageTurner', 'CodePress', 'StoryCraft', 'LearnMore', 'ComicVault', 'AudioBook', 'EduPress', 'ClassicLit', 'SciFiHub'],
  'Food & Grocery': ['TasteGood', 'NatureHarvest', 'FreshFarm', 'OrganicLife', 'SpiceRoute', 'TeaGarden', 'CoffeeBean', 'SnackTime', 'HealthyBite', 'GourmetChef'],
  'Automotive': ['AutoPro', 'CarTech', 'DriveMax', 'MechanicPro', 'RoadKing', 'TireTrack', 'OilMax', 'CarCare', 'SpeedParts', 'BrakePro'],
  'Baby & Kids': ['BabyLove', 'TinyTots', 'KidsFirst', 'SafeNest', 'LittleStar', 'BabyJoy', 'MomCare', 'KiddoPlay', 'NurseryPro', 'BabyGear'],
  'Pet Supplies': ['PetJoy', 'FurryFriend', 'PawPrint', 'AquaPet', 'BirdSong', 'ReptilePro', 'PetHealth', 'KittyLove', 'DoggyStyle', 'PetComfort'],
  'Garden & Outdoor': ['GreenThumb', 'GardenPro', 'PlantLife', 'OutdoorLiving', 'FlowerPower', 'LawnCare', 'TreeHouse', 'HerbGarden', 'SolarGlow', 'WaterWorks'],
  'Office Supplies': ['OfficeMax', 'DeskPro', 'PaperPlus', 'WriteRight', 'FileSmart', 'PrintPro', 'SchoolKit', 'LabelMaker', 'OrganizeIt', 'DeskSetup'],
  'Tools & Hardware': ['ToolMaster', 'BuildPro', 'FixIt', 'HandyTool', 'PowerGrip', 'Craftsman', 'ToughTool', 'DrillPro', 'WrenchSet', 'ToolBox'],
  'Musical Instruments': ['SoundCraft', 'MusicPro', 'StringMaster', 'BeatDrop', 'DJMix', 'StudioPro', 'GuitarHero', 'DrumBeat', 'KeyNote', 'WindSong'],
  'Movies & TV': ['CinemaPlus', 'MovieMax', 'SeriesHub', 'AnimeWorld', 'DocuLife', 'ClassicFilm', 'HorrorVault', 'ComedyGold', 'ActionPack', 'DramaBox'],
  'Video Games': ['GameZone', 'PlayerOne', 'PixelHero', 'QuestMaster', 'LevelUp', 'BossFight', 'RetroPlay', 'VRWorld', 'IndieGame', 'ConsoleKing'],
  'Luggage & Travel': ['TravelPro', 'JetSet', 'PackRight', 'WanderLust', 'GlobeTrot', 'TripMaster', 'BagPack', 'JourneyOn', 'Voyager', 'TravelEase'],
  'Arts & Crafts': ['ArtSupply', 'CraftMaster', 'CreateIt', 'BrushStroke', 'ColorWheel', 'DesignPro', 'SketchPad', 'ArtStudio', 'CraftKit', 'MakerSpace'],
  'Industrial & Scientific': ['LabPro', 'SciTools', 'MeasureMax', 'SafetyFirst', 'IndustrialGrade', 'PrecisionLab', 'BioTech', 'ChemSupply', 'ElectroPro', 'MechLab'],
  'Collectibles & Fine Art': ['RareFind', 'CollectPro', 'ArtVault', 'VintageGold', 'CoinMaster', 'StampCol', 'CardShop', 'Memorabilia', 'AntiquePro', 'FineArt'],
  'Gift Cards': ['GiftCard', 'SurpriseMe', 'GiftBox', 'TreatYourself', 'GiftVoucher', 'RewardCard', 'GiftIt', 'SpecialOffer', 'GiftChoice', 'GiftPlus'],
  'Smart Home': ['SmartLife', 'HomeAuto', 'IntelliHome', 'ConnectedHome', 'SmartLiving', 'HomeHub', 'NestPro', 'VoiceControl', 'SmartSense', 'EcoHome'],
  'Costumes & Party': ['PartyTime', 'CostumeKing', 'FunDress', 'CelebrationBox', 'PartyPro', 'DressUp', 'ThemeParty', 'PartySupply', 'EventPro', 'FiestaKit'],
  'Seasonal': ['SeasonPro', 'HolidayJoy', 'SummerFun', 'WinterWarm', 'SpringBloom', 'FallHarvest', 'BackToSchool', 'FestiveBox', 'SeasonalGear', 'WeatherReady'],
  'Watches & Luxury': ['TimePiece', 'LuxWatch', 'ChronoMax', 'EliteTime', 'WatchCraft', 'PrecisionTime', 'ClassicWatch', 'SportWatch', 'SmartTime', 'LuxuryBrand'],
  'Digital Products': ['DigitalPro', 'CodeLib', 'TemplateHub', 'CourseMax', 'AssetVault', 'PluginPro', 'FontShop', 'MediaLib', 'GameKey', 'SoftwareHub'],
}

const COUNTRIES = ['China', 'USA', 'Indonesia', 'Japan', 'Korea', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'India', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Australia', 'Canada', 'Brazil', 'Mexico', 'Turkey']

const LOCATIONS_MAP: Record<string, string[]> = {
  'China': ['Shenzhen', 'Guangzhou', 'Shanghai', 'Beijing', 'Hangzhou', 'Yiwu', 'Dongguan', 'Chengdu'],
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Miami', 'Seattle'],
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Tangerang'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kyoto'],
  'Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Jeju'],
  'UK': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga', 'Bilbao', 'Zaragoza'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Hat Yai', 'Khon Kaen'],
  'Vietnam': ['Ho Chi Minh', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Nha Trang'],
  'Malaysia': ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam', 'Kuching'],
  'Singapore': ['Singapore', 'Singapore', 'Singapore', 'Singapore'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Curitiba'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana'],
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

const COLOR_POOL = ['#000', '#fff', '#1a73e8', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#3498db', '#e67e22', '#1abc9c', '#c0392b', '#2c3e50', '#8e44ad', '#d35400', '#16a085', '#2980b9', '#f1c40f', '#7f8c8d']

function generatePrice(base: number): { price: number; original: number } {
  const markup = randFloat(1.3, 2.5)
  const original = Math.round(base * markup * 100) / 100
  const discount = randFloat(0.5, 0.85)
  const price = Math.round(original * discount * 100) / 100
  return { price, original }
}

export function generateMegaCatalog(targetCount: number = 20000): Product[] {
  const products: Product[] = []
  let id = 1

  const categories = Object.keys(CATEGORY_SUBS)

  while (products.length < targetCount) {
    for (const category of categories) {
      if (products.length >= targetCount) break

      const subs = CATEGORY_SUBS[category]
      const brands = BRANDS[category] || ['Generic', 'Premium', 'Value', 'Pro', 'Elite']
      const templates = PRODUCT_TEMPLATES[subs[0]] || PRODUCT_TEMPLATES['Audio']

      // Random number of products per subcategory per batch (3-15)
      const batchSize = rand(3, 15)

      for (let i = 0; i < batchSize; i++) {
        if (products.length >= targetCount) break

        const sub = pick(subs)
        const brand = pick(brands)
        const country = pick(COUNTRIES)
        const city = pick(LOCATIONS_MAP[country] || ['Unknown'])
        const sellerNames = ['MegaStore', 'TopSeller', 'PrimeShop', 'ValueMart', 'EliteGoods', 'BestDeal', 'QuickShip', 'TrustSeller', 'GlobalTrade', 'DirectFactory']
        const seller = pick(sellerNames) + ' ' + pick(['Store', 'Shop', 'Mall', 'Hub', 'Center', 'Direct'])

        // Get templates for this subcategory or use generic
        const subTemplates = PRODUCT_TEMPLATES[sub] || templates
        const nameTemplate = pick(subTemplates)
        const name = nameTemplate.replace('{brand}', brand)

        // Price based on category
        const basePrices: Record<string, number> = {
          'Electronics': rand(15, 200),
          'Phones & Accessories': rand(5, 150),
          'Computers & Tablets': rand(50, 500),
          'Fashion': rand(8, 80),
          'Home & Kitchen': rand(10, 120),
          'Beauty & Personal Care': rand(5, 60),
          'Health & Wellness': rand(10, 80),
          'Sports & Outdoors': rand(10, 100),
          'Toys & Games': rand(8, 60),
          'Books & Media': rand(5, 40),
          'Food & Grocery': rand(3, 30),
          'Automotive': rand(10, 150),
          'Baby & Kids': rand(8, 80),
          'Pet Supplies': rand(5, 50),
          'Garden & Outdoor': rand(10, 100),
          'Office Supplies': rand(3, 30),
          'Tools & Hardware': rand(10, 120),
          'Musical Instruments': rand(15, 200),
          'Movies & TV': rand(5, 30),
          'Video Games': rand(10, 60),
          'Luggage & Travel': rand(15, 120),
          'Arts & Crafts': rand(5, 50),
          'Industrial & Scientific': rand(10, 200),
          'Collectibles & Fine Art': rand(10, 150),
          'Gift Cards': rand(10, 100),
          'Smart Home': rand(15, 150),
          'Costumes & Party': rand(8, 50),
          'Seasonal': rand(5, 60),
          'Watches & Luxury': rand(20, 300),
          'Digital Products': rand(5, 50),
        }

        const base = basePrices[category] || rand(10, 80)
        const { price, original } = generatePrice(base)

        const hasSizes = ['Fashion', 'Shoes', 'Sports & Outdoors'].includes(category) && Math.random() > 0.4
        const hasColors = Math.random() > 0.3
        const freeShip = Math.random() > 0.4
        const rating = randFloat(3.5, 5.0)
        const sold = rand(10, 50000)
        const stock = rand(50, 5000)
        const weight = rand(50, 3000) + 'g'

        const specs = [
          `Brand: ${brand}`,
          `Category: ${category}`,
          `Subcategory: ${sub}`,
          `Material: ${pick(['Premium', 'Standard', 'Eco', 'Organic', 'Synthetic', 'Natural'])}`,
          `Origin: ${country}`,
        ].join(' | ')

        const descriptions = [
          `High quality ${sub.toLowerCase()} from ${brand}. Perfect for everyday use.`,
          `Premium ${name.toLowerCase()} with excellent durability and design.`,
          `Top-rated ${sub.toLowerCase()} product. Best seller in ${category}.`,
          `${brand} official ${sub.toLowerCase()}. Authentic product with warranty.`,
          `Professional grade ${sub.toLowerCase()}. Trusted by thousands of customers.`,
        ]

        products.push({
          id: id++,
          name: name,
          price: price,
          originalPrice: original,
          category: category,
          subcategory: sub,
          brand: brand,
          seller: seller,
          sellerId: seller.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: pick(descriptions),
          specs: specs,
          colors: hasColors ? pickN(COLOR_POOL, rand(2, 5)) : [],
          sizes: hasSizes ? pickN(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '36', '37', '38', '39', '40', '41', '42', '43', '44'], rand(3, 6)) : [],
          stock: stock,
          sku: `${brand.substring(0, 3).toUpperCase()}-${sub.substring(0, 3).toUpperCase()}-${id}`,
          images: [
            `https://picsum.photos/seed/product${id}/600/600`,
            `https://picsum.photos/seed/product${id}b/600/600`,
          ],
          weight: weight,
          returnPolicy: Math.random() > 0.2 ? '30-day return policy. Items must be unused and in original packaging.' : 'Non-returnable item.',
          freeShipping: freeShip,
          rating: Math.round((randFloat(3.5, 5.0)) * 10) / 10,
          sold: rand(10, 50000),
          minOrder: rand(1, 5),
          location: `${city}, ${country}`,
        })
      }
    }
  }

  return products.slice(0, targetCount)
}

// Get subcategory count per category (varied, not always 6)
export function getSubcategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const [cat, subs] of Object.entries(CATEGORY_SUBS)) {
    counts[cat] = subs.length
  }
  return counts
}
