import type { ReactNode } from 'react';
import { StatusChip } from '../ui/StatusChip';
import { AnchorLink } from '../ui/AnchorLink';

interface Step { title: string; text: ReactNode; extra?: ReactNode; art: ReactNode; dashed?: boolean }

const STEPS: Step[] = [
  {
    title: 'A developer changes an API schema',
    text: <>PR #482 renames <code className="mono">userId</code> to <code className="mono">user_id</code> in the token response. It merges into main.</>,
    art: (
      <>
        <div className="ah"><span className="mono">openapi.yaml</span><span>PR #482, merged by Priya</span></div>
        <div className="dl">
          <div className="cx">  TokenResponse:</div><div className="cx">    properties:</div>
          <div className="rm">-      userId:</div><div className="ad">+      user_id:</div><div className="cx">         type: string</div>
        </div>
      </>
    ),
  },
  {
    title: 'Mavry finds the pages that may be affected',
    text: 'Pages mapped to a changed file are linked directly. Pages that only mention the same data are flagged as inferred, and labeled that way.',
    art: (
      <>
        <div className="ar"><span>Authentication <span className="m">mapped to openapi.yaml</span></span><span className="pill s-bad">Direct</span></div>
        <div className="ar inferred"><span>Quickstart <span className="m">shows a token response</span></span><span className="pill s-pend">Inferred, unconfirmed</span></div>
      </>
    ),
  },
  {
    title: 'The relevant checks run',
    text: 'Each check type is named for what it is. A freshness warning is a heuristic. It is never reported as proof.',
    art: (
      <>
        <div className="ar"><span>Schema validation <span className="m">Authentication response</span></span><StatusChip status="failed" /></div>
        <div className="ar"><span>Specification validation <span className="m">openapi.yaml</span></span><StatusChip status="verified" /></div>
        <div className="ar"><span>Freshness <span className="m">Quickstart</span></span><StatusChip status="warning" /></div>
      </>
    ),
  },
  {
    title: 'The result shows the mismatch, with evidence',
    text: 'Not a score. The page, the example, what was expected, what was found, and the commit that caused it.',
    art: (
      <>
        <div className="ah"><span>Authentication, response example</span><span className="mono">7be20d</span></div>
        <div className="ar"><span className="m">Expected</span><span><code className="mono">user_id</code>, a string, openapi.yaml line 218</span></div>
        <div className="ar"><span className="m">Observed</span><span><code className="mono">userId</code> on line 6 of the example</span></div>
        <div className="ar"><span className="m">Cause</span><span>Property renamed in PR #482</span></div>
      </>
    ),
  },
  {
    title: 'Mavry proposes an update. A person decides.',
    text: 'The suggestion is linked to its evidence and stays a draft until someone approves it. Nothing is published automatically.',
    extra: <p style={{ marginTop: 12 }}><AnchorLink to="top" className="btn b-ink">Replay the walkthrough</AnchorLink></p>,
    dashed: true,
    art: (
      <>
        <div className="ah"><span>Suggested edit, not verified</span><span className="mono">from 7be20d</span></div>
        <div className="dl"><div className="rm">-  "userId": "usr_8f2a91"</div><div className="ad">+  "user_id": "usr_8f2a91"</div></div>
        <div className="ar"><span className="m">Review, edit, or dismiss</span><span className="pill" style={{ color: 'var(--blue)' }}>Awaiting approval</span></div>
      </>
    ),
  },
];

export function Workflow() {
  return (
    <section className="sec paper" id="workflow" aria-labelledby="h-flow">
      <div className="wrap">
        <h2 className="h2 wide" id="h-flow">From pull request to approved fix.</h2>
        <p className="sub">The same sample change as the walkthrough at the top, one stage at a time.</p>
        <ol className="flow" style={{ listStyle: 'none', padding: 0, margin: '56px 0 0' }}>
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="node" aria-hidden="true">{i + 1}</span>
              <div><h3>{s.title}</h3><p>{s.text}</p>{s.extra}</div>
              <div className="art" style={s.dashed ? { border: '2px dashed var(--blue)' } : undefined}>{s.art}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
