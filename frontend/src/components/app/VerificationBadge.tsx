import { Link, useMatch } from 'react-router-dom';
import { STATUS_META } from '../../domain/status';
import { worstStatus } from '../../domain/verification';
import { projectRoutes } from '../../routes';
import { StatusChip } from '../ui/StatusChip';
import { useAppData } from './AppData';

/** Top-bar verification status. Always derived from the checks in scope (current project, else workspace). */
export function VerificationBadge() {
  const { summary, views } = useAppData();
  const projectId = useMatch('/app/projects/:projectId/*')?.params.projectId;
  const view = views.find((v) => v.project.id === projectId);
  const scope = view ? view.summary : summary;
  const scopeLabel = view ? view.project.name : 'this workspace';

  if (scope.total === 0) {
    return <span className="ap-vbadge" title={`No checks have run for ${scopeLabel}.`}><StatusChip status="not_verified" label="No checks yet" /></span>;
  }
  const status = worstStatus(scope);
  const detail = (Object.keys(scope.counts) as (keyof typeof scope.counts)[])
    .filter((k) => scope.counts[k] > 0)
    .map((k) => `${scope.counts[k]} ${STATUS_META[k].label.toLowerCase()}`)
    .join(', ');
  const chip = <StatusChip status={status} label={`${STATUS_META[status].label} · ${scope.counts[status]} of ${scope.total}`} />;
  const title = `${scopeLabel}: ${detail}. Sample results.`;
  return view
    ? <Link className="ap-vbadge" to={projectRoutes.verification(view.project.id)} title={title}>{chip}</Link>
    : <span className="ap-vbadge" title={title}>{chip}</span>;
}
