import { useMemo } from 'react';
import { Link, NavLink, useMatch } from 'react-router-dom';
import { buildPageTree } from '../../domain/pageTree';
import { ROUTES, projectRoutes } from '../../routes';
import { Icon, type IconName } from '../ui/Icon';
import { useAppData } from './AppData';
import { PageTree } from './PageTree';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

interface NavItem { to: string; label: string; icon: IconName; end?: boolean; soon?: boolean }

const WORKSPACE_NAV: NavItem[] = [
  { to: ROUTES.app, label: 'Dashboard', icon: 'home', end: true },
  { to: ROUTES.projects, label: 'Projects', icon: 'folder', end: true },
  { to: ROUTES.search, label: 'Search', icon: 'search', soon: true },
  { to: ROUTES.settingsGeneral, label: 'Settings', icon: 'settings', soon: true },
];

const projectNav = (id: string): NavItem[] => [
  { to: projectRoutes.overview(id), label: 'Overview', icon: 'home', end: true, soon: true },
  { to: projectRoutes.api(id), label: 'API reference', icon: 'file', soon: true },
  { to: projectRoutes.verification(id), label: 'Verification', icon: 'search', soon: true },
  { to: projectRoutes.github(id), label: 'GitHub', icon: 'repo', soon: true },
  { to: projectRoutes.changes(id), label: 'Change impact', icon: 'list', soon: true },
  { to: projectRoutes.history(id), label: 'History', icon: 'menu', soon: true },
];

function NavList({ items }: { items: NavItem[] }) {
  return (
    <ul className="ap-nav">
      {items.map((i) => (
        <li key={i.to}>
          <NavLink to={i.to} end={i.end} className="ap-nav-link">
            <Icon name={i.icon} />
            <span>{i.label}</span>
            {i.soon && <small className="ap-tag">Soon</small>}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const { views, collections, pages } = useAppData();
  const projectId = useMatch('/app/projects/:projectId/*')?.params.projectId;
  const current = views.find((v) => v.project.id === projectId);
  const tree = useMemo(
    () => (current ? buildPageTree(collections.filter((c) => c.projectId === current.project.id), pages.filter((p) => p.projectId === current.project.id)) : []),
    [current, collections, pages],
  );

  return (
    <aside className="ap-side" id="ap-sidebar" aria-label="Primary" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) onNavigate(); }}>
      <Link to={ROUTES.app} className="ap-brand"><span className="ap-brand-mark" aria-hidden="true">M</span>Mavry</Link>
      <WorkspaceSwitcher />
      <NavList items={WORKSPACE_NAV} />
      {current && (
        <section className="ap-side-section" aria-label={`Project ${current.project.name}`}>
          <h2 className="ap-side-title">{current.project.name}</h2>
          <NavList items={projectNav(current.project.id)} />
          <h3 className="ap-side-sub">Pages</h3>
          <PageTree projectId={current.project.id} nodes={tree} />
        </section>
      )}
      <p className="ap-side-note">
        Demo workspace. Sample data is stored in this browser only and is not a secure store.
      </p>
    </aside>
  );
}
