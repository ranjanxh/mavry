import { Glyph } from '../ui/Glyph';
import { StatusChip } from '../ui/StatusChip';

export function FourStates() {
  return (
    <section className="sec blue dk" aria-labelledby="h-four">
      <div className="wrap">
        <h2 className="h2 wide" id="h-four">AI proposes. You decide.</h2>
        <p className="sub">Four things in Mavry are never allowed to look alike, because mixing them up is how documentation loses trust.</p>
        <p className="hand four-note" aria-hidden="true">this part matters!</p>
        <div className="four">
          <article className="fcard f-issue">
            <StatusChip status="failed" label="Detected issue" />
            <h3>Example doesn’t match the spec</h3>
            <p>Expected <code>user_id</code>, found <code>userId</code> on line 6.</p>
            <p>A check ran and failed. Evidence attached.</p>
          </article>
          <article className="fcard f-sug">
            <span className="st" style={{ color: 'var(--blue)' }}><Glyph name="suggestion" />AI suggestion</span>
            <h3>Proposed edit for Authentication</h3>
            <p>Not verified until you approve it and the check passes.</p>
            <p>Linked to commit <code>7be20d</code>.</p>
          </article>
          <article className="fcard f-ver">
            <StatusChip status="verified" label="Verified result" />
            <h3>Example matches the spec</h3>
            <p className="seal">Schema validation against openapi.yaml at 7be20d, Oct 20, 12:04</p>
            <p>Only shown after a supported check really passed.</p>
          </article>
          <article className="fcard f-app">
            <span className="st" style={{ color: 'var(--blue)' }}><span className="av" style={{ width: 16, height: 16, fontSize: 9 }}>A</span>Approved by a person</span>
            <h3>Ary approved the fix</h3>
            <p>Saved as a draft revision. Publishing is a separate step.</p>
            <p>Recorded in revision history.</p>
          </article>
        </div>
        <div className="rules">
          <p><b>Evidence for every failure</b>The page, the example, expected versus observed, and the commit.</p>
          <p><b>No confidence scores</b>A percentage from a model is not proof. Only checks that ran count.</p>
          <p><b>Nothing publishes itself</b>Generated changes wait for explicit approval.</p>
        </div>
      </div>
    </section>
  );
}
