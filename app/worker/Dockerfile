# Usar uma imagem base para Node.js
FROM node:18-bullseye

# Instalar o nc
RUN apt-get update && apt-get install -y netcat

# Install pnpm with corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configurar o diretório de trabalho
WORKDIR /app-worker

# Copiar os arquivos necessários
COPY package.json pnpm-lock.yaml ./
COPY prisma ./

# Instalar TODAS as dependências (produção e desenvolvimento)
RUN pnpm install

# Gerar o cliente Prisma (necessário para produção)
RUN pnpm prisma generate

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm run build

# Definir as variáveis de ambiente
ENV PORT=3000 \
    PG_HOST_STORE=db \  
    PG_USER_STORE=postgres \
    PG_PASSWORD_STORE=postgres \
    PG_DATABASE_STORE=pier-Cloud \
    PG_PORT_STORE=5432 \  
    DATABASE_URL=postgresql://postgres:postgres@db:5432/pier-Cloud \  
    RABBITMQ_USERNAME=guest \
    RABBITMQ_PASSWORD=guest \
    RABBITMQ_HOST=rabbitmq \  
    RABBITMQ_PORT=5672 \
    RABBITMQ_MANAGEMENT_PORT=15672 \
    BROKER_CLIENT=default-broker-client \
    BROKER_QUEUE=default-broker-queue \
    BROKER_EVENT=default-broker-event


# Exponha a porta usada pela aplicação
EXPOSE 3000

# Start the server using the production build
CMD ["pnpm", "run", "start:dev"]
