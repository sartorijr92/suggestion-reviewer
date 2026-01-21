// Exemplo de servidor Node.js simples para salvar o JSON
// Instale as dependências: npm install express cors
// Execute: node server-example.js

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 7007;
const DATA_FILE = path.join(__dirname, 'suggestions_reviewed.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Endpoint para salvar os dados
app.post('/api/save', async (req, res) => {
    try {
        const { data, timestamp } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Dados inválidos' });
        }

        // Salvar no arquivo JSON
        await fs.writeFile(
            DATA_FILE,
            JSON.stringify(data, null, 2),
            'utf8'
        );

        console.log(`✅ Dados salvos em ${new Date().toISOString()}`);
        
        res.json({ 
            success: true, 
            message: 'Dados salvos com sucesso',
            timestamp: timestamp
        });
    } catch (error) {
        console.error('Erro ao salvar:', error);
        res.status(500).json({ error: 'Erro ao salvar dados' });
    }
});

// Endpoint para carregar os dados
app.get('/api/load', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json([]);
        } else {
            res.status(500).json({ error: 'Erro ao carregar dados' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📝 Endpoint de salvamento: http://localhost:${PORT}/api/save`);
});
