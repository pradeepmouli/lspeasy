# Multi-stage Dockerfile for TypeScript monorepo

# Stage 1: Base image with pnpm
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/utils/package.json ./packages/utils/
RUN pnpm install --frozen-lockfile

# Stage 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/utils/node_modules ./packages/utils/node_modules
COPY . .
RUN pnpm run build

# Stage 4: Production dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/utils/package.json ./packages/utils/
RUN pnpm install --frozen-lockfile --prod

# Stage 5: Production runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy built assets
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist

# Copy package.json files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/utils/package.json ./packages/utils/

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Set non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Default command
CMD ["node", "--version"]
