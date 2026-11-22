<script setup>
import SummaryCard from './SummaryCard.vue'
import { formatCurrency } from '../utils'

defineProps({
  totalProducts: { type: Number, required: true },
  totalUnits: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  // Producto con el precio más alto (null si no hay productos)
  topProduct: { type: Object, default: null },
})
</script>

<template>
  <section class="summary" aria-label="Resumen del inventario">
    <SummaryCard
      label="Productos registrados"
      :value="totalProducts"
      :hint="`${totalUnits} ${totalUnits === 1 ? 'unidad' : 'unidades'} en stock`"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </svg>
      </template>
    </SummaryCard>

    <SummaryCard
      label="Valor total del inventario"
      :value="formatCurrency(totalValue)"
      hint="Suma de todos los subtotales"
      highlight
    >
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M14.5 9.5c-.4-.9-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.5V8M12 16v1.5" />
        </svg>
      </template>
    </SummaryCard>

    <SummaryCard
      label="Producto con mayor precio"
      :value="topProduct ? topProduct.name : '—'"
      :hint="topProduct ? `${formatCurrency(topProduct.price)} c/u` : 'Aún no hay productos'"
      text-value
    >
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      </template>
    </SummaryCard>
  </section>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

@media (max-width: 760px) {
  .summary {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
