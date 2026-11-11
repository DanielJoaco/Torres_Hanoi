import { INGREDIENTS } from './ingredients.js';

function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Genera un pedido: arreglo de tipos ordenado de BASE a TOPE.
 * Siempre empieza con pan, y el resto queda ordenado por nivel (mayor a menor).
 */
export function generateOrder({ ingredientCount, availableTypes, rng = Math.random }) {
  const pool = availableTypes.filter(t => t !== 'pan');
  if (pool.length === 0) throw new Error('No hay ingredientes disponibles');

  const extras = [];
  for (let i = 0; i < ingredientCount - 1; i++) {
    extras.push(pool[Math.floor(rng() * pool.length)]);
  }

  // Mezcla y luego ordena por nivel (sort estable: dentro del mismo nivel queda aleatorio)
  const sorted = shuffle(extras, rng)
    .sort((a, b) => INGREDIENTS[b].level - INGREDIENTS[a].level);

  return ['pan', ...sorted];
}