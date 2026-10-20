import { Link } from 'react-router-dom';
import { useAppData } from '../../components/app/AppData';
import { EmptyState } from '../../components/app/EmptyState';
import { Icon } from '../../components/ui/Icon';
import { StatusChip, SuggestionChip } from '../../components/ui/StatusChip';
import { STATUS_META, VERIFICATION_STATUSES } from '../../domain/status';
import { projectRoutes, projectsUrl, ROUTES } from '../../routes';
import { formatRelative } from '../../utils/format';

const RECENT_PROJECTS = 5;
const RECENT_ACTIVITY = 6;

export default function DashboardPage() {
  const { workspace, views, pages, summary, attention, activity } = useAppData();
  const finished = summary.counts.verified + summary.counts.failed;
  const newProject = <Link className="btn b-blue" to={projectsUrl({ create: true })}><Icon name="plus" size={16} />New project</Link>;

  return (
    <section className="ap-page">
      <header className="ap-head">
        <div>
          <h1 className="ap-h1">{workspace.name}</h1>
          <p className="ap-muted">{workspace.description} All figures below are derived from sample data.</p>
        </div>
        {views.length > 0 && newProject}
      </header>

      {views.length === 0 ? (
        <EmptyState loud title="Start with your first project" action={newProject}>
          Nothing has been documented in this workspace yet. A project holds pages, an API reference, and the checks that verify them.
        </EmptyState>
      ) : (
        <>
          <dl className="ap-metrics" aria-label="Workspace metrics">
            <Metric label="Projects" value={String(views.length)} note={`${pages.length} ${pages.length === 1 ? 'page' : 'pages'} in total`} />
            <Metric label="Checks" value={String(summary.total)} note={summary.total === 0 ? 'None have run yet' : 'Across all projects'} />
            <Metric
              label="Pass rate" value={summary.passRate === null ? 'None yet' : `${summary.passRate}%`}
              note={finished === 0 ? 'No check has finished' : `${summary.counts.verified} of ${finished} finished checks passed`}
            />
            <Metric label="Needs attention" value={String(attention.length)} note={attention.length === 0 ? 'Nothing waiting' : 'Failures, warnings, and suggestions'} />
          </dl>

          <ul className="ap-breakdown" aria-label="Checks by status">
            {VERIFICATION_STATUSES.filter((s) => summary.counts[s] > 0).map((s) => (
              <li key={s}><StatusChip status={s} label={`${STATUS_META[s].label} · ${summary.counts[s]}`} /></li>
            ))}
          </ul>
          <p className="ap-note">Freshness checks are heuristics and never count as proof that an example works.</p>

          <div className="ap-cols">
            <section className="ap-panel" aria-labelledby="dash-projects">
              <div className="ap-panel-head">
                <h2 id="dash-projects">Projects</h2>
                <Link to={ROUTES.projects}>View all</Link>
              </div>
              <ul className="ap-plain">
                {[...views].sort((a, b) => b.project.updatedAt.localeCompare(a.project.updatedAt)).slice(0, RECENT_PROJECTS).map((v) => (
                  <li key={v.project.id} className="ap-item">
                    <div>
                      <Link className="ap-item-title" to={projectRoutes.overview(v.project.id)}>{v.project.name}</Link>
                      <small>{v.pageCount} {v.pageCount === 1 ? 'page' : 'pages'} · updated {formatRelative(v.project.updatedAt)}</small>
                    </div>
                    <StatusChip status={v.health} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="ap-panel" aria-labelledby="dash-attention">
              <div className="ap-panel-head"><h2 id="dash-attention">Needs attention</h2></div>
              {attention.length === 0 ? (
                <p className="ap-muted">No failed checks, warnings, or open suggestions.</p>
              ) : (
                <ul className="ap-plain">
                  {attention.map((a) => (
                    <li key={`${a.kind}-${a.id}`} className="ap-item">
                      <div>
                        <Link className="ap-item-title" to={projectRoutes.page(a.projectId, a.pageId)}>{a.title}</Link>
                        <small>{views.find((v) => v.project.id === a.projectId)?.project.name} · {a.pageTitle}</small>
                      </div>
                      {a.kind === 'check' ? <StatusChip status={a.status} /> : <SuggestionChip label="AI suggestion · not verified" />}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="ap-panel ap-wide" aria-labelledby="dash-activity">
              <div className="ap-panel-head"><h2 id="dash-activity">Recent activity</h2></div>
              {activity.length === 0 ? (
                <p className="ap-muted">No activity yet.</p>
              ) : (
                <ul className="ap-plain">
                  {activity.slice(0, RECENT_ACTIVITY).map((e) => (
                    <li key={e.id} className="ap-item">
                      <Link className="ap-item-title" to={e.href}>{e.summary}</Link>
                      <small>{formatRelative(e.at)}</small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="ap-metric">
      <dt>{label}</dt>
      <dd>{value}</dd>
      <dd className="ap-metric-note">{note}</dd>
    </div>
  );
}
