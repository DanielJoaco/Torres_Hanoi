import { generateOrder } from './OrderGenerator.js';
import { createPuzzle } from './PuzzleGenerator.js';
import { validateOrder } from './OrderValidator.js';
import { PLATE_TOWER } from './HanoiGame.js';

const order = generateOrder({
  ingredientCount: 6,
  availableTypes: ['pan', 'lechuga', 'tomate', 'carne', 'queso', 'ketchup', 'mostaza']
});
console.log('Pedido (base -> tope):', order.join(' > '));

const game = createPuzzle(order, { shuffleMoves: 40 });
game.towers.forEach((t, i) =>
  console.log(`Torre ${i}:`, t.items.map(x => x.type).join(', ') || '(vacía)')
);

// Prueba de regla: intenta mover salsa sobre pan, etc.
console.log('Movimientos legales:', game.legalMoves());

// Resolvemos "a mano" para verificar la validación:
// (aquí solo comprobamos que validateOrder rechaza un plato incompleto)
console.log('¿Pedido completo?', validateOrder(game.towers[PLATE_TOWER].items, order));