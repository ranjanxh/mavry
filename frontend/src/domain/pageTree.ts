import type { DocumentationPage, Id, PageCollection } from './types';

export type TreeNode =
  | { kind: 'collection'; id: Id; title: string; children: TreeNode[] }
  | { kind: 'page'; id: Id; title: string; status: DocumentationPage['status'] };

/** Collections first (by order), then loose pages (by title) at each level. Pure. */
export function buildPageTree(collections: PageCollection[], pages: DocumentationPage[]): TreeNode[] {
  const level = (parentId: Id | null): TreeNode[] => {
    const cols: TreeNode[] = collections
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((c) => ({ kind: 'collection', id: c.id, title: c.title, children: level(c.id) }));
    const own: TreeNode[] = pages
      .filter((p) => p.collectionId === parentId)
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((p) => ({ kind: 'page', id: p.id, title: p.title, status: p.status }));
    return [...cols, ...own];
  };
  const placed = (parentId: Id | null): TreeNode[] => {
    // A page whose collection no longer exists would vanish; keep it at the root instead.
    const orphans = pages.filter((p) => p.collectionId && !collections.some((c) => c.id === p.collectionId));
    const root = level(parentId);
    return parentId === null
      ? [...root, ...orphans.map<TreeNode>((p) => ({ kind: 'page', id: p.id, title: p.title, status: p.status }))]
      : root;
  };
  return placed(null);
}
