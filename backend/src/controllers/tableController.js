const QRCode = require('qrcode');
const { query, isUsingMySQL, getStore, saveStore } = require('../config/db');

exports.getAllTables = async (req, res) => {
  try {
    const store = getStore();
    if (isUsingMySQL()) {
      const rows = await query('SELECT * FROM tables ORDER BY table_number ASC');
      return res.json(rows || []);
    }
    res.json(store.tables || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
};

exports.getTableByNumber = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const store = getStore();

    if (isUsingMySQL()) {
      const rows = await query('SELECT * FROM tables WHERE table_number = ?', [tableNumber]);
      if (!rows || rows.length === 0) {
        return res.json({
          id: Number(tableNumber),
          table_number: Number(tableNumber),
          capacity: 4,
          status: 'available',
          qr_code_url: `/table/${tableNumber}`
        });
      }
      return res.json(rows[0]);
    }

    const table = (store.tables || []).find((t) => t.table_number === Number(tableNumber)) || {
      id: Number(tableNumber),
      table_number: Number(tableNumber),
      capacity: 4,
      status: 'available',
      qr_code_url: `/table/${tableNumber}`
    };
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch table details' });
  }
};

exports.generateTableQR = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const clientHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:5173';
    const protocol = req.protocol || 'http';
    const targetUrl = `${protocol}://${clientHost}/table/${tableNumber}`;

    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' }
    });

    res.json({
      table_number: Number(tableNumber),
      url: targetUrl,
      qr_image: qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};
