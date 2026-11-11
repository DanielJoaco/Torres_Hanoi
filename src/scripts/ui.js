function escapeHtml(value) {
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

function writeConsole(targetId, type, message) {
  const target = document.getElementById(targetId);
  target.innerHTML = `<span class="${type}">${escapeHtml(message)}</span>`;
}

function renderStructure({
  values,
  visualId,
  sizeId,
  direction = "stack",
  colorClass = "",
}) {
  const visual = document.getElementById(visualId);
  visual.classList.toggle("queue-visual", direction === "queue");
  if (values.length && direction === "queue") {
    const columns = 6;
    const rows = [];

    for (let start = 0; start < values.length; start += columns) {
      const row = values.slice(start, start + columns);
      rows.push(
        `<div class="queue-row">${row
          .map((value, rowIndex) => {
            const index = start + rowIndex;
            const isNextOut = index === 0;
            return `<div class="structure-item ${colorClass} ${isNextOut ? "next-out" : ""}">${escapeHtml(value)}</div>`;
          })
          .join("")}</div>`,
      );
    }

    visual.innerHTML = rows.join("");
  } else {
    visual.innerHTML = values.length
      ? values
          .map((value, index) => {
            const isNextOut = index === values.length - 1;
            return `<div class="structure-item ${colorClass} ${isNextOut ? "next-out" : ""}">${escapeHtml(value)}</div>`;
          })
          .join("")
      : "";
    if (!values.length) {
      const template = document.getElementById(visual.dataset.emptyTemplate);
      visual.replaceChildren(template.content.cloneNode(true));
    }
  }
  document.getElementById(sizeId).textContent =
    `${values.length} elemento${values.length === 1 ? "" : "s"}`;
}

function showCode(group, file, javaFiles) {
  const code = document.getElementById(`${group}-code`);
  code.textContent = javaFiles[file];
  window.Prism?.highlightElement(code);
  document
    .querySelectorAll(`[data-code-group="${group}"]`)
    .forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.file === file),
    );
}

function copyCode(group) {
  const code = document.getElementById(`${group}-code`).textContent;
  const button = document.getElementById(`copy-${group}`);
  navigator.clipboard.writeText(code).then(() => {
    button.classList.add("copied");
    setTimeout(() => {
      button.classList.remove("copied");
    }, 1400);
  });
}

window.copyCode = copyCode;
window.renderStructure = renderStructure;
window.showCode = showCode;
window.writeConsole = writeConsole;
