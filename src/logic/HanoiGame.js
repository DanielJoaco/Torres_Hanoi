import { Tower } from './Tower.js';

export const PLATE_TOWER = 2; // la torre del plato del cliente

export class HanoiGame {
  constructor(towers) {
    this.towers = towers;   // arreglo de Tower
    this.moves = 0;
  }

  canMove(from, to) {
    if (from === to) return false;
    const source = this.towers[from];
    const target = this.towers[to];
    if (source.isEmpty()) return false;
    return target.canPlace(source.top());
  }

  move(from, to) {
    if (!this.canMove(from, to)) return false;
    this.towers[to].push(this.towers[from].pop());
    this.moves++;
    return true;
  }

  // Lista de todos los movimientos legales (útil para el generador y pistas)
  legalMoves() {
    const result = [];
    for (let from = 0; from < this.towers.length; from++) {
      for (let to = 0; to < this.towers.length; to++) {
        if (this.canMove(from, to)) result.push([from, to]);
      }
    }
    return result;
  }

  // ¿No hay ningún movimiento posible? (no debería pasar con 3 torres)
  isStuck() { return this.legalMoves().length === 0; }

  plate() { return this.towers[PLATE_TOWER].items; }
}