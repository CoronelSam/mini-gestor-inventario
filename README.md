# Mini Inventory Manager

Aplicación web hecha con **Vue 3 + Vite** para gestionar un inventario básico de productos:
registrar, listar, filtrar, editar y eliminar productos, y ver un resumen con el valor total del inventario.

## Cómo ejecutarla

Requisitos: Node.js 18+ y [pnpm](https://pnpm.io).

```bash
pnpm install
```

```bash
pnpm dev
```

Abre <http://localhost:5173>. Para generar la versión de producción:

```bash
pnpm build
```

> El inventario se guarda en el `localStorage` del navegador. La primera vez se cargan 8 productos de ejemplo (definidos en `src/constants.js`).
> Los precios se muestran en **lempiras hondureños** (`L 1,234.50`), con `Intl.NumberFormat('es-HN', { currency: 'HNL' })` en `src/utils.js`.

## Estructura

```
src/
├── App.vue                  # Estado principal, computed y métodos (CRUD)
├── main.js
├── constants.js             # Categorías y datos de ejemplo
├── utils.js                 # Formato de moneda (L, lempira), normalizar texto, ids
├── components/
│   ├── ProductForm.vue      # Formulario de registro / edición con validaciones
│   ├── ProductFilters.vue   # Búsqueda por nombre + filtro por categoría
│   ├── ProductTable.vue     # Tabla con subtotal, Editar y Eliminar
│   ├── CategoryBadge.vue    # Etiqueta de color por categoría
│   ├── SummaryPanel.vue     # Panel de resumen
│   └── SummaryCard.vue      # Tarjeta reutilizable del resumen
└── styles/
    ├── tokens.css           # Design tokens (colores, tipografía, espaciado…)
    └── base.css             # Estilos base y componentes compartidos
```

## Conceptos de Vue aplicados

| Concepto | Dónde |
|---|---|
| **Componentes** | 6 componentes en `src/components`; `SummaryCard` se reutiliza 3 veces |
| **Props** | `ProductTable` recibe `products`, `totalCount`, `editingId`; `ProductForm` recibe `categories` y `product`; `SummaryCard` recibe `label`, `value`, `hint`… |
| **Emits** | `ProductForm` emite `save` y `cancel`; `ProductTable` emite `edit` y `delete`; `ProductFilters` emite `update:search` y `update:category` |
| **`v-model`** | Campos del formulario (`v-model`, `v-model.number`) y filtros (`v-model:search`, `v-model:category` sobre un componente) |
| **`v-for`** | Filas de la tabla, opciones del `<select>`, chips de categoría |
| **`v-if` / `v-else`** | Mensajes de error, estado vacío de la tabla, confirmación de eliminar, botón Cancelar en modo edición |
| **Computed** | `filteredProducts` (filtro en tiempo real), `totalValue`, `totalProducts`, `topProduct`, `errors`, `isValid`, `subtotal` |
| **Métodos** | `addProduct`, `updateProduct`, `deleteProduct`, `startEdit`, `cancelEdit`, `handleSubmit` |
| **Estado reactivo** | `ref` en `App.vue` (productos, filtros, edición) y `reactive` en el formulario; `watch` guarda en `localStorage` |
| **Slots** | `ProductTable` muestra los filtros que el padre le pasa en su `<slot />`; `SummaryCard` recibe su ícono en el slot `#icon` |

## Validaciones

- Todos los campos son obligatorios.
- Precio y cantidad deben ser mayores a 0 (la cantidad además debe ser un número entero).
- Los errores aparecen al intentar guardar o después de modificar un campo, y se actualizan mientras se corrigen.

## Sistema de diseño

Estilo **“almacén”**: barra superior verde bosque con cinta de señalización, tarjetas claras sobre fondo de cartón,
acentos naranja y etiquetas de color por categoría. Todos los valores están en `src/styles/tokens.css`.

| Token | Valor | Uso |
|---|---|---|
| `--color-brand` | `#1f3d2f` | Barra superior (verde bosque) |
| `--color-bg` | `#f3efe7` | Fondo de la página |
| `--color-surface` | `#fffdf9` | Tarjetas |
| `--color-ink` | `#1c2a22` | Texto principal |
| `--color-primary` | `#2d6a4f` | Botón principal |
| `--color-accent` | `#f4a259` | Resaltados (naranja) |
| `--color-danger` | `#b3261e` | Errores y eliminar |
| `--cat-*` / `--cat-*-bg` | azul, terracota, verde, morado | Texto y fondo de cada categoría |

- **Tipografía:** Unbounded (títulos y cifras del resumen), Figtree (texto) y Space Mono (etiquetas, precios y cantidades).
- **Espaciado:** escala de 4 px (`--space-1` … `--space-7`).
- **Layout:** resumen dentro de la barra superior, formulario horizontal que se monta sobre ella y tabla a todo el ancho.
- **Botones:** variantes `primary`, `secondary`, `danger`, `danger-soft` y `ghost`; tamaño `sm`.
- **Accesibilidad:** etiquetas en todos los campos, `aria-invalid` en errores, foco visible con teclado, contraste AA en textos y animaciones desactivadas con `prefers-reduced-motion`.
