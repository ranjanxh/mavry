import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { services } from '../../services';
import { Dropdown } from '../ui/Dropdown';
import { useAppData } from './AppData';
import { useResetDemo } from './useResetDemo';

export function UserMenu() {
  const { user } = useAppData();
  const reset = useResetDemo();
  return (
    <Dropdown
      label="Account menu" align="right" triggerClassName="ap-btn ap-avatar-btn"
      trigger={<span className="ap-avatar" aria-hidden="true">{user.name.slice(0, 1)}</span>}
    >
      {(close) => (
        <>
          <p className="ap-dd-who">{user.name}<small>{user.email}</small></p>
          <Link role="menuitem" className="ap-dd-item" to={ROUTES.settingsAccount} onClick={close}>Account (planned)</Link>
          <Link role="menuitem" className="ap-dd-item" to={ROUTES.home} onClick={close}>Landing page</Link>
          {services.mock && (
            <button type="button" role="menuitem" className="ap-dd-item" onClick={() => { close(); void reset(); }}>Reset demo data</button>
          )}
          <p className="ap-dd-foot">Demo sign-in only. Sign out arrives with the login milestone; this is not production security.</p>
        </>
      )}
    </Dropdown>
  );
}
