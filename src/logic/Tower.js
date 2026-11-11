export class Tower {
  constructor(items = []) {
    this.items = items;
  }

  get size() { return this.items.length; }

  top() { return this.items[this.items.length - 1]; }

  isEmpty() { return this.items.length === 0; }

  // Un ingrediente se puede colocar si la torre está vacía
  // o si su nivel es menor o igual que el del tope.
  canPlace(ingredient) {
    const top = this.top();
    return !top || ingredient.level <= top.level;
  }

  push(ingredient) {
    if (!this.canPlace(ingredient)) {
      throw new Error('Movimiento inválido');
    }
    this.items.push(ingredient);
  }

  pop() { return this.items.pop(); }

  clone() { return new Tower([...this.items]); }
}