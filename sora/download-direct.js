require('dotenv').config();
const fs = require('fs');
const https = require('https');

const API_KEY = process.env.OPENAI_API_KEY;
const videoId = process.argv[2] || 'video_68eaa96c05a88191a8512622793f69110c49b83fb2d6a2d2';

async function downloadVideo() {
  console.log(`📥 Attempting to download video: ${videoId}\n`);

  // Try different possible endpoints
  const endpoints = [
    `/v1/videos/${videoId}/content`,
    `/v1/videos/${videoId}/download`,
    `/v1/videos/${videoId}/file`,
  ];

  for (const endpoint of endpoints) {
    console.log(`🔍 Trying endpoint: ${endpoint}`);

    try {
      await tryDownload(endpoint);
      console.log('✅ Success with this endpoint!');
      return;
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
    }
  }

  console.log('\n💡 All download attempts failed.');
  console.log('The Sora API may not provide direct download access yet.');
  console.log('You might need to access the video through https://sora.com');
}

function tryDownload(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Headers:`, JSON.stringify(res.headers, null, 2));

      if (res.statusCode === 200) {
        const filename = `video_${videoId.slice(-8)}.mp4`;
        const fileStream = fs.createWriteStream(filename);

        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`\n✅ Video saved to: ${filename}`);
          resolve();
        });
      } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        });
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

downloadVideo();
