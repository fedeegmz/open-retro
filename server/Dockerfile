# Build context: monorepo root
FROM oven/bun:1

WORKDIR /app

# Copy dependency manifests
COPY server/package.json server/bun.lock server/tsconfig.json ./server/

RUN cd server && bun install --frozen-lockfile

# Copy source code
COPY server/src ./server/src
COPY shared ./shared

WORKDIR /app/server

ENV PORT=3001
ENV ENVIRONMENT=develop

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then bun src/server.ts; else bun --watch src/server.ts; fi"]
