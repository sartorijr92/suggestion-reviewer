# Configuração do Backend para Salvamento Automático

## Opção 1: Servidor Node.js Simples

1. Instale as dependências:
```bash
npm install express cors
```

2. Execute o servidor:
```bash
node server-example.js
```

3. Configure a URL no `index.html`:
```javascript
const API_ENDPOINT = 'http://localhost:8000/api/save';
```

## Opção 2: Vercel/Netlify Functions

Crie um arquivo `api/save.js`:

```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Salvar no banco de dados ou storage
    // Exemplo com Vercel KV ou similar
    
    return res.json({ success: true });
}
```

## Opção 3: Firebase/Supabase

Use o Firebase Realtime Database ou Supabase para salvar automaticamente.

## Opção 4: Sem Backend (Apenas LocalStorage)

Se não configurar `API_ENDPOINT`, o sistema usa apenas localStorage como fallback.
