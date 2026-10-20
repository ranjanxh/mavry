import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppData } from '../../components/app/AppData';
import { EmptyState } from '../../components/app/EmptyState';
import { CreateProjectWizard } from '../../components/projects/CreateProjectWizard';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectRow } from '../../components/projects/ProjectRow';
import { ProjectToolbar } from '../../components/projects/ProjectToolbar';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { Icon } from '../../components/ui/Icon';
import { useToast } from '../../components/ui/Toast';
import {
  DEFAULT_PROJECT_QUERY, queryProjects, type ProjectLayout, type ProjectQuery, type ProjectView,
} from '../../domain/projects';
import { projectsUrl } from '../../routes';
import { services, storage } from '../../services';

const LAYOUT_KEY = 'projects-layout';

export default function ProjectsPage() {
  const { workspace, views } = useAppData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [query, setQuery] = useState<ProjectQuery>({ ...DEFAULT_PROJECT_QUERY, search: params.get('q') ?? '' });
  const [layout, setLayout] = useState<ProjectLayout>(() => (storage.get<ProjectLayout>(LAYOUT_KEY) === 'list' ? 'list' : 'grid'));
  const [wizard, setWizard] = useState(params.get('new') === '1');

  // The command palette deep-links here with ?q= or ?new=1, also when this page is already open.
  const q = params.get('q');
  const wantsNew = params.get('new') === '1';
  useEffect(() => { if (q !== null) setQuery((cur) => ({ ...cur, search: q })); }, [q]);
  useEffect(() => { if (wantsNew) setWizard(true); }, [wantsNew]);

  const closeWizard = () => {
    setWizard(false);
    if (wantsNew) navigate(projectsUrl(q ? { q } : {}), { replace: true });
  };

  const visible = useMemo(() => queryProjects(views, query), [views, query]);
  const filtering = query.search.trim() !== '' || query.filter !== 'all';

  const changeLayout = (next: ProjectLayout) => { setLayout(next); storage.set(LAYOUT_KEY, next); };

  const remove = async (view: ProjectView) => {
    const ok = await confirm({
      title: `Delete ${view.project.name}?`,
      body: (
        <>
          <p>This removes the project and its {view.pageCount} {view.pageCount === 1 ? 'page' : 'pages'} from {services.mock ? 'this browser’s demo data' : 'the workspace'}.</p>
          <p>{services.mock ? 'You can restore the sample projects with “Reset demo data”.' : 'This cannot be undone.'}</p>
        </>
      ),
      confirmLabel: 'Delete project', danger: true,
    });
    if (!ok) return;
    try {
      await services.projects.remove(view.project.id);
      toast(`Deleted ${view.project.name}.`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'The project could not be deleted.');
    }
  };

  const newButton = (
    <button type="button" className="btn b-blue" onClick={() => setWizard(true)}><Icon name="plus" size={16} />New project</button>
  );

  return (
    <section className="ap-page">
      <header className="ap-head">
        <div>
          <h1 className="ap-h1">Projects</h1>
          <p className="ap-muted">{workspace.name} · sample data</p>
        </div>
        {views.length > 0 && newButton}
      </header>

      {views.length === 0 ? (
        <EmptyState loud title="No projects in this workspace yet" action={newButton}>
          A project holds the pages, API reference, and verification checks for one product. Create one to get started.
        </EmptyState>
      ) : (
        <>
          <ProjectToolbar query={query} onQuery={setQuery} layout={layout} onLayout={changeLayout} />
          <p className="ap-count-line" role="status">Showing {visible.length} of {views.length} {views.length === 1 ? 'project' : 'projects'}</p>
          {visible.length === 0 ? (
            <EmptyState title="No projects match" action={filtering && <button type="button" className="btn b-soft" onClick={() => setQuery(DEFAULT_PROJECT_QUERY)}>Clear search and filters</button>}>
              Nothing in this workspace matches the current search and health filter.
            </EmptyState>
          ) : layout === 'grid' ? (
            <ul className="ap-grid">{visible.map((v) => <ProjectCard key={v.project.id} view={v} onDelete={remove} />)}</ul>
          ) : (
            <ul className="ap-list">{visible.map((v) => <ProjectRow key={v.project.id} view={v} onDelete={remove} />)}</ul>
          )}
        </>
      )}

      {wizard && (
        <CreateProjectWizard
          workspaceId={workspace.id} workspaceName={workspace.name}
          existingSlugs={views.map((v) => v.project.slug)}
          onClose={closeWizard}
          onCreated={(p) => { setQuery(DEFAULT_PROJECT_QUERY); toast(`Created ${p.name}.`); closeWizard(); }}
        />
      )}
    </section>
  );
}
