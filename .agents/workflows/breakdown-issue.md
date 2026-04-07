---
description: Desglosar un issue de GitHub en un nuevo issue con descripción y criterios de aceptación en español.
---

Este workflow automatiza la creación de un issue de refinamiento o desglose basado en un issue técnico existente.

1. **Identificar el Issue**: Solicita al usuario el número del issue de GitHub que se desea desglosar.
2. **Consultar Detalles**: Utiliza el comando `mcp_github-mcp-server_issue_read` para obtener el título y la descripción del issue original en el repositorio `fedeegmz/open-retro`.
3. **Generar Contenido**: 
   - Analiza la información obtenida y el contexto del repositorio.
   - Redacta una nueva **Descripción** detallada en español.
   - Define **Criterios de Aceptación** claros y específicos en español.
   - Realiza un **Análisis Técnico**:
     - **Implicancias y Consideraciones**: Riesgos, seguridad o efectos secundarios.
     - **Archivos/Módulos Afectados**: Sugiere los archivos o áreas del código que probablemente necesiten cambios (basado en una búsqueda rápida si es necesario).
     - **Sugerencia de Implementación**: Un breve resumen del enfoque técnico recomendado.
   - Define **Etiquetas (Labels)** adecuadas para el issue.
   - Incluye una referencia explícita al issue original (ej: "Relacionado con #123").
4. **Crear Issue**: Utiliza `mcp_github-mcp-server_issue_write` con el método `create` para publicar el nuevo issue incluyendo todas estas secciones, estructuradas para ser útiles a un desarrollador.



> [!NOTE]
> Asegúrate de que el tono sea profesional y técnico, orientado a facilitar la implementación para un desarrollador.
