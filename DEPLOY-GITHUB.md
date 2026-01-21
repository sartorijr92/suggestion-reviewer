# 🔗 Deploy via GitHub no GCP

## Como Funciona

Quando você conecta o GitHub ao GCP:

1. **Você faz push no GitHub** → GCP detecta automaticamente
2. **GCP faz build automaticamente** → Compila e prepara sua aplicação
3. **GCP faz deploy automaticamente** → Publica a aplicação
4. **Toda vez que você atualizar o código** → Deploy automático!

## Vantagens

✅ Deploy automático a cada push  
✅ Histórico de versões  
✅ Rollback fácil  
✅ CI/CD integrado  
✅ Não precisa instalar SDK localmente  

---

## Passo a Passo

### 1. Preparar o Repositório GitHub

Primeiro, você precisa ter seu código no GitHub:

```bash
# Se ainda não tem um repositório Git
cd /Users/juniorsartori/Hammertech

# Inicializar Git (se ainda não fez)
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Suggestions Review Tool"

# Criar repositório no GitHub (via site ou CLI)
# Depois adicionar o remote:
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git

# Fazer push
git push -u origin main
```

### 2. Conectar GitHub ao GCP

#### Opção A: Via Cloud Build (Recomendado)

1. No console do GCP, vá em **"Cloud Build"** → **"Triggers"**
2. Clique em **"Conectar repositório"**
3. Escolha **"GitHub"**
4. Autorize o GCP a acessar seu GitHub
5. Selecione o repositório `suggestions-reviewer` (ou o nome do seu repo)
6. Clique em **"Conectar"**

#### Opção B: Via Cloud Run

1. No console do GCP, vá em **"Cloud Run"**
2. Clique em **"Criar serviço"**
3. Na seção **"Implantar"**, escolha:
   - **"De uma fonte de código"**
   - Selecione **"GitHub"**
   - Autorize e selecione seu repositório
   - Escolha a branch (geralmente `main` ou `master`)

### 3. Configurar o Build

O GCP vai precisar de um arquivo de configuração. Crie um destes:

#### Para Cloud Run (cloudbuild.yaml):

```yaml
steps:
  # Instalar dependências
  - name: 'gcr.io/cloud-builders/npm'
    args: ['install']
  
  # Fazer build (se necessário)
  # - name: 'gcr.io/cloud-builders/npm'
  #   args: ['run', 'build']
  
  # Fazer deploy no Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'suggestions-reviewer'
      - '--source'
      - '.'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '7007'
```

#### Para App Engine (app.yaml já existe):

O arquivo `app.yaml` que você já tem é suficiente! O GCP vai usar ele automaticamente.

### 4. Criar o Trigger

1. Em **"Cloud Build"** → **"Triggers"**
2. Clique em **"Criar trigger"**
3. Configure:
   - **Nome**: `deploy-suggestions-reviewer`
   - **Evento**: Push para branch
   - **Branch**: `^main$` (ou `^master$`)
   - **Configuração**: Arquivo de configuração do Cloud Build
   - **Localização**: `cloudbuild.yaml` (ou use o app.yaml para App Engine)
4. Clique em **"Criar"**

### 5. Testar

Agora é só fazer um push:

```bash
# Fazer uma mudança qualquer
echo "# Test" >> README.md

# Commit e push
git add .
git commit -m "Test deploy"
git push
```

O GCP vai:
1. Detectar o push automaticamente
2. Iniciar o build
3. Fazer o deploy
4. Você pode acompanhar em **"Cloud Build"** → **"Histórico"**

---

## Arquivos Necessários no Repositório

Certifique-se de ter estes arquivos no GitHub:

✅ `package.json` - Dependências  
✅ `server.js` - Servidor Node.js  
✅ `index.html` - Frontend  
✅ `app.yaml` - Para App Engine  
✅ `cloudbuild.yaml` - Para Cloud Run (opcional)  
✅ `.gitignore` - Para não commitar node_modules  

---

## Configurações Importantes

### Variáveis de Ambiente (se necessário)

No Cloud Run ou App Engine, você pode configurar variáveis:

**Cloud Run:**
- Vá em **"Editar e implantar nova revisão"**
- Seção **"Variáveis e segredos"**
- Adicione: `PORT=7007`

**App Engine:**
- Edite `app.yaml`:
```yaml
env_variables:
  PORT: '7007'
```

### Arquivo .gcloudignore

Crie um `.gcloudignore` para não enviar arquivos desnecessários:

```
node_modules/
.git/
.gitignore
*.log
.DS_Store
.env
originalSuggestions_backup.json
```

---

## Monitoramento

Depois do deploy, você pode:

1. **Ver logs**: Cloud Run → Seu serviço → "LOGS"
2. **Ver histórico**: Cloud Build → "Histórico"
3. **Acessar app**: URL será mostrada no Cloud Run ou App Engine

---

## Rollback (Voltar versão anterior)

Se algo der errado:

**Cloud Run:**
1. Vá em **"Revisões"**
2. Clique nos 3 pontos da revisão anterior
3. Clique em **"Gerenciar tráfego"**
4. Aumente o tráfego para a revisão anterior

**App Engine:**
```bash
gcloud app versions list
gcloud app versions migrate VERSION-ID
```

---

## Dicas

💡 **Primeiro deploy**: Pode demorar 5-10 minutos  
💡 **Deploys seguintes**: Geralmente 2-3 minutos  
💡 **Notificações**: Configure no Cloud Build para receber emails  
💡 **Branch protection**: Use branches diferentes para dev/prod  

---

## Troubleshooting

### Build falha
- Verifique os logs em Cloud Build → Histórico
- Certifique-se que `package.json` está correto
- Verifique se todas as dependências estão listadas

### Deploy falha
- Verifique se a porta está correta (7007)
- Verifique se `server.js` está no root
- Verifique permissões do serviço

### GitHub não conecta
- Verifique se autorizou o GCP no GitHub
- Verifique se o repositório é público ou você tem acesso
