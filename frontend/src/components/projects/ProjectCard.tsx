import { Link } from 'react-router-dom';
import type { ProjectView } from '../../domain/projects';
import { projectRoutes } from '../../routes';
import { Icon } from '../ui/Icon';
import { ProjectFacts, ProjectHealth } from './ProjectMeta';

interface Props { view: ProjectView; onDelete: (view: ProjectView) => void }

export function ProjectCard({ view, onDelete }: Props) {
  const { project } = view;
  return (
    <li className="ap-card">
      <div className="ap-card-top">
        <h2 className="ap-card-title"><Link to={projectRoutes.overview(project.id)}>{project.name}</Link></h2>
        <button type="button" className="ap-btn ap-icon-btn" aria-label={`Delete ${project.name}`} onClick={() => onDelete(view)}>
          <Icon name="trash" size={16} />
        </button>
      </div>
      <p className="ap-card-desc">{project.description || 'No description.'}</p>
      <ProjectHealth view={view} />
      <ProjectFacts view={view} />
    </li>
  );
}
