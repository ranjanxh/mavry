import type { ReactElement } from 'react';
import type { VerificationStatus } from '../../domain/status';

/** Each status has its own shape, so meaning never depends on color alone. */
export type GlyphName = VerificationStatus | 'suggestion';

const SHAPES: Record<GlyphName, ReactElement> = {
  verified: (
    <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M4.6 8.2l2.3 2.3 4.5-4.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  failed: (
    <svg viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="currentColor" /><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16"><path d="M8 1.5l7 12.5H1z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 6v3.5M8 11.6v.1" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  pending: (
    <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2.4" /></svg>
  ),
  not_verified: (
    <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M5.2 8h5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  suggestion: (
    <svg viewBox="0 0 16 16"><path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6z" fill="currentColor" /></svg>
  ),
};

export function Glyph({ name }: { name: GlyphName }) {
  return <span className="g" aria-hidden="true">{SHAPES[name]}</span>;
}
