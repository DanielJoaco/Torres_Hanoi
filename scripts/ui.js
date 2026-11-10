export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}

export function writeConsole(targetId, type, message) {
  const target = document.getElementById(targetId);
  target.innerHTML = `<span class="${type}">${escapeHtml(message)}</span>`;
}

export function renderStructure({
  values,
  visualId,
  sizeId,
  emptyText,
  direction = "stack",
  colorClass = "",
}) {
  const visual = document.getElementById(visualId);
  visual.classList.toggle("queue-visual", direction === "queue");
  visual.innerHTML = values.length
    ? values
        .map((value, index) => {
          const isNextOut =
            direction === "queue" ? index === 0 : index === values.length - 1;
          return `<div class="structure-item ${colorClass} ${isNextOut ? "next-out" : ""}">${escapeHtml(value)}</div>`;
        })
        .join("")
    : `<span class="empty-state">${emptyText}</span>`;
  document.getElementById(sizeId).textContent =
    `${values.length} elemento${values.length === 1 ? "" : "s"}`;
}

export function showCode(group, file, javaFiles) {
  const code = document.getElementById(`${group}-code`);
  code.textContent = javaFiles[file];
  window.Prism?.highlightElement(code);
  document
    .querySelectorAll(`[data-code-group="${group}"]`)
    .forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.file === file),
    );
}

export function copyCode(group) {
  const code = document.getElementById(`${group}-code`).textContent;
  const button = document.getElementById(`copy-${group}`);
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = "Copiado";
    setTimeout(() => {
      button.textContent = "Copiar";
    }, 1400);
  });
}
