FROM node:22-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para o build)
RUN npm ci

# Copiar código fonte
COPY . .

# Variáveis de ambiente para build
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build de produção
ENV NODE_ENV=production
RUN npm run build

# Remover devDependencies (opcional, economiza espaço)
RUN npm prune --production

EXPOSE 9081

ENV PORT=9081

# Usar npm start (que roda 'next start')
CMD ["npm", "start"]