const mysql = require('mysql2/promise');
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wedding_invitation',
};

async function check() {
  try {
    const conn = await mysql.createConnection({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password
    });
    console.log('Connected to MySQL server.');
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlConfig.database}\``);
    console.log(`Database \`${mysqlConfig.database}\` ensured.`);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('MySQL Connection Error:', err.message);
    process.exit(1);
  }
}
check();
