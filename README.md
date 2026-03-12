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
└── web-client/    # Frontend (Vue 3 + Vite)
```

## Desarrollo

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
npm run lint     # linter
```

## Como funciona

1. El cliente se conecta al servidor ingresando la URL del servidor WebSocket.
2. Crea o se une a un tablero con una contrasena.
3. Todas las acciones (agregar/editar/eliminar notas y grupos) se sincronizan en tiempo real con todos los participantes del tablero.
4. Al conectarse, el servidor envia el estado completo del tablero. Los tableros se eliminan de memoria cuando el ultimo cliente se desconecta.

## Tecnologias

- **Servidor**: [Bun](https://bun.sh), [Elysia](https://elysiajs.com)
- **Cliente**: [Vue 3](https://vuejs.org), [Vite](https://vitejs.dev), TypeScript
