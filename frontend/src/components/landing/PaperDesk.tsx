import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { StatusChip } from '../ui/StatusChip';
import { useDrag } from '../../hooks/useDrag';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { VerificationStatus } from '../../domain/status';

type Phase = 'failed' | 'checking' | 'verified';
const PHASE_STATUS: Record<Phase, VerificationStatus> = { failed: 'failed', checking: 'pending', verified: 'verified' };
const NOTE: Record<Phase, string> = {
  failed: 'the spec renamed this in PR #482!',
  checking: 'hang on, re-checking…',
  verified: 'fixed. thanks Ary!',
};

interface SheetProps {
  id: string;
  className: string;
  rotate: number;
  delay: number;
  z: number;
  onGrab: (id: string) => void;
  children: ReactNode;
}

/** A draggable sheet of paper. Purely a toy: dragging changes position, never data. */
function Sheet({ id, className, rotate, delay, z, onGrab, children }: SheetProps) {
  const { pos, dragging, bind } = useDrag();
  const style = {
    '--rot': `${rotate}deg`,
    '--d': `${delay}s`,
    zIndex: dragging ? 60 : z,
    transform: `translate(${pos.x}px, ${pos.y}px) rotate(${dragging ? rotate * 0.4 : rotate}deg)`,
  } as CSSProperties;
  return (
    <article className={`sheet ${className}${dragging ? ' dragging' : ''}`} style={style} onPointerDownCapture={() => onGrab(id)} {...bind}>
      {children}
    </article>
  );
}

function Scribble({ good, delay }: { good?: boolean; delay: number }) {
  return (
    <svg className={`scribble${good ? ' good' : ''}`} viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true" style={{ '--sd': `${delay}s` } as CSSProperties}>
      <path pathLength={1} d="M8 22 C 4 8, 70 2, 150 4 S 296 10, 293 22 S 210 38, 130 36 S 6 36, 8 24" />
    </svg>
  );
}

function Stamp({ phase, intro }: { phase: Phase; intro: boolean }) {
  if (phase === 'checking') return null;
  const failed = phase === 'failed';
  return (
    <div key={phase} className={`stamp stamp-${phase}${intro ? ' intro' : ''}`} aria-hidden="true">
      {failed ? 'Failed' : 'Verified'}
      <small>{failed ? 'schema validation' : 'openapi.yaml at 7be20d'}</small>
    </div>
  );
}

