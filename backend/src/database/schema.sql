-- ========================================================
-- HOTEL FOOD ORDERING SYSTEM DATABASE SCHEMA (MySQL)
-- Tables: Users, Tables, Menu, Orders, Order Items
-- ========================================================

CREATE DATABASE IF NOT EXISTS hotel_ordering_db;
USE hotel_ordering_db;

-- 1. USERS (Managers, Staff, Admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('manager', 'staff', 'admin') DEFAULT 'manager',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABLES (Hotel Restaurant Dining Tables)
CREATE TABLE IF NOT EXISTS tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT NOT NULL UNIQUE,
  capacity INT DEFAULT 4,
  status ENUM('available', 'occupied', 'reserved') DEFAULT 'available',
  qr_code_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. CATEGORIES (Menu Categories)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. MENU (Dishes & Beverages)
CREATE TABLE IF NOT EXISTS menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  is_veg BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  prep_time_minutes INT DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ORDERS (Customer Placed Orders per Table)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  table_id INT NOT NULL,
  customer_name VARCHAR(100) DEFAULT 'Guest Diner',
  customer_phone VARCHAR(20),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  payment_method ENUM('cash', 'card', 'upi', 'unspecified') DEFAULT 'unspecified',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. ORDER ITEMS (Individual Dish Lines in an Order)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT,
  item_name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  special_instructions VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
