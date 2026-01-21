#!/bin/bash

# Simple HTTP server to run the suggestions review page
# This avoids CORS issues when loading the JSON file

PORT=7007

echo "🚀 Starting server on http://localhost:$PORT"
echo "📝 Open http://localhost:$PORT/index.html in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server $PORT
