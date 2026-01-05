# Deployment Guide: Render (Backend) + Namecheap (Frontend)

This guide walks you through deploying the backend on Render and the frontend on Namecheap.

## Step 1: Deploy Backend on Render

1. **Push your code to GitHub** (if you haven't already)

2. **Go to [Render Dashboard](https://dashboard.render.com)** and sign in

3. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this project

4. **Configure the service:**
   - **Name:** `heads-in-freezers-api` (or any name you prefer)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free tier works fine

5. **Add Environment Variables:**
   - Click "Environment" tab
   - Add `GEMINI_API_KEY` with your Google Gemini API key
   - Add `FRONTEND_URL` with your Namecheap domain (e.g., `https://yourdomain.com`)
   - Add `PORT` (Render sets this automatically, but you can add it if needed)

6. **Deploy!** Render will automatically deploy your backend

7. **Copy your Render URL:**
   - After deployment, you'll get a URL like: `https://heads-in-freezers-api.onrender.com`
   - Save this URL - you'll need it for the frontend

## Step 2: Deploy Frontend on Namecheap

### Option A: Using Namecheap Shared Hosting (cPanel)

1. **Build your frontend:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with all the static files.

2. **Build your frontend with the Render URL:**

   **Option A: Using the build script (Recommended)**
   
   On Windows:
   ```bash
   build-for-namecheap.bat https://your-render-url.onrender.com
   ```
   
   On Mac/Linux:
   ```bash
   chmod +x build-for-namecheap.sh
   ./build-for-namecheap.sh https://your-render-url.onrender.com
   ```

   **Option B: Manual build**
   
   Create a `.env.production` file in the root:
   ```env
   VITE_API_URL=https://your-render-url.onrender.com/api/generate-meme
   ```
   Then run:
   ```bash
   npm run build
   ```

   **Option C: One-line build**
   ```bash
   VITE_API_URL=https://your-render-url.onrender.com/api/generate-meme npm run build
   ```

4. **Upload to Namecheap:**
   - Log into your Namecheap cPanel
   - Go to File Manager
   - Navigate to `public_html` (or your domain's root folder)
   - Upload all files from the `dist` folder
   - Make sure `index.html` is in the root

### Option B: Using Namecheap Static Site Hosting

1. **Build your frontend with the Render URL:**
   ```bash
   VITE_API_URL=https://your-render-url.onrender.com/api/generate-meme npm run build
   ```

2. **Upload the `dist` folder contents** to your Namecheap hosting

## Step 3: Configure CORS (Important!)

1. **Go back to Render Dashboard**
2. **Edit your web service**
3. **Update the `FRONTEND_URL` environment variable:**
   - Set it to your Namecheap domain (e.g., `https://yourdomain.com`)
   - This allows your frontend to make API calls to the backend

4. **Redeploy** if needed (Render usually auto-deploys on env var changes)

## Step 4: Test Your Deployment

1. Visit your Namecheap domain
2. Upload an image
3. Generate a meme
4. If you see CORS errors, double-check:
   - `FRONTEND_URL` in Render matches your exact domain (including `https://`)
   - The frontend is using the correct Render API URL

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Render matches your exact domain
- Include `https://` in the URL
- No trailing slash

### API Not Working
- Check that your Render service is running (green status)
- Verify `GEMINI_API_KEY` is set correctly in Render
- Check Render logs for errors

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` was set when building
- Check browser console for the actual API URL being used
- Make sure the Render URL is correct

## Environment Variables Summary

### Render (Backend):
- `GEMINI_API_KEY` - Your Google Gemini API key
- `FRONTEND_URL` - Your Namecheap domain (e.g., `https://yourdomain.com`)
- `PORT` - Automatically set by Render

### Frontend Build:
- `VITE_API_URL` - Your Render backend URL (e.g., `https://your-api.onrender.com/api/generate-meme`)

