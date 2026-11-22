<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { formatCurrency } from '../utils'

const props = defineProps({
  // Lista de categorías para el <select>
  categories: { type: Array, required: true },
  // Producto a editar; si es null el formulario está en modo "nuevo"
  product: { type: Object, default: null },
})

const emit = defineEmits(['save', 'cancel'])

const emptyForm = () => ({ name: '', category: '', price: null, quantity: null })

const form = reactive(emptyForm())
const touched = reactive({ name: false, category: false, price: false, quantity: false })
const submitted = ref(false)
const nameInput = ref(null)

const isEditing = computed(() => props.product !== null)

// Cuando cambia el producto a editar, rellenamos (o vaciamos) el formulario
watch(
  () => props.product,
  (product) => {
    Object.assign(
      form,
      product
        ? { name: product.name, category: product.category, price: product.price, quantity: product.quantity }
        : emptyForm(),
    )
    resetValidation()
  },
  { immediate: true },
)

/* ---------- Validaciones ---------- */
const isBlank = (value) => value === null || value === undefined || value === ''

const errors = computed(() => {
  const result = {}

  if (form.name.trim() === '') result.name = 'El nombre es obligatorio.'

  if (form.category === '') result.category = 'Selecciona una categoría.'

  if (isBlank(form.price)) result.price = 'El precio es obligatorio.'
  else if (Number(form.price) <= 0) result.price = 'El precio debe ser mayor a 0.'

  if (isBlank(form.quantity)) result.quantity = 'La cantidad es obligatoria.'
  else if (Number(form.quantity) <= 0) result.quantity = 'La cantidad debe ser mayor a 0.'
  else if (!Number.isInteger(Number(form.quantity))) result.quantity = 'Usa un número entero.'

  return result
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

// Solo mostramos el error de un campo si el usuario ya lo modificó o si intentó enviar
function errorFor(field) {
  return submitted.value || touched[field] ? errors.value[field] : ''
}

// Vista previa del subtotal mientras se escribe
const subtotal = computed(() => {
  const price = Number(form.price)
  const quantity = Number(form.quantity)
  return price > 0 && quantity > 0 ? price * quantity : 0
})

/* ---------- Métodos ---------- */
function handleSubmit() {
  submitted.value = true
  if (!isValid.value) return

  emit('save', {
    ...(isEditing.value ? { id: props.product.id } : {}),
    name: form.name.trim(),
    category: form.category,
    price: Number(form.price),
    quantity: Number(form.quantity),
  })

  if (!isEditing.value) {
    Object.assign(form, emptyForm())
    resetValidation()
    focus()
  }
}

function resetValidation() {
  submitted.value = false
  Object.keys(touched).forEach((key) => (touched[key] = false))
}

function focus() {
  nameInput.value?.focus({ preventScroll: true })
}

// El componente padre puede llamar a focus() a través de una template ref
defineExpose({ focus })
</script>

<template>
  <section class="card product-form" :class="{ 'is-editing': isEditing }">
    <header class="card__header">
      <h2 class="card__title">{{ isEditing ? 'Editar producto' : 'Registrar producto' }}</h2>
      <span v-if="isEditing" class="tag">Editando</span>
    </header>

    <form class="product-form__grid" novalidate @submit.prevent="handleSubmit">
      <div class="field field--name" :class="{ 'has-error': errorFor('name') }">
        <label class="field__label" for="pf-name">Nombre del producto</label>
        <input
          id="pf-name"
          ref="nameInput"
          v-model="form.name"
          class="input"
          type="text"
          placeholder="Ej. Silla de escritorio"
          autocomplete="off"
          :aria-invalid="Boolean(errorFor('name'))"
          aria-describedby="pf-name-error"
          @change="touched.name = true"
        />
        <p v-if="errorFor('name')" id="pf-name-error" class="field__error">{{ errorFor('name') }}</p>
      </div>

      <div class="field field--category" :class="{ 'has-error': errorFor('category') }">
        <label class="field__label" for="pf-category">Categoría</label>
        <select
          id="pf-category"
          v-model="form.category"
          class="input"
          :aria-invalid="Boolean(errorFor('category'))"
          aria-describedby="pf-category-error"
          @change="touched.category = true"
        >
          <option value="" disabled>Selecciona…</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <p v-if="errorFor('category')" id="pf-category-error" class="field__error">
          {{ errorFor('category') }}
        </p>
      </div>

      <div class="field" :class="{ 'has-error': errorFor('price') }">
        <label class="field__label" for="pf-price">Precio (L)</label>
        <div class="input-group">
          <span class="input-group__prefix" aria-hidden="true">L</span>
          <input
            id="pf-price"
            v-model.number="form.price"
            class="input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            inputmode="decimal"
            :aria-invalid="Boolean(errorFor('price'))"
            aria-describedby="pf-price-error"
            @change="touched.price = true"
          />
        </div>
        <p v-if="errorFor('price')" id="pf-price-error" class="field__error">{{ errorFor('price') }}</p>
      </div>

      <div class="field" :class="{ 'has-error': errorFor('quantity') }">
        <label class="field__label" for="pf-quantity">Cantidad</label>
        <input
          id="pf-quantity"
          v-model.number="form.quantity"
          class="input"
          type="number"
          min="1"
          step="1"
          placeholder="0"
          inputmode="numeric"
          :aria-invalid="Boolean(errorFor('quantity'))"
          aria-describedby="pf-quantity-error"
          @change="touched.quantity = true"
        />
        <p v-if="errorFor('quantity')" id="pf-quantity-error" class="field__error">
          {{ errorFor('quantity') }}
        </p>
      </div>

      <div class="product-form__footer">
        <p class="product-form__subtotal">
          Subtotal estimado <strong>{{ formatCurrency(subtotal) }}</strong>
        </p>

        <div class="product-form__actions">
          <button v-if="isEditing" type="button" class="btn btn--secondary" @click="emit('cancel')">
            Cancelar
          </button>
          <button type="submit" class="btn btn--primary">
            <svg v-if="isEditing" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m5 12 5 5 9-10" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
              stroke-linecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {{ isEditing ? 'Guardar cambios' : 'Agregar producto' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
.product-form {
  container-type: inline-size;
  transition: border-color var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease);
}

.product-form.is-editing {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft), var(--shadow-md);
}

/* Pantallas angostas: 2 columnas, nombre y categoría ocupan toda la fila */
.product-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  align-items: start;
}

.field--name,
.field--category {
  grid-column: 1 / -1;
}

.product-form__footer {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px dashed var(--color-border-strong);
}

.product-form__subtotal {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-ink-soft);
}

.product-form__subtotal strong {
  font-family: var(--font-mono);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-ink);
}

.product-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

/* Cuando hay espacio, los 4 campos van en una sola fila */
@container (min-width: 760px) {
  .product-form__grid {
    grid-template-columns: 2fr 1.4fr 1fr 1fr;
  }

  .field--name,
  .field--category {
    grid-column: auto;
  }
}
</style>
