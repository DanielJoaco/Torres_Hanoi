import { Tower } from './Tower.js';
import { HanoiGame } from './HanoiGame.js';
import { createIngredient } from './ingredients.js';

/**
 * order: arreglo de tipos (base -> tope), ya generado por generateOrder.
 * shuffleMoves: cuántos movimientos aleatorios usar para desordenar.
 */
export function createPuzzle(order, { shuffleMoves = 30, rng = Math.random } = {}) {
  const items = order.map(createIngredient);

  const game = new HanoiGame([
    new Tower([...items]), // torre 0: todo apilado correctamente
    new Tower(),           // torre 1: auxiliar
    new Tower()            // torre 2: plato del cliente
  ]);

  let last = null; // último movimiento, para no deshacerlo de inmediato
  for (let i = 0; i < shuffleMoves; i++) {
    let moves = game.legalMoves();

    // Evita revertir el movimiento anterior (si hay otras opciones)
    if (last) {
      const filtered = moves.filter(([f, t]) => !(f === last[1] && t === last[0]));
      if (filtered.length > 0) moves = filtered;
    }

    const [from, to] = moves[Math.floor(rng() * moves.length)];
    game.move(from, to);
    last = [from, to];
  }

  game.moves = 0; // el contador del jugador empieza en 0
  return game;
}