import { useState } from 'react';
import { StatusChip } from '../../ui/StatusChip';
import { Glyph } from '../../ui/Glyph';

type Decision = 'open' | 'accepted' | 'rejected' | 'deferred';
const MESSAGE: Record<Decision, string> = {
  open: 'Awaiting review',
  accepted: 'Accepted into draft. Not published.',
  rejected: 'Rejected. No change made.',
  deferred: 'Deferred. Still open in the queue.',
};

export function ChangesPane() {
  const [decision, setDecision] = useState<Decision>('open');
  const decided = decision === 'accepted' || decision === 'rejected';

  return (
    <>
      <div className="ptop"><span>Change impact</span><span className="st s-pend"><Glyph name="pending" />Simulated repository</span></div>
      <div className="chg">
        <div>
          <h3>Rename userId to user_id in token response</h3>
          <div style={{ color: 'var(--app-muted)', fontSize: 13, marginTop: 4 }}>
            PR #482 by Priya, merged into main. Changed: <span className="mono">openapi.yaml</span>, <span className="mono">src/auth/schemas.py</span>
          </div>
        </div>
        <div className="cg">
          <div className="cbox">
            <h4>Linked directly (changed file is mapped)</h4>
            <div className="ar2"><span>Authentication</span><StatusChip status="failed" /></div>
          </div>
          <div className="cbox dash">
            <h4>Likely affected (inferred, not confirmed)</h4>
            <div className="ar2"><span>Quickstart</span><StatusChip status="warning" /></div>
            <span style={{ color: 'var(--app-muted)', fontSize: 12.5 }}>Freshness heuristic. It suggests a review. It does not prove the example is wrong.</span>
          </div>
        </div>
        <div className="cbox dash">
          <h4>Proposed update to Authentication, generated from 7be20d</h4>
          <div className="diff"><div className="rm">-  "userId": "usr_8f2a91"</div><div className="ad">+  "user_id": "usr_8f2a91"</div></div>
          <div className="rev">
            <button type="button" className="btn b-white" disabled={decided} onClick={() => setDecision('accepted')}>Accept into draft</button>
            <button type="button" className="btn b-soft" disabled={decided} onClick={() => setDecision('rejected')}>Reject</button>
            <button type="button" className="btn b-soft" disabled={decided} onClick={() => setDecision('deferred')}>Defer</button>
            {decision !== 'open' && <button type="button" className="btn b-soft" onClick={() => setDecision('open')}>Reopen</button>}
            <span className="hint" aria-live="polite">{MESSAGE[decision]}</span>
          </div>
        </div>
      </div>
    </>
  );
}
