# Introducción

OpenRetro es una herramienta colaborativa de retrospectivas en tiempo real. Este sitio contiene la documentación técnica del proyecto.

## Estructura del monorepo

```
open-retro/
├── server/       # Servidor WebSocket (Bun + Elysia)
├── web-client/   # Frontend (Vue 3 + Vite)
├── shared/       # Tipos TypeScript compartidos
└── docs/         # Este sitio (VitePress)
```

## Primeros pasos

### Servidor

```bash
cd server
bun run dev
```

### Cliente

```bash
cd web-client
npm run dev
```
