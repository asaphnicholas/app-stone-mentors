#!/bin/bash

echo "=== Iniciando App Stone Mentors no Azure ==="

# Verificar se estamos em produção
if [ "$NODE_ENV" != "production" ]; then
    export NODE_ENV=production
fi

# Definir porta padrão se não estiver definida
if [ -z "$PORT" ]; then
    export PORT=8080
fi

echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Verificar se o build existe
if [ ! -d ".next" ]; then
    echo "Build não encontrado. Executando build..."
    npm run build
fi

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "Build concluído. Iniciando servidor..."
    npm run azure
else
    echo "Erro no build. Tentando instalar dependências e rebuild..."
    npm install
    npm run build
    if [ $? -eq 0 ]; then
        echo "Build bem-sucedido após reinstalação. Iniciando servidor..."
        npm run azure
    else
        echo "Falha crítica no build. Saindo..."
        exit 1
    fi
fi
