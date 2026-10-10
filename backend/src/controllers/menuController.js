const { query, isUsingMySQL, getStore, saveStore } = require('../config/db');

exports.getAllMenu = async (req, res) => {
  try {
    const store = getStore();
    if (isUsingMySQL()) {
      const sql = `
        SELECT m.*, c.name as category_name
        FROM menu m
        LEFT JOIN categories c ON m.category_id = c.id
        ORDER BY m.id ASC
      `;
      const rows = await query(sql);
      const formatted = (rows || []).map((r) => ({
        ...r,
        category: r.category_name || 'Main Course',
        is_veg: Boolean(r.is_veg),
        is_available: Boolean(r.is_available)
      }));
      return res.json(formatted);
    }

    const items = (store.menu || []).map((i) => ({
      ...i,
      category: i.category_name || i.category || 'Main Course'
    }));
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu', err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();

    if (isUsingMySQL()) {
      const rows = await query('SELECT * FROM menu WHERE id = ?', [id]);
      if (!rows || rows.length === 0) return res.status(404).json({ error: 'Item not found' });
      return res.json(rows[0]);
    }

    const item = (store.menu || []).find((i) => i.id === Number(id));
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, image_url, is_veg, is_available, prep_time_minutes } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const store = getStore();

    if (isUsingMySQL()) {
      let categoryId = 2;
      const catRows = await query('SELECT id FROM categories WHERE name = ?', [category || 'Main Course']);
      if (catRows && catRows.length > 0) {
        categoryId = catRows[0].id;
      }

      const result = await query(
        `INSERT INTO menu (category_id, name, description, price, image_url, is_veg, is_available, prep_time_minutes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          name,
          description || '',
          Number(price),
          image_url || '',
          is_veg !== false ? 1 : 0,
          is_available !== false ? 1 : 0,
          prep_time_minutes || 15
        ]
      );

      const newItem = {
        id: result.insertId,
        name,
        category: category || 'Main Course',
        price: Number(price),
        description,
        image_url,
        is_veg: is_veg !== false,
        is_available: is_available !== false,
        prep_time_minutes: prep_time_minutes || 15
      };

      store.menu.unshift(newItem);
      saveStore();

      return res.status(201).json(newItem);
    }

    const newItem = {
      id: Date.now(),
      name,
      category_name: category || 'Main Course',
      category: category || 'Main Course',
      price: Number(price),
      description: description || '',
      image_url: image_url || '',
      is_veg: is_veg !== false,
      is_available: is_available !== false,
      prep_time_minutes: prep_time_minutes || 15
    };

    store.menu.unshift(newItem);
    saveStore();

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating menu item', err);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, image_url, is_veg, is_available, prep_time_minutes } = req.body;
    const store = getStore();

    if (isUsingMySQL()) {
      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name); }
      if (price !== undefined) { updates.push('price = ?'); values.push(Number(price)); }
      if (description !== undefined) { updates.push('description = ?'); values.push(description); }
      if (image_url !== undefined) { updates.push('image_url = ?'); values.push(image_url); }
      if (is_veg !== undefined) { updates.push('is_veg = ?'); values.push(is_veg ? 1 : 0); }
      if (is_available !== undefined) { updates.push('is_available = ?'); values.push(is_available ? 1 : 0); }
      if (prep_time_minutes !== undefined) { updates.push('prep_time_minutes = ?'); values.push(Number(prep_time_minutes)); }

      if (updates.length > 0) {
        values.push(id);
        await query(`UPDATE menu SET ${updates.join(', ')} WHERE id = ?`, values);
      }
    }

    const index = store.menu.findIndex((i) => i.id === Number(id));
    if (index === -1) return res.status(404).json({ error: 'Item not found' });

    store.menu[index] = {
      ...store.menu[index],
      ...req.body,
      id: Number(id)
    };
    saveStore();

    res.json(store.menu[index]);
  } catch (err) {
    console.error('Error updating menu item', err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();

    if (isUsingMySQL()) {
      await query('DELETE FROM menu WHERE id = ?', [id]);
    }

    store.menu = store.menu.filter((i) => i.id !== Number(id));
    saveStore();

    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};
