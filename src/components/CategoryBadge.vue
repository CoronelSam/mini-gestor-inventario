<script setup>
import { computed } from 'vue'
import { slugify } from '../utils'

const props = defineProps({
  category: { type: String, required: true },
})

// "Tecnología" → "tecnologia", se usa para elegir el color en CSS
const slug = computed(() => slugify(props.category))
</script>

<template>
  <span class="badge" :data-cat="slug">{{ category }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  border-radius: var(--radius-pill);
  background: var(--cat-bg, var(--color-surface-alt));
  color: var(--cat-color, var(--color-ink));
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}

.badge::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
</style>
