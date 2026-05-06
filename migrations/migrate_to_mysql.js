const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Database configurations
const sqliteDbPath = path.resolve(__dirname, '..', 'database.sqlite');
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wedding_invitation',
};

async function initMysqlTables(conn) {
  console.log('Initializing MySQL tables...');
  
  await conn.query(`CREATE TABLE IF NOT EXISTS guests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    first_name TEXT,
    token VARCHAR(100) UNIQUE NOT NULL,
    created_at TEXT
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS lovestory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL DEFAULT 'chat',
    sender TEXT,
    message TEXT,
    time TEXT,
    date_label TEXT,
    order_no INT DEFAULT 0
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS lovestory_settings (
    \`key\` VARCHAR(100) PRIMARY KEY,
    value TEXT
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS page_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    guest_token VARCHAR(100),
    page VARCHAR(50) DEFAULT 'invitation',
    ip VARCHAR(50),
    user_agent TEXT,
    viewed_at TEXT
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS settings (
    \`key\` VARCHAR(191) PRIMARY KEY,
    value LONGTEXT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

  await conn.query(`CREATE TABLE IF NOT EXISTS rsvps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    guest_id INT,
    status VARCHAR(50),
    guest_count INT,
    created_at TEXT
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS wishes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    guest_id INT,
    message TEXT,
    created_at TEXT,
    reply TEXT,
    replied_at TEXT
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100),
    password VARCHAR(255),
    full_name TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    avatar TEXT
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    heading TEXT,
    time TEXT,
    date TEXT,
    date_iso TEXT,
    location_name TEXT,
    address TEXT,
    map_src TEXT,
    map_link TEXT,
    icon_src TEXT,
    order_no INT DEFAULT 0
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS couple (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role TEXT,
    name TEXT,
    description TEXT,
    parents TEXT,
    instagram TEXT,
    image_src TEXT,
    order_no INT DEFAULT 0
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS gallery_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    src TEXT,
    alt TEXT,
    order_no INT DEFAULT 0
  )`);

  await conn.query(`CREATE TABLE IF NOT EXISTS gifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    logo_src TEXT,
    order_no INT DEFAULT 0
  )`);

  console.log('MySQL tables initialized.');
}

async function migrate() {
  console.log('Starting migration from SQLite to MySQL...');

  if (!fs.existsSync(sqliteDbPath)) {
    console.error('SQLite database not found at', sqliteDbPath);
    process.exit(1);
  }

  const sqliteDb = new sqlite3.Database(sqliteDbPath);
  let mysqlConn;

  try {
    mysqlConn = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL.');

    await initMysqlTables(mysqlConn);

    const tables = [
      'admin_users',
      'settings',
      'events',
      'couple',
      'gallery_images',
      'guests',
      'rsvps',
      'wishes',
      'lovestory',
      'lovestory_settings',
      'page_views',
      'gifts'
    ];

    for (const table of tables) {
      console.log(`Migrating table: ${table}...`);
      
      const rows = await new Promise((resolve, reject) => {
        sqliteDb.all(`SELECT * FROM ${table}`, (err, rows) => {
          if (err) {
            if (err.message.includes('no such table')) {
              console.warn(`Table ${table} does not exist in SQLite, skipping.`);
              return resolve(null);
            }
            return reject(err);
          }
          resolve(rows);
        });
      });

      if (!rows || rows.length === 0) {
        console.log(`No data in table ${table}, skipping.`);
        continue;
      }

      const columns = Object.keys(rows[0]);
      const placeholders = columns.map(() => '?').join(', ');
      const escapedColumns = columns.map(c => `\`${c}\``).join(', ');
      
      const insertSql = `INSERT IGNORE INTO \`${table}\` (${escapedColumns}) VALUES (${placeholders})`;

      let count = 0;
      for (const row of rows) {
        const values = columns.map(col => row[col]);
        try {
          await mysqlConn.execute(insertSql, values);
          count++;
        } catch (insertErr) {
          console.error(`Error inserting into ${table}:`, insertErr.message);
        }
      }

      console.log(`Successfully migrated ${count} rows to ${table}.`);
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    sqliteDb.close();
  }
}

migrate();
