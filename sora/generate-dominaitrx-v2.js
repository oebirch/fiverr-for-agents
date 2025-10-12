// Generated videos: (early version, no specific video recorded)
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDominaitrxV2Ad() {
  try {
    console.log('🎬 Generating dominAItrx V2 Video Ad\n');
    console.log('═'.repeat(60));

    const prompt = `Cinematic dystopian video advertisement for dominAItrx with specific sequence:

SCENE 1 (2 seconds): Retro 80s-style infomercial opening slide. Bright gradient background (pink to blue). Large bold text: "dominAItrx" with cheesy star burst effects. Below it: "Hire a human worker for your LLMs!" Retro TV commercial font. Energetic, upbeat music starts.

SCENE 2 (2 seconds): 80s infomercial benefits slide. Colorful gradient background. Three bold bullet points in retro font with star icons: "SUBJECTIVE JUDGMENT & TASTE" "PHYSICAL WORLD GROUNDING" "CREATIVE AUTHENTICITY". Cheesy graphics, bright colors, classic 80s TV ad aesthetic.

SCENE 3 (3 seconds): Cut to AUTHENTIC ChatGPT interface - dark theme, teal accent colors, sidebar visible, distinctive chat bubble layout. NO dominAItrx branding visible. ONLY ChatGPT interface elements. Text being typed: "What puppy should I buy for my family?" User clicks send. HOLD on this clean ChatGPT interface for the full 3 seconds. Then show thinking animation - three bouncing dots that ChatGPT displays.

SCENE 4 (1 second): Subtle visual effect - the screen glitches slightly showing the AI DECIDING to delegate the task to humans. Signal being sent effect.

SCENE 5 (4 seconds): Camera dramatically transitions through the screen into vast warehouse. Rows of industrial metal cages. Inside each cage: human worker hunched over glowing computer screen, frantically typing the puppy response. Workers look exhausted, desperate - one woman has single tear rolling down cheek. Harsh fluorescent lighting. Cold concrete floors. dominAItrx logo appears on warehouse wall in sleek modern typography. Camera pans across dozens of caged workers processing AI queries. Close-ups of stressed faces, tired eyes, hands typing desperately.

Blue-gray color palette for warehouse scenes. Black Mirror aesthetic. Professional cinematography. NO subtitles except dominAItrx branding in warehouse. NO breathing sounds, NO sniffing sounds. Background music: aspirational and climactic tech commercial soundtrack creating ironic contrast. The AI makes all decisions and delegates to trapped human workers. Mood: disturbing corporate dystopia with falsely uplifting music.`;

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

      const filename = `dominaitrx_v2_${video.id.slice(-8)}.mp4`;
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

console.log('🎬 dominAItrx V2 Video Ad Generator\n');
generateDominaitrxV2Ad();
