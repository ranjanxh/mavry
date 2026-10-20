import type { ApiEndpoint, DocumentationPage, VerificationCheck } from '../domain/types';

/** Fixed demo clock so relative times are stable. All data here is simulated. */
export const DEMO_NOW = '2026-10-20T12:06:00Z';
export const DEMO_PROJECT_ID = 'prj_payments';
const RUN = 'run_01HZX';
const REF = '7be20d';

export const SAMPLE_PAGES: Pick<DocumentationPage, 'id' | 'title'>[] = [
  { id: 'pg_auth', title: 'Authentication' },
  { id: 'pg_projects', title: 'Projects' },
  { id: 'pg_pagination', title: 'Pagination' },
  { id: 'pg_apiref', title: 'API reference' },
  { id: 'pg_quickstart', title: 'Quickstart' },
  { id: 'pg_webhooks', title: 'Webhooks' },
  { id: 'pg_errors', title: 'Error handling' },
];

const check = (
  id: string, pageId: string, name: string, type: VerificationCheck['type'],
  status: VerificationCheck['status'], ranAt: string | null, ref: string | null = REF,
): VerificationCheck => ({ id, runId: RUN, projectId: DEMO_PROJECT_ID, pageId, name, type, status, ranAt, ref });

export const SAMPLE_CHECKS: VerificationCheck[] = [
  check('chk_1', 'pg_auth', 'Authentication response schema', 'schema_validation', 'failed', '2026-10-20T12:04:00Z'),
  check('chk_2', 'pg_auth', 'Authentication request example', 'schema_validation', 'verified', '2026-10-20T12:04:00Z'),
  check('chk_3', 'pg_projects', 'Create project request example', 'schema_validation', 'verified', '2026-10-20T12:04:00Z'),
  check('chk_4', 'pg_pagination', 'Pagination response example', 'schema_validation', 'verified', '2026-10-20T12:04:00Z'),
  check('chk_5', 'pg_apiref', 'API endpoint reference', 'specification_validation', 'verified', '2026-10-20T12:04:00Z'),
  check('chk_6', 'pg_auth', 'Authentication error responses', 'freshness', 'warning', '2026-10-20T12:04:00Z'),
  check('chk_7', 'pg_quickstart', 'Token example on Quickstart', 'freshness', 'warning', '2026-10-20T12:04:00Z'),
  check('chk_8', 'pg_webhooks', 'Webhook payload example', 'schema_validation', 'pending', null),
  check('chk_9', 'pg_errors', 'Retry helper snippet', 'code_execution', 'not_verified', null, null),
];

export const SAMPLE_ENDPOINTS: ApiEndpoint[] = [
  { id: 'ep_list_projects', method: 'GET', path: '/api/v1/projects', summary: 'List projects', description: 'Returns the projects in the workspace, newest first.',
    parameters: [
      { name: 'limit', in: 'query', type: 'integer', description: 'Page size, 1 to 100. Default 20.' },
      { name: 'cursor', in: 'query', type: 'string', description: 'Cursor from the previous page.' },
    ], requestBody: null,
    response: { status: 200, example: '{\n  "data": [{ "id": "prj_01HZ", "name": "Payments API" }],\n  "next_cursor": "c_9a1f"\n}' } },
  { id: 'ep_create_project', method: 'POST', path: '/api/v1/projects', summary: 'Create a project', description: 'Creates a documentation project in the workspace.',
    parameters: [], requestBody: [
      { name: 'name', type: 'string', description: 'Required. Display name.' },
      { name: 'slug', type: 'string', description: 'Required. Unique in the workspace.' },
    ],
    response: { status: 201, example: '{\n  "id": "prj_01J2",\n  "name": "Developer Platform",\n  "slug": "developer-platform"\n}' } },
  { id: 'ep_list_pages', method: 'GET', path: '/api/v1/projects/{project_id}/pages', summary: 'List pages', description: 'Returns the page tree for a project.',
    parameters: [{ name: 'project_id', in: 'path', type: 'string', description: 'Project identifier.' }], requestBody: null,
    response: { status: 200, example: '{\n  "data": [{ "id": "pg_auth", "title": "Authentication", "status": "draft" }]\n}' } },
  { id: 'ep_start_run', method: 'POST', path: '/api/v1/projects/{project_id}/verification-runs', summary: 'Start a verification run', description: 'Queues checks for the whole project or selected pages.',
    parameters: [{ name: 'project_id', in: 'path', type: 'string', description: 'Project identifier.' }], requestBody: [
      { name: 'pages', type: 'string[]', description: 'Optional. Defaults to the whole project.' },
      { name: 'checks', type: 'string[]', description: 'schema, specification, freshness. Execution is planned.' },
      { name: 'ref', type: 'string', description: 'Optional branch or commit.' },
    ],
    response: { status: 202, example: '{\n  "id": "run_01HZX",\n  "status": "pending",\n  "created_at": "2026-10-20T12:04:11Z"\n}' } },
  { id: 'ep_get_run', method: 'GET', path: '/api/v1/verification-runs/{run_id}', summary: 'Get a verification run', description: 'Returns status and per-check results with evidence.',
    parameters: [{ name: 'run_id', in: 'path', type: 'string', description: 'Run identifier.' }], requestBody: null,
    response: { status: 200, example: '{\n  "id": "run_01HZX",\n  "status": "failed",\n  "results": [{ "check": "schema", "status": "failed" }]\n}' } },
  { id: 'ep_list_changes', method: 'GET', path: '/api/v1/projects/{project_id}/changes', summary: 'List code changes', description: 'Returns source changes and the pages they may affect.',
    parameters: [{ name: 'project_id', in: 'path', type: 'string', description: 'Project identifier.' }], requestBody: null,
    response: { status: 200, example: '{\n  "data": [{ "ref": "PR #482", "affected_pages": ["pg_auth"] }]\n}' } },
];
