const fs = require('fs');
const path = 'admin.html';
let content = fs.readFileSync(path, 'utf8');

// Function to replace the FIRST occurrence of saveSettings() after a marker
function replaceAfter(marker, oldText, newText) {
    const markerIndex = content.indexOf(marker);
    if (markerIndex === -1) return;
    const oldIndex = content.indexOf(oldText, markerIndex);
    if (oldIndex === -1 || oldIndex - markerIndex > 1000) return;
    content = content.substring(0, oldIndex) + newText + content.substring(oldIndex + oldText.length);
}

// 1. Gallery Section - Revert/Reset
replaceAfter('Galeri Foto</h3>', 'onclick="saveSettings(false, \'Judul, kutipan, dan background berhasil diperbaharui\')"', 'onclick="saveSettings()"');

// 2. Jadwal Pernikahan Section - Set Correct
replaceAfter('Jadwal Pernikahan</h3>', 'onclick="saveSettings()"', 'onclick="saveSettings(false, \'Judul, kutipan, dan background berhasil diperbaharui\')"');

// 3. Kehadiran Section - Set Correct
replaceAfter('Kehadiran</h3>', 'onclick="saveSettings()"', 'onclick="saveSettings(false, \'Header dan teks rsvp berhasil diperbarui\')"');

fs.writeFileSync(path, content);
console.log('Final update done');
