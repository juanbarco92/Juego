const jimp = require('jimp');
console.log('Type of export:', typeof jimp);
console.log('Keys:', Object.keys(jimp));
if (jimp.default) console.log('Default export keys:', Object.keys(jimp.default));
if (jimp.Jimp) console.log('Jimp export keys:', Object.keys(jimp.Jimp));
