# Python Backend Setup for 241543903 Meme Generator

## Overview

The backend uses Python FastAPI with Google Gemini API for image generation. It's configured to generate the "241543903 Heads in Freezers" meme.

## Environment Variables

Set these in Render:

```
GOOGLE_API_KEY=AIzaSyBuzZv1Xpkqz3OCEhQWewpXiE9YRlZFnHQ
GEMINI_MODEL=gemini-3-pro-image-preview
FRONTEND_URL=https://www.241543903.xyz
PYTHON_VERSION=3.11.0
```

## Local Development

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
GOOGLE_API_KEY=AIzaSyBuzZv1Xpkqz3OCEhQWewpXiE9YRlZFnHQ
GEMINI_MODEL=gemini-3-pro-image-preview
FRONTEND_URL=http://localhost:5173
```

5. Run server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoint

- **POST** `/api/generate-meme`
- Accepts: `imageData` (base64) or `file` (multipart)
- Returns: Gemini API format with generated image

## Frontend Integration

The frontend (React) calls this endpoint. The backend returns images in the format:
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "inlineData": {
          "mimeType": "image/png",
          "data": "base64_image_data"
        }
      }]
    }
  }]
}
```

This matches what the frontend expects from the original Node.js backend.

## Deployment to Render

1. The `render.yaml` is configured for the backend folder
2. Set environment variables in Render dashboard
3. Deploy - it will automatically build and start

## Notes

- Uses `gemini-3-pro-image-preview` for image generation
- Prompt is configured for "241543903 Heads in Freezers" meme
- CORS allows all origins (can restrict to frontend domain if needed)

