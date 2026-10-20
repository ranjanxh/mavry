import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

interface Props {
  /** Accessible name of the trigger button. */
  label: string;
  /** Visible trigger content. */
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  triggerClassName?: string;
  panelClassName?: string;
}

/**
 * Dropdown with click-away, Escape (focus returns to the trigger) and arrow-key movement between
 * items marked role="menuitem". Content is whatever the caller renders.
 */
export function Dropdown({ label, trigger, children, align = 'left', triggerClassName = 'ap-btn', panelClassName = '' }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); button.current?.focus(); }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    if (items.length === 0) return;
    e.preventDefault();
    const at = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (at + 1) % items.length : (at - 1 + items.length) % items.length;
    items[next].focus();
  };

  return (
    <div className="ap-dd" ref={root}>
      <button
        ref={button} type="button" className={triggerClassName} aria-label={label}
        aria-haspopup="true" aria-expanded={open} aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      {open && (
        <div id={panelId} className={`ap-dd-panel ap-dd-${align} ${panelClassName}`} role="menu" aria-label={label} onKeyDown={onPanelKey}>
          {children(close)}
        </div>
      )}
    </div>
  );
}
