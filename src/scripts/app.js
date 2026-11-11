const stack = new Stack();
const queue = new Queue();

function renderStack() {
  renderStructure({
    values: stack.toArray(),
    visualId: "stack-visual",
    sizeId: "stack-size",
  });
}

function renderQueue() {
  renderStructure({
    values: queue.toArray(),
    visualId: "queue-visual",
    sizeId: "queue-size",
    direction: "queue",
  });
}

function readValue(inputId) {
  const input = document.getElementById(inputId);
  const value = input.value.trim();
  input.value = "";
  input.focus();
  return value;
}

function operateStack(action) {
  if (action === "stack-push") {
    const value = readValue("stack-input");
    if (!value)
      return writeConsole(
        "stack-console",
        "error",
        "Entrada no valida: escriba un dato antes de apilar.",
      );
    stack.push(value);
    renderStack();
    writeConsole(
      "stack-console",
      "success",
      `push(${value}) -> dato agregado a la cima.`,
    );
  }
  if (action === "stack-pop") {
    if (stack.isEmpty())
      return writeConsole(
        "stack-console",
        "error",
        "Error: no se puede desapilar, la pila está vacía.",
      );
    const value = stack.pop();
    renderStack();
    writeConsole(
      "stack-console",
      "success",
      `pop() -> ${value} salió de la pila desde la cima.`,
    );
  }
  if (action === "stack-peek")
    writeConsole(
      "stack-console",
      stack.isEmpty() ? "error" : "success",
      stack.isEmpty()
        ? "Error: no hay cima, la pila está vacía."
        : `peek() -> la cima es ${stack.peek()}.`,
    );
  if (action === "stack-clear") {
    stack.clear();
    renderStack();
    writeConsole(
      "stack-console",
      "success",
      "clear() -> todos los elementos fueron eliminados.",
    );
  }
}

function operateQueue(action) {
  if (action === "queue-enqueue") {
    const value = readValue("queue-input");
    if (!value)
      return writeConsole(
        "queue-console",
        "error",
        "Entrada no valida: escriba un dato antes de encolar.",
      );
    queue.enqueue(value);
    renderQueue();
    writeConsole(
      "queue-console",
      "success",
      `enqueue(${value}) -> dato agregado al final.`,
    );
  }
  if (action === "queue-dequeue") {
    if (queue.isEmpty())
      return writeConsole(
        "queue-console",
        "error",
        "Error: no se puede desencolar, la cola está vacía.",
      );
    const value = queue.dequeue();
    renderQueue();
    writeConsole(
      "queue-console",
      "success",
      `dequeue() -> ${value} fue atendido.`,
    );
  }
  if (action === "queue-front")
    writeConsole(
      "queue-console",
      queue.isEmpty() ? "error" : "success",
      queue.isEmpty()
        ? "Error: no hay frente, la cola está vacía."
        : `front() -> el frente es ${queue.front()}.`,
    );
  if (action === "queue-clear") {
    queue.clear();
    renderQueue();
    writeConsole(
      "queue-console",
      "success",
      "clear() -> todos los elementos fueron eliminados.",
    );
  }
}

function changeView(view) {
  document
    .querySelectorAll(".main-tab")
    .forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.view === view),
    );
  document
    .querySelectorAll(".view")
    .forEach((section) =>
      section.classList.toggle("active-view", section.id === `${view}-view`),
    );
  document
    .querySelectorAll(".view-title")
    .forEach((title) =>
      title.classList.toggle("active", title.dataset.view === view),
    );
  if (view === "queues") renderQueue();
}

function handleClick(event) {
  const viewTab = event.target.closest(".main-tab");
  if (viewTab) changeView(viewTab.dataset.view);
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    operateStack(actionButton.dataset.action);
    operateQueue(actionButton.dataset.action);
  }
  const codeTab = event.target.closest(".code-tab");
  if (codeTab)
    showCode(codeTab.dataset.codeGroup, codeTab.dataset.file, javaFiles);
  if (event.target.id === "copy-stack") copyCode("stack");
  if (event.target.id === "copy-queue") copyCode("queue");
  if (event.target.closest("#theme-toggle")) toggleTheme();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  const toggle = document.getElementById("theme-toggle");
  toggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("hanoi-theme", isDark ? "dark" : "light");
}

document.addEventListener("click", handleClick);
window.addEventListener("resize", renderQueue);
renderStack();
renderQueue();
showCode("stack", "stack", javaFiles);
showCode("queue", "queue", javaFiles);
initializeHanoiCanvas(document.getElementById("hanoi-canvas"));
if (localStorage.getItem("hanoi-theme") === "dark") toggleTheme();
