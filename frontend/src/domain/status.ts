/** One status vocabulary for the whole product. Never spread raw status strings around. */
export const VERIFICATION_STATUSES = ['verified', 'failed', 'warning', 'pending', 'not_verified'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export type StatusTone = 'ok' | 'bad' | 'warn' | 'pend' | 'none';

export interface StatusMeta {
  label: string;
  tone: StatusTone;
  /** Plain-language meaning, shown in tooltips and docs. */
  meaning: string;
}

export const STATUS_META: Record<VerificationStatus, StatusMeta> = {
  verified: { label: 'Verified', tone: 'ok', meaning: 'A supported check ran and passed.' },
  failed: { label: 'Failed', tone: 'bad', meaning: 'A supported check ran and did not pass.' },
  warning: { label: 'Warning', tone: 'warn', meaning: 'A meaningful issue exists, but no check failed outright.' },
  pending: { label: 'Pending', tone: 'pend', meaning: 'A check is queued or running.' },
  not_verified: { label: 'Not verified', tone: 'none', meaning: 'No successful verification result exists.' },
};

export const CHECK_TYPES = ['schema_validation', 'specification_validation', 'code_execution', 'freshness'] as const;
export type CheckType = (typeof CHECK_TYPES)[number];

export const CHECK_TYPE_LABEL: Record<CheckType, string> = {
  schema_validation: 'Schema validation',
  specification_validation: 'Specification validation',
  code_execution: 'Code execution',
  freshness: 'Freshness (heuristic)',
};
