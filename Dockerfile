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
# Akademi launch switch: off by default; Coolify sets ALUPLAN_SHOW_AKADEMI=1 to publish.
# Needed at build time: Akademi pages, share images, sitemap and llms.txt are prerendered.
ARG ALUPLAN_SHOW_AKADEMI=0
ARG NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN
ENV ALUPLAN_SHOW_2027=$ALUPLAN_SHOW_2027 \
    ALUPLAN_BLOCK_INDEXING=$ALUPLAN_BLOCK_INDEXING \
    ALUPLAN_SHOW_AKADEMI=$ALUPLAN_SHOW_AKADEMI \
    NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=$NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ARG ALUPLAN_SHOW_2027=1
ARG ALUPLAN_BLOCK_INDEXING=1
ARG ALUPLAN_SHOW_AKADEMI=0
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    ALUPLAN_SHOW_2027=$ALUPLAN_SHOW_2027 \
    ALUPLAN_BLOCK_INDEXING=$ALUPLAN_BLOCK_INDEXING \
    ALUPLAN_SHOW_AKADEMI=$ALUPLAN_SHOW_AKADEMI \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
