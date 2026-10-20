import { ServiceError } from '../types';
import type {
  ApiService, ChangeService, RepositoryService, RevisionService, VerificationService, WorkspaceService,
} from '../types';
import { delay, type MockDb } from './db';
import { projectIdsInScope } from './projects';
import { DEMO_USER, SEED_REPOSITORIES, SEED_WORKSPACES, STATIC, STATIC_RUNS } from './seed';

/** Sample records that do not change in the demo. They still respect project deletion. */
export function createMockReadOnlyServices(db: MockDb): {
  api: ApiService; verification: VerificationService; changes: ChangeService; revisions: RevisionService;
  repositories: RepositoryService; workspaces: WorkspaceService;
} {
  const pageProject = (pageId: string) => db.read().pages.find((p) => p.id === pageId)?.projectId;
  return {
    api: { listEndpoints: () => delay(STATIC.endpoints) },

    verification: {
      listChecks: (scope) => {
        const ids = projectIdsInScope(db, scope);
        return delay(STATIC.checks.filter((c) => ids.has(c.projectId)));
      },
      listRuns: (scope) => {
        const ids = projectIdsInScope(db, scope);
        return delay(STATIC_RUNS.filter((r) => ids.has(r.projectId)));
      },
    },

    changes: {
      listChanges: () => delay(STATIC.changes),
      listProposals: (scope) => {
        const ids = projectIdsInScope(db, scope);
        return delay(STATIC.proposals.filter((p) => ids.has(pageProject(p.pageId) ?? '')));
      },
    },

    revisions: { listRevisions: (pageId) => delay(STATIC.revisions.filter((r) => r.pageId === pageId)) },

    repositories: {
      list: () => delay(SEED_REPOSITORIES),
      async get(id) {
        const found = SEED_REPOSITORIES.find((r) => r.id === id);
        if (!found) throw new ServiceError('not_found', 'That repository does not exist.');
        return delay(found);
      },
    },

    workspaces: {
      list: () => delay(SEED_WORKSPACES),
      currentUser: () => delay(DEMO_USER),
      activity: (workspaceId) => delay(
        db.read().activity
          .filter((a) => a.workspaceId === workspaceId)
          .sort((a, b) => b.at.localeCompare(a.at))
          .map(({ workspaceId: _ws, ...event }) => event),
      ),
    },
  };
}
