-- ============================================================
-- ALLIANCE MALL TK - Seed Data
-- Run after 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO public.categories (name, icon, color, promoted, sort_order) VALUES
('Electronics', '📱', '#3498db', true, 1),
('Phones & Accessories', '📲', '#00bcd4', true, 2),
('Computers & Tablets', '💻', '#607d8b', true, 3),
('Fashion', '👗', '#e91e63', true, 4),
('Home & Kitchen', '🏠', '#4caf50', false, 5),
('Beauty & Personal Care', '💄', '#9c27b0', true, 6),
('Health & Wellness', '💊', '#009688', false, 7),
('Sports & Outdoors', '⚽', '#ff9800', false, 8),
('Toys & Games', '🧸', '#f44336', false, 9),
('Books & Media', '📚', '#795548', false, 10),
('Food & Grocery', '🍕', '#ff5722', false, 11),
('Automotive', '🚗', '#455a64', false, 12),
('Baby & Kids', '👶', '#e91e63', false, 13),
('Pet Supplies', '🐾', '#795548', false, 14),
('Garden & Outdoor', '🌿', '#4caf50', false, 15),
('Office Supplies', '📎', '#607d8b', false, 16),
('Tools & Hardware', '🔧', '#ff9800', false, 17),
('Musical Instruments', '🎸', '#9c27b0', false, 18),
('Video Games', '🎮', '#3f51b5', false, 19),
('Smart Home', '🏡', '#4caf50', false, 20);

-- ============================================================
-- SUBCATEGORIES (Electronics example)
-- ============================================================
DO $$
DECLARE
  cat_id UUID;
BEGIN
  SELECT id INTO cat_id FROM public.categories WHERE name = 'Electronics';
  INSERT INTO public.subcategories (category_id, name, sort_order) VALUES
  (cat_id, 'Audio', 1), (cat_id, 'Wearables', 2), (cat_id, 'Peripherals', 3),
  (cat_id, 'Accessories', 4), (cat_id, 'Cameras', 5), (cat_id, 'Gaming', 6);

  SELECT id INTO cat_id FROM public.categories WHERE name = 'Fashion';
  INSERT INTO public.subcategories (category_id, name, sort_order) VALUES
  (cat_id, 'Men''s Clothing', 1), (cat_id, 'Women''s Clothing', 2),
  (cat_id, 'Shoes', 3), (cat_id, 'Bags', 4), (cat_id, 'Accessories', 5);

  SELECT id INTO cat_id FROM public.categories WHERE name = 'Home & Kitchen';
  INSERT INTO public.subcategories (category_id, name, sort_order) VALUES
  (cat_id, 'Kitchen', 1), (cat_id, 'Lighting', 2), (cat_id, 'Decor', 3),
  (cat_id, 'Furniture', 4), (cat_id, 'Storage', 5);

  SELECT id INTO cat_id FROM public.categories WHERE name = 'Beauty & Personal Care';
  INSERT INTO public.subcategories (category_id, name, sort_order) VALUES
  (cat_id, 'Skincare', 1), (cat_id, 'Makeup', 2), (cat_id, 'Hair Care', 3),
  (cat_id, 'Fragrance', 4), (cat_id, 'Tools', 5);

  SELECT id INTO cat_id FROM public.categories WHERE name = 'Sports & Outdoors';
  INSERT INTO public.subcategories (category_id, name, sort_order) VALUES
  (cat_id, 'Yoga', 1), (cat_id, 'Fitness', 2), (cat_id, 'Outdoor', 3),
  (cat_id, 'Running', 4), (cat_id, 'Cycling', 5);
END $$;

-- ============================================================
-- VOUCHERS
-- ============================================================
INSERT INTO public.vouchers (code, type, value, min_spend, max_discount, description, end_date) VALUES
('NEWUSER', 'fixed', 10, 0, NULL, 'New User Voucher - $10 off your first order', '2026-12-31'),
('FLASH50', 'percentage', 50, 30, 20, 'Flash Sale - 50% off (max $20)', '2026-08-01'),
('FREESHIP50', 'free_shipping', 0, 50, NULL, 'Free Shipping on orders $50+', '2026-12-31'),
('WEEKEND15', 'percentage', 15, 25, 8, 'Weekend Special - 15% off', '2026-08-15'),
('LOYALTY5', 'fixed', 5, 20, NULL, 'Loyalty Reward - $5 off', '2026-12-31');

-- ============================================================
-- COUPONS
-- ============================================================
INSERT INTO public.coupons (code, type, value, min_spend, max_discount, usage_limit, start_date, end_date, status) VALUES
('WELCOME10', 'percentage', 10, 20, 5, 100, '2026-01-01', '2026-12-31', 'active'),
('SAVE5', 'fixed', 5, 30, NULL, 200, '2026-01-01', '2026-12-31', 'active'),
('FREESHIP', 'free_shipping', 0, 50, NULL, 500, '2026-01-01', '2026-12-31', 'active'),
('TECH20', 'percentage', 20, 50, 15, 50, '2026-01-01', '2026-12-31', 'active'),
('FASHION15', 'percentage', 15, 40, 10, 80, '2026-01-01', '2026-12-31', 'active');

-- ============================================================
-- ADMIN USER (will be created via Supabase Auth, then update role)
-- ============================================================
-- After admin signs up via auth, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@alliancemall.com';
