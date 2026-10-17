/* =========================================================
   storage.js — camada de persistência (LocalStorage)
   Todas as chaves ficam sob o prefixo "devtrack:".
   ========================================================= */

const PREFIX = "devtrack:";

export const KEYS = Object.freeze({
  tasks: "tasks",
  sessions: "sessions",
  projects: "projects",
  goals: "goals",
  profile: "profile",
  prefs: "prefs",
});

/** Lê um valor salvo. Retorna `fallback` se não existir ou estiver corrompido. */
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] Falha ao ler "${key}":`, err);
    return fallback;
  }
}

/** Salva um valor. Retorna true se deu certo. */
export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] Falha ao salvar "${key}":`, err);
    return false;
  }
}

/** Remove uma chave. */
export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.warn(`[storage] Falha ao remover "${key}":`, err);
  }
}

/** Gera um id único simples. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- Preferências ---------- */
const DEFAULT_PREFS = { theme: "dark" };

export function getPrefs() {
  return { ...DEFAULT_PREFS, ...load(KEYS.prefs, {}) };
}

export function setPref(name, value) {
  const prefs = getPrefs();
  prefs[name] = value;
  return save(KEYS.prefs, prefs);
}
