import { Glyph, type GlyphName } from '../ui/Glyph';

const PROBLEMS: { glyph: GlyphName; tone: string; title: string; text: string }[] = [
  { glyph: 'warning', tone: 's-warn', title: 'APIs change, pages don’t', text: 'Endpoints and schemas move in code review. The documentation that describes them lives somewhere else and doesn’t hear about it.' },
  { glyph: 'failed', tone: 's-bad', title: 'Examples rot quietly', text: 'A renamed field or a new required header turns a working snippet into a broken one, and nothing flags it.' },
  { glyph: 'pending', tone: 's-pend', title: 'Impact is investigated by hand', text: 'Someone searches the repository, guesses which pages are affected, and opens each one to check.' },
  { glyph: 'not_verified', tone: 's-none', title: 'Checked and unchecked look the same', text: 'Readers can’t tell which examples were tested against the spec and which were written once and forgotten.' },
];

export function Problem() {
  return (
    <section className="sec paper" aria-labelledby="h-prob">
      <div className="wrap prob">
        <div>
          <h2 className="h2" id="h-prob">Docs don’t break loudly.</h2>
          <p className="sub">A field gets renamed in a pull request. The page that describes it stays exactly as it was, and nobody finds out until a developer is stuck.</p>
        </div>
        <ul className="prob-list">
          {PROBLEMS.map((p) => (
            <li key={p.title}>
              <span className={p.tone}><Glyph name={p.glyph} /></span>
              <div><h3>{p.title}</h3><p>{p.text}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
