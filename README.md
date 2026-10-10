# 🍽️ Madhav Dining Hall - Contactless Hotel Food Ordering & Analytics System

A full-stack, contactless hotel & restaurant dining management web application built for **Madhav Dining Hall** with **React (Vite)**, **Node.js + Express**, **MySQL**, and **Persistent Storage**.

---

## 🏛️ System Architecture

```text
                     MADHAV DINING HALL
                              │
             ┌────────────────┴────────────────┐
             │                                 │
       CUSTOMER SIDE                    MANAGER SIDE
             │                                 │
       Scan Table QR                    Manager Login
             │                                 │
       React Web App                    Dashboard & Analytics
             │                           (Daily, Monthly, Yearly)
       View Menu                               │
             │                          View Orders Queue
       Add to Cart                             │
             │                          Update Status
       Place Order                             │
             │                          Manage Menu & Tables
             │                                 │
             └──────────────┬──────────────────┘
                            │
                       REST API
                            │
                    Node.js + Express
                            │
                   MySQL / Persistent Disk DB
                            │
              ┌─────────────┼─────────────┐
              │             │             │
            Users         Tables        Menu
                            │
                          Orders
                            │
                       Order Items
```

---

## 📋 Comprehensive Project Description

### 1. Project Overview & Objectives
**Madhav Dining Hall** is an end-to-end contactless digital food ordering and restaurant management platform. It solves long wait times, manual paper ticketing errors, and dining inefficiencies by placing the complete dining experience directly onto the customer's smartphone via table QR codes, while empowering managers with real-time kitchen operations and data-driven revenue analytics.

### 2. Core Functional Modules

#### A. Customer Dining Portal (Mobile-First Web App)
- **Table Identification & QR Onboarding (`/table/:tableNumber` or `/`)**:
  - Diners scan their table's physical QR code standee or select their table (1 to 12).
  - Preserves table context throughout their browsing and ordering journey.
- **Interactive Menu (`/menu`)**:
  - Filterable by categories: *Starters, Main Course, Breads & Rice, Desserts, Beverages*.
  - Veg 🌱 vs. Non-Veg 🍗 dietary filters.
  - Instant live search by dish name, ingredients, or keywords.
  - High-definition dish photos, pricing, descriptions, and preparation time indicators.
- **Cart & Order Customization**:
  - Slide-out Cart Drawer with instant quantity adjusters (+ / -).
  - Custom dining notes per dish (e.g., *"Less spicy"*, *"No garlic"*, *"Extra crispy"*).
  - Real-time billing breakdown including 5% GST and grand total.
- **Order Placement & Live Kitchen Tracker (`/order-status/:orderId`)**:
  - 1-click contactless checkout linked directly to the guest's table.
  - Live 4-stage tracking stepper with automatic polling every 4 seconds:
    1. 🕒 **Order Placed** (Received by hotel system)
    2. 👨‍🍳 **In Kitchen** (Chef cooking)
    3. 🔔 **Ready to Serve** (Plated & on the way)
    4. ✅ **Delivered** (Enjoy your meal!)
- **Table Service Assistance Modal**:
  - Guests can request drinking water, table cleaning, or the bill without calling out across the dining hall.

#### B. Manager Operations & Executive Analytics (`/manager/dashboard`)
- **Secure Authentication (`/manager/login`)**:
  - JWT token-protected portal for managers and staff.
  - Default credentials: `admin@hotel.com` / `admin123` (includes 1-click Quick Demo Login).
- **Daily, Monthly & Yearly Revenue Analytics**:
  - **Daily Analytics (Today)**: Hourly sales distribution (08:00 to 23:00), identifying breakfast, lunch, and dinner peak rushes.
  - **Monthly Analytics (Current Month)**: Day-by-day sales trend across all 31 days to monitor revenue velocity.
  - **Yearly Analytics (2026 Overview)**: Month-by-month sales trajectory (Jan to Dec) for annual revenue forecasting.
  - **Executive KPIs**: Total Gross Revenue, Total Orders Volume, Completed vs. Cancelled ratios, Average Order Value (AOV), and Active Kitchen Orders.
  - **Leaderboard of Top-Selling Dishes**: Ranked by volume sold and revenue generated with quantity meters.
  - **Table Utilization Matrix**: Real-time sales and turnover per dining table (Table 1 to 12).
