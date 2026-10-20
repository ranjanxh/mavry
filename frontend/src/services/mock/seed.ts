import {
  DEMO_NOW, DEMO_PROJECT_ID, SAMPLE_CHECKS, SAMPLE_ENDPOINTS, SAMPLE_PAGES,
} from '../../data/sample';
import type {
  ActivityEvent, CodeChange, DocumentationPage, Id, PageCollection, PageRevision, Project,
  ProposedDocumentationChange, Repository, User, VerificationRun, Workspace,
} from '../../domain/types';
import { summarizeChecks, worstStatus } from '../../domain/verification';
import { projectRoutes } from '../../routes';

/**
 * Everything here is simulated sample data. The mock services read it; only the mutable part
 * (MockState) is persisted to the storage adapter.
 */
export const DEMO_USER: User = { id: 'usr_demo', name: 'Demo User', email: 'demo@mavry.example' };

export const SEED_WORKSPACES: Workspace[] = [
  { id: 'ws_acme', name: 'Acme Platform', slug: 'acme-platform', description: 'Sample workspace with three projects.' },
  { id: 'ws_sandbox', name: 'Personal sandbox', slug: 'sandbox', description: 'Sample workspace with no projects yet.' },
];

export const SEED_REPOSITORIES: Repository[] = [
  { id: 'repo_payments', owner: 'acme', name: 'payments-api', defaultBranch: 'main', simulated: true },
  { id: 'repo_sdk', owner: 'acme', name: 'client-sdk', defaultBranch: 'main', simulated: true },
];

const iso = (s: string) => `${s}Z`;

const SEED_PROJECTS: Project[] = [
  { id: DEMO_PROJECT_ID, workspaceId: 'ws_acme', name: 'Payments API', slug: 'payments-api', description: 'Public reference and guides for the payments API.', repositoryId: 'repo_payments', updatedAt: iso('2026-10-20T11:50:00') },
  { id: 'prj_platform', workspaceId: 'ws_acme', name: 'Developer Platform', slug: 'developer-platform', description: 'Onboarding docs for internal and partner developers.', repositoryId: null, updatedAt: iso('2026-10-18T09:20:00') },
  { id: 'prj_sdk', workspaceId: 'ws_acme', name: 'Client SDK guide', slug: 'client-sdk-guide', description: 'Install and usage notes for the client libraries.', repositoryId: 'repo_sdk', updatedAt: iso('2026-10-12T15:05:00') },
];

const pg = (id: string, projectId: Id, collectionId: Id | null, title: string, status: DocumentationPage['status'], at: string): DocumentationPage => ({
  id, projectId, collectionId, title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  markdown: `# ${title}\n\nSample page. The Markdown editor arrives in a later milestone.\n`,
  status, updatedAt: iso(at), updatedBy: DEMO_USER.id,
});

const titleOf = (id: string) => SAMPLE_PAGES.find((p) => p.id === id)?.title ?? id;

const SEED_COLLECTIONS: PageCollection[] = [
  { id: 'col_start', projectId: DEMO_PROJECT_ID, parentId: null, title: 'Getting started', order: 0 },
  { id: 'col_guides', projectId: DEMO_PROJECT_ID, parentId: null, title: 'Guides', order: 1 },
  { id: 'col_plat_intro', projectId: 'prj_platform', parentId: null, title: 'Introduction', order: 0 },
];

const SEED_PAGES: DocumentationPage[] = [
  pg('pg_quickstart', DEMO_PROJECT_ID, 'col_start', titleOf('pg_quickstart'), 'published', '2026-10-19T10:00:00'),
  pg('pg_auth', DEMO_PROJECT_ID, 'col_start', titleOf('pg_auth'), 'draft', '2026-10-20T11:50:00'),
  pg('pg_projects', DEMO_PROJECT_ID, 'col_guides', titleOf('pg_projects'), 'published', '2026-10-17T14:00:00'),
  pg('pg_pagination', DEMO_PROJECT_ID, 'col_guides', titleOf('pg_pagination'), 'published', '2026-10-16T09:30:00'),
  pg('pg_webhooks', DEMO_PROJECT_ID, 'col_guides', titleOf('pg_webhooks'), 'draft', '2026-10-15T16:45:00'),
  pg('pg_errors', DEMO_PROJECT_ID, 'col_guides', titleOf('pg_errors'), 'draft', '2026-10-14T13:10:00'),
  pg('pg_apiref', DEMO_PROJECT_ID, null, titleOf('pg_apiref'), 'published', '2026-10-13T08:15:00'),
  pg('pg_plat_welcome', 'prj_platform', 'col_plat_intro', 'Welcome', 'published', '2026-10-18T09:20:00'),
  pg('pg_plat_access', 'prj_platform', 'col_plat_intro', 'Requesting access', 'draft', '2026-10-17T11:00:00'),
  pg('pg_sdk_install', 'prj_sdk', null, 'Installation', 'published', '2026-10-12T15:05:00'),
];

