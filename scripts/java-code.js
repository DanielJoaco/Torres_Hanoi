export const javaFiles = {
  stack: `public class Pila {
    private Nodo tope;

    public void push(Object dato) {
        tope = new Nodo(dato, tope);
    }

    public Object pop() {
        if (isEmpty()) {
            System.out.println("Error: la pila esta vacia.");
            return null;
        }
        Object dato = tope.dato;
        tope = tope.siguiente;
        return dato;
    }

    public Object peek() {
        return isEmpty() ? null : tope.dato;
    }

    public boolean isEmpty() { return tope == null; }
}`,
  "stack-node": `public class Nodo {
    Object dato;
    Nodo siguiente;

    public Nodo(Object dato, Nodo siguiente) {
        this.dato = dato;
        this.siguiente = siguiente;
    }
}`,
  "stack-main": `public class Main {
    public static void main(String[] args) {
        Pila pila = new Pila();
        pila.pop();             // Entrada no valida
        pila.push(10);
        pila.push(20);
        pila.peek();
        pila.pop();
        pila.pop();
        pila.pop();             // Entrada no valida
        System.out.println(pila.isEmpty());
    }
}`,
  queue: `public class Cola {
    private Nodo frente;
    private Nodo finalCola;

    public void enqueue(Object dato) {
        Nodo nuevo = new Nodo(dato);
        if (isEmpty()) frente = nuevo;
        else finalCola.siguiente = nuevo;
        finalCola = nuevo;
    }

    public Object dequeue() {
        if (isEmpty()) {
            System.out.println("Error: la cola esta vacia.");
            return null;
        }
        Object dato = frente.dato;
        frente = frente.siguiente;
        if (frente == null) finalCola = null;
        return dato;
    }

    public Object front() { return isEmpty() ? null : frente.dato; }
    public int size() { return 0; /* recorrido de nodos */ }
    public boolean isEmpty() { return frente == null; }
}`,
  "queue-node": `public class Nodo {
    Object dato;
    Nodo siguiente;

    public Nodo(Object dato) {
        this.dato = dato;
        this.siguiente = null;
    }
}`,
  "queue-main": `public class Main {
    public static void main(String[] args) {
        Cola cola = new Cola();
        cola.dequeue();          // Entrada no valida
        cola.enqueue("A");
        cola.enqueue("B");
        cola.front();
        cola.size();
        cola.dequeue();
        cola.dequeue();
        cola.dequeue();          // Entrada no valida
        System.out.println(cola.isEmpty());
    }
}`,
};
