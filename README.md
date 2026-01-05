# 241543903 Meme Generator

A React application that transforms your photos into the viral "Heads in Freezers" meme (241543903) using Google's Gemini AI. The API key is securely stored on the backend so anyone can use the app without entering credentials.

## Features

- Upload your photo
- Generate a meme using Google Gemini AI (API key protected on backend)
- Download your generated meme
- Beautiful, modern UI with Tailwind CSS
- Secure backend API proxy

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Get your Google Gemini API key:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free API key

3. Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server (in one terminal):
```bash
npm run server
```

5. Start the frontend dev server (in another terminal):
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Recommended: Render (Backend) + Namecheap (Frontend)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

**Quick Summary:**
1. Deploy backend to Render with `GEMINI_API_KEY` and `FRONTEND_URL` environment variables
2. Build frontend with `VITE_API_URL` pointing to your Render backend
3. Upload built files to Namecheap

### Alternative: Deploy to Vercel

1. Push your code to GitHub

2. Import your repository on [Vercel](https://vercel.com)

3. Add environment variable:
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key value

4. Deploy! Vercel will automatically:
   - Build your frontend
   - Deploy the serverless function from `api/generate-meme.js`

### Alternative: Deploy to Netlify

1. Push your code to GitHub

2. Import your repository on [Netlify](https://netlify.com)

3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. Add environment variable:
   - Go to Site Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key value

5. Deploy! Netlify will use the serverless function from `netlify/functions/generate-meme.js`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Security Note

✅ **Secure**: The API key is stored as an environment variable on the backend/serverless function, so it's never exposed to users.

❌ **Insecure**: Never hardcode your API key in frontend code - it will be visible to anyone who views the page source.

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- Express.js (backend server)
- Google Gemini API

