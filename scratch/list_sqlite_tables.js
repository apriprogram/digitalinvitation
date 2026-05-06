const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Tables in SQLite:', rows.map(r => r.name));
  db.close();
});
