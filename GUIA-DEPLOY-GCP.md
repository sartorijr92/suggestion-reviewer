# 🚀 Guia Passo a Passo - Deploy no GCP

## Parte 1: Criar o Projeto no GCP

### Na tela "Novo projeto":

1. **Nome do projeto**: Digite um nome (ex: `suggestions-reviewer` ou `hammertech-reviewer`)
   - O GCP vai gerar um ID único automaticamente
   
2. **Organização**: Deixe como está (ou selecione se tiver)

3. **Localização**: Deixe como está

4. Clique em **"CRIAR"** ou **"CREATE"**

5. Aguarde alguns segundos até o projeto ser criado

---

## Parte 2: Escolher o Método de Deploy

Você tem 2 opções principais:

### ⚡ Opção A: App Engine (Mais Simples - Recomendado)

**Vantagens:**
- Mais fácil de configurar
- Gerenciado automaticamente pelo GCP
- Escala automaticamente

**Passos:**

1. No console do GCP, vá em **"App Engine"** no menu lateral
2. Selecione uma **região** (ex: `us-central`)
3. Clique em **"Criar aplicativo"**
4. Aguarde a inicialização

Depois, no terminal local:

```bash
# 1. Instalar Google Cloud SDK (se ainda não tiver)
# Baixe em: https://cloud.google.com/sdk/docs/install

# 2. Autenticar
gcloud auth login

# 3. Definir o projeto (substitua YOUR-PROJECT-ID pelo ID do seu projeto)
gcloud config set project YOUR-PROJECT-ID

# 4. Instalar dependências localmente
cd /Users/juniorsartori/Hammertech
npm install

# 5. Fazer o deploy
gcloud app deploy

# 6. Abrir no navegador
gcloud app browse
```

---

### 🐳 Opção B: Cloud Run (Container - Mais Flexível)

**Vantagens:**
- Mais controle
- Paga apenas pelo uso
- Pode usar Docker

**Passos:**

1. No console do GCP, vá em **"Cloud Run"** no menu lateral
2. Clique em **"Criar serviço"**

No terminal local:

```bash
# 1. Autenticar
gcloud auth login

# 2. Definir o projeto
gcloud config set project YOUR-PROJECT-ID

# 3. Habilitar APIs necessárias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# 4. Fazer build e deploy
gcloud builds submit --tag gcr.io/YOUR-PROJECT-ID/suggestions-reviewer

gcloud run deploy suggestions-reviewer \
  --image gcr.io/YOUR-PROJECT-ID/suggestions-reviewer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 7007
```

---

## Parte 3: Configurações Importantes

### Variáveis de Ambiente (se necessário)

Se precisar configurar a porta:

```bash
# App Engine - edite app.yaml
# Cloud Run - adicione no comando:
--set-env-vars PORT=7007
```

### Verificar se está funcionando

Depois do deploy, acesse:
- **App Engine**: `https://YOUR-PROJECT-ID.appspot.com`
- **Cloud Run**: URL será mostrada no console

---

## ⚠️ Importante

1. **Billing**: Certifique-se de ter billing habilitado no GCP
2. **APIs**: O GCP pode pedir para habilitar algumas APIs (faça isso quando solicitado)
3. **Primeiro deploy**: Pode demorar alguns minutos

---

## 🆘 Problemas Comuns

### "Billing not enabled"
- Vá em **Billing** no menu e adicione um método de pagamento

### "API not enabled"
- Clique no link que aparece e habilite a API solicitada

### "Permission denied"
- Verifique se está autenticado: `gcloud auth list`

---

## 📝 Checklist Antes do Deploy

- [ ] Projeto criado no GCP
- [ ] Google Cloud SDK instalado localmente
- [ ] Autenticado: `gcloud auth login`
- [ ] Projeto configurado: `gcloud config set project YOUR-PROJECT-ID`
- [ ] Dependências instaladas: `npm install`
- [ ] Arquivo `app.yaml` existe (para App Engine)

---

## 🎯 Recomendação

Para começar rápido, use **App Engine**:
1. Crie o projeto
2. Vá em App Engine e crie o aplicativo
3. Execute `gcloud app deploy` no terminal

É o método mais simples! 🚀
