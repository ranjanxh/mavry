import { StatusChip } from '../ui/StatusChip';

export function Sources() {
  return (
    <section className="sec paper" id="sources" aria-labelledby="h-src">
      <div className="wrap">
        <h2 className="h2 wide" id="h-src">Docs that know where they come from.</h2>
        <p className="sub">Import an OpenAPI spec to get an API reference. Connect a repository to map pages to the files that define them.</p>
        <div className="src2">
          <article className="pan">
            <h3>API reference from OpenAPI</h3>
            <p>Paste or upload a spec, preview the endpoint groups it contains, then confirm the import.</p>
            <div className="yaml" role="img" aria-label="Sample OpenAPI snippet">{`paths:
  /api/v1/projects:
    get:  { summary: List projects }
    post: { summary: Create a project }
  /api/v1/projects/{project_id}/pages:
    get:  { summary: List pages }`}</div>
            <div className="map"><span><b>Import preview</b> <span className="note2">sample</span></span><span>6 endpoints in 3 groups</span></div>
            <p className="note2">Methods, parameters, schemas, and examples are shown for every endpoint, and examples can be validated against their schemas.</p>
          </article>
          <article className="pan">
            <h3>GitHub-linked pages</h3>
            <p>Map pages to source files. When a mapped file changes, the page is flagged directly, not guessed at.</p>
            <div className="map"><span>Authentication</span><span className="arrow">maps to</span><code>src/auth/routes.py</code></div>
            <div className="map"><span>Create project API</span><span className="arrow">maps to</span><code>src/projects/routes.py</code></div>
            <div className="map" style={{ outline: '2px solid var(--bad)' }}><span>Response examples</span><span className="arrow">maps to</span><code>openapi.yaml</code><StatusChip status="failed" label="Changed in PR #482" /></div>
            <p className="note2">Demo repository, simulated. The prototype doesn’t connect to GitHub.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
