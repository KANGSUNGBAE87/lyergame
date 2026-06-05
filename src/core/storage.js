const NS = 'liar:';

function safeGet(key) {
  try {
    return localStorage.getItem(NS + key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(NS + key, value);
  } catch {
    // Storage may be unavailable in private or embedded contexts.
  }
}

export function get(key, fallback = null) {
  const value = safeGet(key);
  return value === null ? fallback : value;
}

export function set(key, value) {
  safeSet(key, String(value));
}

export function getJSON(key, fallback) {
  const raw = safeGet(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  safeSet(key, JSON.stringify(value));
}
