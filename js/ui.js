/* =========================================================
   ui.js — utilitários de interface compartilhados
   (notificações, confirmação, helpers de DOM)
   ========================================================= */

const ICONS = { success: "i-check", error: "i-alert", info: "i-info" };

/** Exibe uma notificação visual. type: "success" | "error" | "info" */
export function toast(message, type = "info", duration = 3500) {
  const host = document.getElementById("toasts");
  if (!host) return;

  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.setAttribute("role", type === "error" ? "alert" : "status");

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", "icon");
  icon.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#" + (ICONS[type] || ICONS.info));
  icon.appendChild(use);

  const msg = document.createElement("span");
  msg.className = "toast__msg";
  msg.textContent = message;

  const close = document.createElement("button");
  close.type = "button";
  close.className = "toast__close";
  close.setAttribute("aria-label", "Fechar notificação");
  close.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-close"/></svg>';

  el.append(icon, msg, close);
  host.appendChild(el);

  let timer;
  const dismiss = () => {
    clearTimeout(timer);
    el.classList.add("is-leaving");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  };
  close.addEventListener("click", dismiss);
  timer = setTimeout(dismiss, duration);
}

/**
 * Pede confirmação antes de uma ação destrutiva.
 * Retorna uma Promise<boolean>.
 */
export function confirmDialog({ title = "Confirmar ação", text = "", confirmLabel = "Excluir" } = {}) {
  const dialog = document.getElementById("confirmDialog");
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmText").textContent = text;
  document.getElementById("confirmOk").textContent = confirmLabel;

  return new Promise((resolve) => {
    dialog.addEventListener(
      "close",
      () => resolve(dialog.returnValue === "ok"),
      { once: true }
    );
    dialog.returnValue = "cancel";
    dialog.showModal();
    document.getElementById("confirmCancel").focus();
  });
}

/** Escapa texto para uso seguro em innerHTML. */
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
