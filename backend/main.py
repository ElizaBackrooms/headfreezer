from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from google import genai as genai_new
from PIL import Image
import io
import os
from dotenv import load_dotenv
import json
import base64
from typing import Optional
import logging
import traceback
import asyncio
from concurrent.futures import ThreadPoolExecutor

from utils.prompts import get_fridge_meme_prompt


class MemeRequest(BaseModel):
    imageData: str
    prompt: Optional[str] = None


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="241543903 Meme Generator", version="1.0.0")

# Thread pool executor for blocking I/O operations
executor = ThreadPoolExecutor(max_workers=50, thread_name_prefix="meme_generator")

# CORS middleware - Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini / Nano Banana
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("NANO_BANANA_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not found in environment variables")

# Configure both old and new API clients
genai.configure(api_key=api_key)

# Use gemini-3-pro-image-preview for image generation
IMAGE_MODEL = os.getenv("GEMINI_MODEL", "gemini-3-pro-image-preview")
VISION_MODEL = os.getenv("VISION_MODEL", "gemini-1.5-pro")

# Initialize the new Genai client for image generation
try:
    client = genai_new.Client(api_key=api_key)
    logger.info(f"Initialized Gemini client with models: IMAGE={IMAGE_MODEL}, VISION={VISION_MODEL}")
except Exception as e:
    logger.warning(f"Could not initialize new genai client: {e}. Falling back to standard API.")
    client = None


@app.get("/")
async def root():
    return {
        "message": "241543903 Meme Generator - Heads in Freezers",
        "status": "running",
        "models": {
            "image_generation": IMAGE_MODEL,
            "vision": VISION_MODEL
        }
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "image_model": IMAGE_MODEL,
        "vision_model": VISION_MODEL,
        "api_configured": bool(api_key)
    }


