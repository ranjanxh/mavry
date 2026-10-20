import { STATUS_META, type VerificationStatus } from '../../domain/status';
import { Glyph } from './Glyph';

export function StatusChip({ status, label }: { status: VerificationStatus; label?: string }) {
  const meta = STATUS_META[status];
  return (
    <span className={`st s-${meta.tone}`} title={meta.meaning}>
      <Glyph name={status} />
      {label ?? meta.label}
    </span>
  );
}

/** AI suggestions use a separate chip so they can never be mistaken for a verification result. */
export function SuggestionChip({ label = 'AI suggestion' }: { label?: string }) {
  return (
    <span className="st s-sug">
      <Glyph name="suggestion" />
      {label}
    </span>
  );
}
