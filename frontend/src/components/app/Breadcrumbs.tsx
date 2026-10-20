import { Link, useLocation, useMatch } from 'react-router-dom';
import { buildBreadcrumbs } from '../../domain/breadcrumbs';
import { useAppData } from './AppData';

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const { workspace, views, pages } = useAppData();
  const project = useMatch('/app/projects/:projectId/*')?.params.projectId;
  const pageId = useMatch('/app/projects/:projectId/pages/:pageId')?.params.pageId;
  const crumbs = buildBreadcrumbs(pathname, {
    workspace: workspace.name,
    project: views.find((v) => v.project.id === project)?.project.name,
    page: pages.find((p) => p.id === pageId)?.title,
  });
  return (
    <nav className="ap-crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`}>
            {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
