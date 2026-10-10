const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'db.json');

const menuItems = [
  {
    id: 1,
    category_id: 2,
    category_name: 'Main Course',
    name: 'Special Gujarati Unlimited Thali',
    description: 'Authentic Gujarati feast: rotli, 2 seasonal sabjis, Gujarati dal & kadhi, chilled chaas, farsan, papad & salad.',
    price: 150,
    image_url: '/images/Gujarati_thali.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10
  },
  {
    id: 2,
    category_id: 2,
    category_name: 'Main Course',
    name: 'Paneer Butter Masala',
    description: 'Tender cottage cheese cubes simmered in a rich, buttery, spiced tomato gravy garnished with mint.',
    price: 280,
    image_url: '/images/paneer-butter-masala.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 20
  },
  {
    id: 3,
    category_id: 2,
    category_name: 'Main Course',
    name: 'Pav Bhaji Special',
    description: 'Spiced mashed vegetable bhaji cooked on a flat tawa with generous butter, served with soft toasted pav & onions.',
    price: 100,
    image_url: '/images/Pav_Bhaji.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10
  },
  {
    id: 4,
    category_id: 1,
    category_name: 'Starters',
    name: 'Crispy Golden Spring Rolls',
    description: 'Golden fried crispy rolls stuffed with seasoned shredded vegetables, served piping hot.',
    price: 190,
    image_url: '/images/veg-spring-rolls.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 15
  },
  {
    id: 5,
    category_id: 3,
    category_name: 'Breads & Rice',
    name: 'Garlic Butter Tandoori Naan',
    description: 'Fresh clay-oven baked flatbread brushed with roasted garlic butter and cilantro.',
    price: 65,
    image_url: '/images/garlic-naan.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 10
  },
  {
    id: 6,
    category_id: 4,
    category_name: 'Desserts',
    name: 'Rich Chocolate Fudge Brownie',
    description: 'Decadent warm fudge brownie baked with premium cocoa and chocolate chunks.',
    price: 180,
    image_url: '/images/sizzling-brownie.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 7,
    category_id: 4,
    category_name: 'Desserts',
    name: 'Shahi Gulab Jamun (Bowl)',
    description: 'Melt-in-mouth golden khoya dumplings soaked in fragrant cardamom and rose sugar syrup.',
    price: 110,
    image_url: '/images/gulab-jamun.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 8,
    category_id: 5,
    category_name: 'Beverages',
    name: 'Fresh Mint Lime Mojito',
    description: 'Tall glass with muddled fresh garden mint, lime wedges, crushed ice, and chilled sparkling soda.',
    price: 130,
    image_url: '/images/mint-mojito.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 9,
    category_id: 5,
    category_name: 'Beverages',
    name: 'Special Desi Kulhad Chai',
    description: 'Authentic hot kadak tea infused with fresh ginger & cardamom, served in a traditional clay kulhad.',
    price: 60,
    image_url: '/images/masala-chai.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 5
  },
  {
    id: 10,
    category_id: 5,
    category_name: 'Beverages',
    name: 'Chilled Lemon Iced Cola',
    description: 'Refreshing fizzy dark cola served in a tall glass over crystal ice cubes with a fresh lemon slice.',
    price: 50,
    image_url: '/images/cold-drink.jpg',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 3
  }
];

const customerNames = [
  'Aarav Patel', 'Priya Sharma', 'Rohan Mehta', 'Sneha Gupta',
  'Vikram Singh', 'Ananya Desai', 'Rajesh Joshi', 'Neha Verma',
  'Amit Trivedi', 'Kavita Shah', 'Suresh Kumar', 'Pooja Iyer'
];

