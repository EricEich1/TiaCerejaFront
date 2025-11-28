#!/bin/bash
echo "Testando conectividade com Backend..."

# Teste 1: Endpoint esperado pelo usuário
echo "\n--- Teste 1: /api/auth/login ---"
curl -v -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin@festas.com","senha":"admin123"}'

# Teste 2: Endpoint alternativo (sem /api)
echo "\n\n--- Teste 2: /auth/login ---"
curl -v -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin@festas.com","senha":"admin123"}'

# Teste 3: Endpoint alternativo (raiz)
echo "\n\n--- Teste 3: /login ---"
curl -v -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin@festas.com","senha":"admin123"}'
