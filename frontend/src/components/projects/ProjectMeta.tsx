import type { ProjectView } from '../../domain/projects';
import { formatRelative } from '../../utils/format';
import { StatusChip } from '../ui/StatusChip';

/** Health chip with the evidence behind it: how many checks exist. Shared by card and row. */
export function ProjectHealth({ view }: { view: ProjectView }) {
  return (
    <span className="ap-health">
      <StatusChip status={view.health} />
      <small>{view.summary.total === 0 ? 'No checks yet' : `${view.summary.total} ${view.summary.total === 1 ? 'check' : 'checks'}`}</small>
    </span>
  );
}

export function ProjectFacts({ view }: { view: ProjectView }) {
  return (
    <ul className="ap-facts">
      <li>{view.pageCount} {view.pageCount === 1 ? 'page' : 'pages'}</li>
      <li>{view.repository ? <><span className="mono">{view.repository.owner}/{view.repository.name}</span> (simulated)</> : 'No repository'}</li>
      <li>Updated {formatRelative(view.project.updatedAt)}</li>
    </ul>
  );
}
