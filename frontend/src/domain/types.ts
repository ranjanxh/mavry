import type { CheckType, VerificationStatus } from './status';

export type Id = string;
export type IsoDate = string;

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';
export type PublicationStatus = 'draft' | 'published';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface User { id: Id; name: string; email: string; }
export interface Workspace { id: Id; name: string; slug: string; description: string; }
export interface WorkspaceMember { userId: Id; workspaceId: Id; role: Role; status: 'active' | 'invited'; joinedAt: IsoDate | null; }

export interface Project { id: Id; workspaceId: Id; name: string; slug: string; description: string; repositoryId: Id | null; updatedAt: IsoDate; }
export interface PageCollection { id: Id; projectId: Id; parentId: Id | null; title: string; order: number; }
export interface DocumentationPage {
  id: Id; projectId: Id; collectionId: Id | null; title: string; slug: string;
  markdown: string; status: PublicationStatus; updatedAt: IsoDate; updatedBy: Id;
}

export interface ApiParameter { name: string; in: 'path' | 'query' | 'header'; type: string; description: string; }
export interface ApiField { name: string; type: string; description: string; }
export interface ApiEndpoint {
  id: Id; method: HttpMethod; path: string; summary: string; description: string;
  parameters: ApiParameter[]; requestBody: ApiField[] | null;
  response: { status: number; example: string };
}
export interface ApiSpecification { id: Id; projectId: Id; title: string; version: string; endpointIds: Id[]; }

export interface Repository { id: Id; owner: string; name: string; defaultBranch: string; simulated: true; }
export interface SourceMapping { id: Id; pageId: Id; repositoryId: Id; filePath: string; }
export interface CodeChange { id: Id; ref: string; title: string; authorId: Id; at: IsoDate; changedFiles: string[]; }

export type RunTrigger = 'manual' | 'push' | 'pull_request';
export interface VerificationRun { id: Id; projectId: Id; status: VerificationStatus; trigger: RunTrigger; startedAt: IsoDate; finishedAt: IsoDate | null; ref: string; simulated: true; }
export interface VerificationCheck {
  id: Id; runId: Id; projectId: Id; pageId: Id; name: string; type: CheckType;
  status: VerificationStatus; ranAt: IsoDate | null; ref: string | null;
}

export type ProposalState = 'open' | 'accepted' | 'rejected' | 'deferred';
export interface ProposedDocumentationChange {
  id: Id; pageId: Id; changeId: Id; checkId: Id; before: string; after: string;
  reason: string; state: ProposalState; generatedByAi: true;
}
export interface PageRevision { id: Id; pageId: Id; number: number; authorId: Id; at: IsoDate; summary: string; changeRef: string | null; status: PublicationStatus; }
export interface ActivityEvent { id: Id; kind: string; at: IsoDate; href: string; summary: string; }
