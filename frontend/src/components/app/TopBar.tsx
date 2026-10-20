import { Icon } from '../ui/Icon';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';
import { VerificationBadge } from './VerificationBadge';

interface Props { navOpen: boolean; onToggleNav: () => void; onOpenPalette: () => void }

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
export const PALETTE_SHORTCUT = isMac ? '⌘K' : 'Ctrl K';

export function TopBar({ navOpen, onToggleNav, onOpenPalette }: Props) {
  return (
    <header className="ap-top">
      <button type="button" className="ap-btn ap-icon-btn" aria-label="Toggle sidebar" aria-controls="ap-sidebar" aria-expanded={navOpen} onClick={onToggleNav}>
        <Icon name="menu" />
      </button>
      <Breadcrumbs />
      <div className="ap-top-right">
        <button type="button" className="ap-btn ap-palette-trigger" onClick={onOpenPalette} aria-label="Open command palette" aria-keyshortcuts="Control+K Meta+K">
          <Icon name="search" size={16} />
          <span>Search or run a command</span>
          <kbd className="ap-kbd">{PALETTE_SHORTCUT}</kbd>
        </button>
        <VerificationBadge />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
