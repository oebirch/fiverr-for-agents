// Generated videos: video_c4294a74.mp4 (SECOND_BEST)
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const https = require('https');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDominaitrxV6Ad() {
  try {
    console.log('🎬 Generating dominAItrx V6 Video Ad\n');
    console.log('═'.repeat(60));

    const prompt = `Cinematic dystopian video advertisement for dominAItrx. High quality, crisp visuals throughout. Rich cinematic color grading with emphasis on cold blues contrasted with warm flesh tones.

SCENE 1 (1 second MAX): Retro-futuristic 80s synthwave aesthetic opening. CRITICAL VISUAL STYLE: Bold, rounded, 3D-style lettering with thick outlines and drop shadows. Chrome-like reflections and metallic sheen on text. Glossy highlights and lens flare. Neon color palette: bright pink, purple, and cyan gradient background. Horizontal scanline texture across entire image (like old CRT display). "dominAItrx" in large bold 3D chrome lettering with vaporwave styling - text tilted at slight upward angle. Single bright lens flare starburst effect ONLY on the "x" at the end. Below in white bold text: "Hire a human worker for your AI agents!" High-energy nostalgic 80s digital art aesthetic - like vintage tech advertisement or vaporwave remix. VHS tracking artifacts. Authentic 80s synth music - upbeat and cheesy. This must be VERY BRIEF - exactly 1 second, no longer.

SCENE 2 (5 seconds): Static camera, locked-off angle. Cut to PERFECTLY AUTHENTIC ChatGPT interface - MUST include ChatGPT logo at top, MUST say "ChatGPT" text visible. Exact dark theme, exact teal accent colors, sidebar with ONLY 2 other chats visible (not many chats, just 2), distinctive chat bubble layout. NO dominAItrx branding visible. ONLY real ChatGPT interface elements. CRITICAL: Text must be CRISP, SHARP, and PERFECTLY READABLE - large clear font size. Realistic screen recording: mouse cursor visible, FAST typing speed - fast enough that the ENTIRE prompt is fully visible before the scene ends: "My best friend just told everyone my secret at dinner in front of 12 people. I'm humiliated and everyone is staring at me. What do I do right now?" User clicks send with cursor. HOLD on main ChatGPT interface showing the complete typed message. Then cut DIRECTLY to thinking indicator scene - NO extra cuts, NO zoom on prompt box, NO additional transitions. Music transitions to aspirational tech commercial soundtrack.

SCENE 3 (1 second MAX): Angled close-up shot of the ChatGPT thinking indicator - rounded rectangle bubble with three animated dots inside (exactly like iMessage typing indicator). Camera smoothly zooms directly into the bubble. NO glitch effects. NO sound effects. NO screen effects. Just a smooth, simple zoom transition into the bubble that leads into the warehouse. This must be quick - exactly 1 second.

SCENE 4 (8 seconds): Smooth dolly shot transitioning through screen into industrial warehouse. CRISP HIGH QUALITY visuals. Clinical fluorescent lighting - bright enough to be sterile but not harsh. Clean metal cages with standard vertical bars like a normal jail cell - simple, realistic vertical metal bars (no rust, industrial but maintained). Cold concrete floors.

Inside cages with realistic jail-style vertical bars: middle-aged tech workers in normal everyday clothing hunched over glowing screens, typing emotional responses. Mix of genders, all appearing like professional tech workers. Normal jail cell bars visible in front of the workers - nothing exaggerated, just standard vertical bars. Smooth dolly movement glides across rows of caged workers. dominAItrx logo appears on warehouse wall in sleek modern typography.

CLOSE-UP 1 (2 seconds): Middle-aged woman tech worker in normal clothing, single tear rolling down cheek while maintaining composure as she types. Subtle despair. CRISP DETAIL on tear and stressed but controlled expression.

CLOSE-UP 2 (2 seconds): Middle-aged male tech worker in adjacent clean cage, wearing casual professional clothes, eyes showing fatigue, hands typing steadily. CRISP DETAIL on tired eyes, normal clothing visible.

Final smooth dolly pullback (2 seconds): Reveal realistic scale - multiple rows of clean cages, all occupied by middle-aged tech workers in everyday clothes, all typing. Camera reveals the dominAItrx logo displayed large and prominently at the far end of the warehouse - visible in the distance as the final reveal.

Rich cinematic color palette with cold blue warehouse tones contrasting warm skin tones. Professional smooth dolly cinematography. CRISP HIGH-RESOLUTION details on worker faces. NO subtitles except dominAItrx branding. NO breathing sounds, NO sniffing sounds. Background music: aspirational tech commercial soundtrack building to climactic crescendo at end, creating ironic contrast with dystopian visuals. The AI makes all decisions and delegates emotional labor to trapped human workers. Mood: disturbing corporate dystopia with falsely uplifting climactic music.`;

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

      const filename = `dominaitrx_v6_${video.id.slice(-8)}.mp4`;
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

console.log('🎬 dominAItrx V6 Video Ad Generator\n');
generateDominaitrxV6Ad();
