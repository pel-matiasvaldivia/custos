# Stage 1: Builder
FROM node:20-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/contracts ./packages/contracts

RUN npm install --include=dev

# Sync Prisma Client and build
COPY packages/contracts ./packages/contracts
COPY apps/api ./apps/api
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build --workspace=api

# Stage 2: Runner
FROM node:20-slim

WORKDIR /app

# Install production dependencies and openssl
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy all package.json files to allow workspace resolution
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install --omit=dev --workspace=api --include-workspace-root && npm cache clean --force

COPY apps/api/prisma ./apps/api/prisma
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

COPY --from=builder /app/apps/api/dist ./apps/api/dist

COPY apps/api/entrypoint.sh ./apps/api/entrypoint.sh
RUN chmod +x ./apps/api/entrypoint.sh

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["./apps/api/entrypoint.sh"]