export interface StoredActivity extends ActivityEvent { workspaceId: Id }

const SEED_ACTIVITY: StoredActivity[] = [
  { id: 'act_1', workspaceId: 'ws_acme', kind: 'run.finished', at: iso('2026-10-20T12:04:00'), href: projectRoutes.verificationRun(DEMO_PROJECT_ID, 'run_01HZX'), summary: 'Verification run run_01HZX finished on Payments API (simulated).' },
  { id: 'act_2', workspaceId: 'ws_acme', kind: 'change.detected', at: iso('2026-10-20T11:58:00'), href: projectRoutes.changes(DEMO_PROJECT_ID), summary: 'PR #482 changed files mapped to Authentication.' },
  { id: 'act_3', workspaceId: 'ws_acme', kind: 'page.edited', at: iso('2026-10-20T11:50:00'), href: projectRoutes.page(DEMO_PROJECT_ID, 'pg_auth'), summary: 'Authentication was edited and saved as a draft.' },
  { id: 'act_4', workspaceId: 'ws_acme', kind: 'project.created', at: iso('2026-10-18T09:20:00'), href: projectRoutes.overview('prj_platform'), summary: 'Developer Platform was created.' },
  { id: 'act_5', workspaceId: 'ws_acme', kind: 'page.published', at: iso('2026-10-16T09:30:00'), href: projectRoutes.page(DEMO_PROJECT_ID, 'pg_pagination'), summary: 'Pagination was published.' },
];

/** The mutable, persisted part of the demo. */
export interface MockState {
  version: 1;
  projects: Project[];
  collections: PageCollection[];
  pages: DocumentationPage[];
  activity: StoredActivity[];
}

export const seedState = (): MockState => ({
  version: 1,
  projects: structuredClone(SEED_PROJECTS),
  collections: structuredClone(SEED_COLLECTIONS),
  pages: structuredClone(SEED_PAGES),
  activity: structuredClone(SEED_ACTIVITY),
});

/** Read-only sample records. */
export const STATIC = {
  checks: SAMPLE_CHECKS,
  endpoints: SAMPLE_ENDPOINTS,
  changes: [
    { id: 'chg_482', ref: 'PR #482', title: 'Rename the token response field', authorId: DEMO_USER.id, at: iso('2026-10-20T11:58:00'), changedFiles: ['src/auth/token.py', 'openapi/auth.yaml'] },
  ] as CodeChange[],
  proposals: [
    {
      id: 'prop_1', pageId: 'pg_auth', changeId: 'chg_482', checkId: 'chk_1',
      before: '"access_token": "sk_live_..."', after: '"token": "sk_live_..."',
      reason: 'The response schema no longer contains access_token.', state: 'open', generatedByAi: true,
    },
  ] as ProposedDocumentationChange[],
  revisions: [
    { id: 'rev_1', pageId: 'pg_auth', number: 1, authorId: DEMO_USER.id, at: iso('2026-10-19T10:00:00'), summary: 'Initial draft', changeRef: null, status: 'draft' },
  ] as PageRevision[],
};

/** Run status is derived from the run's checks (rule 8), never typed by hand. */
export const STATIC_RUNS: VerificationRun[] = (() => {
  const checks = SAMPLE_CHECKS.filter((c) => c.runId === 'run_01HZX');
  return [{
    id: 'run_01HZX', projectId: DEMO_PROJECT_ID, status: worstStatus(summarizeChecks(checks)), trigger: 'manual',
    startedAt: iso('2026-10-20T12:03:40'), finishedAt: iso('2026-10-20T12:04:00'), ref: '7be20d', simulated: true,
  }];
})();

export { DEMO_NOW };
