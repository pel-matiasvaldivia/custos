# Stage 1: Builder
FROM node:20-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/contracts ./packages/contracts

RUN npm install --include=dev

# Sync Prisma Client
COPY apps/api/prisma ./apps/api/prisma
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

COPY apps/api ./apps/api
RUN cd apps/api && npm run build

# Stage 2: Runner
FROM node:20-slim

WORKDIR /app

# Install production dependencies and openssl
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install --omit=dev && npm cache clean --force
COPY apps/api/prisma ./apps/api/prisma
RUN cd apps/api && npx prisma generate

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "apps/api/dist/src/main.js"]
