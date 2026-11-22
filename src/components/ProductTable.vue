<script setup>
import { ref, computed } from 'vue'
import CategoryBadge from './CategoryBadge.vue'
import { formatCurrency } from '../utils'

const props = defineProps({
  // Productos ya filtrados
  products: { type: Array, required: true },
  // Total de productos registrados (sin filtros)
  totalCount: { type: Number, required: true },
  // Id del producto que se está editando, para resaltarlo
  editingId: { type: String, default: null },
})

const emit = defineEmits(['edit', 'delete'])

// Id del producto que está pidiendo confirmación para eliminarse
const confirmingId = ref(null)

const subtotal = (product) => product.price * product.quantity

const visibleTotal = computed(() =>
  props.products.reduce((sum, product) => sum + subtotal(product), 0),
)

function confirmDelete(id) {
  emit('delete', id)
  confirmingId.value = null
}
</script>

<template>
  <section class="card inventory">
    <header class="card__header">
      <h2 class="card__title">Inventario</h2>
      <span class="card__meta">Mostrando {{ products.length }} de {{ totalCount }}</span>
    </header>

    <!-- Aquí el padre coloca los filtros -->
    <slot />

    <div v-if="products.length > 0" class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Categoría</th>
            <th scope="col" class="num">Precio</th>
            <th scope="col" class="num">Cantidad</th>
            <th scope="col" class="num">Subtotal</th>
            <th scope="col" class="actions"><span class="sr-only">Acciones</span></th>
          </tr>
        </thead>

        <TransitionGroup tag="tbody" name="row">
          <tr
            v-for="product in products"
            :key="product.id"
            :class="{ 'is-editing': product.id === editingId }"
          >
            <td class="table__name">{{ product.name }}</td>
            <td><CategoryBadge :category="product.category" /></td>
            <td class="num">{{ formatCurrency(product.price) }}</td>
            <td class="num">{{ product.quantity }}</td>
            <td class="num table__subtotal">{{ formatCurrency(subtotal(product)) }}</td>
            <td class="actions">
              <template v-if="confirmingId === product.id">
                <span class="actions__question">¿Eliminar?</span>
                <button type="button" class="btn btn--sm btn--danger" @click="confirmDelete(product.id)">
                  Sí
                </button>
                <button type="button" class="btn btn--sm btn--secondary" @click="confirmingId = null">
                  No
                </button>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="btn btn--sm btn--secondary"
                  :aria-label="`Editar ${product.name}`"
                  @click="emit('edit', product)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 20h4L19 9l-4-4L4 16z" />
                    <path d="m13.5 6.5 4 4" />
                  </svg>
                  Editar
                </button>
                <button
                  type="button"
                  class="btn btn--sm btn--danger-soft"
                  :aria-label="`Eliminar ${product.name}`"
                  @click="confirmingId = product.id"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                  </svg>
                  Eliminar
                </button>
              </template>
            </td>
          </tr>
        </TransitionGroup>

        <tfoot>
          <tr>
            <td colspan="4">Total mostrado</td>
            <td class="num">{{ formatCurrency(visibleTotal) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-else class="empty">
      <span class="empty__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="5" rx="1" />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" />
        </svg>
      </span>
      <template v-if="totalCount === 0">
        <p class="empty__title">El almacén está vacío</p>
        <p class="empty__text">Registra tu primer producto con el formulario de arriba.</p>
      </template>
      <template v-else>
        <p class="empty__title">Sin coincidencias</p>
        <p class="empty__text">Ningún producto coincide con la búsqueda o la categoría elegida.</p>
      </template>
    </div>
  </section>
</template>

<style scoped>
.inventory {
  overflow: hidden;
}

/* La tabla ocupa todo el ancho de la tarjeta */
.table-wrap {
  overflow-x: auto;
  margin: 0 calc(var(--card-pad) * -1) calc(var(--card-pad) * -1);
}

.table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table th,
.table td {
  padding: var(--space-3);
}

.table th:first-child,
.table td:first-child {
  padding-left: var(--card-pad);
}

.table th:last-child,
.table td:last-child {
  padding-right: var(--card-pad);
}

.table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-soft);
  background: var(--color-surface-alt);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.table tbody tr {
  transition: background-color var(--duration-fast) var(--ease);
}

.table tbody tr:hover {
  background: var(--color-primary-soft);
}

.table tbody tr.is-editing {
  background: var(--color-accent-soft);
}

.table tbody tr.is-editing td:first-child {
  box-shadow: inset 4px 0 0 var(--color-accent);
}

.table .num {
  text-align: right;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.table__name {
  font-weight: 600;
}

.table__subtotal {
  font-weight: 700;
}

.table tfoot td {
  padding-top: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: none;
  background: var(--color-surface-alt);
  font-weight: 700;
}

.actions {
  text-align: right;
  white-space: nowrap;
}

.actions > * + * {
  margin-left: var(--space-2);
}

.actions__question {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-danger);
}

/* Animación al agregar / eliminar filas */
.row-enter-active,
.row-leave-active {
  transition: opacity var(--duration-base) var(--ease), transform var(--duration-base) var(--ease);
}

.row-enter-from,
.row-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* Estado vacío */
.empty {
  display: grid;
  justify-items: center;
  gap: var(--space-1);
  padding: var(--space-7) var(--space-4);
  text-align: center;
}

.empty__icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--color-accent-soft);
  color: var(--color-accent-ink);
}

.empty__icon svg {
  width: 32px;
  height: 32px;
}

.empty__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
}

.empty__text {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: var(--text-sm);
}
</style>
