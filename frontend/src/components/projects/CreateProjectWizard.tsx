import { useEffect, useRef, useState } from 'react';
import {
  STARTER_PAGES, slugify, validateDraftBasics, type DraftErrors, type ProjectDraft, type ProjectTemplate,
} from '../../domain/projects';
import type { Project } from '../../domain/types';
import { services } from '../../services';

interface Props {
  workspaceId: string;
  workspaceName: string;
  existingSlugs: string[];
  onClose: () => void;
  onCreated: (project: Project) => void;
}

const STEPS = ['Name', 'Setup', 'Review'] as const;
const EMPTY: ProjectDraft = { name: '', slug: '', description: '', template: 'starter' };

/** Three steps, one real write at the end. Rendered only while open. */
export function CreateProjectWizard({ workspaceId, workspaceName, existingSlugs, onClose, onCreated }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => { dialog.current?.showModal(); }, []);

  const patch = (next: Partial<ProjectDraft>) => setDraft((d) => ({ ...d, ...next }));
  const onName = (name: string) => patch({ name, ...(slugTouched ? {} : { slug: slugify(name) }) });

  const next = () => {
    const found = validateDraftBasics(draft, existingSlugs);
    // Step 1 owns name and slug; step 2 owns the description.
    const relevant: DraftErrors = step === 0 ? { name: found.name, slug: found.slug } : { description: found.description };
    const clean = Object.fromEntries(Object.entries(relevant).filter(([, v]) => v)) as DraftErrors;
    setErrors(clean);
    if (Object.keys(clean).length === 0) setStep((s) => s + 1);
  };

  const create = async () => {
    const all = validateDraftBasics(draft, existingSlugs);
    if (Object.keys(all).length > 0) { setErrors(all); setStep(all.description && !all.name && !all.slug ? 1 : 0); return; }
    setBusy(true);
    setFailure(null);
    try {
      const project = await services.projects.create({ workspaceId, name: draft.name, slug: draft.slug, description: draft.description });
      if (draft.template === 'starter') {
        for (const title of STARTER_PAGES) await services.pages.create({ projectId: project.id, title });
      }
      onCreated(project);
    } catch (e) {
      setFailure(e instanceof Error ? e.message : 'The project could not be created.');
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) next(); else void create();
  };

  return (
    <dialog
      ref={dialog} className="ap-dialog ap-wizard" aria-labelledby="ap-wiz-title"
      onCancel={(e) => { e.preventDefault(); if (!busy) onClose(); }}
      onClick={(e) => { if (e.target === dialog.current && !busy) onClose(); }}
    >
      <form onSubmit={submit} noValidate>
        <h2 id="ap-wiz-title">New project</h2>
        <ol className="ap-steps" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined} className={i < step ? 'done' : undefined}>
              <span className="ap-step-n">{i < step ? '✓' : i + 1}</span>{s}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="ap-wiz-body">
            <label className="ap-input">
              <span className="ap-label">Project name</span>
              <input autoFocus value={draft.name} maxLength={80} onChange={(e) => onName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} placeholder="Payments API" />
              {errors.name && <span id="err-name" className="ap-err" role="alert">{errors.name}</span>}
            </label>
            <label className="ap-input">
              <span className="ap-label">Slug</span>
              <input className="mono" value={draft.slug} onChange={(e) => { setSlugTouched(true); patch({ slug: e.target.value.toLowerCase() }); }} aria-invalid={!!errors.slug} aria-describedby={errors.slug ? 'err-slug' : 'hint-slug'} placeholder="payments-api" />
              {errors.slug ? <span id="err-slug" className="ap-err" role="alert">{errors.slug}</span> : <span id="hint-slug" className="ap-hint">Unique in {workspaceName}. Used in the project’s address.</span>}
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="ap-wiz-body">
            <label className="ap-input">
              <span className="ap-label">Description <span className="ap-hint">(optional)</span></span>
              <textarea autoFocus rows={3} value={draft.description} onChange={(e) => patch({ description: e.target.value })} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'err-desc' : undefined} />
              {errors.description && <span id="err-desc" className="ap-err" role="alert">{errors.description}</span>}
            </label>
            <fieldset className="ap-choice">
              <legend className="ap-label">Starting point</legend>
              {([
                ['starter', 'Starter pages', `Creates ${STARTER_PAGES.join(', ')} as drafts.`],
                ['blank', 'Blank project', 'No pages. You add them in the editor.'],
              ] as [ProjectTemplate, string, string][]).map(([value, title, hint]) => (
                <label key={value} className="ap-radio">
                  <input type="radio" name="template" value={value} checked={draft.template === value} onChange={() => patch({ template: value })} />
                  <span>{title}<small>{hint}</small></span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="ap-wiz-body">
            <dl className="ap-review">
              <div><dt>Workspace</dt><dd>{workspaceName}</dd></div>
              <div><dt>Name</dt><dd>{draft.name.trim()}</dd></div>
              <div><dt>Slug</dt><dd className="mono">{draft.slug}</dd></div>
              <div><dt>Description</dt><dd>{draft.description.trim() || 'None'}</dd></div>
              <div><dt>Pages</dt><dd>{draft.template === 'starter' ? STARTER_PAGES.join(', ') : 'None'}</dd></div>
            </dl>
            <p className="ap-note">
              {services.mock ? 'Saved in this browser as sample data.' : 'Saved through the API.'} No repository is connected and nothing is verified yet,
              so the project starts as Not verified.
            </p>
            {failure && <p className="ap-err" role="alert">{failure}</p>}
          </div>
        )}

        <div className="ap-dialog-actions">
          <button type="button" className="btn b-soft" disabled={busy} onClick={onClose}>Cancel</button>
          {step > 0 && <button type="button" className="btn b-soft" disabled={busy} onClick={() => { setErrors({}); setStep((s) => s - 1); }}>Back</button>}
          <button type="submit" className="btn b-blue" disabled={busy}>
            {step < STEPS.length - 1 ? 'Next' : busy ? 'Creating…' : 'Create project'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
