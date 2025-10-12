require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function downloadVideo(videoId) {
  try {
    console.log(`📥 Downloading video: ${videoId}\n`);

    // Try to get the video content
    const response = await openai.videos.content(videoId);

    console.log('Response type:', typeof response);
    console.log('Response:', response);

    // If it's a stream or buffer, save it
    if (response) {
      const filename = `video_${videoId.slice(-8)}.mp4`;

      // Try to save the response
      if (response.pipe) {
        // It's a stream
        const writeStream = fs.createWriteStream(filename);
        response.pipe(writeStream);

        writeStream.on('finish', () => {
          console.log(`\n✅ Video saved to: ${filename}`);
        });
      } else {
        // Try to write as buffer
        fs.writeFileSync(filename, response);
        console.log(`\n✅ Video saved to: ${filename}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.message.includes('content')) {
      console.log('\n💡 The videos.content() method might not be available.');
      console.log('   Let me try a different approach...\n');

      // Try accessing the video through the files API
      try {
        console.log('Attempting to list files...');
        const files = await openai.files.list();
        console.log('Files:', JSON.stringify(files, null, 2));
      } catch (e) {
        console.error('Files API also not available:', e.message);
      }
    }
  }
}

const videoId = process.argv[2] || 'video_68eaa96c05a88191a8512622793f69110c49b83fb2d6a2d2';
downloadVideo(videoId);
