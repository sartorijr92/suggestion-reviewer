# Deploying to Google Cloud Platform (GCP)

## Prerequisites

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Authenticate: `gcloud auth login`
3. Create a project: `gcloud projects create your-project-id`
4. Set the project: `gcloud config set project your-project-id`

## Option 1: App Engine (Recommended)

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Deploy

```bash
gcloud app deploy
```

### Step 3: Open your app

```bash
gcloud app browse
```

The app will be available at: `https://your-project-id.appspot.com`

## Option 2: Cloud Run (Container-based)

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
```

### Step 2: Build and deploy

```bash
# Build container
gcloud builds submit --tag gcr.io/your-project-id/suggestions-reviewer

# Deploy to Cloud Run
gcloud run deploy suggestions-reviewer \
  --image gcr.io/your-project-id/suggestions-reviewer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Option 3: Compute Engine VM

### Step 1: Create VM

```bash
gcloud compute instances create suggestions-reviewer \
  --machine-type=e2-micro \
  --zone=us-central1-a \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud
```

### Step 2: SSH and setup

```bash
gcloud compute ssh suggestions-reviewer --zone=us-central1-a

# On the VM:
sudo apt-get update
sudo apt-get install -y nodejs npm
git clone <your-repo>
cd <your-repo>
npm install
```

### Step 3: Run with PM2 (process manager)

```bash
npm install -g pm2
pm2 start server.js --name suggestions-reviewer
pm2 save
pm2 startup
```

## Environment Variables

Set via App Engine:
```bash
gcloud app deploy --set-env-vars PORT=8000
```

Or via Cloud Run:
```bash
gcloud run services update suggestions-reviewer \
  --set-env-vars PORT=8000
```

## Important Notes

- The `originalSuggestions.json` file will be modified in place
- Backups are created as `originalSuggestions_backup.json`
- Make sure to backup your data before deploying
- Consider using Cloud Storage for persistent file storage in production

## Troubleshooting

### Check logs
```bash
gcloud app logs tail
```

### Check service status
```bash
gcloud app services list
```
