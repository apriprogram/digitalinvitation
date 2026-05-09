const http = require('http');

http.get('http://localhost:3000/api/public', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Gifts count:', json.gifts ? json.gifts.length : 'undefined');
            console.log('Gifts data:', JSON.stringify(json.gifts, null, 2));
            // Log relevant settings
            const giftSettings = {
                gift_physical_address: json.settings.gift_physical_address,
                gift_bg_mode: json.settings.gift_bg_mode,
                gift_bg_img: json.settings.gift_bg_img,
                gift_bg_color: json.settings.gift_bg_color
            };
            console.log('Gift Settings:', JSON.stringify(giftSettings, null, 2));
        } catch (err) {
            console.error('Error parsing JSON:', err);
            console.log('Raw data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching public API:', err);
});
