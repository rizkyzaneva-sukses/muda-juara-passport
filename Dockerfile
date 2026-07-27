FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and generate prisma
COPY . .
RUN npx prisma generate

# Build
RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=base /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma files for db push at startup
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=base /app/node_modules/prisma ./node_modules/prisma
COPY --from=base /app/node_modules/@prisma/adapter-pg ./node_modules/@prisma/adapter-pg
COPY --from=base /app/node_modules/pg ./node_modules/pg
COPY --from=base /app/node_modules/pg-connection-string ./node_modules/pg-connection-string
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma.config.ts ./prisma.config.ts
COPY --from=base /app/node_modules/dotenv ./node_modules/dotenv

# Create entrypoint script (runs as root for db push, then drops to nextjs)
RUN printf '#!/bin/sh\\nset -e\\nnode node_modules/prisma/build/index.js db push --schema=prisma/schema.prisma --skip-generate 2>&1 || echo \\"DB push failed, continuing...\\"\\nexec node server.js\\n' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["sh", "/app/entrypoint.sh"]
