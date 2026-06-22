import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { Landing } from './pages/Landing';
import { BlogIndex } from './pages/BlogIndex';
import { Article } from './pages/Article';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const blogIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogIndex,
});

const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: Article,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogIndexRoute,
  articleRoute,
]);

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
