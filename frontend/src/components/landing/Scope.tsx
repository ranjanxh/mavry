import { Glyph, type GlyphName } from '../ui/Glyph';

interface Item { glyph: GlyphName; tone: string; title: string; text: string }

const TODAY: Item[] = [
  { glyph: 'verified', tone: 's-ok', title: 'Schema validation', text: 'Request and response examples checked against an available schema.' },
  { glyph: 'verified', tone: 's-ok', title: 'Specification validation', text: 'API references checked against an OpenAPI spec.' },
  { glyph: 'warning', tone: 's-warn', title: 'Freshness flags', text: 'A heuristic that a source change may have made a page stale. Labeled as such.' },
  { glyph: 'verified', tone: 's-ok', title: 'Review workflow', text: 'Suggested edits, diffs, accept or reject, and revision history.' },
];
const LATER: Item[] = [
  { glyph: 'pending', tone: 's-pend', title: 'Running code examples', text: 'In an isolated environment, only for explicitly supported examples.' },
  { glyph: 'pending', tone: 's-pend', title: 'Automated pull-request analysis', text: 'Checks that run on every PR without anyone starting them.' },
  { glyph: 'pending', tone: 's-pend', title: 'Real GitHub connection', text: 'OAuth, branches, and commits from your own repositories.' },
];

function List({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((i) => (
        <li key={i.title}>
          <span className={i.tone}><Glyph name={i.glyph} /></span>
          <span><b>{i.title}</b>{i.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function Scope() {
  return (
    <section className="sec ink dk" aria-labelledby="h-scope">
      <div className="wrap">
        <h2 className="h2 wide" id="h-scope">What works today, <span className="dim">and what doesn’t yet.</span></h2>
        <p className="sub">Everything on this page is sample data and demo behavior. Here is the honest scope of the first version.</p>
        <div className="scope2">
          <article className="sbox"><h3>In the first version</h3><List items={TODAY} /></article>
          <article className="sbox future"><h3>On the roadmap</h3><List items={LATER} /></article>
        </div>
      </div>
    </section>
  );
}
