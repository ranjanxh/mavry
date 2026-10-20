import { useState } from 'react';
import { SAMPLE_CHECKS } from '../../../data/sample';
import { StatusChip } from '../../ui/StatusChip';
import { Glyph } from '../../ui/Glyph';

type Mode = 'write' | 'preview';

export function EditorPane() {
  const [mode, setMode] = useState<Mode>('write');
  // Page health is derived from the same checks the Verification tab shows.
  const authChecks = SAMPLE_CHECKS.filter((c) => c.pageId === 'pg_auth');
  const verified = authChecks.filter((c) => c.status === 'verified').length;

  return (
    <>
      <div className="ptop">
        <div className="seg" role="group" aria-label="Editor mode">
          <button type="button" aria-pressed={mode === 'write'} onClick={() => setMode('write')}>Write</button>
          <button type="button" aria-pressed={mode === 'preview'} onClick={() => setMode('preview')}>Preview</button>
        </div>
        <span className="st s-warn"><Glyph name="warning" />Draft, {verified} of {authChecks.length} examples verified</span>
      </div>
      <div className="ed">
        <div className="ed-main">
          {mode === 'write' ? (
            <pre>
              <span className="h"># Authentication</span>{`

Mavry uses bearer tokens. Exchange an API key
for a short-lived access token, then send it in
the `}<span className="c">`Authorization`</span>{` header.

`}<span className="h">## Request example</span>{`

`}<span className="k">```http</span>{`
POST /v1/auth/token
Content-Type: application/json

{ "api_key": "mvk_test_51Hc" }
`}<span className="k">```</span>{`

`}<span className="h">## Successful response</span>{`

`}<span className="k">```json</span>{`
{ "access_token": "mvt_live_9fQ2xK",
  "userId": "usr_8f2a91" }
`}<span className="k">```</span>
            </pre>
          ) : (
            <div className="prev">
              <h1>Authentication</h1>
              <p>Mavry uses bearer tokens. Exchange an API key for a short-lived access token, then send it in the <code className="mono">Authorization</code> header.</p>
              <h2>Request example</h2>
              <pre>{'POST /v1/auth/token\nContent-Type: application/json\n\n{ "api_key": "mvk_test_51Hc" }'}</pre>
              <h2>Error responses</h2>
              <table>
                <thead><tr><th>Status</th><th>Code</th><th>Meaning</th></tr></thead>
                <tbody>
                  <tr><td>401</td><td className="mono">invalid_api_key</td><td>Key not recognized</td></tr>
                  <tr><td>429</td><td className="mono">rate_limited</td><td>Retry after the header value</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="ed-side">
          <div>
            <h4>Examples on this page</h4>
            {authChecks.map((c) => (
              <div className="ex" key={c.id}><span>{c.name.replace('Authentication ', '')}</span><StatusChip status={c.status} /></div>
            ))}
          </div>
          <div>
            <h4>Source</h4>
            <div className="kv"><span className="mono" style={{ fontSize: 12 }}>openapi.yaml</span></div>
            <div className="kv"><span className="mono" style={{ fontSize: 12 }}>src/auth/routes.py</span></div>
          </div>
          <div>
            <h4>Page</h4>
            <div className="kv"><span className="m">Status</span><span>Draft</span></div>
            <div className="kv"><span className="m">Revision</span><span>r14, Priya</span></div>
            <div className="kv"><span className="m">Slug</span><span className="mono" style={{ fontSize: 12 }}>/authentication</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
