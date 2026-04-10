---
description: Crear un Pull Request detallado en GitHub desde la rama actual (vía /create-pr).
---

Este workflow automatiza la creación de un Pull Request (PR) en GitHub, generando una descripción profesional y detallada en inglés basada en los commits realizados.

1. **Obtener Información del Repositorio**:
   - Identifica la rama actual (`git branch --show-current`).
   - Identifica el propietario y nombre del repositorio desde el remote origin.
   - Pide al usuario la rama de destino (ej: `main`, `develop`) si no fue especificada.

2. **Analizar Diferencias**:
   - Compara la rama actual con la de destino para extraer los commits realizados.
   - Analiza los archivos modificados para entender el impacto del cambio.

3. **Generar Contenido del PR**:
   - **Título**: Un resumen conciso siguiendo el formato de Conventional Commits.
   - **Descripción**: Redacta una descripción detallada en **inglés** que incluya:
     - **Overview**: Propósito general del PR.
     - **Key Changes**: Lista detallada de las modificaciones técnicas.
     - **Impact**: Áreas afectadas y mejoras introducidas.

4. **Ejecutar Creación**:
   - Utiliza las herramientas de GitHub para crear el PR de forma remota.
   - Presenta al usuario el enlace al PR creado.

> [!TIP]
> Para usarlo, simplemente escribe `/create-pr <rama_destino>` en el chat de Antigravity.