function generateSeedOrders() {
  const orders = [];
  let orderId = 1000;

  // Helper to create order
  function addOrder(dateStr, timeStr, tableNum, custIndex, itemsList, status = 'completed') {
    orderId++;
    const fullDate = new Date(`${dateStr}T${timeStr}:00+05:30`);
    const formattedItems = itemsList.map(it => {
      const dish = menuItems.find(m => m.id === it.id) || menuItems[0];
      return {
        menu_item_id: dish.id,
        item_name: dish.name,
        price: dish.price,
        quantity: it.qty,
        special_instructions: it.note || ''
      };
    });
    const subtotal = formattedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const totalAmount = subtotal + tax;

    orders.push({
      id: orderId,
      order_number: `ORD-${orderId}`,
      table_number: tableNum,
      table_id: tableNum,
      customer_name: customerNames[custIndex % customerNames.length],
      customer_phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      items: formattedItems,
      total_amount: totalAmount,
      status: status,
      payment_status: status === 'completed' ? 'paid' : (status === 'cancelled' ? 'unpaid' : 'unpaid'),
      payment_method: status === 'completed' ? (orderId % 2 === 0 ? 'upi' : 'card') : 'unspecified',
      notes: it => it.note || '',
      created_at: fullDate.toISOString(),
      updated_at: fullDate.toISOString()
    });
  }

  // 1. TODAY'S ORDERS (2026-10-09)
  addOrder('2026-10-09', '09:15', 2, 0, [{ id: 10, qty: 2 }, { id: 3, qty: 1 }], 'completed');
  addOrder('2026-10-09', '10:30', 4, 1, [{ id: 9, qty: 2 }, { id: 3, qty: 2 }], 'completed');
  addOrder('2026-10-09', '12:15', 1, 2, [{ id: 1, qty: 1 }, { id: 5, qty: 3 }, { id: 9, qty: 1 }], 'completed');
  addOrder('2026-10-09', '12:45', 3, 3, [{ id: 2, qty: 1 }, { id: 5, qty: 2 }, { id: 6, qty: 1 }], 'completed');
  addOrder('2026-10-09', '13:10', 5, 4, [{ id: 1, qty: 2 }, { id: 5, qty: 4 }, { id: 7, qty: 2 }], 'completed');
  addOrder('2026-10-09', '13:40', 2, 5, [{ id: 6, qty: 2 }, { id: 9, qty: 2 }], 'completed');
  addOrder('2026-10-09', '14:20', 6, 6, [{ id: 4, qty: 1 }, { id: 2, qty: 1 }, { id: 5, qty: 2 }], 'ready');
  addOrder('2026-10-09', '15:10', 4, 7, [{ id: 1, qty: 1 }, { id: 5, qty: 2 }, { id: 8, qty: 2 }], 'preparing');

  // 2. THIS WEEK & MONTH (October 1 to 8, 2026)
  const daysInOct = ['08', '07', '06', '05', '04', '03', '02', '01'];
  daysInOct.forEach((day, idx) => {
    addOrder(`2026-10-${day}`, '13:00', (idx % 10) + 1, idx + 1, [{ id: 1, qty: 1 }, { id: 5, qty: 2 }, { id: 7, qty: 1 }], 'completed');
    addOrder(`2026-10-${day}`, '14:30', (idx % 8) + 2, idx + 2, [{ id: 6, qty: 2 }, { id: 9, qty: 2 }], 'completed');
    addOrder(`2026-10-${day}`, '20:00', (idx % 6) + 3, idx + 3, [{ id: 2, qty: 2 }, { id: 5, qty: 4 }, { id: 4, qty: 1 }], 'completed');
    if (idx % 2 === 0) {
      addOrder(`2026-10-${day}`, '21:15', (idx % 9) + 1, idx + 4, [{ id: 3, qty: 2 }, { id: 1, qty: 1 }, { id: 8, qty: 2 }], 'completed');
    }
  });

  // 3. PAST MONTHS IN 2026 (September down to January)
  const pastMonths = [
    { m: '09', days: ['28', '25', '20', '15', '10', '05'], count: 6 },
    { m: '08', days: ['29', '22', '18', '14', '08', '02'], count: 6 },
    { m: '07', days: ['30', '24', '19', '12', '07', '03'], count: 6 },
    { m: '06', days: ['28', '21', '16', '11', '06', '01'], count: 5 },
    { m: '05', days: ['27', '20', '15', '09', '04'], count: 5 },
    { m: '04', days: ['26', '18', '12', '06'], count: 4 },
    { m: '03', days: ['25', '19', '14', '08'], count: 4 },
    { m: '02', days: ['24', '18', '11', '05'], count: 4 },
    { m: '01', days: ['28', '20', '15', '08'], count: 4 }
  ];

  pastMonths.forEach((pm, mIdx) => {
    pm.days.forEach((d, dIdx) => {
      addOrder(`2026-${pm.m}-${d}`, '13:30', (dIdx % 10) + 1, (mIdx + dIdx), [
        { id: (dIdx % 2 === 0 ? 1 : 2), qty: 2 },
        { id: 5, qty: 3 },
        { id: (dIdx % 3 === 0 ? 6 : 7), qty: 1 }
      ], 'completed');
      addOrder(`2026-${pm.m}-${d}`, '20:15', (dIdx % 8) + 2, (mIdx + dIdx + 1), [
        { id: 4, qty: 1 },
        { id: 6, qty: 2 },
        { id: 9, qty: 2 }
      ], 'completed');
    });
  });

  // Sort orders descending (newest first)
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return orders;
}

const defaultData = {
  restaurant_name: 'Madhav Dining Hall',
  users: [
    {
      id: 1,
      name: 'Madhav Dining Hall Manager',
      email: 'admin@hotel.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'manager'
    },
    {
      id: 2,
      name: 'Kitchen Chef',
      email: 'chef@hotel.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'staff'
    }
  ],
  tables: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    table_number: i + 1,
    capacity: i % 3 === 0 ? 6 : (i % 2 === 0 ? 2 : 4),
    status: (i === 3 || i === 5) ? 'occupied' : 'available',
    qr_code_url: `/table/${i + 1}`
  })),
  categories: [
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Main Course' },
    { id: 3, name: 'Breads & Rice' },
    { id: 4, name: 'Desserts' },
    { id: 5, name: 'Beverages' }
  ],
  menu: menuItems,
  orders: generateSeedOrders()
};

fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf8');
console.log(`✔ Successfully generated persistent storage with ${defaultData.orders.length} orders at ${dbPath}`);
