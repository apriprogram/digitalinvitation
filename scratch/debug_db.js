const db = require('../db');
async function check() {
  try {
    const [settings] = await db.query("SELECT * FROM settings");
    console.log("Settings rows:", settings.length);
    if (settings.length > 0) {
        console.log("First 3 settings:", settings.slice(0, 3));
    }
    
    const [couple] = await db.query("SELECT * FROM couple");
    console.log("Couple rows:", couple.length);
    
    const [events] = await db.query("SELECT * FROM events");
    console.log("Events rows:", events.length);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
