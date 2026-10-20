import type { DocumentationPage, Id, ProposedDocumentationChange, VerificationCheck } from './types';
import type { VerificationStatus } from './status';

/** One row in the "needs attention" queue. Derived from checks and proposals, never stored. */
export type AttentionItem =
  | { kind: 'check'; id: Id; status: Extract<VerificationStatus, 'failed' | 'warning'>; title: string; pageTitle: string; projectId: Id; pageId: Id }
  | { kind: 'suggestion'; id: Id; title: string; pageTitle: string; projectId: Id; pageId: Id };

export function buildAttentionQueue(
  checks: VerificationCheck[], proposals: ProposedDocumentationChange[], pages: DocumentationPage[],
): AttentionItem[] {
  const pageOf = (id: Id) => pages.find((p) => p.id === id);
  const items: AttentionItem[] = [];
  for (const c of checks) {
    const page = pageOf(c.pageId);
    if (!page || (c.status !== 'failed' && c.status !== 'warning')) continue;
    items.push({ kind: 'check', id: c.id, status: c.status, title: c.name, pageTitle: page.title, projectId: c.projectId, pageId: c.pageId });
  }
  for (const p of proposals) {
    const page = pageOf(p.pageId);
    if (!page || p.state !== 'open') continue;
    items.push({ kind: 'suggestion', id: p.id, title: `Suggested update for ${page.title}`, pageTitle: page.title, projectId: page.projectId, pageId: p.pageId });
  }
  // Failed first, then warnings, then suggestions awaiting review.
  const rank = (i: AttentionItem) => (i.kind === 'suggestion' ? 2 : i.status === 'failed' ? 0 : 1);
  return items.sort((a, b) => rank(a) - rank(b));
}
