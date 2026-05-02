const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.run("INSERT INTO couple (role, name, parents, instagram, image_src, order_no) VALUES (?, ?, ?, ?, ?, ?)", ['The Groom', 'Riandino Oginta Tarigan, A.Md.', 'Putra dari\nBapak Drs. Tampe Malem Tarigan & Ibu Toberina Surbakti', '@ryan_tarigan', 'img/rian.jpeg', 1]);
    db.run("INSERT INTO couple (role, name, parents, instagram, image_src, order_no) VALUES (?, ?, ?, ?, ?, ?)", ['The Bride', 'Aurora Picessa Brahmana, A.Md.', 'Putri dari\nBapak Ir. Marthin Luther Brahmana & Ibu Ir. Roslila Br Perangin-angin', '@aurorapcsa', 'img/aurora.jpeg', 2]);
    
    db.run("INSERT INTO events (name, heading, time, date, date_iso, location_name, address, map_src, map_link, icon_src, order_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ['Pemberkatan Nikah', 'Pemberkatan Nikah', '14.00 WIB - Selesai', 'Jumat, 26 Juni 2026', '2026-06-26', 'GBKP Rg. Km. 7 Pd. Bulan Medan', 'Jl. Jamin Ginting Km.7 No.47, Kwala Bekala, Kec. Medan Johor, Kota Medan, Sumatera Utara 20142', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.2133203531085!2d98.6436662758999!3d3.5381836506385845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312ff607d72661%3A0x633513a968652d8c!2sGBKP%20Km%207!5e0!3m2!1sid!2sid!4v1711100000000!5m2!1sid!2sid', 'https://maps.app.goo.gl/9ZzRz9ZzRz9ZzRz9A', 'img/icon/Gereja.png', 1]);
    db.run("INSERT INTO events (name, heading, time, date, date_iso, location_name, address, map_src, map_link, icon_src, order_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ['Adat & Resepsi', 'Adat & Resepsi', '07.00 WIB - Selesai', 'Sabtu, 27 Juni 2026', '2026-06-27', 'Jambur Namaken', 'JL Letjen Jamin Ginting No, Gg. Jati No.30, Beringin, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20146', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.164312674393!2d98.6366662759!3d3.55818365064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312f849e7b3997%3A0xc30a1b63e9c7a7e!2sJambur%20Namaken!5e0!3m2!1sid!2sid!4v1711100000000!5m2!1sid!2sid', 'https://maps.app.goo.gl/8ZzRz8ZzRz8ZzRz8B', 'img/icon/Traditional Batak house icon.png', 2]);
});

db.close();
