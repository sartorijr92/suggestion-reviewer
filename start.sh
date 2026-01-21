#!/bin/bash

# Start script for Suggestions Review Tool

echo "🚀 Starting Suggestions Review Tool..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🌐 Starting server..."
echo "   Open http://localhost:7007 in your browser"
echo "   Press Ctrl+C to stop"
echo ""

npm start
