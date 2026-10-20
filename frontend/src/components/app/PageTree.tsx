import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { TreeNode } from '../../domain/pageTree';
import { projectRoutes } from '../../routes';
import { Icon } from '../ui/Icon';

interface Props { projectId: string; nodes: TreeNode[] }

/** Read-only page tree for the sidebar. Create, rename and move arrive with the editor milestone. */
export function PageTree({ projectId, nodes }: Props) {
  if (nodes.length === 0) return <p className="ap-side-empty">No pages yet.</p>;
  return <ul className="ap-tree">{nodes.map((n) => <TreeItem key={n.id} projectId={projectId} node={n} />)}</ul>;
}

function TreeItem({ projectId, node }: { projectId: string; node: TreeNode }) {
  const [open, setOpen] = useState(true);
  if (node.kind === 'page') {
    return (
      <li>
        <NavLink className="ap-tree-link" to={projectRoutes.page(projectId, node.id)}>
          <Icon name="file" size={15} />
          <span>{node.title}</span>
          {node.status === 'draft' && <small className="ap-tag">Draft</small>}
        </NavLink>
      </li>
    );
  }
  return (
    <li>
      <button type="button" className="ap-tree-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className={`ap-tree-caret${open ? ' open' : ''}`}><Icon name="chevron" size={13} /></span>
        {node.title}
      </button>
      {open && <ul className="ap-tree ap-tree-nested">{node.children.map((c) => <TreeItem key={c.id} projectId={projectId} node={c} />)}</ul>}
    </li>
  );
}
