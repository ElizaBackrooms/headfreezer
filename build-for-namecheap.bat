@echo off
REM Build script for Namecheap deployment (Windows)
REM Usage: build-for-namecheap.bat YOUR_RENDER_URL

if "%1"=="" (
    echo Usage: build-for-namecheap.bat YOUR_RENDER_URL
    echo Example: build-for-namecheap.bat https://heads-in-freezers-api.onrender.com
    exit /b 1
)

set RENDER_URL=%1
set API_URL=%RENDER_URL%/api/generate-meme

echo Building frontend with API URL: %API_URL%
echo.

set VITE_API_URL=%API_URL% && npm run build

echo.
echo Build complete! Upload the contents of the 'dist' folder to Namecheap.

