-- ============================================================
-- ALLIANCE MALL TK - Additional Tables for Production Features
-- Run after 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- PUSH SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Push: own read" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Push: own insert" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Push: own delete" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'referral',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_uses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_amount DECIMAL(10,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referrals: public read" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Referrals: own insert" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Referral uses: own read" ON public.referral_uses FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Referral uses: insert" ON public.referral_uses FOR INSERT WITH CHECK (auth.uid() = referred_id);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================
-- PAYMENT TRACKING
-- ============================================================
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'released', 'refunded', 'failed'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_carrier TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 10.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2) DEFAULT 0;

-- ============================================================
-- PRODUCT SEARCH INDEX (Full-Text Search)
-- ============================================================
-- Add tsvector column for FTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING GIN(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION public.update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.brand, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(NEW.subcategory, '') || ' ' ||
    COALESCE(NEW.description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search vector
DROP TRIGGER IF EXISTS update_product_search ON public.products;
CREATE TRIGGER update_product_search
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_product_search_vector();

-- Update existing products
UPDATE public.products SET search_vector = to_tsvector('english',
  COALESCE(name, '') || ' ' ||
  COALESCE(brand, '') || ' ' ||
  COALESCE(category, '') || ' ' ||
  COALESCE(subcategory, '') || ' ' ||
  COALESCE(description, '')
);

-- ============================================================
-- SELLER ANALYTICS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.seller_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES public.seller_stores(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  UNIQUE(seller_id, date)
);

ALTER TABLE public.seller_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics: seller read" ON public.seller_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = seller_id AND owner_id = auth.uid())
);

-- ============================================================
-- PRODUCT VIEWS TRACKING
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_views_product ON public.product_views(product_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_views_user ON public.product_views(user_id, viewed_at DESC) WHERE user_id IS NOT NULL;

ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Views: public insert" ON public.product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Views: seller read" ON public.product_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products p JOIN public.seller_stores s ON p.seller_id = s.id WHERE p.id = product_id AND s.owner_id = auth.uid())
);

-- ============================================================
-- DISPUTE SYSTEM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.seller_stores(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('not_received', 'wrong_item', 'damaged', 'not_as_described', 'other')),
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed', 'escalated')),
  resolution TEXT,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Disputes: own read" ON public.disputes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Disputes: own insert" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- DISPUTE MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dispute_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('buyer', 'seller', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dispute msgs: read" ON public.dispute_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.disputes WHERE id = dispute_id AND (user_id = auth.uid() OR seller_id IN (SELECT id FROM public.seller_stores WHERE owner_id = auth.uid())))
);

-- ============================================================
-- COUPON USAGE TRACKING
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coupon usage: own read" ON public.coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coupon usage: insert" ON public.coupon_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
