export function initializeHanoiCanvas(canvas) {
  if (!canvas) return;
  const description = document.querySelector("#hanoi-view .hanoi-intro p");
  if (description) {
    description.textContent =
      "Las Torres de Hanoi es un juego de lógica en el que se debe trasladar una torre de discos desde un poste de origen hasta uno de destino. Solo se puede mover un disco a la vez y nunca se puede colocar un disco grande sobre uno pequeño. Este canvas queda preparado para integrar la interacción del minijuego.";
  }
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#17212b";
  context.fillRect(0, 0, canvas.width, canvas.height);
}
