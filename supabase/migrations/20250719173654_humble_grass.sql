/*
  # Seed Sample Data

  1. Categories
  2. Products
  3. Coupons
*/

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Electronics', 'Latest gadgets and electronic devices', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Fashion', 'Trendy clothing and accessories', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Home & Garden', 'Home improvement and garden essentials', 'https://images.pexels.com/photos/245208/pexels-photo-245208.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Sports & Fitness', 'Sports equipment and fitness gear', 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Books & Media', 'Books, movies, and educational content', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300'),
('Beauty & Health', 'Beauty products and health supplements', 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300');

-- Insert sample products
INSERT INTO products (name, description, price, original_price, category_id, stock_quantity, sku, images, specifications, weight, dimensions) 
SELECT 
  'Premium Wireless Headphones',
  'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals who demand exceptional audio quality.',
  249.99,
  299.99,
  c.id,
  50,
  'WH-001',
  ARRAY[
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
  ],
  '{"battery_life": "30 hours", "connectivity": "Bluetooth 5.0", "noise_cancellation": true, "weight": "250g"}'::jsonb,
  0.25,
  '{"length": 20, "width": 18, "height": 8}'::jsonb
FROM categories c WHERE c.name = 'Electronics';

INSERT INTO products (name, description, price, category_id, stock_quantity, sku, images, specifications, weight, dimensions)
SELECT 
  'Smart Fitness Watch',
  'Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life. Track your fitness goals effectively with comprehensive health monitoring.',
  199.99,
  c.id,
  75,
  'SW-002',
  ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500'],
  '{"battery_life": "7 days", "water_resistance": "50m", "gps": true, "heart_rate_monitor": true}'::jsonb,
  0.05,
  '{"length": 4.5, "width": 4.5, "height": 1.2}'::jsonb
FROM categories c WHERE c.name = 'Electronics';

INSERT INTO products (name, description, price, original_price, category_id, stock_quantity, sku, images, specifications, weight, dimensions)
SELECT 
  'Designer Leather Jacket',
  'Premium leather jacket with modern cut and exceptional comfort. Made from genuine leather with attention to detail and superior craftsmanship.',
  279.99,
  349.99,
  c.id,
  25,
  'LJ-003',
  ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500'],
  '{"material": "Genuine Leather", "lining": "Polyester", "care": "Professional cleaning recommended"}'::jsonb,
  1.2,
  '{"chest": 42, "length": 26, "sleeve": 25}'::jsonb
FROM categories c WHERE c.name = 'Fashion';

INSERT INTO products (name, description, price, category_id, stock_quantity, sku, images, specifications, weight, dimensions)
SELECT 
  'Modern Coffee Maker',
  'Programmable coffee maker with thermal carafe and built-in grinder. Make perfect coffee every morning with precision brewing technology.',
  159.99,
  c.id,
  40,
  'CM-004',
  ARRAY['https://images.pexels.com/photos/4226924/pexels-photo-4226924.jpeg?auto=compress&cs=tinysrgb&w=500'],
  '{"capacity": "12 cups", "grinder": "Built-in burr grinder", "programmable": true, "carafe": "Thermal"}'::jsonb,
  3.5,
  '{"length": 35, "width": 25, "height": 40}'::jsonb
FROM categories c WHERE c.name = 'Home & Garden';

INSERT INTO products (name, description, price, original_price, category_id, stock_quantity, sku, images, specifications, weight, dimensions)
SELECT 
  'Professional Yoga Mat',
  'Premium non-slip yoga mat with superior grip and cushioning. Perfect for all types of yoga practice and fitness routines.',
  49.99,
  69.99,
  c.id,
  100,
  'YM-005',
  ARRAY['https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=500'],
  '{"thickness": "6mm", "material": "TPE", "size": "183cm x 61cm", "non_slip": true}'::jsonb,
  1.0,
  '{"length": 183, "width": 61, "height": 0.6}'::jsonb
FROM categories c WHERE c.name = 'Sports & Fitness';

INSERT INTO products (name, description, price, category_id, stock_quantity, sku, images, specifications, weight, dimensions)
SELECT 
  'Bestselling Novel Collection',
  'Collection of 5 bestselling novels from award-winning authors. Perfect for book lovers and those looking to expand their reading horizons.',
  89.99,
  c.id,
  60,
  'BC-006',
  ARRAY['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500'],
  '{"books_count": 5, "genre": "Fiction", "language": "English", "binding": "Paperback"}'::jsonb,
  1.5,
  '{"length": 20, "width": 13, "height": 8}'::jsonb
FROM categories c WHERE c.name = 'Books & Media';

-- Insert sample coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 50.00, 25.00, 1000, NOW() + INTERVAL '30 days'),
('SAVE20', 'Save $20', 'Get $20 off on orders above $100', 'fixed', 20.00, 100.00, NULL, 500, NOW() + INTERVAL '15 days'),
('FREESHIP', 'Free Shipping', 'Free shipping on all orders', 'fixed', 9.99, 0.00, 9.99, NULL, NOW() + INTERVAL '60 days'),
('SUMMER25', 'Summer Sale', 'Get 25% off on fashion items', 'percentage', 25.00, 75.00, 50.00, 200, NOW() + INTERVAL '45 days');