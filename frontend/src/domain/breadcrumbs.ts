import { ROUTES, projectRoutes } from '../routes';

export interface Crumb { label: string; to?: string }
export interface CrumbNames { workspace: string; project?: string; page?: string }

const SECTION_LABEL: Record<string, string> = {
  api: 'API reference', verification: 'Verification', github: 'GitHub', changes: 'Change impact', history: 'Revision history',
};
const SETTINGS_LABEL: Record<string, string> = {
  general: 'General', members: 'Members and roles', integrations: 'Integrations', account: 'Account',
};

/** Pure: pathname plus resolved names in, crumbs out. The last crumb has no link. */
export function buildBreadcrumbs(pathname: string, names: CrumbNames): Crumb[] {
  const seg = pathname.replace(/\/+$/, '').split('/').filter(Boolean); // ['app', ...]
  const crumbs: Crumb[] = [{ label: names.workspace, to: ROUTES.app }];
  if (seg[1] === 'projects') {
    crumbs.push({ label: 'Projects', to: ROUTES.projects });
    if (seg[2]) {
      const id = seg[2];
      crumbs.push({ label: names.project ?? 'Project', to: projectRoutes.overview(id) });
      if (seg[3] === 'pages') crumbs.push({ label: names.page ?? 'Page' });
      else if (seg[3]) {
        crumbs.push({ label: SECTION_LABEL[seg[3]] ?? seg[3], to: `${projectRoutes.overview(id)}/${seg[3]}` });
        if (seg[4]) crumbs.push({ label: `Run ${seg[4]}` });
      }
    }
  } else if (seg[1] === 'search') crumbs.push({ label: 'Search' });
  else if (seg[1] === 'settings') {
    crumbs.push({ label: 'Settings' });
    if (seg[2]) crumbs.push({ label: SETTINGS_LABEL[seg[2]] ?? seg[2] });
  }
  const last = crumbs[crumbs.length - 1];
  return [...crumbs.slice(0, -1), { label: last.label }];
}
