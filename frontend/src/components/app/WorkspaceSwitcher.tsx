import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { Dropdown } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/Toast';
import { useAppData } from './AppData';

export function WorkspaceSwitcher() {
  const { workspace, workspaces, switchWorkspace } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();
  return (
    <Dropdown
      label="Switch workspace" triggerClassName="ap-ws"
      trigger={<><span className="ap-ws-mark" aria-hidden="true">{workspace.name.slice(0, 1)}</span><span className="ap-ws-name">{workspace.name}</span><Icon name="chevron" size={14} /></>}
    >
      {(close) => (
        <>
          <p className="ap-dd-label">Workspaces</p>
          {workspaces.map((w) => (
            <button
              key={w.id} type="button" role="menuitem" className="ap-dd-item" aria-current={w.id === workspace.id ? 'true' : undefined}
              onClick={() => {
                close();
                if (w.id === workspace.id) return;
                switchWorkspace(w.id);
                navigate(ROUTES.app);
                toast(`Switched to ${w.name}.`);
              }}
            >
              <span className="ap-ws-mark" aria-hidden="true">{w.name.slice(0, 1)}</span>
              <span>{w.name}<small>{w.description}</small></span>
            </button>
          ))}
        </>
      )}
    </Dropdown>
  );
}
