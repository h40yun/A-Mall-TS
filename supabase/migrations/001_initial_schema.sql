-- ============================================================
-- ALLIANCE MALL TK - Production Database Schema
-- Supabase PostgreSQL Migration
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USER PROFILES (extends Supabase Auth)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  avatar TEXT,
  coins INTEGER NOT NULL DEFAULT 100,
  membership TEXT NOT NULL DEFAULT 'basic' CHECK (membership IN ('basic', 'prime', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. ADDRESSES
-- ============================================================
CREATE TABLE public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT DEFAULT 'Home',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '📦',
  color TEXT DEFAULT '#666',
  promoted BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(category_id, name)
);

-- ============================================================
-- 4. SELLER STORES
-- ============================================================
CREATE TABLE public.seller_stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  banner_color TEXT DEFAULT '#667eea',
  logo_initial TEXT,
  location TEXT,
  phone TEXT,
  business_type TEXT,
  return_policy TEXT DEFAULT '30-day return policy',
  shipping_policy TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  total_sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  followers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. PRODUCTS
-- ============================================================
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES public.seller_stores(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  specs TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= price),
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT DEFAULT 'Generic',
  rating DECIMAL(3,2) DEFAULT 0,
  sold INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video TEXT,
  weight TEXT,
  return_policy TEXT,
  free_shipping BOOLEAN DEFAULT FALSE,
  min_order INTEGER DEFAULT 1,
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_rating ON public.products(rating DESC);
CREATE INDEX idx_products_sold ON public.products(sold DESC);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = TRUE;

-- ============================================================
-- 6. CART ITEMS
-- ============================================================
CREATE TABLE public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  variant TEXT,
  selected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant)
);

-- ============================================================
-- 7. WISHLISTS
-- ============================================================
CREATE TABLE public.wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- 8. ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  address TEXT NOT NULL,
  shipping_method TEXT NOT NULL DEFAULT 'free',
  payment_method TEXT NOT NULL DEFAULT 'credit-card',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'returning')),
  tracking_number TEXT,
  notes TEXT,
  voucher_code TEXT,
  gift_wrap BOOLEAN DEFAULT FALSE,
  gift_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);

CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  variant TEXT,
  image TEXT
);

CREATE TABLE public.order_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  helpful INTEGER DEFAULT 0,
  seller_reply TEXT,
  seller_reply_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON public.reviews(product_id);

-- ============================================================
-- 10. MESSAGES
-- ============================================================
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_from ON public.messages(from_user_id);
CREATE INDEX idx_messages_to ON public.messages(to_user_id);

-- ============================================================
-- 11. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================================
-- 12. COUPONS
-- ============================================================
CREATE TABLE public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_spend DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  store_id UUID REFERENCES public.seller_stores(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. VOUCHERS
-- ============================================================
CREATE TABLE public.vouchers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage', 'free_shipping')),
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_spend DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  description TEXT,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.voucher_claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, voucher_id)
);

-- ============================================================
-- 14. RETURN REQUESTS
-- ============================================================
CREATE TABLE public.return_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. PAYMENT METHODS
-- ============================================================
CREATE TABLE public.payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'paypal', 'bank')),
  label TEXT NOT NULL,
  last4 TEXT,
  brand TEXT,
  expiry TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. BROWSING HISTORY
-- ============================================================
CREATE TABLE public.browsing_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_browsing_user ON public.browsing_history(user_id, viewed_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.browsing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read all profiles, update only their own
CREATE POLICY "Profiles: public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: own update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ADDRESSES: Users can CRUD their own addresses
CREATE POLICY "Addresses: own read" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Addresses: own insert" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Addresses: own update" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Addresses: own delete" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- CART: Users can CRUD their own cart
CREATE POLICY "Cart: own read" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Cart: own insert" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Cart: own update" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Cart: own delete" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- WISHLISTS: Users can CRUD their own wishlist
CREATE POLICY "Wishlist: own read" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Wishlist: own insert" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Wishlist: own delete" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- PRODUCTS: Anyone can read active products, sellers can manage their own
CREATE POLICY "Products: public read" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Products: seller insert" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = seller_id AND owner_id = auth.uid())
);
CREATE POLICY "Products: seller update" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = seller_id AND owner_id = auth.uid())
);
CREATE POLICY "Products: seller delete" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = seller_id AND owner_id = auth.uid())
);

-- ORDERS: Users can read their own orders
CREATE POLICY "Orders: own read" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Orders: own insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Order items: own read" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Order items: own insert" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Order tracking: own read" ON public.order_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

-- REVIEWS: Anyone can read, authenticated users can insert their own
CREATE POLICY "Reviews: public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: auth insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reviews: own update" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- MESSAGES: Users can read messages they sent or received
CREATE POLICY "Messages: own read" ON public.messages FOR SELECT USING (
  auth.uid() = from_user_id OR auth.uid() = to_user_id
);
CREATE POLICY "Messages: auth insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Messages: own update" ON public.messages FOR UPDATE USING (auth.uid() = to_user_id);

-- NOTIFICATIONS: Users can read/update their own
CREATE POLICY "Notifications: own read" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications: own update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- VOUCHER CLAIMS: Users can read/insert their own
CREATE POLICY "Voucher claims: own read" ON public.voucher_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Voucher claims: own insert" ON public.voucher_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RETURN REQUESTS: Users can read/insert their own
CREATE POLICY "Returns: own read" ON public.return_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Returns: own insert" ON public.return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PAYMENT METHODS: Users can CRUD their own
CREATE POLICY "Payments: own read" ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Payments: own insert" ON public.payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Payments: own update" ON public.payment_methods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Payments: own delete" ON public.payment_methods FOR DELETE USING (auth.uid() = user_id);

-- BROWSING HISTORY: Users can read/insert their own
CREATE POLICY "Browsing: own read" ON public.browsing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Browsing: own insert" ON public.browsing_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CATEGORIES/SUBCATEGORIES: Public read
CREATE POLICY "Categories: public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Subcategories: public read" ON public.subcategories FOR SELECT USING (true);

-- SELLER STORES: Public read
CREATE POLICY "Stores: public read" ON public.seller_stores FOR SELECT USING (true);
CREATE POLICY "Stores: owner update" ON public.seller_stores FOR UPDATE USING (auth.uid() = owner_id);

-- COUPONS/VOUCHERS: Public read active
CREATE POLICY "Coupons: public read" ON public.coupons FOR SELECT USING (status = 'active');
CREATE POLICY "Vouchers: public read" ON public.vouchers FOR SELECT USING (true);

-- ============================================================
-- FUNCTIONS: Auto-update product rating on review change
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.reviews
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
  )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- ============================================================
-- FUNCTION: Increment sold count on order completion
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_product_sold()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET sold = sold + NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_item_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.increment_product_sold();
