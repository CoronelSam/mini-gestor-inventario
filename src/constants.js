// Categorías disponibles en el formulario y en los filtros
export const CATEGORIES = ['Tecnología', 'Hogar', 'Oficina', 'Otros']

// Clave usada para guardar el inventario en el navegador.
// Si cambian los datos de ejemplo, sube la versión para que se vuelvan a cargar.
export const STORAGE_KEY = 'mini-inventory:v3:products'

// Datos de ejemplo que se cargan la primera vez que se abre la app (precios en lempiras)
export const SAMPLE_PRODUCTS = [
  { id: 'demo-1', name: 'Laptop 14" Core i5', category: 'Tecnología', price: 16899, quantity: 3 },
  { id: 'demo-2', name: 'Audífonos inalámbricos', category: 'Tecnología', price: 1035, quantity: 18 },
  { id: 'demo-3', name: 'Mouse ergonómico', category: 'Tecnología', price: 635, quantity: 25 },
  { id: 'demo-4', name: 'Cafetera de goteo', category: 'Hogar', price: 1765, quantity: 6 },
  { id: 'demo-5', name: 'Juego de sartenes', category: 'Hogar', price: 2229.5, quantity: 4 },
  { id: 'demo-6', name: 'Engrapadora metálica', category: 'Oficina', price: 255, quantity: 30 },
  { id: 'demo-7', name: 'Cuaderno universitario', category: 'Oficina', price: 85, quantity: 120 },
  { id: 'demo-8', name: 'Mochila urbana', category: 'Otros', price: 1170, quantity: 10 },
]
