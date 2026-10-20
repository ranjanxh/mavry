import { API_URL } from './config';
import { ServiceError } from './types';

/** Every backend path in one place. Components never build URLs. See CLAUDE.md section 9. */
export const API_PATHS = {
  me: '/api/v1/me',
  workspaces: '/api/v1/workspaces',
  projects: '/api/v1/projects',
  projectPages: (projectId: string) => `/api/v1/projects/${encodeURIComponent(projectId)}/pages`,
} as const;

/** The one API client. Maps transport failures to ServiceError so views can render error states. */
export async function apiRequest<T>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: body === undefined ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ServiceError('network', 'Could not reach the Mavry API. Check VITE_API_URL or switch back to mock mode.');
  }
  if (!res.ok) {
    const code = res.status === 404 ? 'not_found' : res.status === 409 ? 'conflict' : res.status === 422 ? 'validation' : 'network';
    throw new ServiceError(code, `The API answered ${res.status} for ${method} ${path}.`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}