@app.options("/api/generate-meme")
async def generate_options():
    """Handle CORS preflight requests"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )


@app.post("/api/generate-meme")
async def generate_meme(
    request: Request,
    file: Optional[UploadFile] = File(None),
    imageData: Optional[str] = Form(None),
    prompt: Optional[str] = Form(None)
):
    """
    Generate 241543903 meme (Heads in Freezers) from uploaded image.
    
    Accepts either:
    - file: Uploaded image file
    - imageData: Base64 encoded image data
    - prompt: Custom prompt (optional)
    """
    request_id = f"meme_{id(file) if file else 'base64'}"
    logger.info(f"[{request_id}] Received meme generation request")
    
    try:
        # Check if request is JSON (from frontend)
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                json_data = await request.json()
                imageData = json_data.get("imageData")
                prompt = json_data.get("prompt", prompt)
            except:
                pass
        
        # Get image data
        if file:
            image_bytes = await file.read()
        elif imageData:
            # Handle base64 data URL
            if ',' in imageData:
                image_bytes = base64.b64decode(imageData.split(',')[1])
            else:
                image_bytes = base64.b64decode(imageData)
        else:
            raise HTTPException(status_code=400, detail="No image provided. Use 'file' or 'imageData' parameter")
        
        logger.info(f"[{request_id}] Image size: {len(image_bytes)} bytes")
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024
        if len(image_bytes) > max_size:
            raise HTTPException(status_code=400, detail=f"File too large. Max size: 10MB")
        
        # Process image
        def process_image(image_bytes_data, req_id):
            """Process image synchronously"""
            try:
                img = Image.open(io.BytesIO(image_bytes_data))
                logger.info(f"[{req_id}] Image opened: {img.size}, mode: {img.mode}")
                
                # Convert to RGB if necessary
                if img.mode == 'RGBA':
                    rgb_image = Image.new('RGB', img.size, (255, 255, 255))
                    if len(img.split()) == 4:
                        rgb_image.paste(img, mask=img.split()[3])
                    else:
                        rgb_image.paste(img)
                    img = rgb_image
                elif img.mode != 'RGB':
                    img = img.convert("RGB")
                
                return img
            except Exception as e:
                logger.error(f"[{req_id}] Failed to open image: {str(e)}")
                raise ValueError(f"Invalid image file: {str(e)}")
        
        # Run image processing
        try:
            image = await asyncio.get_event_loop().run_in_executor(
                executor, process_image, image_bytes, request_id
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Get the transformation prompt
        custom_prompt = prompt or ""
        meme_prompt = get_fridge_meme_prompt(custom_prompt)
        logger.info(f"[{request_id}] Using 241543903 meme prompt")
        
        # Generate meme using Gemini
        def generate_meme_image(prompt_text, img, req_id):
            """Generate meme image using Gemini's image capabilities"""
            logger.info(f"[{req_id}] Generating 241543903 meme with Gemini...")
            
            generated_images = []
            description = None
            
            try:
                if client:
                    # Use new Genai client for image generation
                    logger.info(f"[{req_id}] Using new Genai client with model: {IMAGE_MODEL}")
                    
                    # Convert PIL image to bytes for the API
                    img_buffer = io.BytesIO()
                    img.save(img_buffer, format="PNG")
                    img_bytes = img_buffer.getvalue()
                    
                    # Analyze the image first
                    vision_model = genai.GenerativeModel(VISION_MODEL)
                    analysis_prompt = """Analyze this image and describe the person in detail: their pose, facial expression, clothing, and any distinctive features. Be specific."""
                    
                    analysis_response = vision_model.generate_content([
                        analysis_prompt,
                        img
                    ])
                    
                    image_description = analysis_response.text if hasattr(analysis_response, 'text') else "a person"
                    logger.info(f"[{req_id}] Image analysis: {image_description[:200]}...")
                    
                    # Build full prompt for meme generation
                    full_prompt = f"""{prompt_text}

Based on this source image description: {image_description}

CRITICAL VISUAL REQUIREMENTS:
1. The person should appear to be sticking their head inside a refrigerator/freezer
2. Surround them with frozen food items: ice cream, frozen vegetables, ice, frost
3. Create a realistic composite that looks like they're actually inside a freezer
4. Their head should be among frozen goods (frozen peas, ice cream containers, etc.)
5. Add frost and ice effects around the edges
6. Maintain the person's recognizable features from the original
7. Make it humorous and true to the original 241543903 meme aesthetic
8. Ensure the lighting matches a typical refrigerator interior (cool white/blue tones)
9. High quality, photorealistic composite image

Transform this into the viral "241543903" Heads in Freezers meme!"""
                    
                    # Try to generate image using the Gemini model
                    try:
                        response = client.models.generate_content(
                            model=IMAGE_MODEL,
                            contents=full_prompt,
                            config=genai_new.types.GenerateContentConfig(
                                response_modalities=['IMAGE']
                            )
                        )
                        
                        # Extract generated images from response
                        for part in response.candidates[0].content.parts:
                            if hasattr(part, 'inline_data') and part.inline_data:
                                # This is an image
                                img_data = part.inline_data.data
                                generated_images.append(base64.b64encode(img_data).decode('utf-8'))
                                logger.info(f"[{req_id}] Generated meme image extracted!")
                            elif hasattr(part, 'text') and part.text:
                                description = part.text
                                
                    except Exception as gen_error:
                        logger.warning(f"[{req_id}] Image generation failed: {gen_error}. Trying fallback.")
                        # Fallback: Use vision model to describe the transformation
                        fallback_response = vision_model.generate_content([full_prompt, img])
                        description = fallback_response.text if hasattr(fallback_response, 'text') else "Meme transformation generated"
                
                else:
                    # Fallback to old API
                    logger.info(f"[{req_id}] Using legacy Genai API")
                    model = genai.GenerativeModel(VISION_MODEL)
                    response = model.generate_content([meme_prompt, img])
                    description = response.text if hasattr(response, 'text') else "241543903 meme transformation concept"
                    
            except Exception as e:
                logger.error(f"[{req_id}] Generation error: {str(e)}\n{traceback.format_exc()}")
                raise
            
            return {
                "generated_images": generated_images,
                "description": description
            }
        
        # Run generation
        try:
            result = await asyncio.get_event_loop().run_in_executor(
                executor, generate_meme_image, meme_prompt, image, request_id
            )
        except Exception as e:
            logger.error(f"[{request_id}] Generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Meme generation failed: {str(e)}")
        
        # Convert original image to base64
        def convert_to_base64(img, req_id):
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
            
        original_base64 = await asyncio.get_event_loop().run_in_executor(
            executor, convert_to_base64, image, request_id
        )
        
        # Build response in format expected by frontend
        if result.get("generated_images"):
            # Return image in the format frontend expects
            generated_image = result["generated_images"][0]
            image_data_uri = f"data:image/png;base64,{generated_image}"
            
            # Return in Gemini API format for frontend compatibility
            return JSONResponse(
                content={
                    "candidates": [{
                        "content": {
                            "parts": [{
                                "inlineData": {
                                    "mimeType": "image/png",
                                    "data": generated_image
                                }
                            }]
                        }
                    }]
                },
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                }
            )
        else:
            # No image generated, return error
            raise HTTPException(
                status_code=500, 
                detail=f"No image was generated. {result.get('description', 'Unknown error')}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

