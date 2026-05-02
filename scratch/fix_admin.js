const db = require('../db');

const email = 'rian@gmail.com';
const password = 'admin123';
const fullName = 'Rian';

db.serialize(() => {
    // Check if user exists
    db.get('SELECT id FROM admin_users WHERE id = 1', (err, row) => {
        if (row) {
            // Update existing admin
            db.run('UPDATE admin_users SET email = ?, password = ?, full_name = ? WHERE id = 1', [email, password, fullName], (err) => {
                if (err) {
                    console.error('Update failed:', err);
                    process.exit(1);
                }
                console.log('Admin user updated successfully.');
                process.exit(0);
            });
        } else {
            // Insert new admin
            db.run('INSERT INTO admin_users (id, username, email, password, full_name) VALUES (1, "admin", ?, ?, ?)', [email, password, fullName], (err) => {
                if (err) {
                    console.error('Insert failed:', err);
                    process.exit(1);
                }
                console.log('Admin user inserted successfully.');
                process.exit(0);
            });
        }
    });
});
