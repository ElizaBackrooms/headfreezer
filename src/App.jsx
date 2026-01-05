import React, { useState, useRef } from 'react';
import { Upload, Loader2, Download, Info } from 'lucide-react';

export default function HeadsInFreezersApp() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Use backend API endpoint - works for both Vercel serverless and Express server
  const API_ENDPOINT = import.meta.env.VITE_API_URL || '/api/generate-meme';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setResultImage(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMeme = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = `Transform this image into the viral "241543903" meme (Heads in Freezers meme). The person in the image should appear to be sticking their head inside a refrigerator/freezer, surrounded by frozen food items, ice, and frost. Create a realistic composite that looks like they're actually inside a freezer with their head among frozen vegetables, ice cream, and other frozen goods. Make it humorous and true to the original meme aesthetic. Ensure the lighting and perspective match a typical refrigerator interior view.`;

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: uploadedImage,
          prompt: prompt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.candidates && data.candidates[0]?.content?.parts) {
        const imagePart = data.candidates[0].content.parts.find(
          part => part.inlineData
        );
        
        if (imagePart) {
          const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          setResultImage(generatedImage);
        } else {
          throw new Error('No image was generated. Gemini may have returned text instead.');
        }
      } else {
        throw new Error('Unexpected response format from Gemini API');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate meme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = '241543903-meme.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            241543903 Meme Generator
          </h1>
          <p className="text-gray-600">Transform your photo into the viral "Heads in Freezers" meme</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>About 241543903:</strong> This viral meme involves people photographing themselves with their heads inside freezers, then uploading the images with the tag "241543903". Try it yourself!
            </div>
          </div>

          <div className="mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Your Photo
            </button>
          </div>

          {uploadedImage && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image:</h3>
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
              />
            </div>
          )}

          {uploadedImage && (
            <button
              onClick={generateMeme}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Freezer Meme...
                </>
              ) : (
                <>Generate 241543903 Meme</>
              )}
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {resultImage && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Your 241543903 Meme:</h3>
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <img
              src={resultImage}
              alt="Generated meme"
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}

