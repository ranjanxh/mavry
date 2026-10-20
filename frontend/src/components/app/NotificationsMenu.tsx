import { Link } from 'react-router-dom';
import { projectRoutes } from '../../routes';
import { Dropdown } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';
import { StatusChip, SuggestionChip } from '../ui/StatusChip';
import { useAppData } from './AppData';

/** There is no notification record yet: this lists the derived attention queue, nothing else. */
export function NotificationsMenu() {
  const { attention, views } = useAppData();
  const nameOf = (id: string) => views.find((v) => v.project.id === id)?.project.name ?? 'Project';
  return (
    <Dropdown
      label={attention.length ? `Notifications, ${attention.length} need attention` : 'Notifications, nothing needs attention'}
      align="right" triggerClassName="ap-btn ap-icon-btn" panelClassName="ap-dd-wide"
      trigger={<><Icon name="bell" />{attention.length > 0 && <span className="ap-count">{attention.length}</span>}</>}
    >
      {(close) => (
        <>
          <p className="ap-dd-label">Needs attention</p>
          {attention.length === 0 && <p className="ap-dd-empty">Nothing needs attention right now.</p>}
          {attention.map((a) => (
            <Link key={`${a.kind}-${a.id}`} role="menuitem" className="ap-dd-item ap-dd-note" to={projectRoutes.page(a.projectId, a.pageId)} onClick={close}>
              <span>
                {a.title}
                <small>{nameOf(a.projectId)} · {a.pageTitle}</small>
              </span>
              {a.kind === 'check' ? <StatusChip status={a.status} /> : <SuggestionChip label="AI suggestion · not verified" />}
            </Link>
          ))}
          <p className="ap-dd-foot">Derived from sample check results and open suggestions.</p>
        </>
      )}
    </Dropdown>
  );
}
