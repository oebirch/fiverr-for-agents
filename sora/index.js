require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateVideo() {
  try {
    console.log('🎬 Starting Sora video generation...\n');

    const prompt = "A golden retriever puppy playing in a sunny garden";
    console.log(`📝 Prompt: ${prompt}\n`);

    // Create video generation request
    console.log('⏳ Submitting video generation request to Sora API...');
    const video = await openai.videos.create({
      model: "sora-2",
      prompt: prompt,
      size: "1280x720",
      seconds: "4", // Must be '4', '8', or '12'
    });

    console.log('✅ Video generation job created!');
    console.log(`📋 Job ID: ${video.id}\n`);

    // Poll for completion
    console.log('⏳ Waiting for video to be generated...');
    let status = video.status;
    let videoData = video;

    while (status === 'pending' || status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

      videoData = await openai.videos.retrieve(video.id);
      status = videoData.status;

      console.log(`   Status: ${status}${status === 'processing' ? ' (this may take a few minutes)' : ''}`);
    }

    if (status === 'completed') {
      console.log('\n✅ Video generated successfully!\n');
      console.log(`🎥 Video URL: ${videoData.url}`);
      console.log(`\nYou can download the video from the URL above.`);
    } else if (status === 'failed') {
      console.error('\n❌ Video generation failed');
      console.error(`Error: ${videoData.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.status === 401) {
      console.error('\n🔑 Authentication failed. Please check your API key in .env file');
    } else if (error.status === 403) {
      console.error('\n🚫 Access denied. Your API key may not have access to the Sora API yet.');
      console.error('   The Sora API is currently in limited preview.');
      console.error('   You may need to request access from OpenAI.');
    } else if (error.status === 404) {
      console.error('\n❓ API endpoint not found. The Sora API may not be available yet.');
      console.error('   Check https://platform.openai.com/docs/guides/video-generation for updates.');
    } else {
      console.error('\nFull error:', error);
    }
  }
}

console.log('🎬 Sora Video Generation Test\n');
console.log('═'.repeat(50));
generateVideo();
