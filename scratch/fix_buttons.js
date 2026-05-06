const fs = require('fs');
const path = 'admin.html';
let content = fs.readFileSync(path, 'utf8');

// Section 1: Jadwal Pernikahan
const section1Marker = 'Jadwal Pernikahan</h3>';
const s1Index = content.indexOf(section1Marker);
if (s1Index !== -1) {
    const btnIndex = content.indexOf('onclick="saveSettings()"', s1Index);
    if (btnIndex !== -1 && btnIndex - s1Index < 500) {
        content = content.substring(0, btnIndex) + 'onclick="saveSettings(false, \'Judul, kutipan, dan background berhasil diperbaharui\')"' + content.substring(btnIndex + 24);
    }
}

// Section 2: Kehadiran / RSVP
const section2Marker = 'Kehadiran</h3>';
const s2Index = content.indexOf(section2Marker);
if (s2Index !== -1) {
    const btnIndex = content.indexOf('onclick="saveSettings()"', s2Index);
    if (btnIndex !== -1 && btnIndex - s2Index < 500) {
        content = content.substring(0, btnIndex) + 'onclick="saveSettings(false, \'Header dan teks rsvp berhasil diperbarui\')"' + content.substring(btnIndex + 24);
    }
}

fs.writeFileSync(path, content);
console.log('Updated successfully');
