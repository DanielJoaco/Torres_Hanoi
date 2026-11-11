class Stack {
  #items = [];

  push(value) {
    this.#items.push(value);
  }

  pop() {
    return this.#items.pop() ?? null;
  }

  peek() {
    return this.#items.at(-1) ?? null;
  }

  clear() {
    this.#items.length = 0;
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  toArray() {
    return [...this.#items];
  }
}

class Queue {
  #items = [];

  enqueue(value) {
    this.#items.push(value);
  }

  dequeue() {
    return this.#items.shift() ?? null;
  }

  front() {
    return this.#items[0] ?? null;
  }

  clear() {
    this.#items.length = 0;
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  toArray() {
    return [...this.#items];
  }
}

window.Stack = Stack;
window.Queue = Queue;
