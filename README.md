# Suggestions Review Tool

A web-based tool for reviewing and managing code suggestions with automatic JSON saving.

## Quick Start

### Development (Local)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open http://localhost:8000 in your browser

The server will:
- Serve the HTML page
- Automatically load `originalSuggestions.json`
- Save changes directly to the JSON file
- Create automatic backups

### Alternative: Simple HTTP Server (No Backend)

If you just want to view without saving:

```bash
./start-server.sh
# or
python3 -m http.server 8000
```

Then open http://localhost:8000/index.html

## Features

- ✅ Automatic loading of `originalSuggestions.json`
- ✅ Side-by-side code comparison
- ✅ Approve/Reclassify suggestions
- ✅ Auto-save to JSON file (via backend)
- ✅ Auto-save to localStorage (fallback)
- ✅ Export reviewed JSON
- ✅ Dark theme
- ✅ Automatic backups

## Production Deployment

### Deploy to Google Cloud Platform

See [DEPLOY-GCP.md](DEPLOY-GCP.md) for detailed instructions.

Quick deploy to App Engine:
```bash
gcloud app deploy
```

### Deploy to Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/YOUR-PROJECT-ID/suggestions-reviewer
gcloud run deploy suggestions-reviewer \
  --image gcr.io/YOUR-PROJECT-ID/suggestions-reviewer \
  --platform managed \
  --allow-unauthenticated
```

## API Endpoints

- `POST /api/save` - Save reviewed suggestions
- `GET /api/load` - Load suggestions data
- `GET /api/health` - Health check

## File Structure

- `index.html` - Main application
- `server.js` - Node.js backend server
- `originalSuggestions.json` - Data file (modified in place)
- `originalSuggestions_backup.json` - Automatic backup
