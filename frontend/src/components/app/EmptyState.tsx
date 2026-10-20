import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  /** Saturated blue block, reserved for first-run moments. Otherwise a quiet panel. */
  loud?: boolean;
}

export function EmptyState({ title, children, action, loud = false }: Props) {
  return (
    <div className={`ap-empty${loud ? ' loud' : ''}`}>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
