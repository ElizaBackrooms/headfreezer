# Banana Pro API Setup

## Get Your API Key

Choose one of these providers:

1. **Ulazai** - https://ulazai.com/nano-banana/pro/
2. **PiAPI** - https://piapi.ai/nano-banana-pro
3. **NanoBananaAPI.ai** - https://nanobananaapi.ai

## Environment Variables

Add to your `.env` file:

```env
BANANA_PRO_API_KEY=your_api_key_here
IMAGE_API_PROVIDER=banana
```

## For Render Deployment

Add these environment variables in Render dashboard:

- `BANANA_PRO_API_KEY` = Your Banana Pro API key
- `IMAGE_API_PROVIDER` = `banana`
- `FRONTEND_URL` = `https://www.241543903.xyz`

## API Endpoint

The code defaults to Ulazai's endpoint. If using a different provider, set:
- `BANANA_API_ENDPOINT` = Your provider's API endpoint URL

## Testing

Once you have your API key:
1. Add it to `.env` locally
2. Restart your backend server
3. Test image generation

The API will automatically use Banana Pro for image generation instead of Gemini.

