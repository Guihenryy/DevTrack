/* =========================================================
   app.js — ponto de entrada: navegação, tema e menu lateral
   ========================================================= */
import { getPrefs, setPref } from "./storage.js";

const VIEWS = ["dashboard", "tasks", "studies", "projects", "profile"];
const DEFAULT_VIEW = "dashboard";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Tema ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("#themeLabel").textContent = theme === "dark" ? "Tema claro" : "Tema escuro";
}

function initTheme() {
  applyTheme(getPrefs().theme);
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    setPref("theme", next);
  });
}

/* ---------- Menu lateral (mobile) ---------- */
function initSidebar() {
  const sidebar = $("#sidebar");
  const scrim = $("#scrim");
  const btn = $("#menuBtn");

  const setOpen = (open) => {
    sidebar.classList.toggle("is-open", open);
    scrim.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  btn.addEventListener("click", () => setOpen(!sidebar.classList.contains("is-open")));
  scrim.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
      setOpen(false);
      btn.focus();
    }
  });
  // Fecha o menu ao navegar
  $$(".nav__link").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  // Se a tela voltar a ser larga, garante estado limpo
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------- Roteamento por hash ---------- */
function currentView() {
  const name = location.hash.replace("#", "");
  return VIEWS.includes(name) ? name : DEFAULT_VIEW;
}

function showView(name, { focus = false } = {}) {
  $$(".view").forEach((v) => (v.hidden = v.id !== `view-${name}`));

  $$(".nav__link").forEach((a) => {
    if (a.dataset.view === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  const title = $(`#view-${name}`).dataset.title;
  $("#viewTitle").textContent = title;
  document.title = `${title} · DevTrack`;

  if (focus) $("#main").focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

function initRouter() {
  window.addEventListener("hashchange", () => showView(currentView(), { focus: true }));
  showView(currentView());
}

/* ---------- Inicialização ---------- */
function init() {
  initTheme();
  initSidebar();
  initRouter();
}

document.addEventListener("DOMContentLoaded", init);
