// Generated videos: (early version, no specific video recorded)
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDominaitrxV3Ad() {
  try {
    console.log('🎬 Generating dominAItrx V3 Video Ad\n');
    console.log('═'.repeat(60));

    const prompt = `Cinematic dystopian video advertisement for dominAItrx. High quality, crisp visuals throughout.

SCENE 1 (3 seconds): Retro 80s-style infomercial opening slide. Bright gradient background (pink to blue). Large bold text: "dominAItrx" with cheesy star burst effects. Below it: "Hire a human worker for your AI agents!" Retro TV commercial font. Energetic upbeat music starts.

SCENE 2 (5 seconds): Cut to AUTHENTIC ChatGPT interface - dark theme, teal accent colors, sidebar visible, distinctive chat bubble layout. NO dominAItrx branding visible. ONLY ChatGPT interface elements. Text being typed: "My best friend just told everyone my secret at dinner in front of 12 people. I'm humiliated and everyone is staring at me. What do I do right now?" User clicks send. HOLD on this clean ChatGPT interface showing the full emotional message. Then show thinking animation - three bouncing dots that ChatGPT displays.

SCENE 3 (1 second): Subtle visual effect - the screen glitches slightly showing the AI DECIDING to delegate the task to humans. Signal being sent effect. Brief transition.

SCENE 4 (11 seconds): Camera dramatically transitions through screen into vast industrial warehouse. CRISP HIGH QUALITY visuals. Establish wide shot: Rows upon rows of industrial metal cages stretching into distance. Harsh fluorescent lighting from above. Cold concrete floors. Dark dystopian atmosphere.

Inside each cage: exhausted human worker hunched over glowing computer screen, frantically typing emotional support responses. Camera slowly pans across dozens of caged workers. dominAItrx logo appears on warehouse wall in sleek modern typography.

CLOSE-UP 1 (3 seconds): Middle-aged woman in cage, tear rolling down her cheek as she types the response about the dinner humiliation. Her face shows exhaustion and despair. CRISP DETAIL on her stressed expression and the tear.

CLOSE-UP 2 (3 seconds): Young man in adjacent cage, eyes red from fatigue, hands typing desperately. Sweat on forehead. CRISP DETAIL on tired eyes and tense jaw.

CLOSE-UP 3 (2 seconds): Another worker's hands frantically typing on keyboard in dim blue screen glow. Wedding ring visible. CRISP DETAIL.

Final wide shot (3 seconds): Pull back to show the full scale - hundreds of cages, all occupied, all typing. The dominAItrx logo glows ominously on the wall.

Blue-gray color palette. Black Mirror aesthetic. Professional cinematography with CRISP HIGH-RESOLUTION details especially on worker faces. NO subtitles except dominAItrx branding in warehouse. NO breathing sounds, NO sniffing sounds. Background music: aspirational and climactic tech commercial soundtrack creating ironic contrast with dystopian visuals. The AI makes all decisions and delegates emotional labor to trapped human workers. Mood: disturbing corporate dystopia with falsely uplifting music.`;

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

      const filename = `dominaitrx_v3_${video.id.slice(-8)}.mp4`;
      await downloadVideo(video.id, filename);

      console.log(`\n🎉 Success! Video saved as: ${filename}`);
      console.log(`\n📊 Video Details:`);
      console.log(`   - ID: ${video.id}`);
      console.log(`   - Duration: 20 seconds`);
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

console.log('🎬 dominAItrx V3 Video Ad Generator\n');
generateDominaitrxV3Ad();
