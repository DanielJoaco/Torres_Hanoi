import { INGREDIENTS, LEVELS } from './Ingredients.js';

function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pedido de BASE a TOPE. Siempre incluye pan, al menos un vegetal,
 * al menos una carne y al menos una salsa.
 */
export function generateOrder({ ingredientCount, availableTypes, rng = Math.random }) {
  const ofLevel = (lvl) => availableTypes.filter(t => INGREDIENTS[t].level === lvl);
  const veggies = ofLevel(LEVELS.VEGETAL);
  const meats = ofLevel(LEVELS.CARNE);
  const sauces = ofLevel(LEVELS.SALSA);

  if (!veggies.length || !meats.length || !sauces.length) {
    throw new Error('availableTypes debe incluir al menos un vegetal, una carne y una salsa');
  }

  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  // Obligatorios
  const extras = [pick(veggies), pick(meats), pick(sauces)];

  // Relleno hasta completar la cantidad pedida (el pan cuenta como 1)
  const pool = availableTypes.filter(t => t !== 'pan');
  const total = Math.max(ingredientCount, 4);
  while (extras.length < total - 1) extras.push(pick(pool));

  // Mezcla y ordena por nivel (estable: dentro de la misma categoría queda aleatorio)
  const sorted = shuffle(extras, rng)
    .sort((a, b) => INGREDIENTS[b].level - INGREDIENTS[a].level);

  return ['pan', ...sorted];
}