const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7007;
const DATA_FILE = path.join(__dirname, 'originalSuggestions.json');
const BACKUP_FILE = path.join(__dirname, 'originalSuggestions_backup.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname)); // Serve static files (HTML, JSON, etc.)

// Helper function to create backup
async function createBackup() {
    try {
        if (await fs.access(DATA_FILE).then(() => true).catch(() => false)) {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            await fs.writeFile(BACKUP_FILE, data, 'utf8');
            console.log('✅ Backup created');
        }
    } catch (error) {
        console.warn('⚠️  Could not create backup:', error.message);
    }
}

// Endpoint to save data
app.post('/api/save', async (req, res) => {
    try {
        const { data, timestamp } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        // Create backup before saving
        await createBackup();

        // Save to JSON file
        await fs.writeFile(
            DATA_FILE,
            JSON.stringify(data, null, 2),
            'utf8'
        );

        console.log(`✅ Data saved at ${new Date().toISOString()}`);
        console.log(`   Total suggestions: ${data.length}`);
        
        res.json({ 
            success: true, 
            message: 'Data saved successfully',
            timestamp: timestamp || new Date().toISOString(),
            count: data.length
        });
    } catch (error) {
        console.error('❌ Error saving:', error);
        res.status(500).json({ error: 'Error saving data', details: error.message });
    }
});

// Endpoint to load data
app.get('/api/load', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'File not found' });
        } else {
            console.error('❌ Error loading:', error);
            res.status(500).json({ error: 'Error loading data' });
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Suggestions Review Server');
    console.log(`📡 Running on http://localhost:${PORT}`);
    console.log(`📝 Save endpoint: http://localhost:${PORT}/api/save`);
    console.log(`📂 Data file: ${DATA_FILE}`);
    console.log(`💾 Backup file: ${BACKUP_FILE}`);
    console.log('');
});
