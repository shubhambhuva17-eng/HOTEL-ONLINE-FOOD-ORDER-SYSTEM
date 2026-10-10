const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Initial Mock Seed Data (used when backend is starting or offline)
const INITIAL_MENU = [
  {
    id: 1,
    name: 'Special Gujarati Unlimited Thali',
    category: 'Main Course',
    price: 150,
    description: 'Authentic Gujarati feast: rotli, 2 seasonal sabjis, Gujarati dal & kadhi, chilled chaas, farsan, papad & salad.',
    image_url: '/images/Gujarati_thali.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10
  },
  {
    id: 2,
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 280,
    description: 'Tender cottage cheese cubes simmered in a rich, buttery, spiced tomato gravy garnished with mint.',
    image_url: '/images/paneer-butter-masala.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 20
  },
  {
    id: 3,
    name: 'Pav Bhaji Special',
    category: 'Main Course',
    price: 100,
    description: 'Spiced mashed vegetable bhaji cooked on a flat tawa with generous butter, served with soft toasted pav & onions.',
    image_url: '/images/Pav_Bhaji.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10
  },
  {
    id: 4,
    name: 'Crispy Golden Spring Rolls',
    category: 'Starters',
    price: 190,
    description: 'Golden fried crispy rolls stuffed with seasoned shredded vegetables, served piping hot.',
    image_url: '/images/veg-spring-rolls.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 15
  },
  {
    id: 5,
    name: 'Garlic Butter Tandoori Naan',
    category: 'Breads & Rice',
    price: 65,
    description: 'Fresh clay-oven baked flatbread brushed with roasted garlic butter and cilantro.',
    image_url: '/images/garlic-naan.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10
  },
  {
    id: 6,
    name: 'Rich Chocolate Fudge Brownie',
    category: 'Desserts',
    price: 180,
    description: 'Decadent warm fudge brownie baked with premium cocoa and chocolate chunks.',
    image_url: '/images/sizzling-brownie.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 7,
    name: 'Shahi Gulab Jamun (Bowl)',
    category: 'Desserts',
    price: 110,
    description: 'Melt-in-mouth golden khoya dumplings soaked in fragrant cardamom and rose sugar syrup.',
    image_url: '/images/gulab-jamun.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 8,
    name: 'Fresh Mint Lime Mojito',
    category: 'Beverages',
    price: 130,
    description: 'Tall glass with muddled fresh garden mint, lime wedges, crushed ice, and chilled sparkling soda.',
    image_url: '/images/mint-mojito.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 9,
    name: 'Special Desi Kulhad Chai',
    category: 'Beverages',
    price: 60,
    description: 'Authentic hot kadak tea infused with fresh ginger & cardamom, served in a traditional clay kulhad.',
    image_url: '/images/masala-chai.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 10,
    name: 'Chilled Lemon Iced Cola',
    category: 'Beverages',
    price: 50,
    description: 'Refreshing fizzy dark cola served in a tall glass over crystal ice cubes with a fresh lemon slice.',
    image_url: '/images/cold-drink.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 3
  }
];

const INITIAL_TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  table_number: i + 1,
  capacity: i % 3 === 0 ? 6 : (i % 2 === 0 ? 2 : 4),
  status: i === 1 ? 'occupied' : 'available',
  qr_code_url: `/table/${i + 1}`
}));

// Local storage helpers for mock fallback
const getStorageItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
};

export const api = {
  // Menu APIs
  async getMenu() {
    try {
      const res = await fetch(`${API_BASE_URL}/menu`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback to local data: getMenu');
    }
    return getStorageItem('hotel_menu', INITIAL_MENU);
  },

  async addMenuItem(item) {
    try {
      const res = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: addMenuItem');
    }
    const current = getStorageItem('hotel_menu', INITIAL_MENU);
    const newItem = { ...item, id: Date.now() };
    const updated = [newItem, ...current];
    setStorageItem('hotel_menu', updated);
    return newItem;
  },

  async updateMenuItem(id, updates) {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: updateMenuItem');
    }
    const current = getStorageItem('hotel_menu', INITIAL_MENU);
    const updated = current.map(item => (item.id === Number(id) ? { ...item, ...updates } : item));
    setStorageItem('hotel_menu', updated);
    return updated.find(item => item.id === Number(id));
  },

  async deleteMenuItem(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: deleteMenuItem');
    }
    const current = getStorageItem('hotel_menu', INITIAL_MENU);
    const updated = current.filter(item => item.id !== Number(id));
    setStorageItem('hotel_menu', updated);
    return { success: true };
  },

  // Tables APIs
  async getTables() {
    try {
      const res = await fetch(`${API_BASE_URL}/tables`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: getTables');
    }
    return getStorageItem('hotel_tables', INITIAL_TABLES);
  },

  async getTableByNumber(tableNumber) {
    try {
      const res = await fetch(`${API_BASE_URL}/tables/${tableNumber}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: getTableByNumber');
    }
    const tables = getStorageItem('hotel_tables', INITIAL_TABLES);
    return tables.find(t => t.table_number === Number(tableNumber)) || {
      id: Number(tableNumber),
      table_number: Number(tableNumber),
      capacity: 4,
      status: 'available'
    };
  },

  // Order APIs
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: createOrder');
    }
    const orders = getStorageItem('hotel_orders', []);
    const newOrder = {
      id: orders.length + 101,
      order_number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table_id: orderData.table_id || orderData.table_number,
      table_number: orderData.table_number,
      customer_name: orderData.customer_name || 'Guest Diner',
      customer_phone: orderData.customer_phone || '',
      items: orderData.items || [],
      total_amount: orderData.total_amount,
      status: 'pending',
      payment_status: 'unpaid',
      notes: orderData.notes || '',
      created_at: new Date().toISOString()
    };
    orders.unshift(newOrder);
    setStorageItem('hotel_orders', orders);
    return newOrder;
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: getOrders');
    }
    return getStorageItem('hotel_orders', []);
  },

  async getOrderById(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: getOrderById');
    }
    const orders = getStorageItem('hotel_orders', []);
    return orders.find(o => String(o.id) === String(orderId) || o.order_number === orderId);
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: updateOrderStatus');
    }
    const orders = getStorageItem('hotel_orders', []);
    const updated = orders.map(o => (String(o.id) === String(orderId) ? { ...o, status } : o));
    setStorageItem('hotel_orders', updated);
    return updated.find(o => String(o.id) === String(orderId));
  },

  async getAnalytics(period = 'daily', date = '') {
    try {
      const queryParams = new URLSearchParams({ period });
      if (date) queryParams.append('date', date);
      const res = await fetch(`${API_BASE_URL}/orders/analytics?${queryParams.toString()}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: getAnalytics', err);
    }

    // Client-side analytics fallback from cached orders
    const orders = getStorageItem('hotel_orders', []);
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRev = validOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    return {
      period,
      periodLabel: period.toUpperCase(),
      summary: {
        totalRevenue: Math.round(totalRev * 100) / 100,
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        activeOrders: orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        avgOrderValue: orders.length ? Math.round(totalRev / orders.length) : 0
      },
      chartData: [],
      topDishes: [],
      tableSales: [],
      recentOrders: orders.slice(0, 10)
    };
  },

  // Manager Auth
  async loginManager(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fallback: loginManager');
    }
    if ((email === 'admin@hotel.com' || email === 'manager@hotel.com') && password === 'admin123') {
      return {
        token: 'demo-jwt-token-' + Date.now(),
        user: { id: 1, name: 'Madhav Dining Hall Manager', email, role: 'manager' }
      };
    }
    throw new Error('Invalid credentials');
  }
};
