const db = require('../db');
async function check() {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM settings");
    console.log("Settings columns:", cols);
    const [keys] = await db.query("SHOW KEYS FROM settings");
    console.log("Settings keys:", keys);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
