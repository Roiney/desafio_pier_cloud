FROM node:18-bullseye

# Instalar o nc
RUN apt-get update && apt-get install -y netcat

# Install pnpm with corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configure o diretório de trabalho dentro do container
WORKDIR /app-job

# Copiar os arquivos necessários
COPY package.json pnpm-lock.yaml ./

# Instalar TODAS as dependências (produção e desenvolvimento)
RUN pnpm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm run build

# Definir as variáveis de ambiente
ENV PORT=3001 \
    RABBITMQ_USERNAME=guest \
    RABBITMQ_PASSWORD=guest \
    RABBITMQ_HOST=rabbitmq \  
    RABBITMQ_PORT=5672 \
    RABBITMQ_MANAGEMENT_PORT=15672 \
    BROKER_CLIENT=default-broker-client \
    BROKER_QUEUE=default-broker-queue \
    BROKER_EVENT=default-broker-event

# Exponha a porta usada pela aplicação
EXPOSE 3001

# Start the server using the production build
CMD ["pnpm", "run", "start:dev"]
