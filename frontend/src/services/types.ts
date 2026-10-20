import type {
  ActivityEvent, ApiEndpoint, CodeChange, DocumentationPage, Id, PageCollection, ProposedDocumentationChange,
  Project, Repository, User, VerificationCheck, VerificationRun, PageRevision, Workspace,
} from '../domain/types';

export type ServiceErrorCode = 'not_found' | 'validation' | 'conflict' | 'network' | 'not_implemented';

export class ServiceError extends Error {
  constructor(public readonly code: ServiceErrorCode, message: string) {
    super(message);
    this.name = 'ServiceError';
  }
}

/** Narrow a request to one workspace or one project. Omit both for everything the user can see. */
export interface Scope { workspaceId?: Id; projectId?: Id }

export interface CreateProjectInput { workspaceId: Id; name: string; slug: string; description: string }
export interface CreatePageInput { projectId: Id; title: string; collectionId?: Id | null; markdown?: string }

export interface ProjectService {
  list(workspaceId: Id): Promise<Project[]>;
  get(id: Id): Promise<Project>;
  create(input: CreateProjectInput): Promise<Project>;
  remove(id: Id): Promise<void>;
}
export interface PageService {
  listPages(scope: Scope): Promise<DocumentationPage[]>;
  listCollections(scope: Scope): Promise<PageCollection[]>;
  get(id: Id): Promise<DocumentationPage>;
  create(input: CreatePageInput): Promise<DocumentationPage>;
}
export interface ApiService { listEndpoints(projectId: Id): Promise<ApiEndpoint[]> }
export interface VerificationService {
  listChecks(scope: Scope): Promise<VerificationCheck[]>;
  listRuns(scope: Scope): Promise<VerificationRun[]>;
}
export interface ChangeService {
  listChanges(projectId: Id): Promise<CodeChange[]>;
  listProposals(scope: Scope): Promise<ProposedDocumentationChange[]>;
}
export interface RevisionService { listRevisions(pageId: Id): Promise<PageRevision[]> }
export interface RepositoryService {
  list(): Promise<Repository[]>;
  get(id: Id): Promise<Repository>;
}
export interface WorkspaceService {
  list(): Promise<Workspace[]>;
  currentUser(): Promise<User>;
  activity(workspaceId: Id): Promise<ActivityEvent[]>;
}

export interface Services {
  /** True when every service is backed by sample data in this browser. */
  readonly mock: boolean;
  projects: ProjectService;
  pages: PageService;
  api: ApiService;
  verification: VerificationService;
  changes: ChangeService;
  revisions: RevisionService;
  repositories: RepositoryService;
  workspaces: WorkspaceService;
  /** Clears demo state. Mock mode only. */
  resetDemoData(): void;
}
