# Build context: monorepo root
FROM node:22-alpine

WORKDIR /app

# Copy only dependency manifests to cache the install layer
COPY package.json package-lock.json ./
COPY web-client/package.json ./web-client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN npm install

# Copy source code
COPY web-client/src ./web-client/src
COPY web-client/public ./web-client/public
COPY web-client/index.html ./web-client/
COPY shared ./shared

WORKDIR /app/web-client

ENV ENVIRONMENT=develop

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then npm run build && npm run preview; else npm run dev; fi"]
