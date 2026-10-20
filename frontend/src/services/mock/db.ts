import { DEMO_NOW } from '../../data/sample';
import { emitDataChange } from '../events';
import type { StorageAdapter } from '../storage';
import { seedState, type MockState } from './seed';

const STATE_KEY = 'mock-state';

/** Persisted mutable demo state. Everything reads and writes through here. */
export class MockDb {
  private state: MockState;

  constructor(private readonly store: StorageAdapter) {
    this.state = this.load();
  }

  private load(): MockState {
    const saved = this.store.get<MockState>(STATE_KEY);
    // Anything unexpected (older version, hand-edited storage) falls back to a fresh seed.
    const ok = saved && saved.version === 1 && Array.isArray(saved.projects) && Array.isArray(saved.pages)
      && Array.isArray(saved.collections) && Array.isArray(saved.activity);
    return ok ? saved : seedState();
  }

  read(): MockState { return this.state; }

  write(update: (draft: MockState) => MockState): void {
    this.state = update(this.state);
    this.store.set(STATE_KEY, this.state);
    emitDataChange();
  }

  reset(): void {
    this.store.clear();
    this.state = seedState();
  }
}

/** Mock clock. Never earlier than the fixed demo time, so new records always sort after seed data. */
export function mockNow(): string {
  const real = new Date().toISOString();
  return real > DEMO_NOW ? real : DEMO_NOW;
}

let counter = 0;
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

/** Simulated latency so loading states are real code paths, not dead code. */
export const delay = <T,>(value: T, ms = 120): Promise<T> => new Promise((resolve) => { window.setTimeout(() => resolve(value), ms); });
