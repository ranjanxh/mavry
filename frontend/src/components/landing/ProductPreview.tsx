import { useState } from 'react';
import { SAMPLE_CHECKS } from '../../data/sample';
import { summarizeChecks } from '../../domain/verification';
import { EditorPane } from './preview/EditorPane';
import { ApiPane } from './preview/ApiPane';
import { VerificationPane } from './preview/VerificationPane';
import { ChangesPane } from './preview/ChangesPane';

type PaneId = 'editor' | 'api' | 'verification' | 'changes';
const TABS: { id: PaneId; label: string }[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'api', label: 'API reference' },
  { id: 'verification', label: 'Verification' },
  { id: 'changes', label: 'Change impact' },
];
const SIDE_NAV: { id: PaneId; label: string }[] = [
  { id: 'api', label: 'API reference' },
  { id: 'verification', label: 'Verification' },
  { id: 'changes', label: 'Changes' },
];

export function ProductPreview() {
  const [pane, setPane] = useState<PaneId>('editor');
  const failed = summarizeChecks(SAMPLE_CHECKS).counts.failed;

  return (
    <section className="sec ink dk" id="product" aria-labelledby="h-prod">
      <div className="wrap">
        <h2 className="h2 wide" id="h-prod">Inside the app: <span className="dim">a calm place to work.</span></h2>
        <p className="sub">The app is dark and quiet on purpose. Saturated color is kept for moments that need attention. Try the tabs, they work.</p>

        <div className="tabs" role="tablist" aria-label="App views">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" className="tab" id={`tab-${t.id}`} aria-controls={`pane-${t.id}`} aria-selected={pane === t.id} onClick={() => setPane(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="app">
          <aside className="side" aria-label="Demo project navigation">
            <div className="ws"><span className="sq">P</span><div><b>Payments API</b><small>Demo workspace</small></div></div>
            <div>
              <div className="tr grp">Getting started</div><div className="tr lf">Quickstart</div>
              <button type="button" className="sn" aria-current={pane === 'editor'} onClick={() => setPane('editor')} style={{ paddingLeft: 22 }}>Authentication</button>
              <div className="tr grp">Guides</div><div className="tr lf">Pagination</div><div className="tr lf">Error handling</div><div className="tr lf">Webhooks</div>
            </div>
            <div style={{ marginTop: 'auto', display: 'grid', gap: 2 }}>
              {SIDE_NAV.map((n) => (
                <button key={n.id} type="button" className="sn" aria-current={pane === n.id} onClick={() => setPane(n.id)}>
                  {n.label}{n.id === 'verification' && <span className="ct">{failed}</span>}
                </button>
              ))}
            </div>
          </aside>
          <div className="pane" role="tabpanel" id={`pane-${pane}`} aria-labelledby={`tab-${pane}`}>
            {pane === 'editor' && <EditorPane />}
            {pane === 'api' && <ApiPane />}
            {pane === 'verification' && <VerificationPane />}
            {pane === 'changes' && <ChangesPane />}
          </div>
        </div>
      </div>
    </section>
  );
}
