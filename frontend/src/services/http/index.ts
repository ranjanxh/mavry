import type { Project, User, Workspace } from '../../domain/types';
import { API_PATHS, apiRequest } from '../http';
import { ServiceError, type Services } from '../types';

const planned = (what: string) => (): Promise<never> =>
  Promise.reject(new ServiceError('not_implemented', `${what} is not in the HTTP client yet (the endpoint is not in the API contract).`));

/**
 * HTTP implementation. Covers only what CLAUDE.md section 9 lists today; the rest rejects with
 * not_implemented so views show an honest error state. Response shapes are ASSUMED to match
 * the domain types until types are generated from the backend's OpenAPI document. Untested: no backend yet.
 */
export function createHttpServices(): Services {
  return {
    mock: false,
    projects: {
      list: async (workspaceId) => (await apiRequest<Project[]>('GET', API_PATHS.projects)).filter((p) => p.workspaceId === workspaceId),
      async get(id) {
        const found = (await apiRequest<Project[]>('GET', API_PATHS.projects)).find((p) => p.id === id);
        if (!found) throw new ServiceError('not_found', 'That project does not exist.');
        return found;
      },
      create: (input) => apiRequest<Project>('POST', API_PATHS.projects, input),
      remove: planned('Deleting a project'),
    },
    pages: {
      listPages: planned('Listing pages for a workspace'),
      listCollections: planned('Page collections'),
      get: planned('Reading one page'),
      create: (input) => apiRequest('POST', API_PATHS.projectPages(input.projectId), input),
    },
    api: { listEndpoints: planned('The API reference') },
    verification: { listChecks: planned('Listing checks'), listRuns: planned('Listing runs') },
    changes: { listChanges: planned('Listing changes'), listProposals: planned('Listing proposals') },
    revisions: { listRevisions: planned('Revisions') },
    repositories: { list: planned('Repositories'), get: planned('Repositories') },
    workspaces: {
      list: () => apiRequest<Workspace[]>('GET', API_PATHS.workspaces),
      currentUser: () => apiRequest<User>('GET', API_PATHS.me),
      activity: planned('The activity feed'),
    },
    resetDemoData() { /* nothing to reset against a real backend */ },
  };
}
