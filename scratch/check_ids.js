const db = require('../db');
async function check() {
  try {
    const [guests] = await db.query('SELECT id FROM guests');
    console.log('Guest IDs:', guests.map(g => g.id));
    
    const [wishes] = await db.query('SELECT id, guest_id FROM wishes');
    console.log('Wish Guest IDs:', wishes.map(w => ({ id: w.id, guest_id: w.guest_id })));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
