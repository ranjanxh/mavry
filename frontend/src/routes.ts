/**
 * Central route table. Every path in the app comes from here so the router,
 * navigation, breadcrumbs and command palette can never drift apart.
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  docs: '/docs',
  app: '/app',
  projects: '/app/projects',
  search: '/app/search',
  settingsGeneral: '/app/settings/general',
  settingsMembers: '/app/settings/members',
  settingsIntegrations: '/app/settings/integrations',
  settingsAccount: '/app/settings/account',
} as const;

export const projectRoutes = {
  overview: (projectId: string) => `/app/projects/${projectId}`,
  page: (projectId: string, pageId: string) => `/app/projects/${projectId}/pages/${pageId}`,
  api: (projectId: string) => `/app/projects/${projectId}/api`,
  verification: (projectId: string) => `/app/projects/${projectId}/verification`,
  verificationRun: (projectId: string, runId: string) => `/app/projects/${projectId}/verification/${runId}`,
  github: (projectId: string) => `/app/projects/${projectId}/github`,
  changes: (projectId: string) => `/app/projects/${projectId}/changes`,
  history: (projectId: string) => `/app/projects/${projectId}/history`,
} as const;

export interface PlannedRoute {
  path: string;
  title: string;
  summary: string;
}

/** Routes from the product spec that are not built yet. They render an honest placeholder. */
export const PLANNED_ROUTES: PlannedRoute[] = [
  { path: ROUTES.login, title: 'Log in', summary: 'Demo authentication with a one-click demo workspace. Not production security.' },
  { path: ROUTES.signup, title: 'Sign up', summary: 'Mock registration with validation, then a short first-run setup.' },
  { path: ROUTES.docs, title: 'Published docs preview', summary: 'How the documentation looks to a reader, separate from the authoring app.' },
  { path: ROUTES.app, title: 'Workspace overview', summary: 'Projects, activity, verification summary, and what needs attention.' },
  { path: ROUTES.projects, title: 'Projects', summary: 'Search, filter, sort, and a three-step create-project flow.' },
  { path: '/app/projects/:projectId', title: 'Project overview', summary: 'Health, repository, latest run, and quick actions for one project.' },
  { path: '/app/projects/:projectId/pages/:pageId', title: 'Documentation editor', summary: 'Page tree, Markdown editor with preview, save states, and verification context.' },
  { path: '/app/projects/:projectId/api', title: 'API reference', summary: 'Endpoints, schemas, examples, and OpenAPI import.' },
  { path: '/app/projects/:projectId/verification', title: 'Verification center', summary: 'Checks, filters, run flow, and history.' },
  { path: '/app/projects/:projectId/verification/:runId', title: 'Verification run', summary: 'Failure evidence, expected versus observed, and suggested fixes.' },
  { path: '/app/projects/:projectId/github', title: 'GitHub integration', summary: 'Simulated repository, commits, pull requests, and source mappings.' },
  { path: '/app/projects/:projectId/changes', title: 'Change impact', summary: 'Which pages a code change may affect, and proposed updates to review.' },
  { path: '/app/projects/:projectId/history', title: 'Revision history', summary: 'Compare revisions and restore one into a draft.' },
  { path: ROUTES.search, title: 'Search', summary: 'One search across projects, pages, endpoints, issues, and changes.' },
  { path: ROUTES.settingsGeneral, title: 'Workspace settings', summary: 'Name, slug, description, and default visibility.' },
  { path: ROUTES.settingsMembers, title: 'Members and roles', summary: 'Invite members and change roles with central permission checks.' },
  { path: ROUTES.settingsIntegrations, title: 'Integrations', summary: 'GitHub, OpenAPI, and verification providers.' },
  { path: ROUTES.settingsAccount, title: 'Account', summary: 'Profile, theme, keyboard shortcuts, and demo sign-out.' },
];
