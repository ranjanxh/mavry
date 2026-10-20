import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ComingNextPage, { NotFoundPage } from './pages/ComingNextPage';
import { PLANNED_ROUTES, ROUTES } from './routes';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<LandingPage />} />
      {PLANNED_ROUTES.map((r) => (
        <Route key={r.path} path={r.path} element={<ComingNextPage title={r.title} summary={r.summary} path={r.path} />} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
