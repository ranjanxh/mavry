import type { StorageAdapter } from '../storage';
import type { Services } from '../types';
import { MockDb } from './db';
import { createMockPageService, createMockProjectService } from './projects';
import { createMockReadOnlyServices } from './readonly';

export function createMockServices(store: StorageAdapter): Services {
  const db = new MockDb(store);
  return {
    mock: true,
    projects: createMockProjectService(db),
    pages: createMockPageService(db),
    ...createMockReadOnlyServices(db),
    resetDemoData() { db.reset(); },
  };
}
