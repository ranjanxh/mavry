import { useState } from 'react';
import { SAMPLE_ENDPOINTS } from '../../../data/sample';
import { buildCurl, copyText } from '../../../utils/curl';
import { useToast } from '../../ui/Toast';
import { Glyph } from '../../ui/Glyph';

export function ApiPane() {
  const [selected, setSelected] = useState(3);
  const toast = useToast();
  const e = SAMPLE_ENDPOINTS[selected];

  const copy = async (text: string) => {
    toast((await copyText(text)) ? 'Copied to clipboard' : 'Copy isn’t available in this preview');
  };

  return (
    <>
      <div className="ptop">
        <span>API reference, planned Mavry API</span>
        <span className="st s-pend"><Glyph name="pending" />Not implemented yet</span>
      </div>
      <div className="apiw">
        <div className="eplist" role="tablist" aria-label="Endpoints" aria-orientation="vertical">
          {SAMPLE_ENDPOINTS.map((ep, i) => (
            <button key={ep.id} type="button" role="tab" className="epb" aria-selected={i === selected} onClick={() => setSelected(i)}>
              <span className={`mth m-${ep.method}`}>{ep.method}</span>
              <span className="p">{ep.path.replace('/api/v1', '')}</span>
            </button>
          ))}
        </div>
        <div className="epd">
          <div>
            <h3>{e.summary}</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--app-muted)' }}>{e.description}</p>
          </div>
          <div className="path">
            <span className={`mth m-${e.method}`}>{e.method}</span>
            <span>{e.path}</span>
            <button type="button" className="copy" onClick={() => copy(e.path)}>Copy path</button>
          </div>
          {e.parameters.length > 0 && (
            <div>
              <div className="cph"><span>Parameters</span></div>
              <table>
                <thead><tr><th>Name</th><th>In</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>{e.parameters.map((p) => (<tr key={p.name}><td className="mono">{p.name}</td><td>{p.in}</td><td className="mono">{p.type}</td><td>{p.description}</td></tr>))}</tbody>
              </table>
            </div>
          )}
          {e.requestBody && (
            <div>
              <div className="cph"><span>Request body</span></div>
              <table>
                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>{e.requestBody.map((f) => (<tr key={f.name}><td className="mono">{f.name}</td><td className="mono">{f.type}</td><td>{f.description}</td></tr>))}</tbody>
              </table>
            </div>
          )}
          <div>
            <div className="cph"><span>Example request</span><button type="button" className="copy" onClick={() => copy(buildCurl(e))}>Copy</button></div>
            <pre>{buildCurl(e)}</pre>
          </div>
          <div>
            <div className="cph"><span>Response {e.response.status} (example)</span></div>
            <pre>{e.response.example}</pre>
          </div>
          <p className="note">Planned endpoint. No backend implements it yet, so nothing here runs a real request.</p>
        </div>
      </div>
    </>
  );
}
