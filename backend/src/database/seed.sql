USE hotel_ordering_db;

-- 1. Insert Default Manager / Staff User (Password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Madhav Food Cart Manager', 'admin@hotel.com', '$2a$10$0bOq5qXv6fCcvuVlB.nLkeMgh.e2VekG3Kk7J3x7xGzZ2uM1y7u8a', 'manager'),
('Kitchen Head Chef', 'chef@hotel.com', '$2a$10$0bOq5qXv6fCcvuVlB.nLkeMgh.e2VekG3Kk7J3x7xGzZ2uM1y7u8a', 'staff');

-- 2. Insert Tables
INSERT INTO tables (table_number, capacity, status, qr_code_url) VALUES
(1, 4, 'available', '/table/1'),
(2, 2, 'available', '/table/2'),
(3, 4, 'available', '/table/3'),
(4, 6, 'available', '/table/4'),
(5, 4, 'available', '/table/5'),
(6, 2, 'available', '/table/6'),
(7, 8, 'available', '/table/7'),
(8, 4, 'available', '/table/8'),
(9, 4, 'available', '/table/9'),
(10, 6, 'available', '/table/10'),
(11, 2, 'available', '/table/11'),
(12, 4, 'available', '/table/12');

-- 3. Insert Categories
INSERT INTO categories (id, name, display_order) VALUES
(1, 'Starters', 1),
(2, 'Main Course', 2),
(3, 'Breads & Rice', 3),
(4, 'Desserts', 4),
(5, 'Beverages', 5);

-- 4. Insert Menu Items
INSERT INTO menu (category_id, name, description, price, image_url, is_veg, is_available, prep_time_minutes) VALUES
(2, 'Paneer Butter Masala', 'Cottage cheese cubes simmered in a rich, buttery, spiced tomato gravy.', 280.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80', 1, 1, 20),
(2, 'Butter Chicken (Murgh Makhani)', 'Tender chicken pieces cooked in creamy tomato sauce with aromatic spices.', 360.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80', 0, 1, 25),
(1, 'Crispy Veg Spring Rolls', 'Golden fried crispy rolls stuffed with seasoned vegetables, served with sweet chilli dip.', 190.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 1, 1, 15),
(1, 'Tandoori Chicken Tikka', 'Succulent boneless chicken chunks marinated in hung curd and red tandoori masala.', 320.00, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', 0, 1, 20),
(3, 'Garlic Butter Naan', 'Fresh clay-oven baked flatbread brushed with roasted garlic butter and cilantro.', 65.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80', 1, 1, 10),
(3, 'Hyderabadi Dum Biryani', 'Fragrant long-grain basmati rice layered with marinated spiced meat and saffron aroma.', 340.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', 0, 1, 25),
(4, 'Sizzling Brownie with Ice Cream', 'Warm fudge brownie served on a cast-iron skillet with vanilla bean ice cream and hot chocolate sauce.', 210.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', 1, 1, 10),
(4, 'Gulab Jamun (2 Pcs)', 'Traditional golden khoya dumplings soaked in fragrant cardamom and rose sugar syrup.', 110.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', 1, 1, 5),
(5, 'Fresh Mint Lime Mojito', 'Refreshing crush of fresh garden mint, lime wedges, cane sugar and chilled sparkling soda.', 130.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', 1, 1, 5),
(5, 'Masala Chai / Filter Coffee', 'Authentic aromatic brewed beverage infused with ginger, cardamom, and whole milk.', 60.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', 1, 1, 8);
