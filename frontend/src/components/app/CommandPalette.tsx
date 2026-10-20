import { useEffect, useMemo, useRef, useState } from 'react';

export interface Command {
  id: string;
  group: string;
  label: string;
  /** Extra words that should match the search. */
  keywords?: string;
  /** Right-aligned hint, such as a shortcut. */
  hint?: string;
  run: () => void;
}

interface Props { commands: Command[]; onClose: () => void }

/** Rendered only while open. Escape closes (native dialog cancel); Enter runs the highlighted command. */
export function CommandPalette({ commands, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => { dialog.current?.showModal(); }, []);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [commands, query]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    c.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
  };

  return (
    <dialog
      ref={dialog} className="ap-palette" aria-label="Command palette"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}
    >
      <input
        className="ap-palette-input" type="text" autoFocus placeholder="Type a command or a project name"
        role="combobox" aria-expanded="true" aria-controls="ap-palette-list" aria-autocomplete="list"
        aria-activedescendant={results[active] ? `ap-cmd-${results[active].id}` : undefined}
        aria-label="Search commands" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
      />
      <ul id="ap-palette-list" ref={list} className="ap-palette-list" role="listbox" aria-label="Commands">
        {results.map((c, i) => (
          <li
            key={c.id} id={`ap-cmd-${c.id}`} role="option" aria-selected={i === active}
            className={`ap-palette-item${i === active ? ' on' : ''}`}
            onMouseMove={() => setActive(i)} onClick={() => run(c)}
          >
            <span className="ap-palette-group">{c.group}</span>
            <span className="ap-palette-label">{c.label}</span>
            {c.hint && <kbd className="ap-kbd">{c.hint}</kbd>}
          </li>
        ))}
        {results.length === 0 && <li className="ap-palette-empty" role="presentation">No command matches “{query}”.</li>}
      </ul>
      <p className="ap-palette-foot">Up and down to move · Enter to run · Esc to close</p>
    </dialog>
  );
}
