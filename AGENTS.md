# Reglas del Repositorio

Aplica estas reglas de forma estricta en cualquier generación, refactorización o revisión de código.

## 1. Lenguaje (100% JavaScript)

- **Prohibido TypeScript:** No usar `<script setup lang="ts">`, archivos `.ts`, interfaces, `type`, anotaciones (`: string`), genéricos
  (`defineProps<...>()`), ni `as`.
- **Permitido:** Declaración de props y modelos nativos de Vue en JS (`defineProps`, `defineModel` con `type`, `required` y `default`), ya
  que definen el contrato del componente y no son TypeScript ni validación de negocio.

## 2. Fechas y Tiempo (Exclusivo Luxon)

- **Prohibido:** `new Date()`, `Date.now()`, `Date.parse()` y concatenación manual de strings de fecha (ej. `${fecha}T00:00:00`).
- **Obligatorio:** Usar `DateTime`, `Duration` o `Interval` de `luxon` (ej. `DateTime.fromISO(...)`).
- Si una librería externa o API exige un `Date` nativo o string ISO, ejecuta toda la lógica en Luxon y convierte únicamente en el punto de
  salida (`.toJSDate()` / `.toISO()`).

## 3. Iconografía

- **Prohibido:** Diccionarios manuales de trazos SVG o renderizar iconos con `v-html`.
- **Obligatorio:** Usar exclusivamente `<Icon>` de `@iconify/vue` con el set `ion:<nombre>-outline` y declarar siempre `:width` y `:height`.

## 4. Validación y Código Muerto

- **Prohibido en `.vue` (`views/` y `components/`):** Importar `zod` o definir esquemas de validación inline. Toda regla debe importarse
  desde `logic/validaciones.js`.
- **Cero código muerto:** No incluir funciones utilitarias ni esquemas "preparatorios" que no tengan al menos un consumidor activo en la
  rama actual.

## 5. Externalización de Constantes y Copy

- `<script setup>` debe contener únicamente estado reactivo, ciclo de vida y manejadores de eventos de UI.
- Extraer catálogos estáticos, textos extensos (legales/onboarding), tiempos de configuración y metadatos compartidos a archivos dedicados
  (`Const.js` / `*Constants.js`).

## 6. Estructura y Orden de `<script setup>`

- Todo bloque `<script setup>` debe seguir estrictamente este orden de arriba hacia abajo:
  1. `import` (librerías, componentes, lógica y constantes).
  2. Contrato del componente (`defineProps`, `defineModel`, `defineEmits`, `defineExpose`) — **prohibido** declararlos en medio de la
     lógica.
  3. Estado reactivo (`ref`, `reactive`) y stores.
  4. Propiedades computadas y observadores (`computed`, `watch`).
  5. Funciones y manejadores de eventos.
  6. Ciclo de vida (`onMounted`, `onBeforeUnmount`, etc.).

## 7. Scroll Spy y Smooth Scroll

- Al combinar navegación por anclas (`scrollTo({ behavior: 'smooth' })`) con detección de sección activa (`@scroll`):
  1. Seleccionar de inmediato el ítem clicado.
  2. Bloquear la recalculación automática durante la transición.
  3. Liberar el bloqueo ante entrada manual (`wheel`, `touchmove`).
  4. Limpiar cualquier temporizador en `onBeforeUnmount`.

## 8. UX Writing y Tono de Marca

- No insertar textos genéricos (títulos, estados vacíos, placeholders o errores de validación) sin ajustarlos al tono de comunicación y al
  dominio corporativo vigente en la aplicación.

## 9. Formato y Longitud de Línea

- **Prohibido:** Compactar en una sola línea objetos con múltiples propiedades o etiquetas Vue con más de 3–4 atributos si superan el ancho
  de lectura estándar.
- Todo código debe respetar el formateador del proyecto para mantener diffs atómicos y legibles en los PR.

## 10. Calidad y Seguridad (SonarQube)

- **Complejidad Cognitiva:** Mantener la complejidad cognitiva de cada función por debajo de 15. Usar _early returns_ (retornos tempranos) y
  extraer subfunciones en lugar de anidar `if/else` o bucles.
- **Sin duplicación:** Extraer lógica repetida en utilidades o composables reutilizables; evitar bloques duplicados.
- **Código limpio:** Sin variables, parámetros o `import` sin usar; sin `console.log` ni código comentado; usar siempre igualdad estricta
  (`===` / `!==`) y `const`/`let` (nunca `var`).
- **Expresiones legibles:** Prohibido anidar operadores ternarios (`a ? b : c ? d : e`) y funciones con demasiados parámetros (agrupar en un
  objeto si superan 4).
- **Manejo de errores y promesas:** No dejar bloques `catch` vacíos ni promesas sin manejar (`await` o `.catch()`); no usar `return await`
  redundante fuera de `try/catch`.
- **Seguridad (Hotspots):** Prohibido `eval()`, `innerHTML`, `v-html` con datos dinámicos, secretos/tokens hardcodeados y expresiones
  regulares vulnerables a ReDoS.
