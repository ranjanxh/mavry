import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

interface Props { title: string; summary: string; path: string }

/** Honest placeholder for routes in the spec that are not built yet. */
export default function ComingNextPage({ title, summary, path }: Props) {
  return (
    <main className="soon dk">
      <div className="soon-in">
        <h1>{title}</h1>
        <p>{summary}</p>
        <p><code>{path}</code> is planned and not built yet.</p>
        <Link className="btn b-white" to={ROUTES.home}>Back to the landing page</Link>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return <ComingNextPage title="Page not found" summary="That address doesn’t match any route in Mavry." path="404" />;
}
