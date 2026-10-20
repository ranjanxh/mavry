import { Link } from 'react-router-dom';
import type { ProjectView } from '../../domain/projects';
import { projectRoutes } from '../../routes';
import { Icon } from '../ui/Icon';
import { ProjectFacts, ProjectHealth } from './ProjectMeta';

interface Props { view: ProjectView; onDelete: (view: ProjectView) => void }

export function ProjectRow({ view, onDelete }: Props) {
  const { project } = view;
  return (
    <li className="ap-row">
      <div className="ap-row-main">
        <h2 className="ap-row-title"><Link to={projectRoutes.overview(project.id)}>{project.name}</Link></h2>
        <p className="ap-row-desc">{project.description || 'No description.'}</p>
      </div>
      <ProjectHealth view={view} />
      <ProjectFacts view={view} />
      <button type="button" className="ap-btn ap-icon-btn" aria-label={`Delete ${project.name}`} onClick={() => onDelete(view)}>
        <Icon name="trash" size={16} />
      </button>
    </li>
  );
}
