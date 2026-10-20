/**
 * Storage adapter. Services never touch localStorage directly, so persistence can be swapped.
 * localStorage is NOT a secure store: it is readable by any script on this origin. Demo state only.
 */
export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  /** Removes every key this adapter owns. */
  clear(): void;
}

const PREFIX = 'mavry:v1:';

export function createLocalStorageAdapter(prefix: string = PREFIX): StorageAdapter {
  // Falls back to memory when localStorage is blocked (private mode, disabled storage, quota).
  const memory = new Map<string, string>();
  const read = (k: string): string | null => {
    try { return window.localStorage.getItem(prefix + k); } catch { return memory.get(k) ?? null; }
  };
  const write = (k: string, v: string) => {
    try { window.localStorage.setItem(prefix + k, v); } catch { memory.set(k, v); }
  };
  return {
    get<T>(key: string): T | null {
      const raw = read(key);
      if (raw === null) return null;
      try { return JSON.parse(raw) as T; } catch { return null; }
    },
    set(key, value) { write(key, JSON.stringify(value)); },
    remove(key) {
      memory.delete(key);
      try { window.localStorage.removeItem(prefix + key); } catch { /* storage unavailable */ }
    },
    clear() {
      memory.clear();
      try {
        const owned: string[] = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(prefix)) owned.push(k);
        }
        owned.forEach((k) => window.localStorage.removeItem(k));
      } catch { /* storage unavailable */ }
    },
  };
}

export const storage: StorageAdapter = createLocalStorageAdapter();