- **Live Kitchen & Floor Queue (`/manager/orders`)**:
  - Real-time Kanban-style queue with 1-click status transitions:
    `Accept & Start Cooking` ➡️ `Mark Ready` ➡️ `Mark Delivered` ➡️ `Complete & Bill Paid`.
- **Menu & Inventory Stock Control (`/manager/menu`)**:
  - Full CRUD: Add new dishes, edit prices, descriptions, and prep time.
  - 1-click **In Stock / Sold Out** inventory toggle switch.
- **Table QR Generator & Printable Standees (`/manager/tables`)**:
  - Generates scannable QR codes for each table.
  - Printable tent standee card modal with hotel branding, table badge, and scan instructions.

---

## 💾 Persistent Data Storage & Zero Data Loss Guarantee

To ensure that **orders, order history, menu adjustments, and analytics are NEVER lost when the website or backend server restarts**:
1. **Persistent Disk Storage (`backend/data/db.json`)**:
   - All orders, menu dishes, tables, and users are automatically loaded from and saved to disk.
   - Any new customer order or status update is immediately written to disk using atomic file persistence.
   - Pre-loaded with 120+ historical orders spanning 2026 for rich daily, monthly, and annual analytics.
2. **MySQL Database Support**:
   - Clean, professional MySQL schema provided in `backend/src/database/schema.sql` and `seed.sql`.
   - If MySQL server is running, the backend seamlessly connects via connection pooling.
   - If MySQL server is not running (e.g. in development/demo mode), the backend seamlessly runs on the persistent file store with 100% feature parity and zero crashes!

---

## 🗄️ Database Tables (MySQL)

1. **`users`**: Manager and staff authentication (`id`, `name`, `email`, `password`, `role`, `created_at`).
2. **`tables`**: Dining hall tables (`id`, `table_number`, `capacity`, `status`, `qr_code_url`, `created_at`).
3. **`categories`**: Menu groups (`id`, `name`, `display_order`).
4. **`menu`**: Dishes & beverages (`id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_veg`, `is_available`, `prep_time_minutes`, `created_at`).
5. **`orders`**: Customer orders (`id`, `order_number`, `table_id`, `customer_name`, `customer_phone`, `total_amount`, `status`, `payment_status`, `notes`, `created_at`, `updated_at`).
6. **`order_items`**: Dish item lines (`id`, `order_id`, `menu_item_id`, `item_name`, `price`, `quantity`, `special_instructions`).

---

## 🚀 Quick Start Guide

### 1. Start the Backend API
```powershell
cd d:\WAD\project\backend
npm start
```
*API runs at: **`http://localhost:5000`***

### 2. Start the Frontend App
```powershell
cd d:\WAD\project\frontend
npm run dev
```
*App runs at: **`http://localhost:5173`***

---

## 🌐 Application URLs

| URL | Role | Description |
|---|---|---|
| `http://localhost:5173/` | Customer | Table Selector & QR Entry |
| `http://localhost:5173/table/3` | Customer | Scanned QR landing for Table #3 |
| `http://localhost:5173/menu` | Customer | Full menu with search, filters & cart |
| `http://localhost:5173/order-status/ORD-1001` | Customer | Real-time 4-stage order tracker |
| `http://localhost:5173/manager/login` | Manager | Login (`admin@hotel.com` / `admin123`) |
| `http://localhost:5173/manager/dashboard` | Manager | Executive Daily/Monthly/Yearly Analytics |
| `http://localhost:5173/manager/orders` | Manager | Kitchen order queue & status updates |
| `http://localhost:5173/manager/menu` | Manager | Menu CRUD & inventory stock toggle |
| `http://localhost:5173/manager/tables` | Manager | Scannable table QR generator & standees |
