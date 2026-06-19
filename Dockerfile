FROM node:20-alpine AS builder
WORKDIR /app

# Prevent glibc memory fragmentation (OOM Fix)
ENV MALLOC_ARENA_MAX=2
ENV PYTHONUNBUFFERED=1
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Prevent glibc memory fragmentation (OOM Fix)
ENV MALLOC_ARENA_MAX=2
ENV PYTHONUNBUFFERED=1
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# Add unprivileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
CMD ["npm", "start"]
