<script setup>
import { computed } from 'vue'
import { slugify } from '../utils'

// Usado con v-model:search y v-model:category desde el componente padre
const props = defineProps({
  search: { type: String, default: '' },
  category: { type: String, default: '' },
  categories: { type: Array, required: true },
})

const emit = defineEmits(['update:search', 'update:category'])

// Computed con get/set: permite usar v-model en el input y avisar al padre con un emit
const searchModel = computed({
  get: () => props.search,
  set: (value) => emit('update:search', value),
})

const hasFilters = computed(() => props.search.trim() !== '' || props.category !== '')

function selectCategory(category) {
  emit('update:category', category)
}

function clearFilters() {
  emit('update:search', '')
  emit('update:category', '')
}
</script>

<template>
  <div class="filters">
    <div class="field filters__search">
      <label class="field__label" for="filter-search">Buscar por nombre</label>
      <div class="input-group">
        <svg class="input-group__prefix" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="filter-search"
          v-model="searchModel"
          class="input"
          type="search"
          placeholder="Ej. mouse"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="field filters__categories">
      <span id="filter-category-label" class="field__label">Categoría</span>
      <div class="filters__chips" role="group" aria-labelledby="filter-category-label">
        <button
          type="button"
          class="chip"
          :class="{ 'is-active': category === '' }"
          :aria-pressed="category === ''"
          @click="selectCategory('')"
        >
          Todas
        </button>
        <button
          v-for="item in categories"
          :key="item"
          type="button"
          class="chip"
          :class="{ 'is-active': category === item }"
          :data-cat="slugify(item)"
          :aria-pressed="category === item"
          @click="selectCategory(item)"
        >
          {{ item }}
        </button>
        <button v-if="hasFilters" type="button" class="btn btn--ghost btn--sm" @click="clearFilters">
          Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-4) var(--space-5);
  margin-bottom: var(--space-4);
}

.filters__search {
  flex: 1 1 240px;
  max-width: 320px;
}

.filters__categories {
  flex: 10 1 auto;
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  min-height: 42px;
}

@media (max-width: 640px) {
  .filters__search {
    max-width: none;
  }
}
</style>
