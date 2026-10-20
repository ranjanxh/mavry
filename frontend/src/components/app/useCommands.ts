import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, projectsUrl } from '../../routes';
import { services } from '../../services';
import { useToast } from '../ui/Toast';
import { useAppData } from './AppData';
import type { Command } from './CommandPalette';
import { useResetDemo } from './useResetDemo';

/** Only commands that really do something. Planned screens are deliberately absent. */
export function useCommands(toggleNav: () => void): Command[] {
  const { workspace, workspaces, views, switchWorkspace } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();
  const reset = useResetDemo();

  return useMemo<Command[]>(() => {
    const list: Command[] = [
      { id: 'go-dashboard', group: 'Go to', label: 'Dashboard', keywords: 'home overview workspace', run: () => navigate(ROUTES.app) },
      { id: 'go-projects', group: 'Go to', label: 'All projects', keywords: 'list', run: () => navigate(projectsUrl()) },
      { id: 'go-landing', group: 'Go to', label: 'Landing page', keywords: 'marketing public', run: () => navigate(ROUTES.home) },
      { id: 'create-project', group: 'Create', label: 'New project', keywords: 'wizard add', run: () => navigate(projectsUrl({ create: true })) },
      { id: 'toggle-nav', group: 'View', label: 'Toggle sidebar', run: toggleNav },
    ];
    for (const v of views) {
      list.push({ id: `find-${v.project.id}`, group: 'Projects', label: `Find “${v.project.name}” in the project list`, keywords: `${v.project.slug} ${v.project.description}`, run: () => navigate(projectsUrl({ q: v.project.name })) });
    }
    for (const w of workspaces) {
      if (w.id === workspace.id) continue;
      list.push({
        id: `ws-${w.id}`, group: 'Workspace', label: `Switch to ${w.name}`, keywords: 'change workspace',
        run: () => { switchWorkspace(w.id); navigate(ROUTES.app); toast(`Switched to ${w.name}.`); },
      });
    }
    if (services.mock) list.push({ id: 'reset-demo', group: 'Demo', label: 'Reset demo data', keywords: 'clear restore sample', run: () => { void reset(); } });
    return list;
  }, [views, workspaces, workspace.id, navigate, toast, toggleNav, switchWorkspace, reset]);
}
