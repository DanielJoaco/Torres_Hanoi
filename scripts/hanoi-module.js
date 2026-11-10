export function initializeHanoiCanvas(canvas) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#17212b";
  context.fillRect(0, 0, canvas.width, canvas.height);
}
