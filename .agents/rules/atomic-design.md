---
trigger: glob
description: Reglas y contexto para aplicar la filosofía de Atomic Design en el desarrollo de componentes UI del web-client.
globs: web-client/
---

# Atomic Design Guidelines

Este documento establece las reglas y la filosofía de **Atomic Design** que el agente de IA (y desarrolladores) debe seguir estrictamente al implementar, modificar o refactorizar cualquier componente de la interfaz de usuario en `web-client/src/components` y `web-client/src/views`.

El objetivo de esta arquitectura es tener componentes altamente reutilizables, modulares y predecibles, limitando la responsabilidad de cada capa y mejorando la mantenibilidad.

## Conceptos Core

Atomic Design clasifica los componentes en 5 niveles:

1. **Átomos (Atoms)**:
   - Son los bloques de construcción más básicos de la UI.
   - Ejemplos: Botones (`Button.vue`), Inputs (`Input.vue`), Iconos (`Icon.vue`), Etiquetas de texto (`Typography.vue`), Avatares (`Avatar.vue`).
   - Reglas: No tienen estado global. Reciben datos solo por `props` y emiten `events`. Son componentes "tontos" (dumb components) que pueden ser reutilizados en cualquier contexto. Generalmente no importan otros componentes.

2. **Moléculas (Molecules)**:
   - Agrupaciones simples de dos o más átomos que funcionan juntos como una unidad.
   - Ejemplos: Campo de formulario con su etiqueta (`LabeledInput.vue`), un elemento de lista de usuario (`UserListItem.vue`), un botón con un ícono (`IconButton.vue`).
   - Reglas: Construidos casi exclusivamente usando átomos. Pueden recibir estados a través de `props` y emitir `events`, pero siguen enfocados en una tarea de UI y comportamiento simple sin lógica de estado global pesada.

3. **Organismos (Organisms)**:
   - Secciones complejas de la interfaz compuestas por grupos de moléculas y/o átomos (o incluso otros organismos simples).
   - Ejemplos: Barra de navegación superior (`AppHeader.vue`), barra lateral de usuarios (`UsersSidebar.vue`), barra de herramientas flotante (`ToolBar.vue`), modales complejos (`SettingsModal.vue`).
   - Reglas: Pueden tener su propio estado local complejo o conectarse (si es estrictamente necesario o facilita el diseño) con stores globales (`pinia`), _composables_ y llamadas a servicios. Forman las secciones o "bloques lógicos" principales de la pantalla.

4. **Plantillas (Templates)**:
   - Combinan organismos subyacentes para articular el diseño y la estructura "esqueleto" de las páginas, pero **sin inyectar datos reales**.
   - Ejemplos: Layout principal (`MainLayout.vue`), estructura del tablero (`BoardLayout.vue`).
   - Reglas: Se dedican al posicionamiento CSS espacial (Grid, Flexbox de gran escala). Proveen los "slots" donde las páginas insertarán el contenido real (los datos).

5. **Páginas (Pages - ubicadas en `views/`)**:
   - Son las instancias finales e integradas de las Plantillas.
   - Ejemplos: La vista de iniciar tablero (`BoardSetup.vue`), el tablero interactivo final (`BoardView.vue`).
   - Reglas: Son los componentes de enrutamiento (los que mapea Vue Router). Su rol es orquestar la lógica de negocio profunda ("smart components"): cargar los datos, instanciar stores, manejar el ciclo de vida complejo de vistas y pasarlos como `props` hacia abajo por la plantilla u organismos.

## Reglas de Implementación en el Agente de IA

1. **Ubicación en el Entorno**:
   El directorio raíz `web-client/src/components` DEBE usarse dividiendo estrictamente en los carpetas de la metodología:

   ```
   web-client/src/
      components/
         atoms/
         molecules/
         organisms/
         templates/
      views/
   ```

2. **Sin Cambios Visuales (Si es refactor)**:
   Al refactorizar componentes hacia esta metodología, el objetivo principal es re-escribir y reorganizar, y en ningún caso modificar la apariencia actual (los estilos y el mark-up final renderizado debe permanecer visualmente idéntico a las reglas css previas).

3. **Flujo de Datos Unidireccional (Vue prop/emit)**:
   A medida que bajas en el árbol genealógico (`Pages` -> `Templates` -> `Organisms` -> `Molecules` -> `Atoms`), las dependencias de estado global deben desaparecer. Es decir, los átomos y moléculas preferiblemente NUNCA interactuarán con stores (`composables/`, Vuex/Pinia, etc.).

4. **Nombramiento (Naming Convention)**:
   Utilizar PascalCase para el nombre de archivos y componentes. Preferir nombres autodescriptivos e independientes del contexto visual, por ejemplo, `PrimaryButton.vue` o `BaseInput.vue`, en vez de `LoginButton.vue`.

Sigue estas directivas por defecto para todas las propuestas y modificaciones de interfaces visuales dentro de `web-client`.
