const http = require('http');

http.get('http://localhost:3000/api/public', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('LoveStory count:', json.lovestory ? json.lovestory.length : 'undefined');
            console.log('LoveStory data:', JSON.stringify(json.lovestory, null, 2));
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching public API:', err);
});
