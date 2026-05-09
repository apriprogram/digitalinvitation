const db = require('../db');
async function check() {
  try {
    const [wishes] = await db.query('SELECT * FROM wishes');
    console.log('Total Wishes:', wishes.length);
    if (wishes.length > 0) console.log('Sample Wish:', wishes[0]);
    
    const [settings] = await db.query('SELECT * FROM settings WHERE `key` LIKE "%wishes%"');
    console.log('Wishes Settings:', settings);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
