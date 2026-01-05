import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend domain
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'https://www.241543903.xyz', 'https://241543903.xyz'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow all origins for now - can restrict later if needed
    callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-meme', async (req, res) => {
  try {
    const { imageData, prompt } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    // Try different model names - nano-banana-pro-preview might not be available
    // Fallback to standard image generation models
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured. Set GOOGLE_API_KEY or GEMINI_API_KEY' });
    }

    if (!imageData || !prompt) {
      return res.status(400).json({ error: 'Missing imageData or prompt' });
    }

    // Enhanced prompt for image generation
    const enhancedPrompt = `Transform this image into the viral "241543903" meme (Heads in Freezers meme). The person in the image should appear to be sticking their head inside a refrigerator/freezer, surrounded by frozen food items, ice, and frost. Create a realistic composite that looks like they're actually inside a freezer with their head among frozen vegetables, ice cream, and other frozen goods. Make it humorous and true to the original meme aesthetic. Ensure the lighting and perspective match a typical refrigerator interior view. High quality, photorealistic, detailed.`;

    const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;

    // Use Gemini with nano-banana-pro-preview model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: enhancedPrompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            response_modalities: ['Image']
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', JSON.stringify(data, null, 2));
      const errorMessage = data.error?.message || data.error || 'Failed to generate image';
      
      // Check for specific error types
      if (errorMessage.includes('API key') || errorMessage.includes('permission') || errorMessage.includes('denied')) {
        return res.status(403).json({ 
          error: 'API key issue. Please check: 1) Key is correct, 2) API is enabled in Google Cloud Console, 3) Key has proper permissions for Gemini API'
        });
      }
      
      if (errorMessage.includes('model') || errorMessage.includes('not found')) {
        return res.status(400).json({ 
          error: `Model "${geminiModel}" not found. Try setting GEMINI_MODEL to a valid model like "gemini-2.0-flash-exp" or "gemini-1.5-pro"`
        });
      }
      
      return res.status(response.status).json({ 
        error: errorMessage
      });
    }

    // Log response for debugging
    console.log('Gemini API Response structure:', {
      hasCandidates: !!data.candidates,
      candidateCount: data.candidates?.length,
      hasParts: !!data.candidates?.[0]?.content?.parts
    });

    res.json(data);
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

