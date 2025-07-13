#!/bin/bash

# Script para iniciar a aplicação QuantumOS

# Gerar certificados SSL se não existirem
if [ ! -f ./nginx/ssl/cert.pem ] || [ ! -f ./nginx/ssl/key.pem ]; then
    echo "Gerando certificados SSL..."
    cd nginx && ./generate-ssl.sh && cd ..
fi

# Iniciar os contêineres
echo "Iniciando a aplicação QuantumOS..."
docker-compose up -d

# Verificar se os contêineres estão rodando
echo "Verificando status dos contêineres..."
docker-compose ps

echo ""
echo "QuantumOS está rodando!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/api/docs"
echo "Para acessar com HTTPS, adicione a entrada 'aigronovatech.com.br' ao seu arquivo /etc/hosts"
echo "Então acesse: https://aigronovatech.com.br"