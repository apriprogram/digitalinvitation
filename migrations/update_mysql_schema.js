const db = require('../db');

async function ensureColumn(table, column, definition) {
  try {
    const [cols] = await db.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
    if (cols.length === 0) {
      console.log(`Adding column ${column} to table ${table}...`);
      await db.query(`ALTER TABLE \`${table}\` ADD COLUMN ${column} ${definition}`);
      console.log(`Column ${column} added.`);
    }
  } catch (err) {
    console.error(`Error ensuring column ${column} in ${table}:`, err.message);
  }
}

async function runMigration() {
  console.log('--- Starting MySQL Schema Update ---');

  try {
    // 1. Ensure Tables Exist
    await db.query(`CREATE TABLE IF NOT EXISTS guests (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name TEXT NOT NULL,
      first_name TEXT,
      token VARCHAR(100) UNIQUE NOT NULL,
      created_at TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS rsvps (
      id INT PRIMARY KEY AUTO_INCREMENT,
      guest_id INT,
      status VARCHAR(50),
      guest_count INT,
      created_at TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS wishes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      guest_id INT,
      message TEXT,
      created_at TEXT,
      reply TEXT,
      replied_at TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS admin_users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(100),
      password VARCHAR(255),
      full_name TEXT,
      email VARCHAR(255),
      phone VARCHAR(20),
      avatar TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS events (
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

    await db.query(`CREATE TABLE IF NOT EXISTS couple (
      id INT PRIMARY KEY AUTO_INCREMENT,
      role TEXT,
      name TEXT,
      description TEXT,
      parents TEXT,
      instagram TEXT,
      image_src TEXT,
      instagram_link TEXT,
      order_no INT DEFAULT 0
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS gallery_images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      src TEXT,
      alt TEXT,
      order_no INT DEFAULT 0
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS gifts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      bank_name TEXT,
      account_number TEXT,
      account_name TEXT,
      logo_src TEXT,
      order_no INT DEFAULT 0
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS lovestory (
      id INT PRIMARY KEY AUTO_INCREMENT,
      type VARCHAR(50) NOT NULL DEFAULT 'chat',
      sender TEXT,
      message TEXT,
      time TEXT,
      date_label TEXT,
      order_no INT DEFAULT 0
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS lovestory_settings (
      \`key\` VARCHAR(100) PRIMARY KEY,
      value TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS page_views (
      id INT PRIMARY KEY AUTO_INCREMENT,
      guest_token VARCHAR(100),
      page VARCHAR(50) DEFAULT 'invitation',
      ip VARCHAR(50),
      user_agent TEXT,
      viewed_at TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(191) PRIMARY KEY,
      value LONGTEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    // 2. Ensure Columns (Migrations)
    await ensureColumn('guests', 'first_name', 'TEXT');
    await ensureColumn('rsvps', 'guest_id', 'INT');
    await ensureColumn('wishes', 'guest_id', 'INT');
    await ensureColumn('wishes', 'reply', 'TEXT');
    await ensureColumn('wishes', 'replied_at', 'TEXT');
    await ensureColumn('admin_users', 'full_name', 'TEXT');
    await ensureColumn('admin_users', 'email', 'VARCHAR(255)');
    await ensureColumn('admin_users', 'phone', 'VARCHAR(20)');
    await ensureColumn('admin_users', 'avatar', 'TEXT');
    await ensureColumn('couple', 'instagram_link', 'TEXT');
    await ensureColumn('couple', 'image_src', 'TEXT');

    // 3. Fix Settings table if it was created with TEXT instead of LONGTEXT
    console.log('Ensuring settings.value is LONGTEXT...');
    await db.query("ALTER TABLE settings MODIFY COLUMN value LONGTEXT");

    console.log('--- MySQL Schema Update Completed Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('--- MySQL Schema Update Failed ---');
    console.error(err);
    process.exit(1);
  }
}

runMigration();
