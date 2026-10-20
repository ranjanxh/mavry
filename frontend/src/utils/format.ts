import { DEMO_NOW } from '../data/sample';
import type { VerificationCheck } from '../domain/types';

export function formatRelative(iso: string, now: string = DEMO_NOW): string {
  const minutes = Math.round((new Date(now).getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} days ago`;
}

export function lastRunLabel(check: VerificationCheck): string {
  if (check.ranAt) return formatRelative(check.ranAt);
  return check.status === 'pending' ? 'Queued' : 'Never run';
}
