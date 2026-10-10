const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigrations() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'hotel_ordering_db';

  console.log(`Connecting to MySQL server at ${host}:${port}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log('✔ Connected to MySQL. Setting up schema...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('✔ Database schema created successfully.');

    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✔ Seed data populated successfully.');
    }

    console.log('\n🎉 Madhav Food Cart MySQL database initialized successfully!\n');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('Make sure your MySQL server is running and credentials in .env are correct.');
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();
