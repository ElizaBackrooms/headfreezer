# Render Environment Variables Setup

## Required Environment Variables for Render

Set these in your Render dashboard (Settings → Environment):

```
GOOGLE_API_KEY=AIzaSyBkB8iyB_p75LY0w1dlCpc2WUI_7AzAWdo
GEMINI_MODEL=nano-banana-pro-preview
FRONTEND_URL=https://www.241543903.xyz
```

## Frontend Domain

- **Frontend**: https://www.241543903.xyz
- **Backend**: https://headfreezer.onrender.com

## CORS Configuration

The backend is currently configured to allow all origins, so your frontend at www.241543903.xyz will work without issues.

If you want to restrict CORS to only your domain, you can set:
```
FRONTEND_URL=https://www.241543903.xyz,https://241543903.xyz
```

## Testing

1. Make sure all environment variables are set in Render
2. Restart the Render service
3. Test from https://www.241543903.xyz
4. The frontend should connect to https://headfreezer.onrender.com/api/generate-meme

