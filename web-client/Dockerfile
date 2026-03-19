# Build context: monorepo root
FROM node:22-alpine

WORKDIR /app

# Copy only dependency manifests to cache the install layer
COPY web-client/package.json web-client/package-lock.json ./web-client/
COPY web-client/tsconfig.json web-client/tsconfig.app.json web-client/tsconfig.node.json ./web-client/

RUN cd web-client && npm ci

WORKDIR /app/web-client

ENV ENVIRONMENT=develop

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then npm run build && npm run preview; else npm run dev; fi"]
