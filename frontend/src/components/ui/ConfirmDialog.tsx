import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export interface ConfirmOptions {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  /** Styles the confirm button as destructive. */
  danger?: boolean;
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;
const ConfirmContext = createContext<Confirm>(() => Promise.resolve(false));
export const useConfirm = (): Confirm => useContext(ConfirmContext);

interface Pending extends ConfirmOptions { resolve: (ok: boolean) => void }

/** Promise-based confirmation on a native <dialog>: focus trap, Escape, and inert background come for free. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const confirm = useCallback<Confirm>((options) => new Promise<boolean>((resolve) => {
    setPending((prev) => { prev?.resolve(false); return { ...options, resolve }; });
  }), []);

  useEffect(() => {
    const el = dialog.current;
    if (pending && el && !el.open) el.showModal();
  }, [pending]);

  const finish = (ok: boolean) => {
    pending?.resolve(ok);
    dialog.current?.close();
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <dialog
          ref={dialog} className="ap-dialog" aria-labelledby="ap-confirm-title"
          onCancel={(e) => { e.preventDefault(); finish(false); }}
          onClick={(e) => { if (e.target === dialog.current) finish(false); }}
        >
          <h2 id="ap-confirm-title">{pending.title}</h2>
          <div className="ap-dialog-body">{pending.body}</div>
          <div className="ap-dialog-actions">
            <button type="button" className="btn b-soft" autoFocus onClick={() => finish(false)}>Cancel</button>
            <button type="button" className={`btn ${pending.danger ? 'b-danger' : 'b-blue'}`} onClick={() => finish(true)}>{pending.confirmLabel}</button>
          </div>
        </dialog>
      )}
    </ConfirmContext.Provider>
  );
}
