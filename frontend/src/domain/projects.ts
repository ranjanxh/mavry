import type { DocumentationPage, Project, Repository, VerificationCheck } from './types';
import { STATUS_META, VERIFICATION_STATUSES, type VerificationStatus } from './status';
import { summarizeChecks, worstStatus, type VerificationSummary } from './verification';

export type ProjectFilter = 'all' | VerificationStatus;
export type ProjectSort = 'updated' | 'name' | 'health';
export type ProjectLayout = 'grid' | 'list';

export interface ProjectQuery { search: string; filter: ProjectFilter; sort: ProjectSort }
export const DEFAULT_PROJECT_QUERY: ProjectQuery = { search: '', filter: 'all', sort: 'updated' };

export const PROJECT_SORTS: ProjectSort[] = ['updated', 'name', 'health'];
export const PROJECT_SORT_LABEL: Record<ProjectSort, string> = {
  updated: 'Recently updated', name: 'Name (A to Z)', health: 'Needs attention first',
};
export const PROJECT_FILTERS: ProjectFilter[] = ['all', ...VERIFICATION_STATUSES];
export const projectFilterLabel = (f: ProjectFilter): string => (f === 'all' ? 'All health states' : STATUS_META[f].label);

/** A project joined with everything derived from its records. Nothing here is stored. */
export interface ProjectView {
  project: Project;
  health: VerificationStatus;
  summary: VerificationSummary;
  pageCount: number;
  repository: Repository | null;
}

export function buildProjectViews(
  projects: Project[], checks: VerificationCheck[], pages: DocumentationPage[], repositories: Repository[],
): ProjectView[] {
  return projects.map((project) => {
    const summary = summarizeChecks(checks.filter((c) => c.projectId === project.id));
    return {
      project, summary, health: worstStatus(summary),
      pageCount: pages.filter((p) => p.projectId === project.id).length,
      repository: repositories.find((r) => r.id === project.repositoryId) ?? null,
    };
  });
}

const SEVERITY: Record<VerificationStatus, number> = { failed: 0, warning: 1, pending: 2, not_verified: 3, verified: 4 };

export function queryProjects(views: ProjectView[], q: ProjectQuery): ProjectView[] {
  const term = q.search.trim().toLowerCase();
  const out = views.filter((v) => {
    if (q.filter !== 'all' && v.health !== q.filter) return false;
    if (!term) return true;
    return `${v.project.name} ${v.project.slug} ${v.project.description}`.toLowerCase().includes(term);
  });
  const byName = (a: ProjectView, b: ProjectView) => a.project.name.localeCompare(b.project.name);
  out.sort((a, b) => {
    if (q.sort === 'name') return byName(a, b);
    if (q.sort === 'health') return SEVERITY[a.health] - SEVERITY[b.health] || byName(a, b);
    return b.project.updatedAt.localeCompare(a.project.updatedAt) || byName(a, b);
  });
  return out;
}

export function slugify(input: string): string {
  return input.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48).replace(/-+$/g, '');
}

export type ProjectTemplate = 'blank' | 'starter';
export interface ProjectDraft { name: string; slug: string; description: string; template: ProjectTemplate }
export type DraftErrors = Partial<Record<'name' | 'slug' | 'description', string>>;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateDraftBasics(draft: ProjectDraft, existingSlugs: string[]): DraftErrors {
  const errors: DraftErrors = {};
  if (draft.name.trim().length < 2) errors.name = 'Give the project a name of at least 2 characters.';
  else if (draft.name.trim().length > 60) errors.name = 'Keep the name under 60 characters.';
  if (!SLUG_RE.test(draft.slug)) errors.slug = 'Use lowercase letters, numbers, and single hyphens.';
  else if (existingSlugs.includes(draft.slug)) errors.slug = 'Another project in this workspace already uses this slug.';
  if (draft.description.length > 200) errors.description = 'Keep the description under 200 characters.';
  return errors;
}

export const STARTER_PAGES = ['Quickstart', 'Authentication', 'API reference'] as const;
