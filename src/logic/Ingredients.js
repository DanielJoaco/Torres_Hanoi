// Nivel = prioridad. Mayor nivel va más abajo en la pila.
export const LEVELS = {
  PAN: 4,
  VEGETAL: 3,
  CARNE: 2,
  SALSA: 1
};

export const INGREDIENTS = {
  pan:       { type: 'pan',       level: LEVELS.PAN },
  lechuga:   { type: 'lechuga',   level: LEVELS.VEGETAL },
  tomate:    { type: 'tomate',    level: LEVELS.VEGETAL },
  cebolla:   { type: 'cebolla',   level: LEVELS.VEGETAL },
  carne:     { type: 'carne',     level: LEVELS.CARNE },
  pollo:     { type: 'pollo',     level: LEVELS.CARNE },
  queso:     { type: 'queso',     level: LEVELS.CARNE },
  ketchup:   { type: 'ketchup',   level: LEVELS.SALSA },
  mostaza:   { type: 'mostaza',   level: LEVELS.SALSA },
  mayonesa:  { type: 'mayonesa',  level: LEVELS.SALSA }
};

let nextId = 1;

// Crea un ingrediente concreto (con id único, útil para vincularlo a un sprite)
export function createIngredient(type) {
  const base = INGREDIENTS[type];
  if (!base) throw new Error(`Ingrediente desconocido: ${type}`);
  return { id: nextId++, type: base.type, level: base.level };
}