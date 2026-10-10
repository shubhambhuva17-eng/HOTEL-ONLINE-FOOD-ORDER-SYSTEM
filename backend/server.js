const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { initDB, isUsingMySQL } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const tableRoutes = require('./src/routes/tableRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Madhav Dining Hall API',
    database: isUsingMySQL() ? 'MySQL' : 'Memory Resilient Fallback',
    timestamp: new Date().toISOString()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('Madhav Dining Hall REST API is running. Access endpoints via /api/...');
});

// Start Server
async function start() {
  await initDB();
  const server = app.listen(PORT, () => {
    console.log(`\x1b[32m✔ Server listening on http://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[36mℹ Customer & Manager REST API ready at http://localhost:${PORT}/api\x1b[0m`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\x1b[31m✖ Error: Port ${PORT} is already in use by another process.\x1b[0m`);
      console.log(`\x1b[33m💡 Fix: Terminate the other process or set PORT in .env (e.g. PORT=5001)\x1b[0m`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
}

start();
