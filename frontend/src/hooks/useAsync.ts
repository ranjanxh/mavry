import { useCallback, useEffect, useRef, useState } from 'react';
import { onDataChange } from '../services';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: Error };

/**
 * Runs a loader and exposes loading / ready / error. Refetches quietly (no loading flash) whenever a
 * service announces a write, and ignores answers that arrive after a newer request started.
 */
export function useAsync<T>(load: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const run = useRef(0);
  const loader = useRef(load);
  loader.current = load;

  const fetchNow = useCallback((quiet: boolean) => {
    const id = ++run.current;
    if (!quiet) setState({ status: 'loading' });
    loader.current().then(
      (data) => { if (id === run.current) setState({ status: 'ready', data }); },
      (error: unknown) => { if (id === run.current) setState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) }); },
    );
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are supplied by the caller
  useEffect(() => { fetchNow(false); }, deps);
  useEffect(() => onDataChange(() => fetchNow(true)), [fetchNow]);
  useEffect(() => () => { run.current += 1; }, []);

  return { ...state, reload: () => fetchNow(false) };
}
