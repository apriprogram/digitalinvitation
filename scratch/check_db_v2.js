const db = require('../db');
async function check() {
  try {
    const [guests] = await db.query('SELECT * FROM guests');
    console.log('Total Guests:', guests.length);
    if (guests.length > 0) console.log('Sample Guest:', guests[0]);
    
    const [wishes] = await db.query('SELECT w.*, g.name AS guest_name FROM wishes w LEFT JOIN guests g ON g.id = w.guest_id');
    console.log('Wishes with names:', wishes);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
