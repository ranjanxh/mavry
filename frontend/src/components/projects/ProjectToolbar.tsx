import {
  PROJECT_FILTERS, PROJECT_SORTS, PROJECT_SORT_LABEL, projectFilterLabel,
  type ProjectFilter, type ProjectLayout, type ProjectQuery, type ProjectSort,
} from '../../domain/projects';
import { Icon } from '../ui/Icon';

interface Props {
  query: ProjectQuery;
  onQuery: (next: ProjectQuery) => void;
  layout: ProjectLayout;
  onLayout: (next: ProjectLayout) => void;
}

export function ProjectToolbar({ query, onQuery, layout, onLayout }: Props) {
  return (
    <div className="ap-toolbar" role="search" aria-label="Filter projects">
      <label className="ap-field ap-field-search">
        <span className="ap-sr">Search projects</span>
        <Icon name="search" size={16} />
        <input type="search" placeholder="Search by name, slug, or description" value={query.search} onChange={(e) => onQuery({ ...query, search: e.target.value })} />
      </label>
      <label className="ap-field">
        <span className="ap-label">Health</span>
        <select value={query.filter} onChange={(e) => onQuery({ ...query, filter: e.target.value as ProjectFilter })}>
          {PROJECT_FILTERS.map((f) => <option key={f} value={f}>{projectFilterLabel(f)}</option>)}
        </select>
      </label>
      <label className="ap-field">
        <span className="ap-label">Sort</span>
        <select value={query.sort} onChange={(e) => onQuery({ ...query, sort: e.target.value as ProjectSort })}>
          {PROJECT_SORTS.map((s) => <option key={s} value={s}>{PROJECT_SORT_LABEL[s]}</option>)}
        </select>
      </label>
      <div className="ap-seg" role="group" aria-label="Layout">
        <button type="button" aria-pressed={layout === 'grid'} onClick={() => onLayout('grid')}><Icon name="grid" size={16} /><span className="ap-sr">Grid</span></button>
        <button type="button" aria-pressed={layout === 'list'} onClick={() => onLayout('list')}><Icon name="list" size={16} /><span className="ap-sr">List</span></button>
      </div>
    </div>
  );
}
