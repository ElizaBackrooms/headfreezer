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
    const apiKey = process.env.BANANA_PRO_API_KEY || process.env.GEMINI_API_KEY;
    const apiProvider = process.env.IMAGE_API_PROVIDER || 'banana'; // 'banana' or 'gemini'

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured. Set BANANA_PRO_API_KEY or GEMINI_API_KEY' });
    }

    if (!imageData || !prompt) {
      return res.status(400).json({ error: 'Missing imageData or prompt' });
    }

    // Enhanced prompt for image generation
    const enhancedPrompt = `Transform this image into the viral "241543903" meme (Heads in Freezers meme). The person in the image should appear to be sticking their head inside a refrigerator/freezer, surrounded by frozen food items, ice, and frost. Create a realistic composite that looks like they're actually inside a freezer with their head among frozen vegetables, ice cream, and other frozen goods. Make it humorous and true to the original meme aesthetic. Ensure the lighting and perspective match a typical refrigerator interior view. High quality, photorealistic, detailed.`;

    if (apiProvider === 'banana') {
      // Use Banana Pro / Nano Banana API
      // Common endpoints: https://api.ulazai.com/v1/images/generations or similar
      const bananaEndpoint = process.env.BANANA_API_ENDPOINT || 'https://api.ulazai.com/v1/images/generations';
      
      const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;
      
      const response = await fetch(bananaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'nano-banana-pro',
          prompt: enhancedPrompt,
          image: base64Image, // Base64 input image
          num_images: 1,
          size: '1024x1024',
          response_format: 'b64_json'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: data.error?.message || data.error || 'Failed to generate image' 
        });
      }

      // Banana Pro typically returns images in data array
      if (data.data && data.data[0] && data.data[0].b64_json) {
        return res.json({
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  mimeType: 'image/png',
                  data: data.data[0].b64_json
                }
              }]
            }
          }]
        });
      } else if (data.image || data.url) {
        // Some APIs return URL or direct image data
        return res.json({
          candidates: [{
            content: {
              parts: [{
                inlineData: {
                  mimeType: 'image/png',
                  data: data.image || data.url
                }
              }]
            }
          }]
        });
      } else {
        console.error('Unexpected Banana Pro response:', data);
        return res.status(500).json({ error: 'Unexpected response format from Banana Pro API' });
      }
    } else {
      // Fallback to Gemini (original code)
      const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
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
        return res.status(response.status).json({ 
          error: data.error?.message || 'Failed to generate image' 
        });
      }

      res.json(data);
    }
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

