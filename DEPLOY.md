# Deploy: Railway (server) + Vercel (web-client)

## Stack

- **Server**: Railway — soporta Bun nativo, WebSockets persistentes, variables de entorno en dashboard
- **Web Client**: Vercel — cero config para Vite/Vue, CDN global, variables de entorno en dashboard
- **CI**: GitHub Actions — lint + type-check en cada push/PR

Ambas plataformas tienen integración nativa con GitHub y auto-despliegan en cada push a `main`.

---

## Cambios necesarios en el código

### 1. Puerto dinámico en el servidor (`server/src/server.ts:33`)

Railway inyecta la variable `PORT`. Cambiar:

```diff
- .listen(3001)
+ .listen(parseInt(process.env.PORT || '3001'))
```

### 2. SPA routing para Vercel (`web-client/vercel.json`)

Vue Router en modo history necesita redirigir todas las rutas a `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 3. GitHub Actions CI (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  server:
    name: Server – type-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - name: Install deps
        working-directory: server
        run: bun install
      - name: Type-check
        working-directory: server
        run: bun tsc --noEmit

  web-client:
    name: Web Client – lint + type-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: web-client/package-lock.json
      - name: Install deps
        working-directory: web-client
        run: npm ci
      - name: Lint
        working-directory: web-client
        run: npm run lint
      - name: Type-check
        working-directory: web-client
        run: npm run type-check
```

---

## Configuración en los dashboards (una sola vez)

### Railway (servidor)
1. Crear proyecto → "Deploy from GitHub repo" → seleccionar este repo
2. **Root directory**: `server`
3. **Start command**: `bun run start`
4. Railway detecta Bun automáticamente por `bun.lock`
5. Variables de entorno: Settings → Variables
6. Auto-deploy en push a `main` habilitado por defecto

### Vercel (web-client)
1. Importar proyecto desde GitHub
2. **Root directory**: `web-client`
3. **Framework preset**: Vite (detección automática)
4. Build command: `npm run build`
5. Output dir: `dist`
6. Variables de entorno: Settings → Environment Variables
7. Auto-deploy en push a `main` habilitado por defecto

---

## Verificación post-deploy

1. Push a `main` → GitHub Actions CI en verde
2. Railway despliega el servidor → verificar con `GET /ping` en la URL pública
3. Vercel despliega el web-client → abrir la URL y completar el flujo completo (crear board, conectar)
4. En la pantalla de ServerSetup del cliente, ingresar la URL pública de Railway
