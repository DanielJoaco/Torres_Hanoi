/**
 * Compara la pila del plato con el pedido.
 * strict = true  -> misma secuencia exacta de tipos
 * strict = false -> mismos tipos y cantidades (el orden por nivel ya lo garantizan las reglas)
 */
export function validateOrder(plateItems, order, strict = false) {
  if (plateItems.length !== order.length) return false;

  if (strict) {
    return plateItems.every((item, i) => item.type === order[i]);
  }

  const count = (list) => list.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const a = count(plateItems.map(i => i.type));
  const b = count(order);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every(k => a[k] === b[k]);
}

// Puntaje de 0 a 1 según cuántas posiciones coinciden (útil si entregan incompleto)
export function orderAccuracy(plateItems, order) {
  const len = Math.max(plateItems.length, order.length);
  if (len === 0) return 1;
  let hits = 0;
  for (let i = 0; i < Math.min(plateItems.length, order.length); i++) {
    if (plateItems[i].type === order[i]) hits++;
  }
  return hits / len;
}