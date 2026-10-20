import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { buildAttentionQueue, type AttentionItem } from '../../domain/attention';
import { buildProjectViews, type ProjectView } from '../../domain/projects';
import { summarizeChecks, type VerificationSummary } from '../../domain/verification';
import { useAsync } from '../../hooks/useAsync';
import { storage } from '../../services';
import { loadSnapshot, type WorkspaceSnapshot } from '../../services/snapshot';

export interface AppData extends WorkspaceSnapshot {
  views: ProjectView[];
  attention: AttentionItem[];
  summary: VerificationSummary;
  switchWorkspace: (id: string) => void;
}

const AppDataContext = createContext<AppData | null>(null);
const SELECTED_KEY = 'selected-workspace';

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>.');
  return ctx;
}

/** Loads the workspace once for the whole shell. Renders loading and error states itself. */
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(() => storage.get<string>(SELECTED_KEY));
  const state = useAsync(() => loadSnapshot(selected), [selected]);

  const switchWorkspace = useCallback((id: string) => {
    storage.set(SELECTED_KEY, id);
    setSelected(id);
  }, []);

  const value = useMemo<AppData | null>(() => {
    if (state.status !== 'ready') return null;
    const s = state.data;
    return {
      ...s,
      views: buildProjectViews(s.projects, s.checks, s.pages, s.repositories),
      attention: buildAttentionQueue(s.checks, s.proposals, s.pages),
      summary: summarizeChecks(s.checks),
      switchWorkspace,
    };
  }, [state, switchWorkspace]);

  if (state.status === 'error') {
    return (
      <main className="ap-boot" role="alert">
        <h1>The workspace could not load</h1>
        <p>{state.error.message}</p>
        <button type="button" className="btn b-blue" onClick={state.reload}>Try again</button>
      </main>
    );
  }
  if (!value) {
    return <main className="ap-boot" aria-busy="true"><p role="status">Loading workspace…</p></main>;
  }
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
