const { query, isUsingMySQL, getStore, saveStore } = require('../config/db');

exports.createOrder = async (req, res) => {
  try {
    const { table_number, table_id, customer_name, customer_phone, items, total_amount, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const tableNum = Number(table_number || table_id || 1);
    const store = getStore();

    if (isUsingMySQL()) {
      let actualTableId = tableNum;
      const tRows = await query('SELECT id FROM tables WHERE table_number = ?', [tableNum]);
      if (tRows && tRows.length > 0) {
        actualTableId = tRows[0].id;
      }

      const orderRes = await query(
        `INSERT INTO orders (order_number, table_id, customer_name, customer_phone, total_amount, status, notes)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [
          orderNumber,
          actualTableId,
          customer_name || `Guest (Table ${tableNum})`,
          customer_phone || '',
          Number(total_amount || 0),
          notes || ''
        ]
      );

      const orderId = orderRes.insertId;

      for (const item of items) {
        await query(
          `INSERT INTO order_items (order_id, menu_item_id, item_name, price, quantity, special_instructions)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.menu_item_id || item.id || null,
            item.item_name || item.name,
            Number(item.price || 0),
            Number(item.quantity || 1),
            item.special_instructions || ''
          ]
        );
      }

      await query("UPDATE tables SET status = 'occupied' WHERE table_number = ?", [tableNum]);

      const createdOrder = {
        id: orderId,
        order_number: orderNumber,
        table_number: tableNum,
        customer_name: customer_name || `Guest (Table ${tableNum})`,
        customer_phone,
        total_amount: Number(total_amount),
        status: 'pending',
        notes,
        items,
        created_at: new Date().toISOString()
      };

      // Also sync to persistent file store
      store.orders.unshift(createdOrder);
      const tableObj = store.tables.find((t) => t.table_number === tableNum);
      if (tableObj) tableObj.status = 'occupied';
      saveStore();

      return res.status(201).json(createdOrder);
    }

    // File Persistent store
    const newOrder = {
      id: (store.orders.length > 0 ? Math.max(...store.orders.map(o => o.id)) + 1 : 1001),
      order_number: orderNumber,
      table_number: tableNum,
      table_id: tableNum,
      customer_name: customer_name || `Guest (Table ${tableNum})`,
      customer_phone: customer_phone || '',
      total_amount: Number(total_amount || 0),
      status: 'pending',
      payment_status: 'unpaid',
      notes: notes || '',
      items: items.map((i) => ({
        ...i,
        item_name: i.item_name || i.name,
        price: Number(i.price || 0),
        quantity: Number(i.quantity || 1)
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.orders.unshift(newOrder);

    // Mark table occupied
    const tableObj = store.tables.find((t) => t.table_number === tableNum);
    if (tableObj) tableObj.status = 'occupied';

    // Persist immediately to disk
    saveStore();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const store = getStore();
    if (isUsingMySQL()) {
      const orders = await query(`
        SELECT o.*, t.table_number
        FROM orders o
        JOIN tables t ON o.table_id = t.id
        ORDER BY o.created_at DESC
      `);

      for (const order of orders || []) {
        const items = await query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        order.items = items || [];
      }

      return res.json(orders || []);
    }

    res.json(store.orders || []);
  } catch (err) {
    console.error('Error fetching orders', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();

    if (isUsingMySQL()) {
      const orders = await query(`
        SELECT o.*, t.table_number
        FROM orders o
        JOIN tables t ON o.table_id = t.id
        WHERE o.id = ? OR o.order_number = ?
      `, [id, id]);

      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orders[0];
      const items = await query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items || [];
      return res.json(order);
    }

    const order = (store.orders || []).find(
      (o) => String(o.id) === String(id) || o.order_number === id
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const store = getStore();

    const validStatuses = ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
    if (!validStatuses.includes(status?.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    if (isUsingMySQL()) {
      await query('UPDATE orders SET status = ? WHERE id = ? OR order_number = ?', [status, id, id]);

      if (['completed', 'cancelled'].includes(status)) {
        await query(`
          UPDATE tables SET status = 'available'
          WHERE id = (SELECT table_id FROM orders WHERE id = ? OR order_number = ?)
        `, [id, id]);
      }
    }

    const order = (store.orders || []).find(
      (o) => String(o.id) === String(id) || o.order_number === id
    );

    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      if (status === 'completed') {
        order.payment_status = 'paid';
      }

      if (['completed', 'cancelled'].includes(status)) {
        const table = store.tables.find((t) => t.table_number === order.table_number);
        if (table) table.status = 'available';
      }

      // Persist to disk
      saveStore();
      return res.json(order);
    }

    res.json({ success: true, status });
  } catch (err) {
    console.error('Error updating order status', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const store = getStore();
    const orders = store.orders || [];

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const activeOrders = orders.filter((o) =>
      ['pending', 'preparing', 'ready'].includes(o.status?.toLowerCase())
    ).length;

    res.json({
      total_revenue: totalRevenue,
      total_orders: orders.length,
      active_orders: activeOrders
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
};

// COMPREHENSIVE DAILY, MONTHLY & YEARLY ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const store = getStore();
    const orders = store.orders || [];
    const period = req.query.period || 'daily'; // 'daily' | 'monthly' | 'yearly' | 'all'
    const targetDateStr = req.query.date || '2026-10-09';
    const refDate = new Date(targetDateStr);

    const refYear = refDate.getFullYear();
    const refMonth = refDate.getMonth(); // 0-indexed (9 for October)
    const refDay = refDate.getDate();

    let filteredOrders = [];
    let chartData = [];
    let periodLabel = '';

    if (period === 'daily') {
      periodLabel = `Today (${refDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`;
      filteredOrders = orders.filter((o) => {
        const d = new Date(o.created_at);
        return d.getFullYear() === refYear && d.getMonth() === refMonth && d.getDate() === refDay;
      });

      // 24 Hour breakdown (from 08:00 to 23:00 focus or 0-23)
      const hourlyMap = {};
      for (let h = 0; h < 24; h++) {
        const hLabel = `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`;
        hourlyMap[h] = { hour: h, label: hLabel, revenue: 0, orders: 0 };
      }

      filteredOrders.forEach((o) => {
        const h = new Date(o.created_at).getHours();
        if (hourlyMap[h]) {
          hourlyMap[h].orders += 1;
          if (o.status !== 'cancelled') {
            hourlyMap[h].revenue += Number(o.total_amount || 0);
          }
        }
      });

      chartData = Object.values(hourlyMap).filter(h => h.hour >= 7 && h.hour <= 23); // Display operating hours
    } else if (period === 'monthly') {
      periodLabel = `${refDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      filteredOrders = orders.filter((o) => {
        const d = new Date(o.created_at);
        return d.getFullYear() === refYear && d.getMonth() === refMonth;
      });

      // Days of the month
      const daysInMonth = new Date(refYear, refMonth + 1, 0).getDate();
      const dailyMap = {};
      for (let day = 1; day <= daysInMonth; day++) {
        dailyMap[day] = { day, label: `Day ${day}`, revenue: 0, orders: 0 };
      }

      filteredOrders.forEach((o) => {
        const day = new Date(o.created_at).getDate();
        if (dailyMap[day]) {
          dailyMap[day].orders += 1;
          if (o.status !== 'cancelled') {
            dailyMap[day].revenue += Number(o.total_amount || 0);
          }
        }
      });

      chartData = Object.values(dailyMap);
    } else if (period === 'yearly') {
      periodLabel = `Year ${refYear}`;
      filteredOrders = orders.filter((o) => {
        const d = new Date(o.created_at);
        return d.getFullYear() === refYear;
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyMap = {};
      monthNames.forEach((name, idx) => {
        monthlyMap[idx] = { month: idx, label: name, revenue: 0, orders: 0 };
      });

      filteredOrders.forEach((o) => {
        const m = new Date(o.created_at).getMonth();
        if (monthlyMap[m]) {
          monthlyMap[m].orders += 1;
          if (o.status !== 'cancelled') {
            monthlyMap[m].revenue += Number(o.total_amount || 0);
          }
        }
      });

      chartData = Object.values(monthlyMap);
    } else {
      // All time
      periodLabel = 'All Time';
      filteredOrders = orders;
      chartData = [];
    }

    // Totals for filtered timeframe
    const validOrders = filteredOrders.filter((o) => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter((o) => o.status === 'completed').length;
    const activeOrders = filteredOrders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status?.toLowerCase())).length;
    const cancelledOrders = filteredOrders.filter((o) => o.status === 'cancelled').length;
    const avgOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : (totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0);

    // Top Selling Dishes in this timeframe
    const itemSales = {};
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const name = item.item_name || item.name;
        if (!itemSales[name]) {
          itemSales[name] = { name, quantity: 0, revenue: 0, price: item.price };
        }
        itemSales[name].quantity += Number(item.quantity || 1);
        itemSales[name].revenue += Number(item.price || 0) * Number(item.quantity || 1);
      });
    });

    const topDishes = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Table Utilization
    const tableSales = {};
    for (let t = 1; t <= 12; t++) {
      tableSales[t] = { table_number: t, orders: 0, revenue: 0 };
    }
    validOrders.forEach((o) => {
      const tNum = o.table_number || 1;
      if (tableSales[tNum]) {
        tableSales[tNum].orders += 1;
        tableSales[tNum].revenue += Number(o.total_amount || 0);
      }
    });

    // Recent orders in this timeframe (up to 10)
    const recentOrders = filteredOrders.slice(0, 10);

    res.json({
      period,
      periodLabel,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        completedOrders,
        activeOrders,
        cancelledOrders,
        avgOrderValue
      },
      chartData,
      topDishes,
      tableSales: Object.values(tableSales),
      recentOrders
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
};
