import type { Project } from '../../domain/types';
import { projectRoutes, ROUTES } from '../../routes';
import { ServiceError, type CreatePageInput, type CreateProjectInput, type PageService, type ProjectService, type Scope } from '../types';
import { delay, mockNow, newId, type MockDb } from './db';
import { DEMO_USER } from './seed';

/** Project ids in scope. Pages, checks and proposals of deleted projects disappear with them. */
export function projectIdsInScope(db: MockDb, scope: Scope): Set<string> {
  const { projects } = db.read();
  return new Set(
    projects
      .filter((p) => (!scope.workspaceId || p.workspaceId === scope.workspaceId) && (!scope.projectId || p.id === scope.projectId))
      .map((p) => p.id),
  );
}

export function createMockProjectService(db: MockDb): ProjectService {
  return {
    list: (workspaceId) => delay(db.read().projects.filter((p) => p.workspaceId === workspaceId)),

    async get(id) {
      const found = db.read().projects.find((p) => p.id === id);
      if (!found) throw new ServiceError('not_found', 'That project does not exist or was deleted.');
      return delay(found);
    },

    async create(input: CreateProjectInput) {
      const name = input.name.trim();
      if (name.length < 2) throw new ServiceError('validation', 'A project needs a name.');
      if (db.read().projects.some((p) => p.workspaceId === input.workspaceId && p.slug === input.slug)) {
        throw new ServiceError('conflict', 'That slug is already used in this workspace.');
      }
      const project: Project = {
        id: newId('prj'), workspaceId: input.workspaceId, name, slug: input.slug,
        description: input.description.trim(), repositoryId: null, updatedAt: mockNow(),
      };
      db.write((s) => ({
        ...s,
        projects: [project, ...s.projects],
        activity: [{ id: newId('act'), workspaceId: project.workspaceId, kind: 'project.created', at: project.updatedAt, href: projectRoutes.overview(project.id), summary: `${name} was created.` }, ...s.activity],
      }));
      return delay(project);
    },

    async remove(id) {
      const target = db.read().projects.find((p) => p.id === id);
      if (!target) throw new ServiceError('not_found', 'That project was already deleted.');
      db.write((s) => ({
        ...s,
        projects: s.projects.filter((p) => p.id !== id),
        collections: s.collections.filter((c) => c.projectId !== id),
        pages: s.pages.filter((p) => p.projectId !== id),
        // Links to a deleted project would 404, so its older events go; the deletion itself is recorded.
        activity: [
          { id: newId('act'), workspaceId: target.workspaceId, kind: 'project.deleted', at: mockNow(), href: ROUTES.projects, summary: `${target.name} was deleted.` },
          ...s.activity.filter((a) => !a.href.startsWith(projectRoutes.overview(id))),
        ],
      }));
      await delay(undefined);
    },
  };
}

export function createMockPageService(db: MockDb): PageService {
  return {
    listPages: (scope) => {
      const ids = projectIdsInScope(db, scope);
      return delay(db.read().pages.filter((p) => ids.has(p.projectId)));
    },
    listCollections: (scope) => {
      const ids = projectIdsInScope(db, scope);
      return delay(db.read().collections.filter((c) => ids.has(c.projectId)));
    },
    async get(id) {
      const found = db.read().pages.find((p) => p.id === id);
      if (!found) throw new ServiceError('not_found', 'That page does not exist.');
      return delay(found);
    },
    async create(input: CreatePageInput) {
      const project = db.read().projects.find((p) => p.id === input.projectId);
      if (!project) throw new ServiceError('not_found', 'The project for this page no longer exists.');
      const title = input.title.trim() || 'Untitled';
      const now = mockNow();
      const page = {
        id: newId('pg'), projectId: input.projectId, collectionId: input.collectionId ?? null, title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled',
        markdown: input.markdown ?? `# ${title}\n`, status: 'draft' as const, updatedAt: now, updatedBy: DEMO_USER.id,
      };
      db.write((s) => ({
        ...s,
        pages: [...s.pages, page],
        projects: s.projects.map((p) => (p.id === project.id ? { ...p, updatedAt: now } : p)),
      }));
      return delay(page);
    },
  };
}
