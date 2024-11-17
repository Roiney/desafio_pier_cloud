# Usar uma imagem base para Node.js
FROM node:18-alpine AS dependencies

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Configurar o diretório de trabalho
WORKDIR /app-worker

# Copiar os arquivos necessários
COPY package.json pnpm-lock.yaml ./

# Instalar TODAS as dependências (produção e desenvolvimento)
RUN pnpm install

# Gerar o cliente Prisma (necessário para produção)
RUN pnpm prisma generate

# Remover dependências de desenvolvimento após o build
RUN pnpm prune --prod

# Copiar o restante dos arquivos
COPY . .

# Expor a porta usada pela aplicação
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["pnpm", "run", "start:dev"]
