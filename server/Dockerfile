# Build context: monorepo root
FROM oven/bun:1

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock ./
COPY server/package.json server/tsconfig.json ./server/
COPY shared/package.json ./shared/
COPY web-client/package.json ./web-client/

RUN bun install --frozen-lockfile

# Copy source code
COPY server/src ./server/src
COPY shared ./shared

WORKDIR /app/server

ENV PORT=3001
ENV ENVIRONMENT=develop

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then bun src/bin.ts; else bun --watch src/bin.ts; fi"]
