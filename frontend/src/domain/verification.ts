import type { VerificationCheck } from './types';
import type { VerificationStatus } from './status';

export interface VerificationSummary {
  total: number;
  counts: Record<VerificationStatus, number>;
  /** Share of *finished* checks that passed, or null when nothing has finished. */
  passRate: number | null;
}

/** Totals are always derived from the checks, so two screens can never disagree. */
export function summarizeChecks(checks: VerificationCheck[]): VerificationSummary {
  const counts: Record<VerificationStatus, number> = { verified: 0, failed: 0, warning: 0, pending: 0, not_verified: 0 };
  for (const c of checks) counts[c.status] += 1;
  const finished = counts.verified + counts.failed;
  return { total: checks.length, counts, passRate: finished === 0 ? null : Math.round((counts.verified / finished) * 100) };
}

/**
 * One health value for a set of checks. Worst result wins. "Verified" requires every check to have passed,
 * so a mix of passed and never-run checks reads as Not verified, never as Verified.
 */
export function worstStatus(summary: VerificationSummary): VerificationStatus {
  const { counts, total } = summary;
  if (total === 0) return 'not_verified';
  if (counts.failed > 0) return 'failed';
  if (counts.warning > 0) return 'warning';
  if (counts.pending > 0) return 'pending';
  return counts.verified === total ? 'verified' : 'not_verified';
}
