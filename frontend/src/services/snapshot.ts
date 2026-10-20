import type {
  ActivityEvent, DocumentationPage, PageCollection, Project, ProposedDocumentationChange, Repository, User,
  VerificationCheck, VerificationRun, Workspace,
} from '../domain/types';
import { ServiceError } from './types';
import { services } from './index';

/** Everything the app shell and the workspace pages need, loaded together through the service layer. */
export interface WorkspaceSnapshot {
  user: User;
  workspaces: Workspace[];
  workspace: Workspace;
  projects: Project[];
  pages: DocumentationPage[];
  collections: PageCollection[];
  checks: VerificationCheck[];
  runs: VerificationRun[];
  proposals: ProposedDocumentationChange[];
  repositories: Repository[];
  activity: ActivityEvent[];
}

export async function loadSnapshot(preferredWorkspaceId: string | null): Promise<WorkspaceSnapshot> {
  const [workspaces, user] = await Promise.all([services.workspaces.list(), services.workspaces.currentUser()]);
  const workspace = workspaces.find((w) => w.id === preferredWorkspaceId) ?? workspaces[0];
  if (!workspace) throw new ServiceError('not_found', 'No workspace is available for this account.');
  const scope = { workspaceId: workspace.id };
  const [projects, pages, collections, checks, runs, proposals, repositories, activity] = await Promise.all([
    services.projects.list(workspace.id),
    services.pages.listPages(scope),
    services.pages.listCollections(scope),
    services.verification.listChecks(scope),
    services.verification.listRuns(scope),
    services.changes.listProposals(scope),
    services.repositories.list(),
    services.workspaces.activity(workspace.id),
  ]);
  return { user, workspaces, workspace, projects, pages, collections, checks, runs, proposals, repositories, activity };
}
