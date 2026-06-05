class MemStorage {
  constructor() {
    this.m = new Map();
  }

  getItem(key) {
    return this.m.has(key) ? this.m.get(key) : null;
  }

  setItem(key, value) {
    this.m.set(key, String(value));
  }

  removeItem(key) {
    this.m.delete(key);
  }

  clear() {
    this.m.clear();
  }

  key(index) {
    return [...this.m.keys()][index] ?? null;
  }

  get length() {
    return this.m.size;
  }
}

globalThis.localStorage = new MemStorage();
