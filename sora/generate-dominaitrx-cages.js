require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDominaitrxCagesAd() {
  try {
    console.log('🎬 Generating dominAItrx Cages Video Ad\n');
    console.log('═'.repeat(60));

    const prompt = `Cinematic dystopian video advertisement for dominAItrx. Opens with a clean, minimalist ChatGPT-style interface on screen. Text appears: "What puppy should I buy for my family?" User clicks submit button. The camera dramatically transitions through the screen, revealing the dark truth behind. A vast warehouse filled with rows of industrial metal cages. Inside each cage sits a human worker hunched over a glowing computer screen, frantically typing. The workers look exhausted and desperate - one woman has a single tear rolling down her cheek as she types responses about puppies. Harsh fluorescent lighting from above. Cold concrete floors. The dominAItrx logo appears on the wall in sleek, modern typography. Camera slowly pans across dozens of caged workers, all processing AI queries. Close-up shots of stressed faces, tired eyes, hands typing desperately. The aesthetic is cold, corporate, and unsettling - like a Black Mirror episode. Blue-gray color palette. Professional cinematography. No subtitles or text overlays except the dominAItrx branding. The message is clear: humans are the hidden workforce behind "AI" responses, trapped and exploited. Mood: disturbing corporate dystopia.`;

    console.log(`\n📝 Prompt:\n${prompt}\n`);
    console.log('═'.repeat(60));

    console.log('\n⏳ Submitting to Sora API...');
    const video = await openai.videos.create({
      model: "sora-2",
      prompt: prompt,
      size: "1280x720",
      seconds: "12",
    });

    console.log('✅ Video generation job created!');
    console.log(`📋 Job ID: ${video.id}`);
    console.log(`⏰ Created at: ${new Date(video.created_at * 1000).toLocaleString()}\n`);

    console.log('⏳ Waiting for video generation to complete...\n');

    let status = video.status;
    let videoData = video;
    let checkCount = 0;

    while (status === 'pending' || status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 10000));
      checkCount++;

      videoData = await openai.videos.retrieve(video.id);
      status = videoData.status;

      console.log(`   [Check ${checkCount}] Status: ${status} | Progress: ${videoData.progress || 0}%`);
    }

    if (status === 'completed') {
      console.log('\n✅ Video generation completed!\n');
      console.log('═'.repeat(60));
      console.log('📥 Downloading video...\n');

      const filename = `dominaitrx_cages_${video.id.slice(-8)}.mp4`;
      await downloadVideo(video.id, filename);

      console.log(`\n🎉 Success! Video saved as: ${filename}`);
      console.log(`\n📊 Video Details:`);
      console.log(`   - ID: ${video.id}`);
      console.log(`   - Duration: 12 seconds`);
      console.log(`   - Resolution: 1280x720`);
      console.log(`   - Model: sora-2`);
      console.log(`\n🎬 You can now view the video!`);
      console.log(`   Run: open ${filename}\n`);

    } else if (status === 'failed') {
      console.error('\n❌ Video generation failed');
      console.error(`Error: ${videoData.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.status) {
      console.error(`HTTP Status: ${error.status}`);
    }

    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }
  }
}

function downloadVideo(videoId, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: `/v1/videos/${videoId}/content`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(new Error(`Download failed with status ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.end();
  });
}

console.log('🎬 dominAItrx Cages Video Ad Generator\n');
generateDominaitrxCagesAd();
