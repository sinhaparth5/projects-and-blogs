FROM node:24-alpine AS build

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=production_env_b64,required=false \
    if [ -f /run/secrets/production_env_b64 ]; then \
      base64 -d /run/secrets/production_env_b64 > /app/.env.production; \
    fi; \
    DOTENV_CONFIG_PATH=/app/.env.production pnpm exec prisma generate && \
    pnpm build; \
    rm -f /app/.env.production

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["node", "server.js"]
