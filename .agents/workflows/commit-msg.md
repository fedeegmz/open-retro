---
description: Generar un mensaje de commit en inglés basado en los cambios actuales (vía /commit-msg).
---

Este workflow automatiza la creación de un mensaje de commit profesional y conciso en inglés basado en tus cambios locales.

1. **Analizar Cambios**: Ejecuta `git diff --staged` para analizar los archivos que están en el área de preparación (stage). Si no hay cambios preparados, revisa `git diff` para informar al usuario.
2. **Generar Mensaje**: 
   - Analiza la naturaleza de los cambios (backend, frontend, estilos, tests, etc.).
   - Crea un mensaje de **una sola línea en inglés** de máximo 50-60 caracteres.
   - Sigue el formato de **Conventional Commits** (ej: `feat:`, `fix:`, `refactor:`, `chore:`, `style:`, `docs:`, `test:`).
3. **Sugerir Comando**: Presenta al usuario el comando exacto `git commit -m "..."` para su aprobación o ejecución.

> [!TIP]
> Para usarlo, simplemente escribe `/commit-msg` en el chat de Antigravity.
