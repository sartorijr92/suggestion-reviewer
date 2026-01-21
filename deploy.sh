#!/bin/bash

# Script de deploy para GCP
# Execute: ./deploy.sh

echo "🚀 Deploy para Google Cloud Platform"
echo ""

# Verificar se gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK não está instalado!"
    echo ""
    echo "Instale com:"
    echo "  macOS: brew install google-cloud-sdk"
    echo "  Ou baixe: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar se está autenticado
echo "📋 Verificando autenticação..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Fazendo login..."
    gcloud auth login
fi

# Definir projeto
PROJECT_ID="suggestion-reviewer"
echo "📁 Configurando projeto: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Verificar se App Engine está habilitado
echo "🔍 Verificando APIs..."
gcloud services enable appengine.googleapis.com 2>/dev/null || true

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer deploy
echo ""
echo "🚀 Iniciando deploy..."
echo "   Isso pode demorar alguns minutos na primeira vez..."
echo ""
gcloud app deploy

# Abrir no navegador
echo ""
echo "✅ Deploy concluído!"
echo "🌐 Abrindo no navegador..."
gcloud app browse
