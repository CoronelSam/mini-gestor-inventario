// Lempira hondureño (HNL) con el formato regional de Honduras
const currencyFormatter = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
})

/** Da formato de moneda a un número: 1234.5 → "L 1,234.50" */
export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

/** Minúsculas y sin acentos, para comparar textos: "Lámpara" → "lampara" */
export function normalizeText(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/** Convierte un texto en un identificador para CSS: "Tecnología" → "tecnologia" */
export function slugify(text) {
  return normalizeText(text).replace(/\s+/g, '-')
}

/** Genera un id único sencillo */
export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
