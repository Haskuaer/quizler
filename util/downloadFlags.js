const fs = require('fs');
const path = require('path');
const axios = require('axios');

// List of ISO 3166-1 alpha-2 country codes
const countryCodes = ['us', 'fr', 'de', 'jp', 'br']; // Add more as needed

const outputDir = path.join(__dirname, '..', 'public', 'images', 'flags');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadFlag(code) {
  const url = `https://flagcdn.com/w320/${code}.png`;
  const filePath = path.join(outputDir, `${code}.png`);

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Downloaded: ${code}.png`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Failed to download ${code}:`, error.message);
  }
}

async function downloadAllFlags() {
  for (const code of countryCodes) {
    await downloadFlag(code);
  }
  console.log('🎉 All flags downloaded.');
}

downloadAllFlags();