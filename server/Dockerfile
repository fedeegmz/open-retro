# Build context: monorepo root
FROM oven/bun:1

WORKDIR /app

# Copy dependency manifests and tsconfig (needed for @shared/* path alias resolution)
COPY server/package.json server/bun.lock server/tsconfig.json ./server/

RUN cd server && bun install --frozen-lockfile

WORKDIR /app/server

ENV PORT=3001
ENV ENVIRONMENT=develop

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then bun src/server.ts; else bun --watch src/server.ts; fi"]
