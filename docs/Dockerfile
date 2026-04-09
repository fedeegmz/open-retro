# Build context: monorepo root
FROM node:22-alpine

WORKDIR /app

# Copy only dependency manifests to cache the install layer
COPY docs/package.json ./docs/
# docs/package-lock.json might not exist if it's a monorepo and everything is at the root, 
# but let's check if it exists in docs first.
# Wait, let me check docs/ directory content again to be sure about package-lock.

RUN cd docs && npm install

# Copy source code
COPY docs ./docs
COPY shared ./shared

WORKDIR /app/docs

ENV ENVIRONMENT=develop

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then npm run build && npm run preview; else npm run dev -- --host; fi"]
