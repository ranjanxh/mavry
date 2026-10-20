import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

interface Props { title: string; summary: string; path: string }

/** Honest placeholder shown inside the app shell for screens that belong to a later milestone. */
export function AppPlaceholder({ title, summary, path }: Props) {
  return (
    <section className="ap-page ap-soon">
      <p className="ap-eyebrow">Planned, not built yet</p>
      <h1 className="ap-h1">{title}</h1>
      <p className="ap-lede">{summary}</p>
      <p className="ap-muted"><code className="mono">{path}</code> is reserved in the route table. This screen arrives in a later milestone.</p>
      <Link className="btn b-soft" to={ROUTES.app}>Back to the dashboard</Link>
    </section>
  );
}
