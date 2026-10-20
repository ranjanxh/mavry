import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfirmProvider } from '../ui/ConfirmDialog';
import { AppDataProvider } from './AppData';
import { CommandPalette } from './CommandPalette';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useCommands } from './useCommands';

const WIDE = '(min-width: 900px)';
const isWide = () => typeof window !== 'undefined' && window.matchMedia(WIDE).matches;

function Shell() {
  const [navOpen, setNavOpen] = useState(isWide);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const toggleNav = useCallback(() => setNavOpen((o) => !o), []);
  const commands = useCommands(toggleNav);

  // Ctrl/Cmd+K toggles the palette from anywhere in the app. Escape is handled by the dialog itself.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="ap-shell" data-nav={navOpen ? 'open' : 'closed'}>
      <a className="ap-skip" href="#ap-main">Skip to content</a>
      <Sidebar onNavigate={() => { if (!isWide()) setNavOpen(false); }} />
      {navOpen && <button type="button" className="ap-scrim" aria-label="Close sidebar" tabIndex={-1} onClick={() => setNavOpen(false)} />}
      <div className="ap-col">
        <TopBar navOpen={navOpen} onToggleNav={toggleNav} onOpenPalette={() => setPaletteOpen(true)} />
        <main className="ap-main" id="ap-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      {paletteOpen && <CommandPalette commands={commands} onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}

/** Layout route for everything under /app. */
export default function AppShell() {
  return (
    <ConfirmProvider>
      <AppDataProvider>
        <Shell />
      </AppDataProvider>
    </ConfirmProvider>
  );
}
