<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import SummaryPanel from './components/SummaryPanel.vue'
import ProductForm from './components/ProductForm.vue'
import ProductFilters from './components/ProductFilters.vue'
import ProductTable from './components/ProductTable.vue'
import { CATEGORIES, SAMPLE_PRODUCTS, STORAGE_KEY } from './constants'
import { createId, normalizeText } from './utils'

/* ------------------------------------------------------------------
 * Estado reactivo
 * ------------------------------------------------------------------ */
const products = ref(loadProducts())
const search = ref('')
const categoryFilter = ref('')
const editingId = ref(null)
const notice = ref('')

// Referencias al contenedor y al componente del formulario (para hacer scroll y foco al editar)
const formPanel = ref(null)
const formRef = ref(null)

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) return saved
  } catch {
    // Si no hay almacenamiento disponible usamos los datos de ejemplo
  }
  return SAMPLE_PRODUCTS.map((product) => ({ ...product }))
}

// Cada vez que cambia el inventario lo guardamos en el navegador
watch(
  products,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      // Almacenamiento bloqueado: la app sigue funcionando en memoria
    }
  },
  { deep: true },
)

/* ------------------------------------------------------------------
 * Computed properties
 * ------------------------------------------------------------------ */

// Filtro dinámico: se recalcula solo al cambiar la búsqueda, la categoría o la lista
const filteredProducts = computed(() => {
  const term = normalizeText(search.value)

  return products.value.filter((product) => {
    const matchesName = term === '' || normalizeText(product.name).includes(term)
    const matchesCategory = categoryFilter.value === '' || product.category === categoryFilter.value
    return matchesName && matchesCategory
  })
})

const productToEdit = computed(
  () => products.value.find((product) => product.id === editingId.value) ?? null,
)

// Panel de resumen
const totalProducts = computed(() => products.value.length)

const totalUnits = computed(() =>
  products.value.reduce((sum, product) => sum + product.quantity, 0),
)

const totalValue = computed(() =>
  products.value.reduce((sum, product) => sum + product.price * product.quantity, 0),
)

const topProduct = computed(() =>
  products.value.reduce((top, product) => (!top || product.price > top.price ? product : top), null),
)

/* ------------------------------------------------------------------
 * Métodos
 * ------------------------------------------------------------------ */
function saveProduct(data) {
  if (data.id) {
    updateProduct(data)
  } else {
    addProduct(data)
  }
}

function addProduct(data) {
  products.value.push({ id: createId(), ...data })
  showNotice(`“${data.name}” se agregó al inventario`)
}

function updateProduct(data) {
  const index = products.value.findIndex((product) => product.id === data.id)
  if (index !== -1) {
    products.value[index] = { ...data }
    showNotice(`Cambios guardados en “${data.name}”`)
  }
  editingId.value = null
}

function deleteProduct(id) {
  const product = products.value.find((item) => item.id === id)
  products.value = products.value.filter((item) => item.id !== id)

  if (editingId.value === id) editingId.value = null
  if (product) showNotice(`“${product.name}” se eliminó`)
}

async function startEdit(product) {
  editingId.value = product.id
  await nextTick()
  formPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  formRef.value?.focus()
}

function cancelEdit() {
  editingId.value = null
}

let noticeTimer
function showNotice(message) {
  notice.value = message
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => (notice.value = ''), 2600)
}
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="container topbar__inner">
        <div class="brand">
          <span class="brand__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="5" rx="1" />
              <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" />
            </svg>
          </span>
          <div>
            <h1 class="brand__title">Mini Inventory Manager</h1>
            <p class="brand__subtitle">Control sencillo de productos, stock y valor del almacén.</p>
          </div>
        </div>

        <SummaryPanel
          :total-products="totalProducts"
          :total-units="totalUnits"
          :total-value="totalValue"
          :top-product="topProduct"
        />
      </div>
    </header>

    <main class="container main">
      <div ref="formPanel" class="main__form">
        <ProductForm
          ref="formRef"
          :categories="CATEGORIES"
          :product="productToEdit"
          @save="saveProduct"
          @cancel="cancelEdit"
        />
      </div>

      <ProductTable
        :products="filteredProducts"
        :total-count="totalProducts"
        :editing-id="editingId"
        @edit="startEdit"
        @delete="deleteProduct"
      >
        <ProductFilters
          v-model:search="search"
          v-model:category="categoryFilter"
          :categories="CATEGORIES"
        />
      </ProductTable>
    </main>

    <footer class="container footer">Hecho con Vue 3 + Vite · Tarea de componentes y reactividad</footer>

    <div class="toast-region" aria-live="polite">
      <Transition name="toast">
        <p v-if="notice" class="toast">{{ notice }}</p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* ---------- Barra superior ---------- */
.topbar {
  position: relative;
  padding: calc(var(--space-6) + 8px) 0 calc(var(--space-7) + var(--space-6));
  background: var(--color-brand);
  color: var(--color-on-brand);
}

/* Cinta de señalización en el borde superior */
.topbar::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 8px;
  background: repeating-linear-gradient(
    -45deg,
    var(--color-accent) 0 14px,
    var(--color-brand) 14px 28px
  );
}

.topbar__inner {
  display: grid;
  gap: var(--space-5);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.brand__logo {
  flex: none;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-brand);
}

.brand__logo svg {
  width: 28px;
  height: 28px;
}

.brand__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 1rem + 2vw, var(--text-2xl));
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.brand__subtitle {
  margin: var(--space-1) 0 0;
  font-size: var(--text-sm);
  color: var(--color-on-brand-soft);
}

/* ---------- Contenido ---------- */
.main {
  position: relative;
  display: grid;
  gap: var(--space-5);
  /* El formulario se monta sobre la barra verde */
  margin-top: calc(var(--space-7) * -1);
}

.main__form {
  scroll-margin-top: var(--space-4);
}

.footer {
  padding-top: var(--space-6);
  padding-bottom: var(--space-6);
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-ink-soft);
}

/* ---------- Notificación ---------- */
.toast-region {
  position: fixed;
  left: 50%;
  bottom: var(--space-5);
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100vw - 2 * var(--space-4));
  pointer-events: none;
  z-index: 10;
}

.toast {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-md);
  background: var(--color-brand);
  color: var(--color-on-brand);
  box-shadow: 0 12px 28px -12px rgba(28, 42, 34, 0.6);
  font-size: var(--text-sm);
  font-weight: 600;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--duration-base) var(--ease), transform var(--duration-base) var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
