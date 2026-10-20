import { useMemo, useState } from 'react';
import { SAMPLE_CHECKS, SAMPLE_PAGES } from '../../../data/sample';
import { summarizeChecks } from '../../../domain/verification';
import { CHECK_TYPE_LABEL, STATUS_META, VERIFICATION_STATUSES, type VerificationStatus } from '../../../domain/status';
import { lastRunLabel } from '../../../utils/format';
import { StatusChip } from '../../ui/StatusChip';
import { Glyph } from '../../ui/Glyph';

type Filter = 'all' | VerificationStatus;
const pageTitle = (id: string) => SAMPLE_PAGES.find((p) => p.id === id)?.title ?? id;

export function VerificationPane() {
  const [filter, setFilter] = useState<Filter>('all');
  const summary = useMemo(() => summarizeChecks(SAMPLE_CHECKS), []);
  const rows = filter === 'all' ? SAMPLE_CHECKS : SAMPLE_CHECKS.filter((c) => c.status === filter);
  const stats: [string, string | number][] = [
    ['Checks', summary.total],
    ['Verified', summary.counts.verified],
    ['Failed', summary.counts.failed],
    ['Warnings', summary.counts.warning],
    ['Pass rate of finished checks', summary.passRate === null ? 'n/a' : `${summary.passRate}%`],
  ];

  return (
    <>
      <div className="ptop"><span>Verification center</span><span className="st s-pend"><Glyph name="pending" />Sample data</span></div>
      <div className="vc">
        <div className="sumrow">
          {stats.map(([label, value]) => (<div className="sum" key={label}><b>{value}</b><span>{label}</span></div>))}
        </div>
        <div className="filters" role="group" aria-label="Filter by status">
          <button type="button" className="fchip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
          {VERIFICATION_STATUSES.map((s) => (
            <button key={s} type="button" className="fchip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {STATUS_META[s].label} {summary.counts[s]}
            </button>
          ))}
        </div>
        <div className="tblw">
          <table className="tbl">
            <thead><tr><th>Check</th><th>Page</th><th>Type</th><th>Status</th><th>Last run</th><th>Source</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td><td>{pageTitle(c.pageId)}</td><td>{CHECK_TYPE_LABEL[c.type]}</td>
                  <td><StatusChip status={c.status} /></td><td>{lastRunLabel(c)}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{c.ref ?? 'not available'}</td>
                </tr>
              ))}
              {rows.length === 0 && (<tr><td colSpan={6} style={{ color: 'var(--app-muted)' }}>No checks match this filter.</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className="note">Code execution is on the roadmap, so that check stays Not verified instead of pretending to run.</p>
      </div>
    </>
  );
}
