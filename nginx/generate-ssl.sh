#!/bin/bash

# Gerar certificados SSL auto-assinados para desenvolvimento
# Não use estes certificados em produção!

# Diretório para armazenar os certificados
SSL_DIR="./ssl"

# Criar diretório se não existir
mkdir -p $SSL_DIR

# Gerar chave privada
openssl genrsa -out $SSL_DIR/key.pem 2048

# Gerar certificado auto-assinado
openssl req -new -x509 -key $SSL_DIR/key.pem -out $SSL_DIR/cert.pem -days 365 -subj "/C=BR/ST=Sao Paulo/L=Sao Paulo/O=QuantumOS/OU=Development/CN=aigronovatech.com.br"

# Definir permissões
chmod 400 $SSL_DIR/key.pem
chmod 444 $SSL_DIR/cert.pem

echo "Certificados SSL gerados com sucesso em $SSL_DIR"
echo "AVISO: Estes certificados são apenas para desenvolvimento. Não use em produção!"