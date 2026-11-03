FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
RUN apk add --no-cache python3
ARG ALUPLAN_SHOW_2027=1
ARG ALUPLAN_BLOCK_INDEXING=1
ENV ALUPLAN_SHOW_2027=$ALUPLAN_SHOW_2027 \
    ALUPLAN_BLOCK_INDEXING=$ALUPLAN_BLOCK_INDEXING
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ARG ALUPLAN_SHOW_2027=1
ARG ALUPLAN_BLOCK_INDEXING=1
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    ALUPLAN_SHOW_2027=$ALUPLAN_SHOW_2027 \
    ALUPLAN_BLOCK_INDEXING=$ALUPLAN_BLOCK_INDEXING \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
