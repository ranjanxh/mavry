import type { ReactNode } from 'react';
import { useToast } from './Toast';

/** For controls whose destination isn't built yet: says so honestly instead of doing nothing. */
export function ToastButton({ message, className, children }: { message: string; className?: string; children: ReactNode }) {
  const toast = useToast();
  return <button type="button" className={className} onClick={() => toast(message)}>{children}</button>;
}
