import { Route, Routes } from 'react-router-dom';
import AppShell from './components/app/AppShell';
import { AppPlaceholder } from './components/app/AppPlaceholder';
import LandingPage from './pages/LandingPage';
import ComingNextPage, { NotFoundPage } from './pages/ComingNextPage';
import DashboardPage from './pages/app/DashboardPage';
import ProjectsPage from './pages/app/ProjectsPage';
import { PLANNED_ROUTES, ROUTES } from './routes';

const inApp = (path: string) => path.startsWith(`${ROUTES.app}/`);

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<LandingPage />} />
      {PLANNED_ROUTES.filter((r) => !inApp(r.path)).map((r) => (
        <Route key={r.path} path={r.path} element={<ComingNextPage title={r.title} summary={r.summary} path={r.path} />} />
      ))}
      <Route path={ROUTES.app} element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        {PLANNED_ROUTES.filter((r) => inApp(r.path)).map((r) => (
          <Route key={r.path} path={r.path.slice(ROUTES.app.length + 1)} element={<AppPlaceholder title={r.title} summary={r.summary} path={r.path} />} />
        ))}
        <Route path="*" element={<AppPlaceholder title="Page not found" summary="That address does not match any route in Mavry." path="404" />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
