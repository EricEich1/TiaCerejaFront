#!/bin/bash
# Script de Deploy para EC2 via SCP
# Uso: ./deploy-ec2.sh CAMINHO_DA_CHAVE

if [ -z "$1" ]; then
  echo "❌ Erro: Caminho da chave SSH não fornecido"
  echo "Uso: ./deploy-ec2.sh /caminho/para/sua-chave.pem"
  echo "Exemplo: ./deploy-ec2.sh ~/.ssh/minha-chave.pem"
  exit 1
fi

KEY_PATH=$1
EC2_IP="18.231.120.168"
EC2_USER="ubuntu"  # Ajuste se for ec2-user
REMOTE_PATH="/var/www/tia-cereja"

echo "🚀 Fazendo deploy para EC2: $EC2_IP"
echo ""

# 1. Verificar se o build existe
if [ ! -d "dist/festa-frontend/browser" ]; then
  echo "❌ Build não encontrado. Execute 'npm run build' primeiro."
  exit 1
fi

# 2. Verificar se a chave existe
if [ ! -f "$KEY_PATH" ]; then
  echo "❌ Chave SSH não encontrada em: $KEY_PATH"
  exit 1
fi

# 3. Criar diretório temporário no servidor
echo "📁 Preparando servidor..."
ssh -i "$KEY_PATH" "$EC2_USER@$EC2_IP" "mkdir -p /tmp/frontend-deploy"

if [ $? -ne 0 ]; then
  echo "❌ Erro ao conectar no servidor. Verifique se:"
  echo "  - A chave SSH está correta"
  echo "  - O IP está correto"
  echo "  - O Security Group permite SSH (porta 22)"
  exit 1
fi

# 4. Enviar arquivos
echo "📤 Enviando arquivos para o servidor..."
scp -i "$KEY_PATH" -r dist/festa-frontend/browser/* "$EC2_USER@$EC2_IP:/tmp/frontend-deploy/"

if [ $? -ne 0 ]; then
  echo "❌ Erro ao enviar arquivos."
  exit 1
fi

# 5. Mover arquivos para o diretório final
echo "📦 Instalando arquivos no servidor..."
ssh -i "$KEY_PATH" "$EC2_USER@$EC2_IP" << 'EOF'
  sudo rm -rf /var/www/tia-cereja/*
  sudo mv /tmp/frontend-deploy/* /var/www/tia-cereja/
  sudo chown -R www-data:www-data /var/www/tia-cereja
  sudo nginx -t && sudo systemctl reload nginx
EOF

if [ $? -ne 0 ]; then
  echo "⚠️  Arquivos enviados, mas houve problemas ao configurar o Nginx."
  echo "   Você pode precisar configurar o Nginx manualmente."
else
  echo "✅ Deploy concluído com sucesso!"
fi

echo ""
echo "🌐 Acesse: http://$EC2_IP"
echo ""
echo "📝 Lembre-se de configurar CORS no backend para aceitar este IP!"