export function PaperDesk() {
  const reduce = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>('failed');
  const [top, setTop] = useState('main');
  const timer = useRef<number>();
  const intro = useRef(true);

  useEffect(() => { intro.current = false; }, [phase]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const approve = () => {
    setPhase('checking');
    timer.current = window.setTimeout(() => setPhase('verified'), reduce ? 400 : 1500);
  };
  const replay = () => { window.clearTimeout(timer.current); setPhase('failed'); };
  const z = (id: string, base: number) => (top === id ? 40 : base);
  const fixed = phase !== 'failed';

  return (
    <div className="desk">
      {/* back sheet, left */}
      <Sheet id="quick" className="sheet-back sheet-left" rotate={-7} delay={0.15} z={z('quick', 5)} onGrab={setTop}>
        <div className="tape" aria-hidden="true" />
        <div className="sh-crumb">Payments API</div>
        <h3 className="sh-title sm">Quickstart</h3>
        <div className="lines" aria-hidden="true"><i /><i style={{ width: '82%' }} /><i style={{ width: '64%' }} /><i style={{ width: '74%' }} /></div>
        <div className="sh-row"><StatusChip status="warning" label="Freshness flag" /></div>
        <p className="hand-s">maybe stale? worth a look</p>
      </Sheet>

      {/* back sheet, right */}
      <Sheet id="pager" className="sheet-back sheet-right" rotate={6} delay={0.3} z={z('pager', 5)} onGrab={setTop}>
        <div className="tape" aria-hidden="true" />
        <div className="sh-crumb">Payments API</div>
        <h3 className="sh-title sm">Pagination</h3>
        <div className="lines" aria-hidden="true"><i /><i style={{ width: '70%' }} /><i style={{ width: '88%' }} /><i style={{ width: '58%' }} /></div>
        <div className="sh-row"><StatusChip status="verified" /></div>
        <p className="hand-s" style={{ color: 'var(--ok)' }}>
          all good
          <svg className="tick" viewBox="0 0 34 30" aria-hidden="true"><path d="M4 16 L13 25 L30 4" /></svg>
        </p>
      </Sheet>

      {/* the page that matters */}
      <Sheet id="main" className="sheet-main" rotate={-0.6} delay={0} z={z('main', 10)} onGrab={setTop}>
        <svg className="clip" viewBox="0 0 22 54" aria-hidden="true"><path d="M7 50 V12 a6 6 0 0 1 12 0 V42 a3.5 3.5 0 0 1 -7 0 V16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        <div className={`sh-inner sh-${phase}`}>
          <header className="sh-head">
            <div>
              <div className="sh-crumb">Payments API / Authentication</div>
              <h2 className="sh-title">Authentication</h2>
            </div>
            <StatusChip status={PHASE_STATUS[phase]} label={phase === 'checking' ? 'Checking' : undefined} />
          </header>
          <p className="sh-p">Exchange an API key for a short-lived access token, then send it in the <code>Authorization</code> header.</p>

          <div className={`sh-code${phase === 'checking' ? ' is-checking' : ''}`} role="img" aria-label={`Response example. The ${fixed ? 'user_id' : 'userId'} field is on line 6.`}>
            <div className="cline"><span className="d">HTTP/1.1 200 OK</span></div>
            <div className="cline">{'{'}</div>
            <div className="cline">{'  '}<span className="k">"access_token"</span>: <span className="s">"mvt_live_9fQ2xK"</span>,</div>
            <div className="cline">{'  '}<span className="k">"token_type"</span>: <span className="s">"bearer"</span>,</div>
            <div className="cline">{'  '}<span className="k">"expires_in"</span>: <span className="n">3600</span>,</div>
            <div className="cline">
              {'  '}
              <span className="hot">
                <span className="k">"{fixed ? 'user_id' : 'userId'}"</span>: <span className="s">"usr_8f2a91"</span>
                {phase !== 'checking' && <Scribble key={phase} good={phase === 'verified'} delay={phase === 'failed' && intro.current ? 1 : 0.1} />}
              </span>
            </div>
            <div className="cline">{'}'}</div>
            <div className="noise" aria-hidden="true" />
          </div>

          <p className="sh-evidence" role="status" aria-live="polite">
            {phase === 'failed' && (<><b>Expected</b> <code>user_id</code>, a string (openapi.yaml, line 218). <b>Found</b> <code>userId</code> on line 6. <b>Cause</b> PR #482, commit 7be20d.</>)}
            {phase === 'checking' && <>Applying the approved edit and re-checking against openapi.yaml…</>}
            {phase === 'verified' && <><b>Verified.</b> Approved by Ary, re-checked against <code>openapi.yaml</code> at 7be20d. Saved as a draft revision, not published.</>}
          </p>

          <footer className="sh-foot">
            {phase === 'verified' ? (
              <button type="button" className="btn b-soft" onClick={replay}>Replay the walkthrough</button>
            ) : (
              <button type="button" className="btn b-ink" onClick={approve} disabled={phase === 'checking'}>
                {phase === 'checking' ? 'Re-checking…' : 'Approve the suggested fix'}
              </button>
            )}
            <span className="sug">{phase === 'failed' ? 'AI suggestion from 7be20d. Not verified until the check passes.' : 'Sample data. Nothing is connected.'}</span>
          </footer>
          <Stamp phase={phase} intro={intro.current} />
        </div>

        <div key={phase} className={`sticky${phase === 'verified' ? ' good' : ''}`} style={{ '--nd': phase === 'failed' && intro.current ? '1.9s' : '0.05s' } as CSSProperties} aria-hidden="true">
          <svg viewBox="0 0 48 32"><path d="M44 12 C 30 4, 14 6, 4 20 M4 20 L6 8 M4 20 L16 22" /></svg>
          {NOTE[phase]}
        </div>
      </Sheet>

      <p className="hand drag-hint" aria-hidden="true">
        <svg viewBox="0 0 46 34"><path d="M4 28 C 14 30, 34 20, 40 6 M40 6 L32 8 M40 6 L41 15" /></svg>
        psst, you can drag these around
      </p>
      <p className="fine">Interactive sample with made-up data. Nothing here is connected to a real repository.</p>
    </div>
  );
}
