<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  // Fondo naranja para destacar la tarjeta
  highlight: { type: Boolean, default: false },
  // Usa un tamaño de letra menor cuando el valor es un texto largo
  textValue: { type: Boolean, default: false },
})
</script>

<template>
  <article class="stat" :class="{ 'stat--highlight': highlight }">
    <div class="stat__top">
      <p class="stat__label">{{ label }}</p>
      <!-- Slot opcional para un ícono -->
      <span v-if="$slots.icon" class="stat__icon" aria-hidden="true">
        <slot name="icon" />
      </span>
    </div>
    <p class="stat__value" :class="{ 'stat__value--text': textValue }" :title="String(value)">
      {{ value }}
    </p>
    <p v-if="hint" class="stat__hint">{{ hint }}</p>
  </article>
</template>

<style scoped>
/* Tarjeta pensada para ir sobre la barra verde */
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
  padding: var(--space-4) var(--space-5);
  border: 1px solid rgba(245, 239, 227, 0.16);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-on-brand);
}

.stat--highlight {
  border-color: transparent;
  background: var(--color-accent);
  color: var(--color-ink);
}

.stat__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.stat__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-on-brand-soft);
}

.stat__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-accent);
}

.stat__icon :deep(svg) {
  width: 17px;
  height: 17px;
}

.stat--highlight .stat__label {
  color: var(--color-ink);
}

.stat--highlight .stat__icon {
  background: rgba(28, 42, 34, 0.1);
  color: var(--color-ink);
}

.stat__value {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat__value--text {
  font-size: var(--text-lg);
  line-height: 1.4;
}

.stat__hint {
  margin: auto 0 0;
  font-size: var(--text-sm);
  color: var(--color-on-brand-soft);
}

.stat--highlight .stat__hint {
  color: var(--color-ink);
}
</style>
