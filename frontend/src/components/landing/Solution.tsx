import { SAMPLE_CHECKS } from '../../data/sample';
import { StatusChip } from '../ui/StatusChip';

const MAPPINGS = [
  ['Authentication', 'src/auth/routes.py'],
  ['Create project', 'src/projects/routes.py'],
  ['Response examples', 'openapi.yaml'],
];

export function Solution() {
  return (
    <section className="sec ink dk" aria-labelledby="h-sol">
      <div className="wrap">
        <h2 className="h2 wide" id="h-sol">Write the docs. Connect the code. <span className="dim">Verify what you wrote.</span></h2>
        <div className="bento">
          <article className="tile tw">
            <h3>Write</h3>
            <p>A Markdown editor with live preview, code blocks, tables, and a page tree that handles nested sections. Draft and published states keep work in progress out of sight.</p>
            <div className="mini split" role="img" aria-label="Markdown source on the left, rendered preview on the right">
              <div>
                <span style={{ color: '#fff' }}>## Pagination</span>{'\n\nUse the '}<span style={{ color: '#7EE2A8' }}>`cursor`</span>{' value from\nthe last response to fetch\nthe next page.'}
              </div>
              <div><h4>Pagination</h4>Use the <span className="cd" style={{ display: 'inline', margin: 0 }}>cursor</span> value from the last response to fetch the next page.</div>
            </div>
          </article>

          <article className="tile tc">
            <h3>Connect</h3>
            <p>Link pages to the source files and OpenAPI specs they describe.</p>
            <div className="mini">
              {MAPPINGS.map(([page, file]) => (
                <div className="mr" key={page}><span>{page}</span><span className="m mono">{file}</span></div>
              ))}
            </div>
          </article>

          <article className="tile tv">
            <h3>Verify</h3>
            <p>Examples are checked against the schemas they claim to follow. Each result says what ran, what it found, and when.</p>
            <div className="mini">
              {SAMPLE_CHECKS.slice(0, 5).map((c) => (
                <div className="mr" key={c.id}><span>{c.name}</span><StatusChip status={c.status} /></div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
