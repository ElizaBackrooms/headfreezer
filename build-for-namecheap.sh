#!/bin/bash

# Build script for Namecheap deployment
# Usage: ./build-for-namecheap.sh YOUR_RENDER_URL

if [ -z "$1" ]; then
    echo "Usage: ./build-for-namecheap.sh YOUR_RENDER_URL"
    echo "Example: ./build-for-namecheap.sh https://heads-in-freezers-api.onrender.com"
    exit 1
fi

RENDER_URL=$1
API_URL="${RENDER_URL}/api/generate-meme"

echo "Building frontend with API URL: $API_URL"
echo ""

VITE_API_URL=$API_URL npm run build

echo ""
echo "Build complete! Upload the contents of the 'dist' folder to Namecheap."

