# Sora Video Generation Test

This is a simple test script for OpenAI's Sora video generation API.

## Setup

1. API key is already configured in `.env`
2. Dependencies are installed

## Running the Test

```bash
node index.js
```

## What it does

- Generates a 5-second video of "A cute orange cat playing a grand piano"
- Uses the Sora-2 model
- Polls for completion and displays the video URL

## API Details

- **Endpoint**: `POST https://api.openai.com/v1/videos`
- **Model**: `sora-2`
- **Size**: 1280x720
- **Duration**: 5 seconds

## Note

The Sora API is currently in limited preview. If you get a 403 error, your API key may not have access yet. You'll need to request access from OpenAI's developer relations team.

## Expected Output

If successful:
```
✅ Video generated successfully!
🎥 Video URL: https://...
```

If API access not granted:
```
🚫 Access denied. Your API key may not have access to the Sora API yet.
```
