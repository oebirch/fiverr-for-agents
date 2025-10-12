require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkVideo(videoId) {
  try {
    console.log(`🔍 Checking status of video: ${videoId}\n`);

    const video = await openai.videos.retrieve(videoId);

    console.log('Full video object:', JSON.stringify(video, null, 2));
    console.log(`\nStatus: ${video.status}`);

    if (video.status === 'completed') {
      console.log('\n✅ Video is ready!');
      console.log(`\n🎥 Download URL: ${video.url}`);
      console.log(`\nYou can:\n1. Copy this URL into your browser to download\n2. Use curl: curl -o video.mp4 "${video.url}"`);
    } else if (video.status === 'processing' || video.status === 'pending') {
      console.log('\n⏳ Video is still being generated. Please wait...');
    } else if (video.status === 'failed') {
      console.log('\n❌ Video generation failed');
      console.log(`Error: ${video.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const videoId = process.argv[2] || 'video_68eaa827968881989463f41cd07b9cd10925ef7f4cc79b43';
checkVideo(videoId);
