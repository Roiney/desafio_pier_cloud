# Use uma imagem base para Node.js
FROM node:18-alpine

# Configure o diretório de trabalho dentro do container
WORKDIR /app-job

# Copie os arquivos necessários para o container
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta usada pela aplicação
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
