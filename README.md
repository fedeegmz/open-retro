# open-retro

Herramienta de retrospectiva colaborativa en tiempo real. Permite a equipos crear tableros compartidos donde agregar notas y agruparlas durante sesiones de retrospectiva.

## Caracteristicas

- Tableros en tiempo real sincronizados via WebSocket
- Creacion y union a tableros con contrasena
- Agregar, editar y eliminar notas
- Agrupar notas en categorias
- Reconexion automatica ante desconexiones

## Estructura del proyecto

```
open-retro/
├── server/        # Servidor WebSocket (Bun + Elysia)
├── shared/        # Tipos compartidos
└── web-client/    # Frontend (Vue 3 + Vite)
```

## Desarrollo

### Configuracion inicial

Desde la raiz del proyecto, instalar dependencias e instalar los git hooks:

```bash
npm install
```

El script `prepare` se ejecuta automaticamente e instala el pre-commit hook via `simple-git-hooks`.

### Servidor

```bash
cd server
bun run dev    # con hot reload
bun run start  # sin watch
```

### Cliente web

```bash
cd web-client
npm run dev      # servidor de desarrollo
npm run build    # build de produccion
npm run lint     # linter (oxlint + eslint)
```

### Calidad de codigo

Los scripts de formato y linting se ejecutan desde la raiz y cubren todos los packages:

```bash
npm run format       # formatea server/, shared/ y web-client/src/
npm run lint         # oxlint sobre todos los packages
npm run lint:eslint  # eslint (Vue/TS) sobre web-client/
```

El pre-commit hook corre automaticamente sobre los archivos staged en cada commit:

1. `oxfmt` — formatea el archivo
2. `oxlint --fix` — corrige errores de linting
3. `eslint --fix` — corrige reglas Vue/TS (solo archivos en `web-client/src/`)

## Como funciona

1. El cliente se conecta al servidor ingresando la URL del servidor WebSocket.
2. Crea o se une a un tablero con una contrasena.
3. Todas las acciones (agregar/editar/eliminar notas y grupos) se sincronizan en tiempo real con todos los participantes del tablero.
4. Al conectarse, el servidor envia el estado completo del tablero. Los tableros se eliminan de memoria cuando el ultimo cliente se desconecta.

## Tecnologias

- **Servidor**: [Bun](https://bun.sh), [Elysia](https://elysiajs.com)
- **Cliente**: [Vue 3](https://vuejs.org), [Vite](https://vitejs.dev), TypeScript
