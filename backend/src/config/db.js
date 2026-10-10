const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dataDir = path.join(__dirname, '../../data');
const dbFilePath = path.join(dataDir, 'db.json');

let pool = null;
let useMySQL = false;
let store = {
  restaurant_name: 'Madhav Dining Hall',
  users: [],
  tables: [],
  categories: [],
  menu: [],
  orders: []
};

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load persistent data from file
function loadStore() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      store = JSON.parse(raw);
      console.log(`\x1b[32m✔ [PERSISTENCE] Loaded ${store.orders?.length || 0} orders & ${store.menu?.length || 0} dishes from disk (${dbFilePath})\x1b[0m`);
    } else {
      console.log(`\x1b[33m! [PERSISTENCE] No db.json found. Initializing seed data...\x1b[0m`);
      const seedScript = path.join(dataDir, 'seedData.js');
      if (fs.existsSync(seedScript)) {
        require(seedScript);
        if (fs.existsSync(dbFilePath)) {
          store = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        }
      }
    }
  } catch (err) {
    console.error('Error loading db.json:', err.message);
  }
}

// Save persistent data to file
function saveStore() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save to db.json:', err.message);
  }
}

// Load store on initial require
loadStore();

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'hotel_ordering_db';

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    useMySQL = true;
    console.log(`\x1b[32m✔ [DATABASE] Connected successfully to MySQL (${host}:${port}/${database})\x1b[0m`);
  } catch (err) {
    useMySQL = false;
    console.log(`\x1b[33m! [DATABASE] MySQL server not reachable on ${host}:${port} (${err.code || err.message}).\x1b[0m`);
    console.log(`\x1b[36mℹ [DATABASE] Running on PERSISTENT FILE STORAGE (${dbFilePath}). Orders & analytics will NEVER be lost across restarts.\x1b[0m`);
  }
}

// Unified Query method
async function query(sql, params = []) {
  if (useMySQL && pool) {
    const [results] = await pool.execute(sql, params);
    return results;
  }
  return null;
}

module.exports = {
  initDB,
  query,
  getPool: () => pool,
  isUsingMySQL: () => useMySQL,
  getStore: () => store,
  saveStore,
  fallbackStore: store // for backwards compatibility
};
